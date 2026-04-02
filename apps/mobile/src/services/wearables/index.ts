/**
 * Wearables Module - Public API
 *
 * Provides Apple Watch integration for the Gentle Reminder platform:
 *  - Watch <-> Phone connectivity bridge
 *  - HealthKit data synchronization
 *  - CoreMotion / fall detection / gait analysis
 *  - Data processing, anomaly detection, and daily summaries
 */

// Bridge
export {
  WatchConnectivityBridge,
  type ConnectionStatus,
  type WatchMessage,
  type WatchMessageType,
  type HeartRateUpdate,
  type StepUpdate,
  type SleepUpdate,
  type FallEvent as WatchFallEvent,
  type DataReceivedCallback,
} from './WatchConnectivityBridge';

// HealthKit
export {
  HealthKitSync,
  type HeartRateReading,
  type StepReading,
  type SleepReading,
  type SleepStage,
  type ActivitySummary,
  type HealthDataType,
  type AuthorizationStatus,
  type SyncResult,
  type BackgroundSyncSchedule,
} from './HealthKitSync';

// Motion
export {
  MotionSync,
  type AccelerometerReading,
  type GyroscopeReading,
  type DeviceMotionReading,
  type FallEvent as MotionFallEvent,
  type GaitAnalysis,
  type GaitVariability,
  type GaitRisk,
  type MotionWindow,
  type StepCadenceResult,
} from './MotionSync';

// Data Processing
export {
  WearableDataProcessor,
  type HRVMetrics,
  type SleepStageAnalysis,
  type SleepStageDetail,
  type SleepCycle,
  type Anomaly,
  type AnomalyType,
  type BaselineMetrics,
  type DailyWearableSummary,
  type NormalizedSignal,
  type TrendResult,
} from './WearableDataProcessor';
