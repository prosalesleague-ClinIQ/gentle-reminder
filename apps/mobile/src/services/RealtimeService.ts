import { Platform } from 'react-native';

/**
 * Real-Time WebSocket Service for Gentle Reminder.
 *
 * Provides live bidirectional communication between the mobile app
 * and the API server for:
 * - Real-time caregiver alert delivery
 * - Live session progress updates to dashboard
 * - Family message notifications
 * - Patient status broadcasting
 *
 * Uses native WebSocket (available on all React Native platforms).
 * Includes auto-reconnect with exponential backoff.
 */

export type RealtimeEventType =
  | 'session_update'
  | 'alert'
  | 'message'
  | 'medication_reminder'
  | 'status_change'
  | 'fall_detected'
  | 'mood_update'
  | 'connected'
  | 'disconnected';

export interface RealtimeEvent {
  type: RealtimeEventType;
  data: Record<string, unknown>;
  timestamp: string;
}

type EventHandler = (event: RealtimeEvent) => void;

const WS_BASE = process.env.EXPO_PUBLIC_WS_URL || 'ws://localhost:3000';
const MAX_RECONNECT_ATTEMPTS = 10;
const BASE_RECONNECT_DELAY_MS = 1000;

class RealtimeService {
  private static instance: RealtimeService;
  private ws: WebSocket | null = null;
  private userId: string | null = null;
  private token: string | null = null;
  private handlers: Map<RealtimeEventType | '*', Set<EventHandler>> = new Map();
  private reconnectAttempts: number = 0;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private connected: boolean = false;
  private intentionalClose: boolean = false;

  private constructor() {}

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  /**
   * Connect to the WebSocket server.
   */
  connect(userId: string, token: string): void {
    this.userId = userId;
    this.token = token;
    this.intentionalClose = false;
    this.attemptConnect();
  }

  /**
   * Disconnect from the WebSocket server.
   */
  disconnect(): void {
    this.intentionalClose = true;
    this.clearReconnectTimer();
    if (this.ws) {
      this.ws.close(1000, 'Client disconnect');
      this.ws = null;
    }
    this.connected = false;
    this.notifyHandlers({ type: 'disconnected', data: {}, timestamp: new Date().toISOString() });
  }

  /**
   * Subscribe to a specific event type or all events ('*').
   * Returns unsubscribe function.
   */
  on(eventType: RealtimeEventType | '*', handler: EventHandler): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler);
    return () => {
      this.handlers.get(eventType)?.delete(handler);
    };
  }

  /**
   * Send an event to the server.
   */
  send(type: string, data: Record<string, unknown>): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.warn('[Realtime] Cannot send — not connected');
      return;
    }

    this.ws.send(JSON.stringify({
      type,
      data,
      userId: this.userId,
      timestamp: new Date().toISOString(),
    }));
  }

  /**
   * Send a session progress update (visible to caregivers in real-time).
   */
  sendSessionUpdate(sessionId: string, phase: string, exerciseIndex: number, score?: number): void {
    this.send('session_update', {
      sessionId,
      patientId: this.userId,
      phase,
      exerciseIndex,
      score,
    });
  }

  /**
   * Send a mood update.
   */
  sendMoodUpdate(mood: string): void {
    this.send('mood_update', {
      patientId: this.userId,
      mood,
    });
  }

  /**
   * Send a medication taken confirmation.
   */
  sendMedicationTaken(medicationId: string): void {
    this.send('medication_taken', {
      patientId: this.userId,
      medicationId,
    });
  }

  isConnected(): boolean {
    return this.connected;
  }

  // ── Internal ────────────────────────────────────────────────

  private attemptConnect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return;

    try {
      const url = `${WS_BASE}/ws?userId=${this.userId}&token=${this.token}`;
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        console.log('[Realtime] Connected');
        this.notifyHandlers({
          type: 'connected',
          data: { userId: this.userId },
          timestamp: new Date().toISOString(),
        });
      };

      this.ws.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data as string) as RealtimeEvent;
          this.notifyHandlers(parsed);
        } catch {
          console.warn('[Realtime] Failed to parse message');
        }
      };

      this.ws.onclose = (event) => {
        this.connected = false;
        this.ws = null;

        if (!this.intentionalClose) {
          this.scheduleReconnect();
        }
      };

      this.ws.onerror = () => {
        // onclose will fire after onerror
      };
    } catch (error) {
      console.warn('[Realtime] Connection failed:', error);
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.warn('[Realtime] Max reconnect attempts reached');
      return;
    }

    const delay = BASE_RECONNECT_DELAY_MS * Math.pow(2, this.reconnectAttempts);
    this.reconnectAttempts++;

    console.log(`[Realtime] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`);
    this.reconnectTimer = setTimeout(() => this.attemptConnect(), delay);
  }

  private clearReconnectTimer(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }

  private notifyHandlers(event: RealtimeEvent): void {
    // Notify type-specific handlers
    const typeHandlers = this.handlers.get(event.type);
    if (typeHandlers) {
      typeHandlers.forEach((handler) => {
        try { handler(event); } catch {}
      });
    }

    // Notify wildcard handlers
    const wildcardHandlers = this.handlers.get('*');
    if (wildcardHandlers) {
      wildcardHandlers.forEach((handler) => {
        try { handler(event); } catch {}
      });
    }
  }
}

export const realtimeService = RealtimeService.getInstance();
export { RealtimeService };
