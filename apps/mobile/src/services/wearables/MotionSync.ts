/**
 * MotionSync.ts
 *
 * Synchronizes CoreMotion data from the Apple Watch to the Gentle Reminder
 * platform. Provides accelerometer, gyroscope, fall-detection, gait-analysis
 * and step-cadence capabilities through native bridge calls.
 *
 * All motion data is collected on the Watch via CMMotionManager and
 * forwarded to the phone over WatchConnectivity. This module normalizes
 * the raw readings and provides analysis helpers.
 */

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

// ---------------------------------------------------------------------------
// Types & Interfaces
// ---------------------------------------------------------------------------

export interface AccelerometerReading {
  id: string;
  timestamp: number;
  x: number; // g-force
  y: number;
  z: number;
  magnitude: number;
  source: string;
}

export interface GyroscopeReading {
  id: string;
  timestamp: number;
  rotationRateX: number; // rad/s
  rotationRateY: number;
  rotationRateZ: number;
  magnitude: number;
  source: string;
}

export interface DeviceMotionReading {
  id: string;
  timestamp: number;
  attitude: {
    roll: number;   // radians
    pitch: number;
    yaw: number;
  };
  gravity: { x: number; y: number; z: number };
  userAcceleration: { x: number; y: number; z: number };
  rotationRate: { x: number; y: number; z: number };
  magneticField: {
    x: number;
    y: number;
    z: number;
    accuracy: 'uncalibrated' | 'low' | 'medium' | 'high';
  };
}

export interface FallEvent {
  id: string;
  timestamp: number;
  severity: 'minor' | 'moderate' | 'severe';
  impactAcceleration: number; // peak g-force
  freefallDuration: number;   // ms
  postImpactMovement: boolean;
  location?: { latitude: number; longitude: number };
  confirmed: boolean;
  confidenceScore: number; // 0-1
}

export interface GaitAnalysis {
  sessionId: string;
  startTime: number;
  endTime: number;
  stepCount: number;
  cadence: number; // steps per minute
  strideLength: number; // meters
  walkingSpeed: number; // m/s
  asymmetry: number; // 0-1 (0 = perfectly symmetric)
  regularity: number; // 0-1 (1 = very regular)
  stabilityIndex: number; // 0-1 (1 = very stable)
  doubleSupportTime: number; // percentage of gait cycle
  swingTime: number; // percentage
  stanceTime: number; // percentage
  variability: GaitVariability;
  risk: GaitRisk;
}

export interface GaitVariability {
  cadenceCV: number; // coefficient of variation
  strideLengthCV: number;
  swingTimeCV: number;
  stanceTimeCV: number;
}

export interface GaitRisk {
  fallRisk: 'low' | 'moderate' | 'high';
  balanceScore: number; // 0-100
  mobilityScore: number; // 0-100
  recommendations: string[];
}

export interface MotionWindow {
  startTime: Date;
  endTime: Date;
  sampleRate?: number; // Hz, default 50
}

export interface StepCadenceResult {
  averageCadence: number; // steps/min
  peakCadence: number;
  minCadence: number;
  cadenceOverTime: Array<{ timestamp: number; cadence: number }>;
  totalSteps: number;
  durationSeconds: number;
}

type MotionCallback<T> = (data: T) => void;

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const DEFAULT_SAMPLE_RATE_HZ = 50;
const FREEFALL_THRESHOLD_G = 0.3;
const IMPACT_THRESHOLD_G = 3.0;
const SEVERE_IMPACT_G = 6.0;
const MODERATE_IMPACT_G = 4.0;
const FREEFALL_MIN_DURATION_MS = 150;
const POST_IMPACT_WINDOW_MS = 3000;
const STEP_DETECTION_THRESHOLD_G = 0.15;
const MIN_STEP_INTERVAL_MS = 250;
const MAX_STEP_INTERVAL_MS = 2000;

// ---------------------------------------------------------------------------
// MotionSync
// ---------------------------------------------------------------------------

export class MotionSync {
  private static instance: MotionSync | null = null;

  private nativeModule: any;
  private eventEmitter: NativeEventEmitter | null = null;
  private subscriptions: Array<{ remove: () => void }> = [];

  private fallCallbacks: MotionCallback<FallEvent>[] = [];
  private accelCallbacks: MotionCallback<AccelerometerReading>[] = [];
  private gyroCallbacks: MotionCallback<GyroscopeReading>[] = [];
  private deviceMotionCallbacks: MotionCallback<DeviceMotionReading>[] = [];

  // ---------------------------------------------------------------------------
  // Singleton
  // ---------------------------------------------------------------------------

  static getInstance(): MotionSync {
    if (!MotionSync.instance) {
      MotionSync.instance = new MotionSync();
    }
    return MotionSync.instance;
  }

  private constructor() {
    if (Platform.OS !== 'ios') {
      console.warn('[MotionSync] Only supported on iOS');
      return;
    }
    this.nativeModule = NativeModules.CoreMotionBridge ?? null;
    if (this.nativeModule) {
      this.eventEmitter = new NativeEventEmitter(this.nativeModule);
      this.registerNativeListeners();
    }
  }

  // ---------------------------------------------------------------------------
  // Accelerometer
  // ---------------------------------------------------------------------------

  async syncAccelerometerData(window: MotionWindow): Promise<AccelerometerReading[]> {
    if (!this.nativeModule) return [];
    try {
      const raw = await this.nativeModule.queryAccelerometer({
        startDate: window.startTime.toISOString(),
        endDate: window.endTime.toISOString(),
        sampleRate: window.sampleRate ?? DEFAULT_SAMPLE_RATE_HZ,
      });

      return (raw.samples ?? []).map((s: any) => ({
        id: s.uuid ?? this.genId(),
        timestamp: new Date(s.timestamp).getTime(),
        x: s.x ?? 0,
        y: s.y ?? 0,
        z: s.z ?? 0,
        magnitude: Math.sqrt((s.x ?? 0) ** 2 + (s.y ?? 0) ** 2 + (s.z ?? 0) ** 2),
        source: s.source ?? 'Apple Watch',
      }));
    } catch (err) {
      console.error('[MotionSync] syncAccelerometerData failed', err);
      return [];
    }
  }

  // ---------------------------------------------------------------------------
  // Gyroscope
  // ---------------------------------------------------------------------------

  async syncGyroscopeData(window: MotionWindow): Promise<GyroscopeReading[]> {
    if (!this.nativeModule) return [];
    try {
      const raw = await this.nativeModule.queryGyroscope({
        startDate: window.startTime.toISOString(),
        endDate: window.endTime.toISOString(),
        sampleRate: window.sampleRate ?? DEFAULT_SAMPLE_RATE_HZ,
      });

      return (raw.samples ?? []).map((s: any) => ({
        id: s.uuid ?? this.genId(),
        timestamp: new Date(s.timestamp).getTime(),
        rotationRateX: s.x ?? 0,
        rotationRateY: s.y ?? 0,
        rotationRateZ: s.z ?? 0,
        magnitude: Math.sqrt((s.x ?? 0) ** 2 + (s.y ?? 0) ** 2 + (s.z ?? 0) ** 2),
        source: s.source ?? 'Apple Watch',
      }));
    } catch (err) {
      console.error('[MotionSync] syncGyroscopeData failed', err);
      return [];
    }
  }

  // ---------------------------------------------------------------------------
  // Device Motion (fused sensor)
  // ---------------------------------------------------------------------------

  async syncDeviceMotion(window: MotionWindow): Promise<DeviceMotionReading[]> {
    if (!this.nativeModule) return [];
    try {
      const raw = await this.nativeModule.queryDeviceMotion({
        startDate: window.startTime.toISOString(),
        endDate: window.endTime.toISOString(),
        sampleRate: window.sampleRate ?? DEFAULT_SAMPLE_RATE_HZ,
      });

      return (raw.samples ?? []).map((s: any) => ({
        id: s.uuid ?? this.genId(),
        timestamp: new Date(s.timestamp).getTime(),
        attitude: {
          roll: s.attitude?.roll ?? 0,
          pitch: s.attitude?.pitch ?? 0,
          yaw: s.attitude?.yaw ?? 0,
        },
        gravity: { x: s.gravity?.x ?? 0, y: s.gravity?.y ?? 0, z: s.gravity?.z ?? 0 },
        userAcceleration: { x: s.userAccel?.x ?? 0, y: s.userAccel?.y ?? 0, z: s.userAccel?.z ?? 0 },
        rotationRate: { x: s.rotation?.x ?? 0, y: s.rotation?.y ?? 0, z: s.rotation?.z ?? 0 },
        magneticField: {
          x: s.magneticField?.x ?? 0,
          y: s.magneticField?.y ?? 0,
          z: s.magneticField?.z ?? 0,
          accuracy: s.magneticField?.accuracy ?? 'uncalibrated',
        },
      }));
    } catch (err) {
      console.error('[MotionSync] syncDeviceMotion failed', err);
      return [];
    }
  }

  // ---------------------------------------------------------------------------
  // Fall Detection
  // ---------------------------------------------------------------------------

  detectFallEvent(accelReadings: AccelerometerReading[]): FallEvent | null {
    if (accelReadings.length < 10) return null;

    // Phase 1: find freefall (magnitude < threshold)
    let freefallStart: number | null = null;
    let freefallEnd: number | null = null;

    for (let i = 0; i < accelReadings.length; i++) {
      const r = accelReadings[i];
      if (r.magnitude < FREEFALL_THRESHOLD_G) {
        if (freefallStart === null) freefallStart = i;
        freefallEnd = i;
      } else if (freefallStart !== null) {
        const duration = accelReadings[freefallEnd!].timestamp - accelReadings[freefallStart].timestamp;
        if (duration >= FREEFALL_MIN_DURATION_MS) break;
        freefallStart = null;
        freefallEnd = null;
      }
    }

    if (freefallStart === null || freefallEnd === null) return null;

    const freefallDuration =
      accelReadings[freefallEnd].timestamp - accelReadings[freefallStart].timestamp;
    if (freefallDuration < FREEFALL_MIN_DURATION_MS) return null;

    // Phase 2: find impact spike after freefall
    let peakG = 0;
    let impactIndex = -1;
    for (let i = freefallEnd + 1; i < accelReadings.length; i++) {
      if (accelReadings[i].timestamp - accelReadings[freefallEnd].timestamp > POST_IMPACT_WINDOW_MS) break;
      if (accelReadings[i].magnitude > peakG) {
        peakG = accelReadings[i].magnitude;
        impactIndex = i;
      }
    }

    if (peakG < IMPACT_THRESHOLD_G) return null;

    // Phase 3: check post-impact movement (low movement suggests incapacitation)
    let postImpactMovement = false;
    if (impactIndex >= 0) {
      const postWindow = accelReadings.slice(impactIndex + 1, impactIndex + 50);
      const avgMag = postWindow.reduce((sum, r) => sum + r.magnitude, 0) / (postWindow.length || 1);
      postImpactMovement = avgMag > 1.2; // above resting gravity
    }

    const severity: FallEvent['severity'] =
      peakG >= SEVERE_IMPACT_G ? 'severe' : peakG >= MODERATE_IMPACT_G ? 'moderate' : 'minor';

    const confidence = Math.min(1.0, (peakG / SEVERE_IMPACT_G) * 0.5 + (freefallDuration / 500) * 0.3 + 0.2);

    return {
      id: this.genId(),
      timestamp: accelReadings[freefallStart].timestamp,
      severity,
      impactAcceleration: peakG,
      freefallDuration,
      postImpactMovement,
      confirmed: false,
      confidenceScore: Math.round(confidence * 100) / 100,
    };
  }

  // ---------------------------------------------------------------------------
  // Gait Analysis
  // ---------------------------------------------------------------------------

  analyzeGait(accelReadings: AccelerometerReading[]): GaitAnalysis | null {
    if (accelReadings.length < 100) return null;

    const steps = this.detectSteps(accelReadings);
    if (steps.length < 4) return null;

    const startTime = accelReadings[0].timestamp;
    const endTime = accelReadings[accelReadings.length - 1].timestamp;
    const durationSec = (endTime - startTime) / 1000;

    // Cadence
    const stepIntervals: number[] = [];
    for (let i = 1; i < steps.length; i++) {
      stepIntervals.push(steps[i].timestamp - steps[i - 1].timestamp);
    }
    const avgInterval = stepIntervals.reduce((a, b) => a + b, 0) / stepIntervals.length;
    const cadence = 60000 / avgInterval; // steps per minute

    // Stride length estimate (using inverted pendulum model)
    const avgStepAccel = steps.reduce((s, step) => s + step.magnitude, 0) / steps.length;
    const strideLength = 0.4 * Math.cbrt(avgStepAccel) * (avgInterval / 1000); // rough estimate
    const walkingSpeed = (strideLength * cadence) / 60;

    // Asymmetry: compare odd vs even step intervals
    const oddIntervals = stepIntervals.filter((_, i) => i % 2 === 0);
    const evenIntervals = stepIntervals.filter((_, i) => i % 2 === 1);
    const oddAvg = oddIntervals.reduce((a, b) => a + b, 0) / (oddIntervals.length || 1);
    const evenAvg = evenIntervals.reduce((a, b) => a + b, 0) / (evenIntervals.length || 1);
    const asymmetry = Math.abs(oddAvg - evenAvg) / ((oddAvg + evenAvg) / 2);

    // Regularity: inverse of interval coefficient of variation
    const intervalMean = avgInterval;
    const intervalStd = Math.sqrt(
      stepIntervals.reduce((s, v) => s + (v - intervalMean) ** 2, 0) / stepIntervals.length
    );
    const cadenceCV = intervalStd / intervalMean;
    const regularity = Math.max(0, 1 - cadenceCV);

    // Stability from vertical axis variance
    const verticalAxis = accelReadings.map(r => r.z);
    const vertMean = verticalAxis.reduce((a, b) => a + b, 0) / verticalAxis.length;
    const vertStd = Math.sqrt(verticalAxis.reduce((s, v) => s + (v - vertMean) ** 2, 0) / verticalAxis.length);
    const stabilityIndex = Math.max(0, Math.min(1, 1 - vertStd / 2));

    // Gait phase estimation (simplified)
    const doubleSupportTime = 20 + asymmetry * 15; // rough %
    const swingTime = (100 - doubleSupportTime) / 2;
    const stanceTime = 100 - swingTime;

    // Variability metrics
    const strideLengthCV = cadenceCV * 0.8; // correlated estimate
    const swingTimeCV = cadenceCV * 1.1;
    const stanceTimeCV = cadenceCV * 0.9;

    // Risk assessment
    const fallRisk: GaitRisk['fallRisk'] =
      cadenceCV > 0.15 || asymmetry > 0.2 || stabilityIndex < 0.5
        ? 'high'
        : cadenceCV > 0.08 || asymmetry > 0.1 || stabilityIndex < 0.7
        ? 'moderate'
        : 'low';

    const balanceScore = Math.round(stabilityIndex * 100);
    const mobilityScore = Math.round((regularity * 50 + (1 - asymmetry) * 50));

    const recommendations: string[] = [];
    if (fallRisk === 'high') {
      recommendations.push('Consider using a walking aid for stability');
      recommendations.push('Consult physical therapist for balance exercises');
    }
    if (asymmetry > 0.15) {
      recommendations.push('Gait asymmetry detected - consider orthopedic evaluation');
    }
    if (cadence < 80) {
      recommendations.push('Walking cadence is below normal - gentle walking program recommended');
    }
    if (stabilityIndex < 0.6) {
      recommendations.push('Low stability detected - ensure clear walking paths at home');
    }

    return {
      sessionId: this.genId(),
      startTime,
      endTime,
      stepCount: steps.length,
      cadence: Math.round(cadence * 10) / 10,
      strideLength: Math.round(strideLength * 100) / 100,
      walkingSpeed: Math.round(walkingSpeed * 100) / 100,
      asymmetry: Math.round(asymmetry * 1000) / 1000,
      regularity: Math.round(regularity * 1000) / 1000,
      stabilityIndex: Math.round(stabilityIndex * 1000) / 1000,
      doubleSupportTime: Math.round(doubleSupportTime * 10) / 10,
      swingTime: Math.round(swingTime * 10) / 10,
      stanceTime: Math.round(stanceTime * 10) / 10,
      variability: {
        cadenceCV: Math.round(cadenceCV * 10000) / 10000,
        strideLengthCV: Math.round(strideLengthCV * 10000) / 10000,
        swingTimeCV: Math.round(swingTimeCV * 10000) / 10000,
        stanceTimeCV: Math.round(stanceTimeCV * 10000) / 10000,
      },
      risk: { fallRisk, balanceScore, mobilityScore, recommendations },
    };
  }

  // ---------------------------------------------------------------------------
  // Step cadence
  // ---------------------------------------------------------------------------

  calculateStepCadence(accelReadings: AccelerometerReading[]): StepCadenceResult {
    const steps = this.detectSteps(accelReadings);
    if (steps.length < 2) {
      return {
        averageCadence: 0,
        peakCadence: 0,
        minCadence: 0,
        cadenceOverTime: [],
        totalSteps: 0,
        durationSeconds: 0,
      };
    }

    const duration = (steps[steps.length - 1].timestamp - steps[0].timestamp) / 1000;

    // Build cadence over sliding window (10-step window)
    const windowSize = Math.min(10, Math.floor(steps.length / 2));
    const cadenceOverTime: Array<{ timestamp: number; cadence: number }> = [];
    let peakCadence = 0;
    let minCadence = Infinity;

    for (let i = windowSize; i < steps.length; i++) {
      const windowDuration = (steps[i].timestamp - steps[i - windowSize].timestamp) / 1000;
      if (windowDuration > 0) {
        const cadence = (windowSize / windowDuration) * 60;
        cadenceOverTime.push({ timestamp: steps[i].timestamp, cadence: Math.round(cadence * 10) / 10 });
        if (cadence > peakCadence) peakCadence = cadence;
        if (cadence < minCadence) minCadence = cadence;
      }
    }

    const averageCadence = duration > 0 ? (steps.length / duration) * 60 : 0;

    return {
      averageCadence: Math.round(averageCadence * 10) / 10,
      peakCadence: Math.round(peakCadence * 10) / 10,
      minCadence: minCadence === Infinity ? 0 : Math.round(minCadence * 10) / 10,
      cadenceOverTime,
      totalSteps: steps.length,
      durationSeconds: Math.round(duration * 10) / 10,
    };
  }

  // ---------------------------------------------------------------------------
  // Step detection (peak detection algorithm)
  // ---------------------------------------------------------------------------

  private detectSteps(readings: AccelerometerReading[]): AccelerometerReading[] {
    if (readings.length < 5) return [];

    // Apply low-pass filter to vertical axis
    const filtered = this.lowPassFilter(readings.map(r => r.magnitude), 0.3);
    const mean = filtered.reduce((a, b) => a + b, 0) / filtered.length;

    const steps: AccelerometerReading[] = [];
    let lastStepTime = 0;

    for (let i = 2; i < filtered.length - 2; i++) {
      // Peak detection: local maximum above threshold
      const isPeak =
        filtered[i] > filtered[i - 1] &&
        filtered[i] > filtered[i - 2] &&
        filtered[i] > filtered[i + 1] &&
        filtered[i] > filtered[i + 2] &&
        filtered[i] > mean + STEP_DETECTION_THRESHOLD_G;

      if (isPeak) {
        const timeSinceLast = readings[i].timestamp - lastStepTime;
        if (timeSinceLast >= MIN_STEP_INTERVAL_MS && timeSinceLast <= MAX_STEP_INTERVAL_MS) {
          steps.push(readings[i]);
          lastStepTime = readings[i].timestamp;
        } else if (lastStepTime === 0) {
          steps.push(readings[i]);
          lastStepTime = readings[i].timestamp;
        }
      }
    }

    return steps;
  }

  private lowPassFilter(signal: number[], alpha: number): number[] {
    const result = [signal[0]];
    for (let i = 1; i < signal.length; i++) {
      result.push(alpha * signal[i] + (1 - alpha) * result[i - 1]);
    }
    return result;
  }

  // ---------------------------------------------------------------------------
  // Real-time listeners
  // ---------------------------------------------------------------------------

  onFallDetected(callback: MotionCallback<FallEvent>): () => void {
    this.fallCallbacks.push(callback);
    return () => { this.fallCallbacks = this.fallCallbacks.filter(c => c !== callback); };
  }

  onAccelerometerUpdate(callback: MotionCallback<AccelerometerReading>): () => void {
    this.accelCallbacks.push(callback);
    return () => { this.accelCallbacks = this.accelCallbacks.filter(c => c !== callback); };
  }

  onGyroscopeUpdate(callback: MotionCallback<GyroscopeReading>): () => void {
    this.gyroCallbacks.push(callback);
    return () => { this.gyroCallbacks = this.gyroCallbacks.filter(c => c !== callback); };
  }

  // ---------------------------------------------------------------------------
  // Native event bridge
  // ---------------------------------------------------------------------------

  private registerNativeListeners(): void {
    if (!this.eventEmitter) return;

    this.subscriptions.push(
      this.eventEmitter.addListener('MotionAccelerometer', (data: any) => {
        const reading: AccelerometerReading = {
          id: this.genId(),
          timestamp: data.timestamp ?? Date.now(),
          x: data.x ?? 0,
          y: data.y ?? 0,
          z: data.z ?? 0,
          magnitude: Math.sqrt((data.x ?? 0) ** 2 + (data.y ?? 0) ** 2 + (data.z ?? 0) ** 2),
          source: 'Apple Watch',
        };
        this.accelCallbacks.forEach(cb => cb(reading));
      }),
      this.eventEmitter.addListener('MotionGyroscope', (data: any) => {
        const reading: GyroscopeReading = {
          id: this.genId(),
          timestamp: data.timestamp ?? Date.now(),
          rotationRateX: data.x ?? 0,
          rotationRateY: data.y ?? 0,
          rotationRateZ: data.z ?? 0,
          magnitude: Math.sqrt((data.x ?? 0) ** 2 + (data.y ?? 0) ** 2 + (data.z ?? 0) ** 2),
          source: 'Apple Watch',
        };
        this.gyroCallbacks.forEach(cb => cb(reading));
      }),
      this.eventEmitter.addListener('MotionFallDetected', (data: any) => {
        const event: FallEvent = {
          id: this.genId(),
          timestamp: data.timestamp ?? Date.now(),
          severity: data.severity ?? 'moderate',
          impactAcceleration: data.impactAcceleration ?? 0,
          freefallDuration: data.freefallDuration ?? 0,
          postImpactMovement: data.postImpactMovement ?? false,
          confirmed: false,
          confidenceScore: data.confidence ?? 0.5,
          location: data.location,
        };
        this.fallCallbacks.forEach(cb => cb(event));
      })
    );
  }

  // ---------------------------------------------------------------------------
  // Cleanup
  // ---------------------------------------------------------------------------

  destroy(): void {
    this.subscriptions.forEach(s => s.remove());
    this.subscriptions = [];
    this.fallCallbacks = [];
    this.accelCallbacks = [];
    this.gyroCallbacks = [];
    this.deviceMotionCallbacks = [];
  }

  static destroySingleton(): void {
    if (MotionSync.instance) {
      MotionSync.instance.destroy();
      MotionSync.instance = null;
    }
  }

  // ---------------------------------------------------------------------------
  // Utility
  // ---------------------------------------------------------------------------

  private genId(): string {
    return `mo_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  }
}

export default MotionSync;
