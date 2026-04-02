/**
 * HealthKitSync.ts
 *
 * Manages HealthKit data synchronization between the Apple Watch (via the
 * native HealthKit store) and the Gentle Reminder mobile application.
 *
 * Responsibilities:
 *  - Request / check HealthKit authorization for required data types
 *  - Query heart-rate, step-count, sleep-analysis and activity-summary data
 *  - Subscribe to real-time background delivery of new samples
 *  - Schedule periodic background syncs via BackgroundFetch
 *  - Normalize native samples into platform-specific reading types
 */

import { NativeModules, Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Type definitions
// ---------------------------------------------------------------------------

export interface HeartRateReading {
  id: string;
  bpm: number;
  timestamp: number;
  endTimestamp: number;
  source: string;
  deviceName?: string;
  motionContext: 'sedentary' | 'active' | 'unknown';
  confidence: number;
}

export interface StepReading {
  id: string;
  count: number;
  startTimestamp: number;
  endTimestamp: number;
  source: string;
  distance?: number; // meters
  floorsAscended?: number;
  floorsDescended?: number;
}

export interface SleepReading {
  id: string;
  stage: SleepStage;
  startTimestamp: number;
  endTimestamp: number;
  source: string;
  durationMinutes: number;
}

export type SleepStage = 'inBed' | 'asleepUnspecified' | 'awake' | 'asleepCore' | 'asleepDeep' | 'asleepREM';

export interface ActivitySummary {
  date: string; // YYYY-MM-DD
  activeEnergyBurned: number; // kcal
  activeEnergyGoal: number;
  exerciseMinutes: number;
  exerciseGoal: number;
  standHours: number;
  standGoal: number;
  stepCount: number;
  distanceWalkingRunning: number; // meters
  flightsClimbed: number;
  appleExerciseTime: number;
  basalEnergyBurned: number;
}

export type HealthDataType =
  | 'heartRate'
  | 'stepCount'
  | 'sleepAnalysis'
  | 'activeEnergyBurned'
  | 'basalEnergyBurned'
  | 'distanceWalkingRunning'
  | 'flightsClimbed'
  | 'appleExerciseTime'
  | 'oxygenSaturation'
  | 'bodyTemperature'
  | 'respiratoryRate'
  | 'restingHeartRate'
  | 'heartRateVariabilitySDNN'
  | 'walkingHeartRateAverage';

export interface AuthorizationStatus {
  type: HealthDataType;
  status: 'authorized' | 'denied' | 'notDetermined' | 'sharingDenied';
}

export interface SyncResult<T> {
  readings: T[];
  count: number;
  syncedAt: number;
  hasMore: boolean;
  cursor?: string;
}

export interface BackgroundSyncSchedule {
  intervalMinutes: number;
  dataTypes: HealthDataType[];
  enabled: boolean;
  lastSyncAt: number | null;
  nextSyncAt: number | null;
}

type UpdateCallback<T> = (readings: T[]) => void;

interface SubscriptionHandle {
  type: HealthDataType;
  remove: () => void;
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const HK_TYPE_IDENTIFIERS: Record<HealthDataType, string> = {
  heartRate: 'HKQuantityTypeIdentifierHeartRate',
  stepCount: 'HKQuantityTypeIdentifierStepCount',
  sleepAnalysis: 'HKCategoryTypeIdentifierSleepAnalysis',
  activeEnergyBurned: 'HKQuantityTypeIdentifierActiveEnergyBurned',
  basalEnergyBurned: 'HKQuantityTypeIdentifierBasalEnergyBurned',
  distanceWalkingRunning: 'HKQuantityTypeIdentifierDistanceWalkingRunning',
  flightsClimbed: 'HKQuantityTypeIdentifierFlightsClimbed',
  appleExerciseTime: 'HKQuantityTypeIdentifierAppleExerciseTime',
  oxygenSaturation: 'HKQuantityTypeIdentifierOxygenSaturation',
  bodyTemperature: 'HKQuantityTypeIdentifierBodyTemperature',
  respiratoryRate: 'HKQuantityTypeIdentifierRespiratoryRate',
  restingHeartRate: 'HKQuantityTypeIdentifierRestingHeartRate',
  heartRateVariabilitySDNN: 'HKQuantityTypeIdentifierHeartRateVariabilitySDNN',
  walkingHeartRateAverage: 'HKQuantityTypeIdentifierWalkingHeartRateAverage',
};

const DEFAULT_SYNC_TYPES: HealthDataType[] = [
  'heartRate',
  'stepCount',
  'sleepAnalysis',
  'activeEnergyBurned',
  'distanceWalkingRunning',
  'flightsClimbed',
  'restingHeartRate',
  'heartRateVariabilitySDNN',
];

const DEFAULT_SYNC_INTERVAL_MINUTES = 15;
const MAX_SAMPLE_BATCH = 1000;

// ---------------------------------------------------------------------------
// HealthKitSync
// ---------------------------------------------------------------------------

export class HealthKitSync {
  private static instance: HealthKitSync | null = null;

  private nativeModule: any;
  private authorized = false;
  private authStatuses: Map<HealthDataType, AuthorizationStatus> = new Map();
  private subscriptions: SubscriptionHandle[] = [];
  private backgroundSchedule: BackgroundSyncSchedule;
  private syncInProgress = false;

  // Per-type callbacks
  private heartRateListeners: UpdateCallback<HeartRateReading>[] = [];
  private stepListeners: UpdateCallback<StepReading>[] = [];
  private sleepListeners: UpdateCallback<SleepReading>[] = [];

  // ---------------------------------------------------------------------------
  // Singleton
  // ---------------------------------------------------------------------------

  static getInstance(): HealthKitSync {
    if (!HealthKitSync.instance) {
      HealthKitSync.instance = new HealthKitSync();
    }
    return HealthKitSync.instance;
  }

  private constructor() {
    if (Platform.OS !== 'ios') {
      console.warn('[HealthKitSync] Only supported on iOS');
    }
    this.nativeModule = NativeModules.HealthKitBridge ?? null;
    this.backgroundSchedule = {
      intervalMinutes: DEFAULT_SYNC_INTERVAL_MINUTES,
      dataTypes: DEFAULT_SYNC_TYPES,
      enabled: false,
      lastSyncAt: null,
      nextSyncAt: null,
    };
  }

  // ---------------------------------------------------------------------------
  // Authorization
  // ---------------------------------------------------------------------------

  async requestAuthorization(types: HealthDataType[] = DEFAULT_SYNC_TYPES): Promise<boolean> {
    if (!this.nativeModule) return false;
    try {
      const identifiers = types.map(t => HK_TYPE_IDENTIFIERS[t]).filter(Boolean);
      const result = await this.nativeModule.requestAuthorization(identifiers);

      types.forEach((type, index) => {
        this.authStatuses.set(type, {
          type,
          status: result.statuses?.[index] ?? 'notDetermined',
        });
      });

      this.authorized = types.every(t => this.authStatuses.get(t)?.status === 'authorized');
      return this.authorized;
    } catch (err) {
      console.error('[HealthKitSync] Authorization failed', err);
      return false;
    }
  }

  getAuthorizationStatus(type: HealthDataType): AuthorizationStatus | undefined {
    return this.authStatuses.get(type);
  }

  isAuthorized(): boolean {
    return this.authorized;
  }

  // ---------------------------------------------------------------------------
  // Heart Rate
  // ---------------------------------------------------------------------------

  async syncHeartRate(startDate: Date, endDate: Date): Promise<SyncResult<HeartRateReading>> {
    if (!this.ensureReady('heartRate')) return this.emptyResult();
    try {
      const raw = await this.nativeModule.queryHeartRate({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: MAX_SAMPLE_BATCH,
      });

      const readings: HeartRateReading[] = (raw.samples ?? []).map((s: any) => ({
        id: s.uuid ?? this.genId(),
        bpm: s.value,
        timestamp: new Date(s.startDate).getTime(),
        endTimestamp: new Date(s.endDate).getTime(),
        source: s.sourceName ?? 'Apple Watch',
        deviceName: s.deviceName,
        motionContext: this.mapMotionContext(s.metadata?.HKMetadataKeyHeartRateMotionContext),
        confidence: s.metadata?.confidence ?? 1.0,
      }));

      return {
        readings,
        count: readings.length,
        syncedAt: Date.now(),
        hasMore: readings.length >= MAX_SAMPLE_BATCH,
        cursor: raw.cursor,
      };
    } catch (err) {
      console.error('[HealthKitSync] syncHeartRate failed', err);
      return this.emptyResult();
    }
  }

  private mapMotionContext(value: number | undefined): HeartRateReading['motionContext'] {
    switch (value) {
      case 1: return 'sedentary';
      case 2: return 'active';
      default: return 'unknown';
    }
  }

  // ---------------------------------------------------------------------------
  // Step Count
  // ---------------------------------------------------------------------------

  async syncStepCount(startDate: Date, endDate: Date): Promise<SyncResult<StepReading>> {
    if (!this.ensureReady('stepCount')) return this.emptyResult();
    try {
      const raw = await this.nativeModule.queryStepCount({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: MAX_SAMPLE_BATCH,
      });

      const readings: StepReading[] = (raw.samples ?? []).map((s: any) => ({
        id: s.uuid ?? this.genId(),
        count: s.value,
        startTimestamp: new Date(s.startDate).getTime(),
        endTimestamp: new Date(s.endDate).getTime(),
        source: s.sourceName ?? 'Apple Watch',
        distance: s.distance,
        floorsAscended: s.floorsAscended,
        floorsDescended: s.floorsDescended,
      }));

      return {
        readings,
        count: readings.length,
        syncedAt: Date.now(),
        hasMore: readings.length >= MAX_SAMPLE_BATCH,
        cursor: raw.cursor,
      };
    } catch (err) {
      console.error('[HealthKitSync] syncStepCount failed', err);
      return this.emptyResult();
    }
  }

  // ---------------------------------------------------------------------------
  // Sleep Analysis
  // ---------------------------------------------------------------------------

  async syncSleepAnalysis(startDate: Date, endDate: Date): Promise<SyncResult<SleepReading>> {
    if (!this.ensureReady('sleepAnalysis')) return this.emptyResult();
    try {
      const raw = await this.nativeModule.querySleepAnalysis({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        limit: MAX_SAMPLE_BATCH,
      });

      const readings: SleepReading[] = (raw.samples ?? []).map((s: any) => {
        const start = new Date(s.startDate).getTime();
        const end = new Date(s.endDate).getTime();
        return {
          id: s.uuid ?? this.genId(),
          stage: this.mapSleepStage(s.value),
          startTimestamp: start,
          endTimestamp: end,
          source: s.sourceName ?? 'Apple Watch',
          durationMinutes: (end - start) / 60_000,
        };
      });

      return {
        readings,
        count: readings.length,
        syncedAt: Date.now(),
        hasMore: readings.length >= MAX_SAMPLE_BATCH,
        cursor: raw.cursor,
      };
    } catch (err) {
      console.error('[HealthKitSync] syncSleepAnalysis failed', err);
      return this.emptyResult();
    }
  }

  private mapSleepStage(value: number | undefined): SleepStage {
    switch (value) {
      case 0: return 'inBed';
      case 1: return 'asleepUnspecified';
      case 2: return 'awake';
      case 3: return 'asleepCore';
      case 4: return 'asleepDeep';
      case 5: return 'asleepREM';
      default: return 'asleepUnspecified';
    }
  }

  // ---------------------------------------------------------------------------
  // Activity Summary
  // ---------------------------------------------------------------------------

  async syncActivitySummary(date: Date): Promise<ActivitySummary | null> {
    if (!this.nativeModule) return null;
    try {
      const dateStr = date.toISOString().slice(0, 10);
      const raw = await this.nativeModule.queryActivitySummary({ date: dateStr });
      if (!raw) return null;

      return {
        date: dateStr,
        activeEnergyBurned: raw.activeEnergyBurned ?? 0,
        activeEnergyGoal: raw.activeEnergyGoal ?? 0,
        exerciseMinutes: raw.appleExerciseTime ?? 0,
        exerciseGoal: raw.exerciseGoal ?? 30,
        standHours: raw.appleStandHours ?? 0,
        standGoal: raw.standGoal ?? 12,
        stepCount: raw.stepCount ?? 0,
        distanceWalkingRunning: raw.distanceWalkingRunning ?? 0,
        flightsClimbed: raw.flightsClimbed ?? 0,
        appleExerciseTime: raw.appleExerciseTime ?? 0,
        basalEnergyBurned: raw.basalEnergyBurned ?? 0,
      };
    } catch (err) {
      console.error('[HealthKitSync] syncActivitySummary failed', err);
      return null;
    }
  }

  // ---------------------------------------------------------------------------
  // Real-time subscriptions (background delivery)
  // ---------------------------------------------------------------------------

  async subscribeToUpdates(type: HealthDataType, callback: UpdateCallback<any>): Promise<SubscriptionHandle | null> {
    if (!this.nativeModule) return null;

    switch (type) {
      case 'heartRate': this.heartRateListeners.push(callback); break;
      case 'stepCount': this.stepListeners.push(callback); break;
      case 'sleepAnalysis': this.sleepListeners.push(callback); break;
      default:
        console.warn(`[HealthKitSync] Subscription not implemented for ${type}`);
        return null;
    }

    try {
      const identifier = HK_TYPE_IDENTIFIERS[type];
      await this.nativeModule.enableBackgroundDelivery(identifier, 'immediate');

      const handle: SubscriptionHandle = {
        type,
        remove: () => {
          switch (type) {
            case 'heartRate': this.heartRateListeners = this.heartRateListeners.filter(l => l !== callback); break;
            case 'stepCount': this.stepListeners = this.stepListeners.filter(l => l !== callback); break;
            case 'sleepAnalysis': this.sleepListeners = this.sleepListeners.filter(l => l !== callback); break;
          }
          this.nativeModule?.disableBackgroundDelivery(identifier).catch(() => {});
        },
      };

      this.subscriptions.push(handle);
      return handle;
    } catch (err) {
      console.error(`[HealthKitSync] subscribeToUpdates(${type}) failed`, err);
      return null;
    }
  }

  unsubscribeAll(): void {
    this.subscriptions.forEach(s => s.remove());
    this.subscriptions = [];
    this.heartRateListeners = [];
    this.stepListeners = [];
    this.sleepListeners = [];
  }

  // ---------------------------------------------------------------------------
  // Background sync scheduling
  // ---------------------------------------------------------------------------

  async enableBackgroundSync(intervalMinutes: number = DEFAULT_SYNC_INTERVAL_MINUTES, types?: HealthDataType[]): Promise<void> {
    this.backgroundSchedule = {
      intervalMinutes,
      dataTypes: types ?? DEFAULT_SYNC_TYPES,
      enabled: true,
      lastSyncAt: null,
      nextSyncAt: Date.now() + intervalMinutes * 60_000,
    };

    if (this.nativeModule?.scheduleBackgroundSync) {
      await this.nativeModule.scheduleBackgroundSync({
        interval: intervalMinutes * 60,
        types: this.backgroundSchedule.dataTypes.map(t => HK_TYPE_IDENTIFIERS[t]),
      });
    }
  }

  async disableBackgroundSync(): Promise<void> {
    this.backgroundSchedule.enabled = false;
    this.backgroundSchedule.nextSyncAt = null;
    if (this.nativeModule?.cancelBackgroundSync) {
      await this.nativeModule.cancelBackgroundSync();
    }
  }

  getBackgroundSchedule(): BackgroundSyncSchedule {
    return { ...this.backgroundSchedule };
  }

  /**
   * Called by the background task handler to perform a full sync round.
   */
  async performBackgroundSync(): Promise<{ types: HealthDataType[]; totalReadings: number }> {
    if (this.syncInProgress) return { types: [], totalReadings: 0 };
    this.syncInProgress = true;

    const since = new Date(this.backgroundSchedule.lastSyncAt ?? Date.now() - 3_600_000);
    const now = new Date();
    let totalReadings = 0;
    const syncedTypes: HealthDataType[] = [];

    try {
      for (const type of this.backgroundSchedule.dataTypes) {
        switch (type) {
          case 'heartRate': {
            const r = await this.syncHeartRate(since, now);
            totalReadings += r.count;
            if (r.count > 0) { syncedTypes.push(type); this.heartRateListeners.forEach(l => l(r.readings)); }
            break;
          }
          case 'stepCount': {
            const r = await this.syncStepCount(since, now);
            totalReadings += r.count;
            if (r.count > 0) { syncedTypes.push(type); this.stepListeners.forEach(l => l(r.readings)); }
            break;
          }
          case 'sleepAnalysis': {
            const r = await this.syncSleepAnalysis(since, now);
            totalReadings += r.count;
            if (r.count > 0) { syncedTypes.push(type); this.sleepListeners.forEach(l => l(r.readings)); }
            break;
          }
        }
      }

      this.backgroundSchedule.lastSyncAt = Date.now();
      this.backgroundSchedule.nextSyncAt = Date.now() + this.backgroundSchedule.intervalMinutes * 60_000;
    } finally {
      this.syncInProgress = false;
    }

    return { types: syncedTypes, totalReadings };
  }

  // ---------------------------------------------------------------------------
  // Helpers
  // ---------------------------------------------------------------------------

  private ensureReady(type: HealthDataType): boolean {
    if (!this.nativeModule) return false;
    const status = this.authStatuses.get(type);
    if (status && status.status !== 'authorized') {
      console.warn(`[HealthKitSync] Not authorized for ${type}`);
      return false;
    }
    return true;
  }

  private emptyResult<T>(): SyncResult<T> {
    return { readings: [], count: 0, syncedAt: Date.now(), hasMore: false };
  }

  private genId(): string {
    return `hk_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }

  static destroy(): void {
    if (HealthKitSync.instance) {
      HealthKitSync.instance.unsubscribeAll();
      HealthKitSync.instance = null;
    }
  }
}

export default HealthKitSync;
