import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Offline Sync Service for Gentle Reminder.
 *
 * Ensures the app works without internet connectivity:
 * - Queues API requests when offline
 * - Syncs queued actions when connectivity returns
 * - Caches critical data locally (medications, family, settings)
 * - Conflict resolution: last-write-wins with timestamp
 *
 * Uses AsyncStorage for persistence (works on all RN platforms).
 */

export interface QueuedAction {
  id: string;
  method: 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  body?: Record<string, unknown>;
  createdAt: string;
  retryCount: number;
}

export interface CachedData {
  key: string;
  data: unknown;
  cachedAt: string;
  expiresAt: string;
}

const QUEUE_STORAGE_KEY = '@gr_offline_queue';
const CACHE_PREFIX = '@gr_cache_';
const MAX_RETRIES = 5;
const DEFAULT_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

const API_BASE = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

class OfflineSync {
  private static instance: OfflineSync;
  private queue: QueuedAction[] = [];
  private syncing: boolean = false;
  private online: boolean = true;

  private constructor() {}

  static getInstance(): OfflineSync {
    if (!OfflineSync.instance) {
      OfflineSync.instance = new OfflineSync();
    }
    return OfflineSync.instance;
  }

  /**
   * Initialize: load queued actions from storage, check connectivity.
   */
  async initialize(): Promise<void> {
    await this.loadQueue();
    this.checkConnectivity();
    // Attempt to sync any pending actions
    if (this.online && this.queue.length > 0) {
      await this.sync();
    }
  }

  // ── Queue Management ────────────────────────────────────────

  /**
   * Add an action to the offline queue.
   * Called when an API request fails due to network error.
   */
  async enqueue(action: Omit<QueuedAction, 'id' | 'createdAt' | 'retryCount'>): Promise<void> {
    const queuedAction: QueuedAction = {
      ...action,
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: new Date().toISOString(),
      retryCount: 0,
    };
    this.queue.push(queuedAction);
    await this.saveQueue();
  }

  /**
   * Sync all queued actions to the server.
   */
  async sync(): Promise<{ synced: number; failed: number }> {
    if (this.syncing || !this.online || this.queue.length === 0) {
      return { synced: 0, failed: 0 };
    }

    this.syncing = true;
    let synced = 0;
    let failed = 0;
    const remaining: QueuedAction[] = [];

    for (const action of this.queue) {
      try {
        const response = await fetch(`${API_BASE}${action.endpoint}`, {
          method: action.method,
          headers: { 'Content-Type': 'application/json' },
          body: action.body ? JSON.stringify(action.body) : undefined,
        });

        if (response.ok) {
          synced++;
        } else if (action.retryCount < MAX_RETRIES) {
          remaining.push({ ...action, retryCount: action.retryCount + 1 });
          failed++;
        } else {
          // Exceeded max retries — drop the action
          console.warn(`[OfflineSync] Dropping action after ${MAX_RETRIES} retries:`, action.endpoint);
          failed++;
        }
      } catch {
        // Network error — keep in queue
        remaining.push(action);
        failed++;
        this.online = false;
        break; // Stop trying if we're offline
      }
    }

    this.queue = remaining;
    await this.saveQueue();
    this.syncing = false;

    return { synced, failed };
  }

  getQueueSize(): number {
    return this.queue.length;
  }

  // ── Cache Management ────────────────────────────────────────

  /**
   * Cache data locally with a TTL.
   */
  async cache(key: string, data: unknown, ttlMs: number = DEFAULT_CACHE_TTL_MS): Promise<void> {
    const cached: CachedData = {
      key,
      data,
      cachedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + ttlMs).toISOString(),
    };

    try {
      await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cached));
    } catch {
      // Storage full or unavailable
    }
  }

  /**
   * Get cached data. Returns null if expired or not found.
   */
  async getCached<T>(key: string): Promise<T | null> {
    try {
      const stored = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (!stored) return null;

      const cached: CachedData = JSON.parse(stored);
      if (new Date(cached.expiresAt) < new Date()) {
        // Expired — remove and return null
        await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
        return null;
      }

      return cached.data as T;
    } catch {
      return null;
    }
  }

  /**
   * Cache critical patient data for offline access.
   */
  async cachePatientData(patientId: string, data: {
    medications?: unknown[];
    familyMembers?: unknown[];
    recentScores?: unknown[];
    settings?: Record<string, unknown>;
  }): Promise<void> {
    const ttl = 7 * 24 * 60 * 60 * 1000; // 7 days for critical data
    if (data.medications) await this.cache(`patient_${patientId}_meds`, data.medications, ttl);
    if (data.familyMembers) await this.cache(`patient_${patientId}_family`, data.familyMembers, ttl);
    if (data.recentScores) await this.cache(`patient_${patientId}_scores`, data.recentScores, ttl);
    if (data.settings) await this.cache(`patient_${patientId}_settings`, data.settings, ttl);
  }

  /**
   * Clear all cached data.
   */
  async clearCache(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
    } catch {}
  }

  // ── Connectivity ────────────────────────────────────────────

  isOnline(): boolean {
    return this.online;
  }

  setOnline(online: boolean): void {
    const wasOffline = !this.online;
    this.online = online;
    // Auto-sync when coming back online
    if (online && wasOffline && this.queue.length > 0) {
      this.sync();
    }
  }

  private async checkConnectivity(): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/../health`, { method: 'HEAD' });
      this.online = response.ok;
    } catch {
      this.online = false;
    }
  }

  // ── Persistence ─────────────────────────────────────────────

  private async loadQueue(): Promise<void> {
    try {
      const stored = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch {
      this.queue = [];
    }
  }

  private async saveQueue(): Promise<void> {
    try {
      await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    } catch {}
  }
}

export const offlineSync = OfflineSync.getInstance();
export { OfflineSync };
