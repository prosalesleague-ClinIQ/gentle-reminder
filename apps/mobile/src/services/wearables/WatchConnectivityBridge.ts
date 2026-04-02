/**
 * WatchConnectivityBridge.ts
 *
 * TypeScript bridge for Apple Watch <-> iPhone communication.
 * Handles bidirectional messaging, offline queue, data compression,
 * and connection lifecycle management for the Gentle Reminder platform.
 *
 * This bridge wraps the native WCSession (WatchConnectivity framework)
 * via React Native's NativeModules, providing a clean async API for
 * the mobile app to exchange health and motion data with the Watch.
 */

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------

export type ConnectionStatus = 'connected' | 'disconnected' | 'notPaired' | 'notInstalled' | 'unknown';

export interface WatchMessage {
  id: string;
  type: WatchMessageType;
  payload: Record<string, unknown>;
  timestamp: number;
  compressed: boolean;
  retryCount: number;
}

export type WatchMessageType =
  | 'healthSync'
  | 'motionSync'
  | 'heartRate'
  | 'stepCount'
  | 'sleepData'
  | 'fallAlert'
  | 'medicationReminder'
  | 'cognitivePrompt'
  | 'configUpdate'
  | 'ping'
  | 'ack';

export interface HeartRateUpdate {
  bpm: number;
  timestamp: number;
  source: 'watch' | 'manual';
  confidence: number;
}

export interface StepUpdate {
  count: number;
  startTime: number;
  endTime: number;
  distance?: number;
}

export interface SleepUpdate {
  stage: 'awake' | 'light' | 'deep' | 'rem';
  startTime: number;
  endTime: number;
}

export interface FallEvent {
  timestamp: number;
  severity: 'minor' | 'moderate' | 'severe';
  location?: { latitude: number; longitude: number };
  accelerationPeak: number;
  confirmed: boolean;
}

export type DataReceivedCallback<T> = (data: T) => void;

interface QueuedMessage {
  message: WatchMessage;
  resolve: (value: boolean) => void;
  reject: (reason: Error) => void;
  enqueuedAt: number;
}

interface CompressionResult {
  data: string;
  originalSize: number;
  compressedSize: number;
  ratio: number;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MAX_QUEUE_SIZE = 200;
const MAX_RETRY_COUNT = 5;
const RETRY_DELAY_BASE_MS = 1000;
const MESSAGE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const PING_INTERVAL_MS = 30_000;
const COMPRESSION_THRESHOLD_BYTES = 512;

// ---------------------------------------------------------------------------
// WatchConnectivityBridge
// ---------------------------------------------------------------------------

export class WatchConnectivityBridge {
  private static instance: WatchConnectivityBridge | null = null;

  private nativeModule: any;
  private eventEmitter: NativeEventEmitter | null = null;
  private connectionStatus: ConnectionStatus = 'unknown';
  private messageQueue: QueuedMessage[] = [];
  private isProcessingQueue = false;
  private pingTimer: ReturnType<typeof setInterval> | null = null;
  private subscriptions: Array<{ remove: () => void }> = [];

  // Callbacks
  private heartRateCallbacks: DataReceivedCallback<HeartRateUpdate>[] = [];
  private stepCallbacks: DataReceivedCallback<StepUpdate>[] = [];
  private sleepCallbacks: DataReceivedCallback<SleepUpdate>[] = [];
  private fallCallbacks: DataReceivedCallback<FallEvent>[] = [];
  private statusChangeCallbacks: DataReceivedCallback<ConnectionStatus>[] = [];
  private rawMessageCallbacks: DataReceivedCallback<WatchMessage>[] = [];

  // ---------------------------------------------------------------------------
  // Singleton
  // ---------------------------------------------------------------------------

  static getInstance(): WatchConnectivityBridge {
    if (!WatchConnectivityBridge.instance) {
      WatchConnectivityBridge.instance = new WatchConnectivityBridge();
    }
    return WatchConnectivityBridge.instance;
  }

  private constructor() {
    if (Platform.OS !== 'ios') {
      console.warn('[WatchBridge] Watch connectivity only supported on iOS');
      return;
    }
    this.nativeModule = NativeModules.WatchConnectivity;
    if (this.nativeModule) {
      this.eventEmitter = new NativeEventEmitter(this.nativeModule);
      this.registerNativeListeners();
    }
  }

  // ---------------------------------------------------------------------------
  // Lifecycle
  // ---------------------------------------------------------------------------

  async activate(): Promise<boolean> {
    if (!this.nativeModule) return false;
    try {
      const result = await this.nativeModule.activateSession();
      this.connectionStatus = this.mapNativeStatus(result.status);
      this.startPingLoop();
      return true;
    } catch (err) {
      console.error('[WatchBridge] activation failed', err);
      return false;
    }
  }

  async deactivate(): Promise<void> {
    this.stopPingLoop();
    this.unregisterNativeListeners();
    this.messageQueue = [];
    this.connectionStatus = 'disconnected';
  }

  // ---------------------------------------------------------------------------
  // Connection status
  // ---------------------------------------------------------------------------

  getConnectionStatus(): ConnectionStatus {
    return this.connectionStatus;
  }

  onStatusChange(callback: DataReceivedCallback<ConnectionStatus>): () => void {
    this.statusChangeCallbacks.push(callback);
    return () => {
      this.statusChangeCallbacks = this.statusChangeCallbacks.filter(cb => cb !== callback);
    };
  }

  private mapNativeStatus(native: string): ConnectionStatus {
    const mapping: Record<string, ConnectionStatus> = {
      activated: 'connected',
      notActivated: 'disconnected',
      inactive: 'disconnected',
      notPaired: 'notPaired',
      watchAppNotInstalled: 'notInstalled',
    };
    return mapping[native] ?? 'unknown';
  }

  // ---------------------------------------------------------------------------
  // Sending messages
  // ---------------------------------------------------------------------------

  async sendMessage(data: Record<string, unknown>, type: WatchMessageType = 'configUpdate'): Promise<boolean> {
    const message: WatchMessage = {
      id: this.generateId(),
      type,
      payload: data,
      timestamp: Date.now(),
      compressed: false,
      retryCount: 0,
    };

    if (this.connectionStatus === 'connected') {
      return this.transmit(message);
    }

    return this.enqueue(message);
  }

  private async transmit(message: WatchMessage): Promise<boolean> {
    if (!this.nativeModule) return false;
    try {
      const payload = message.compressed
        ? message.payload
        : this.maybeCompress(message.payload);

      await this.nativeModule.sendMessage({
        id: message.id,
        type: message.type,
        payload: payload.data ?? payload,
        compressed: payload.data !== undefined,
        timestamp: message.timestamp,
      });
      return true;
    } catch (err) {
      console.warn('[WatchBridge] transmit failed, queuing', err);
      if (message.retryCount < MAX_RETRY_COUNT) {
        message.retryCount++;
        return this.enqueue(message);
      }
      return false;
    }
  }

  // ---------------------------------------------------------------------------
  // Message queue (offline sync)
  // ---------------------------------------------------------------------------

  private enqueue(message: WatchMessage): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.messageQueue.length >= MAX_QUEUE_SIZE) {
        this.pruneQueue();
      }
      this.messageQueue.push({ message, resolve, reject, enqueuedAt: Date.now() });
    });
  }

  private pruneQueue(): void {
    const now = Date.now();
    this.messageQueue = this.messageQueue.filter(
      q => now - q.enqueuedAt < MESSAGE_TTL_MS
    );
    if (this.messageQueue.length >= MAX_QUEUE_SIZE) {
      const removed = this.messageQueue.shift();
      removed?.reject(new Error('Queue overflow'));
    }
  }

  async flushQueue(): Promise<{ sent: number; failed: number }> {
    if (this.isProcessingQueue || this.connectionStatus !== 'connected') {
      return { sent: 0, failed: 0 };
    }
    this.isProcessingQueue = true;
    let sent = 0;
    let failed = 0;

    while (this.messageQueue.length > 0) {
      const item = this.messageQueue.shift();
      if (!item) break;

      const now = Date.now();
      if (now - item.enqueuedAt > MESSAGE_TTL_MS) {
        item.reject(new Error('Message expired'));
        failed++;
        continue;
      }

      try {
        const ok = await this.transmit(item.message);
        if (ok) { item.resolve(true); sent++; }
        else { item.reject(new Error('Transmit failed')); failed++; }
      } catch {
        item.reject(new Error('Transmit error'));
        failed++;
      }
    }

    this.isProcessingQueue = false;
    return { sent, failed };
  }

  getQueueSize(): number {
    return this.messageQueue.length;
  }

  // ---------------------------------------------------------------------------
  // Receiving messages (native event handlers)
  // ---------------------------------------------------------------------------

  private registerNativeListeners(): void {
    if (!this.eventEmitter) return;

    const sub1 = this.eventEmitter.addListener('WatchMessage', (data: any) => {
      this.handleIncomingMessage(data);
    });

    const sub2 = this.eventEmitter.addListener('WatchStatusChange', (data: any) => {
      this.connectionStatus = this.mapNativeStatus(data.status);
      this.statusChangeCallbacks.forEach(cb => cb(this.connectionStatus));
      if (this.connectionStatus === 'connected') {
        this.flushQueue();
      }
    });

    const sub3 = this.eventEmitter.addListener('WatchFallDetected', (data: any) => {
      const event: FallEvent = {
        timestamp: data.timestamp ?? Date.now(),
        severity: data.severity ?? 'moderate',
        accelerationPeak: data.accelerationPeak ?? 0,
        confirmed: data.confirmed ?? false,
        location: data.location,
      };
      this.fallCallbacks.forEach(cb => cb(event));
    });

    this.subscriptions.push(sub1, sub2, sub3);
  }

  private unregisterNativeListeners(): void {
    this.subscriptions.forEach(s => s.remove());
    this.subscriptions = [];
  }

  private handleIncomingMessage(raw: any): void {
    const message: WatchMessage = {
      id: raw.id ?? this.generateId(),
      type: raw.type ?? 'ping',
      payload: raw.compressed ? this.decompress(raw.payload) : raw.payload,
      timestamp: raw.timestamp ?? Date.now(),
      compressed: false,
      retryCount: 0,
    };

    this.rawMessageCallbacks.forEach(cb => cb(message));

    switch (message.type) {
      case 'heartRate':
        this.heartRateCallbacks.forEach(cb => cb(message.payload as unknown as HeartRateUpdate));
        break;
      case 'stepCount':
        this.stepCallbacks.forEach(cb => cb(message.payload as unknown as StepUpdate));
        break;
      case 'sleepData':
        this.sleepCallbacks.forEach(cb => cb(message.payload as unknown as SleepUpdate));
        break;
      case 'fallAlert':
        this.fallCallbacks.forEach(cb => cb(message.payload as unknown as FallEvent));
        break;
    }
  }

  // ---------------------------------------------------------------------------
  // Data-specific subscriptions
  // ---------------------------------------------------------------------------

  onHeartRate(callback: DataReceivedCallback<HeartRateUpdate>): () => void {
    this.heartRateCallbacks.push(callback);
    return () => { this.heartRateCallbacks = this.heartRateCallbacks.filter(c => c !== callback); };
  }

  onSteps(callback: DataReceivedCallback<StepUpdate>): () => void {
    this.stepCallbacks.push(callback);
    return () => { this.stepCallbacks = this.stepCallbacks.filter(c => c !== callback); };
  }

  onSleep(callback: DataReceivedCallback<SleepUpdate>): () => void {
    this.sleepCallbacks.push(callback);
    return () => { this.sleepCallbacks = this.sleepCallbacks.filter(c => c !== callback); };
  }

  onFall(callback: DataReceivedCallback<FallEvent>): () => void {
    this.fallCallbacks.push(callback);
    return () => { this.fallCallbacks = this.fallCallbacks.filter(c => c !== callback); };
  }

  onRawMessage(callback: DataReceivedCallback<WatchMessage>): () => void {
    this.rawMessageCallbacks.push(callback);
    return () => { this.rawMessageCallbacks = this.rawMessageCallbacks.filter(c => c !== callback); };
  }

  // ---------------------------------------------------------------------------
  // High-level sync helpers
  // ---------------------------------------------------------------------------

  async syncHealthData(): Promise<boolean> {
    return this.sendMessage({ request: 'syncHealth', since: Date.now() - 86_400_000 }, 'healthSync');
  }

  async syncMotionData(): Promise<boolean> {
    return this.sendMessage({ request: 'syncMotion', since: Date.now() - 3_600_000 }, 'motionSync');
  }

  async sendMedicationReminder(name: string, dosage: string, scheduledTime: number): Promise<boolean> {
    return this.sendMessage({ medication: name, dosage, scheduledTime }, 'medicationReminder');
  }

  async sendCognitivePrompt(prompt: string, category: string): Promise<boolean> {
    return this.sendMessage({ prompt, category }, 'cognitivePrompt');
  }

  // ---------------------------------------------------------------------------
  // Data compression (simple run-length for small payloads)
  // ---------------------------------------------------------------------------

  private maybeCompress(payload: Record<string, unknown>): Record<string, unknown> | CompressionResult {
    const json = JSON.stringify(payload);
    if (json.length < COMPRESSION_THRESHOLD_BYTES) return payload;
    const compressed = this.compress(json);
    return {
      data: compressed,
      originalSize: json.length,
      compressedSize: compressed.length,
      ratio: compressed.length / json.length,
    };
  }

  private compress(input: string): string {
    // Simple LZ-style compression suitable for small JSON payloads
    let result = '';
    let i = 0;
    while (i < input.length) {
      let bestLen = 0;
      let bestDist = 0;
      const searchStart = Math.max(0, i - 255);
      for (let j = searchStart; j < i; j++) {
        let len = 0;
        while (i + len < input.length && input[j + len] === input[i + len] && len < 255) {
          len++;
        }
        if (len > bestLen) {
          bestLen = len;
          bestDist = i - j;
        }
      }
      if (bestLen >= 4) {
        result += `\x00${String.fromCharCode(bestDist)}${String.fromCharCode(bestLen)}`;
        i += bestLen;
      } else {
        if (input[i] === '\x00') result += '\x00\x00\x00';
        else result += input[i];
        i++;
      }
    }
    return btoa(result);
  }

  private decompress(input: any): Record<string, unknown> {
    if (typeof input === 'object') return input;
    try {
      const decoded = atob(String(input));
      let result = '';
      let i = 0;
      while (i < decoded.length) {
        if (decoded[i] === '\x00') {
          const dist = decoded.charCodeAt(i + 1);
          const len = decoded.charCodeAt(i + 2);
          if (dist === 0 && len === 0) {
            result += '\x00';
          } else {
            const start = result.length - dist;
            for (let j = 0; j < len; j++) {
              result += result[start + j];
            }
          }
          i += 3;
        } else {
          result += decoded[i];
          i++;
        }
      }
      return JSON.parse(result);
    } catch {
      return {};
    }
  }

  // ---------------------------------------------------------------------------
  // Ping / keep-alive
  // ---------------------------------------------------------------------------

  private startPingLoop(): void {
    this.stopPingLoop();
    this.pingTimer = setInterval(() => {
      if (this.connectionStatus === 'connected') {
        this.sendMessage({ ts: Date.now() }, 'ping').catch(() => {});
      }
    }, PING_INTERVAL_MS);
  }

  private stopPingLoop(): void {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  // ---------------------------------------------------------------------------
  // Utilities
  // ---------------------------------------------------------------------------

  private generateId(): string {
    return `wm_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /** Destroy the singleton -- useful for tests */
  static destroy(): void {
    if (WatchConnectivityBridge.instance) {
      WatchConnectivityBridge.instance.deactivate();
      WatchConnectivityBridge.instance = null;
    }
  }
}

export default WatchConnectivityBridge;
