/**
 * BackgroundSync.ts
 *
 * Background synchronization module for the Gentle Reminder mobile app.
 * Uses expo-background-fetch to register a periodic background task that
 * syncs patient data (medications, cognitive scores, configuration) to the
 * paired Apple Watch every 15 minutes.
 *
 * Includes Platform.OS check for web compatibility -- background fetch
 * is only available on native iOS/Android platforms.
 */

import { Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface BackgroundSyncConfig {
  /** Minimum interval between syncs in seconds (default: 900 = 15 min) */
  minimumIntervalSeconds: number;
  /** Whether to sync medications */
  syncMedications: boolean;
  /** Whether to sync cognitive scores */
  syncCognitiveScores: boolean;
  /** Whether to sync health data */
  syncHealthData: boolean;
  /** Whether to sync configuration/settings */
  syncConfig: boolean;
}

export interface SyncPayload {
  medications: MedicationSyncItem[];
  cognitiveScore: number | null;
  config: Record<string, unknown>;
  lastSyncTimestamp: number;
}

export interface MedicationSyncItem {
  id: string;
  name: string;
  dosage: string;
  scheduledTime: number; // epoch ms
  isTaken: boolean;
}

type BackgroundFetchResult = 'newData' | 'noData' | 'failed';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TASK_NAME = 'com.gentlereminder.watch-sync';
const DEFAULT_INTERVAL_SECONDS = 900; // 15 minutes
const LAST_SYNC_KEY = 'backgroundSync.lastSyncTimestamp';

// ---------------------------------------------------------------------------
// Module State
// ---------------------------------------------------------------------------

let isRegistered = false;
let currentConfig: BackgroundSyncConfig = {
  minimumIntervalSeconds: DEFAULT_INTERVAL_SECONDS,
  syncMedications: true,
  syncCognitiveScores: true,
  syncHealthData: true,
  syncConfig: true,
};

// Lazy-loaded native modules (avoid import errors on web)
let BackgroundFetch: any = null;
let TaskManager: any = null;

// ---------------------------------------------------------------------------
// Lazy Module Loading
// ---------------------------------------------------------------------------

async function loadNativeModules(): Promise<boolean> {
  if (Platform.OS === 'web') {
    console.warn('[BackgroundSync] Background fetch not available on web');
    return false;
  }

  try {
    if (!BackgroundFetch) {
      const bgModule = await import('expo-background-fetch');
      BackgroundFetch = bgModule;
    }
    if (!TaskManager) {
      const tmModule = await import('expo-task-manager');
      TaskManager = tmModule;
    }
    return true;
  } catch (error) {
    console.error('[BackgroundSync] Failed to load native modules:', error);
    return false;
  }
}

// ---------------------------------------------------------------------------
// Sync Task Implementation
// ---------------------------------------------------------------------------

/**
 * The core sync function executed by the background task.
 * Gathers current patient data and sends it to the Watch via
 * WatchConnectivityBridge.
 */
async function performSync(): Promise<BackgroundFetchResult> {
  try {
    console.log('[BackgroundSync] Starting background sync...');

    // Dynamically import to avoid circular dependencies
    const { WatchConnectivityBridge } = await import('./WatchConnectivityBridge');
    const bridge = WatchConnectivityBridge.getInstance();

    // Check if watch is connected
    const status = bridge.getConnectionStatus();
    if (status !== 'connected') {
      console.log('[BackgroundSync] Watch not connected, skipping sync');
      return 'noData';
    }

    // Build sync payload
    const payload = await buildSyncPayload();

    if (!payload) {
      console.log('[BackgroundSync] No data to sync');
      return 'noData';
    }

    // Send medications list to watch
    if (currentConfig.syncMedications && payload.medications.length > 0) {
      await bridge.sendMessage(
        {
          medications: payload.medications.map(med => ({
            id: med.id,
            name: med.name,
            dosage: med.dosage,
            scheduledTime: med.scheduledTime,
            isTaken: med.isTaken,
          })),
        },
        'configUpdate'
      );
    }

    // Send cognitive score
    if (currentConfig.syncCognitiveScores && payload.cognitiveScore !== null) {
      await bridge.sendMessage(
        { cognitiveScore: payload.cognitiveScore },
        'configUpdate'
      );
    }

    // Send config updates
    if (currentConfig.syncConfig && Object.keys(payload.config).length > 0) {
      await bridge.sendMessage(payload.config, 'configUpdate');
    }

    // Request health data sync from watch
    if (currentConfig.syncHealthData) {
      await bridge.syncHealthData();
    }

    // Record last sync time
    await persistLastSyncTime(Date.now());

    console.log('[BackgroundSync] Sync completed successfully');
    return 'newData';
  } catch (error) {
    console.error('[BackgroundSync] Sync failed:', error);
    return 'failed';
  }
}

// ---------------------------------------------------------------------------
// Payload Builder
// ---------------------------------------------------------------------------

/**
 * Builds the sync payload by reading current patient data from
 * local storage / state management.
 */
async function buildSyncPayload(): Promise<SyncPayload | null> {
  try {
    let medications: MedicationSyncItem[] = [];
    let cognitiveScore: number | null = null;
    let config: Record<string, unknown> = {};

    // Try to load medications from AsyncStorage
    if (Platform.OS !== 'web') {
      try {
        const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;

        const medsJson = await AsyncStorage.getItem('patient.medications.today');
        if (medsJson) {
          const medsData = JSON.parse(medsJson);
          medications = (medsData || []).map((med: any) => ({
            id: med.id || `med_${Date.now()}`,
            name: med.name || '',
            dosage: med.dosage || '',
            scheduledTime: med.scheduledTime || 0,
            isTaken: med.isTaken || false,
          }));
        }

        const scoreJson = await AsyncStorage.getItem('patient.cognitiveScore');
        if (scoreJson) {
          cognitiveScore = JSON.parse(scoreJson);
        }

        const configJson = await AsyncStorage.getItem('patient.watchConfig');
        if (configJson) {
          config = JSON.parse(configJson);
        }
      } catch (storageError) {
        console.warn('[BackgroundSync] Storage read error:', storageError);
      }
    }

    const lastSync = await getLastSyncTime();

    return {
      medications,
      cognitiveScore,
      config,
      lastSyncTimestamp: lastSync,
    };
  } catch (error) {
    console.error('[BackgroundSync] Failed to build payload:', error);
    return null;
  }
}

// ---------------------------------------------------------------------------
// Persistence Helpers
// ---------------------------------------------------------------------------

async function persistLastSyncTime(timestamp: number): Promise<void> {
  if (Platform.OS === 'web') return;

  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    await AsyncStorage.setItem(LAST_SYNC_KEY, JSON.stringify(timestamp));
  } catch {
    // Non-critical, ignore
  }
}

async function getLastSyncTime(): Promise<number> {
  if (Platform.OS === 'web') return 0;

  try {
    const AsyncStorage = (await import('@react-native-async-storage/async-storage')).default;
    const value = await AsyncStorage.getItem(LAST_SYNC_KEY);
    return value ? JSON.parse(value) : 0;
  } catch {
    return 0;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Registers the background sync task with the system.
 * On iOS, this uses expo-background-fetch to schedule periodic execution.
 * On web, this is a no-op that logs a warning.
 *
 * @param config - Optional configuration overrides
 * @returns Whether registration was successful
 */
export async function registerBackgroundSync(
  config?: Partial<BackgroundSyncConfig>
): Promise<boolean> {
  if (Platform.OS === 'web') {
    console.warn('[BackgroundSync] Background sync not available on web platform');
    return false;
  }

  if (isRegistered) {
    console.log('[BackgroundSync] Already registered, updating config');
    if (config) {
      currentConfig = { ...currentConfig, ...config };
    }
    return true;
  }

  // Apply config overrides
  if (config) {
    currentConfig = { ...currentConfig, ...config };
  }

  // Load native modules
  const modulesLoaded = await loadNativeModules();
  if (!modulesLoaded) {
    return false;
  }

  try {
    // Define the background task
    TaskManager.defineTask(TASK_NAME, async () => {
      const result = await performSync();

      switch (result) {
        case 'newData':
          return BackgroundFetch.BackgroundFetchResult.NewData;
        case 'noData':
          return BackgroundFetch.BackgroundFetchResult.NoData;
        case 'failed':
          return BackgroundFetch.BackgroundFetchResult.Failed;
      }
    });

    // Register background fetch
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: currentConfig.minimumIntervalSeconds,
      stopOnTerminate: false,
      startOnBoot: true,
    });

    isRegistered = true;
    console.log(
      `[BackgroundSync] Registered with ${currentConfig.minimumIntervalSeconds}s interval`
    );
    return true;
  } catch (error) {
    console.error('[BackgroundSync] Registration failed:', error);
    return false;
  }
}

/**
 * Unregisters the background sync task.
 * Stops periodic sync from running.
 *
 * @returns Whether unregistration was successful
 */
export async function unregisterBackgroundSync(): Promise<boolean> {
  if (Platform.OS === 'web') {
    return true; // No-op on web
  }

  if (!isRegistered) {
    return true;
  }

  const modulesLoaded = await loadNativeModules();
  if (!modulesLoaded) {
    return false;
  }

  try {
    await BackgroundFetch.unregisterTaskAsync(TASK_NAME);
    isRegistered = false;
    console.log('[BackgroundSync] Unregistered successfully');
    return true;
  } catch (error) {
    console.error('[BackgroundSync] Unregistration failed:', error);
    return false;
  }
}

/**
 * Manually triggers a sync (useful for testing or on-demand sync).
 * Works on all platforms but only syncs on native.
 */
export async function triggerManualSync(): Promise<BackgroundFetchResult> {
  if (Platform.OS === 'web') {
    console.warn('[BackgroundSync] Manual sync not available on web');
    return 'failed';
  }

  return performSync();
}

/**
 * Returns whether background sync is currently registered.
 */
export function isBackgroundSyncRegistered(): boolean {
  return isRegistered;
}

/**
 * Returns the current background sync configuration.
 */
export function getBackgroundSyncConfig(): Readonly<BackgroundSyncConfig> {
  return { ...currentConfig };
}

/**
 * Returns the timestamp of the last successful sync.
 */
export async function getLastSyncTimestamp(): Promise<number> {
  return getLastSyncTime();
}

export default {
  registerBackgroundSync,
  unregisterBackgroundSync,
  triggerManualSync,
  isBackgroundSyncRegistered,
  getBackgroundSyncConfig,
  getLastSyncTimestamp,
};
