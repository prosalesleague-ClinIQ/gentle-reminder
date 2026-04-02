# Gentle Reminder - Apple Watch Companion App

WatchOS companion application for the Gentle Reminder dementia care platform. Provides continuous health monitoring, fall detection, gait analysis, and medication reminders directly on the patient's wrist.

## Architecture

```
watch-app/
  WatchKitExtension/
    WatchConnectivityManager.swift    # Watch <-> Phone communication
  HealthKitCollector/
    HealthKitCollector.swift           # HealthKit data collection
  MotionAnalyzer/
    MotionAnalyzer.swift               # CoreMotion fall/gait analysis
```

The Watch app communicates with the iPhone app via WatchConnectivity (WCSession). The TypeScript bridge on the mobile side (`apps/mobile/src/services/wearables/`) handles the React Native integration.

## Data Flow

```
Apple Watch                          iPhone (React Native)
-----------                          --------------------
HealthKitCollector                   HealthKitSync.ts
  -> heart rate, steps, sleep          -> queries via NativeModule
  -> HRV, SpO2, activity              -> background sync scheduling

MotionAnalyzer                       MotionSync.ts
  -> accelerometer, gyroscope          -> fall detection analysis
  -> fall detection                    -> gait analysis
  -> gait metrics                      -> step cadence

WatchConnectivityManager  <------>   WatchConnectivityBridge.ts
  -> sendMessage / receive             -> sendMessage / receive
  -> application context               -> message queue (offline)
  -> user info transfer                -> data compression
  -> file transfer                     -> callback management

                                     WearableDataProcessor.ts
                                       -> HRV analysis (SDNN, RMSSD)
                                       -> sleep stage analysis
                                       -> anomaly detection
                                       -> daily summary generation
                                       -> trend detection
```

## Setup Requirements

### Xcode Project Setup

1. Create a new WatchOS App target in Xcode
2. Enable the following capabilities:
   - HealthKit (with Background Delivery)
   - Background Modes (Health Kit, Background Fetch, Remote Notifications)
   - WatchConnectivity

### Info.plist Keys

Add the following usage descriptions to the Watch app's Info.plist:

```xml
<key>NSHealthShareUsageDescription</key>
<string>Gentle Reminder needs access to your health data to monitor wellness and detect potential issues.</string>

<key>NSHealthUpdateUsageDescription</key>
<string>Gentle Reminder records wellness observations from your care sessions.</string>

<key>NSMotionUsageDescription</key>
<string>Gentle Reminder uses motion data to detect falls and analyze walking patterns for your safety.</string>
```

### HealthKit Entitlements

Enable in the entitlements file:

```xml
<key>com.apple.developer.healthkit</key>
<true/>
<key>com.apple.developer.healthkit.background-delivery</key>
<true/>
```

### Required Data Types

The app requests read access to the following HealthKit data types:

| Category | Type | Identifier |
|----------|------|------------|
| Vitals | Heart Rate | HKQuantityTypeIdentifierHeartRate |
| Vitals | Resting Heart Rate | HKQuantityTypeIdentifierRestingHeartRate |
| Vitals | HRV (SDNN) | HKQuantityTypeIdentifierHeartRateVariabilitySDNN |
| Vitals | Walking HR Average | HKQuantityTypeIdentifierWalkingHeartRateAverage |
| Vitals | Oxygen Saturation | HKQuantityTypeIdentifierOxygenSaturation |
| Vitals | Respiratory Rate | HKQuantityTypeIdentifierRespiratoryRate |
| Vitals | Body Temperature | HKQuantityTypeIdentifierBodyTemperature |
| Activity | Step Count | HKQuantityTypeIdentifierStepCount |
| Activity | Distance | HKQuantityTypeIdentifierDistanceWalkingRunning |
| Activity | Flights Climbed | HKQuantityTypeIdentifierFlightsClimbed |
| Activity | Exercise Time | HKQuantityTypeIdentifierAppleExerciseTime |
| Energy | Active Energy | HKQuantityTypeIdentifierActiveEnergyBurned |
| Energy | Basal Energy | HKQuantityTypeIdentifierBasalEnergyBurned |
| Sleep | Sleep Analysis | HKCategoryTypeIdentifierSleepAnalysis |
| Summary | Activity Summary | HKActivitySummaryType |

## Key Features

### Fall Detection

The MotionAnalyzer implements a three-phase fall detection algorithm:

1. **Freefall Detection**: Monitors for acceleration magnitude below 0.3g for at least 150ms
2. **Impact Detection**: After freefall, watches for impact spike above 3.0g
3. **Post-Impact Analysis**: Checks for movement in the 3 seconds after impact to assess severity

Severity classification:
- Minor: impact 3.0-4.0g
- Moderate: impact 4.0-6.0g
- Severe: impact above 6.0g

### Gait Analysis

Real-time gait metrics computed from accelerometer data:
- Cadence (steps per minute)
- Stride length (estimated via inverted pendulum model)
- Walking speed
- Asymmetry (left/right step interval comparison)
- Regularity (coefficient of variation of step intervals)
- Stability index (vertical acceleration variance)
- Fall risk classification (low/moderate/high)

### Medication Reminders

The Watch receives medication reminder push messages from the phone and displays them with haptic feedback. Supports:
- Medication name and dosage display
- Scheduled time with countdown
- Confirmation/snooze actions
- Haptic notification patterns

## TypeScript Bridge Integration

The mobile-side bridge files provide React Native integration:

```typescript
import {
  WatchConnectivityBridge,
  HealthKitSync,
  MotionSync,
  WearableDataProcessor,
} from './services/wearables';

// Initialize
const bridge = WatchConnectivityBridge.getInstance();
await bridge.activate();

// Subscribe to heart rate updates
bridge.onHeartRate((update) => {
  console.log(`Heart rate: ${update.bpm} bpm`);
});

// Sync health data
const healthSync = HealthKitSync.getInstance();
await healthSync.requestAuthorization(['heartRate', 'stepCount', 'sleepAnalysis']);
const heartRateData = await healthSync.syncHeartRate(startDate, endDate);

// Analyze data
const processor = new WearableDataProcessor();
const hrv = processor.calculateHeartRateVariability(heartRateData.readings);
const summary = processor.buildDailyWearableSummary(date, heartRateData.readings, ...);
```

## Background Sync

The HealthKitCollector supports background delivery for critical metrics. When enabled:
- Heart rate updates delivered immediately
- HRV and SpO2 delivered immediately
- Sleep analysis delivered hourly
- Step count and activity via periodic background fetch

Configure background sync from the TypeScript side:

```typescript
const healthSync = HealthKitSync.getInstance();
await healthSync.enableBackgroundSync(15, ['heartRate', 'stepCount', 'sleepAnalysis']);
```

## Testing

The Watch app logic cannot be unit tested in the standard JavaScript test runner. However, the TypeScript bridge code and data processing can be tested:

```bash
cd apps/mobile
npx jest src/services/wearables/
```

For the Swift code, use Xcode's XCTest framework with the Watch simulator.
