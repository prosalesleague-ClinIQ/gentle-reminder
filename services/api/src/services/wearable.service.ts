import { AppError } from '../middleware/errorHandler.js';

/**
 * Wearable data ingestion and aggregation service.
 * Normalizes signals from multiple wearable device formats and
 * provides daily summaries for clinician dashboards.
 */

// ── Types ─────────────────────────────────────────────────

export type SignalType = 'heartrate' | 'movement' | 'sleep' | 'spo2' | 'temperature';

export interface RawWearableSignal {
  patientId: string;
  deviceId?: string;
  deviceType?: string; // 'apple_watch' | 'fitbit' | 'garmin' | 'generic'
  signalType: SignalType;
  value: number;
  unit?: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface NormalizedSignal {
  patientId: string;
  deviceId: string;
  signalType: SignalType;
  value: number;
  unit: string;
  timestamp: string;
  normalizedAt: string;
}

export interface DailySummary {
  patientId: string;
  date: string;
  heartRate: {
    min: number;
    max: number;
    avg: number;
    resting: number;
    readings: number;
  };
  movement: {
    steps: number;
    activeMinutes: number;
    readings: number;
  };
  sleep: {
    totalMinutes: number;
    deepMinutes: number;
    lightMinutes: number;
    awakenings: number;
    quality: 'poor' | 'fair' | 'good' | 'excellent';
    readings: number;
  };
  alerts: string[];
  generatedAt: string;
}

// ── In-memory store (demo mode) ───────────────────────────

const signalStore: Map<string, NormalizedSignal[]> = new Map();

/** Default units for each signal type */
const DEFAULT_UNITS: Record<SignalType, string> = {
  heartrate: 'bpm',
  movement: 'steps',
  sleep: 'minutes',
  spo2: '%',
  temperature: 'celsius',
};

// ── Normalization ─────────────────────────────────────────

/**
 * Normalize a raw wearable signal into a standard format.
 * Handles different device formats and unit conversions.
 */
export function normalizeSignal(raw: RawWearableSignal): NormalizedSignal {
  let value = raw.value;
  let unit = raw.unit || DEFAULT_UNITS[raw.signalType] || 'unknown';

  // Unit conversions
  if (raw.signalType === 'temperature' && raw.unit === 'fahrenheit') {
    value = (value - 32) * (5 / 9);
    unit = 'celsius';
  }

  // Clamp heart rate to physiological range
  if (raw.signalType === 'heartrate') {
    value = Math.max(30, Math.min(250, value));
  }

  // Clamp SpO2 to valid range
  if (raw.signalType === 'spo2') {
    value = Math.max(0, Math.min(100, value));
  }

  return {
    patientId: raw.patientId,
    deviceId: raw.deviceId || 'unknown',
    signalType: raw.signalType,
    value: Math.round(value * 100) / 100,
    unit,
    timestamp: raw.timestamp || new Date().toISOString(),
    normalizedAt: new Date().toISOString(),
  };
}

// ── Ingestion ─────────────────────────────────────────────

/**
 * Ingest a batch of wearable signals. Normalizes and stores each one.
 */
export async function ingestBatch(signals: RawWearableSignal[]): Promise<{
  accepted: number;
  rejected: number;
  errors: string[];
}> {
  let accepted = 0;
  let rejected = 0;
  const errors: string[] = [];

  for (const raw of signals) {
    try {
      if (!raw.patientId) {
        rejected++;
        errors.push('Missing patientId');
        continue;
      }
      if (!raw.signalType) {
        rejected++;
        errors.push('Missing signalType');
        continue;
      }

      const normalized = normalizeSignal(raw);

      // Store in memory (in production: write to time-series DB)
      const key = normalized.patientId;
      if (!signalStore.has(key)) {
        signalStore.set(key, []);
      }
      signalStore.get(key)!.push(normalized);
      accepted++;
    } catch (err) {
      rejected++;
      errors.push((err as Error).message);
    }
  }

  return { accepted, rejected, errors };
}

/**
 * Ingest a single heart rate reading.
 */
export async function ingestHeartRate(data: {
  patientId: string;
  value: number;
  deviceId?: string;
  timestamp?: string;
}): Promise<NormalizedSignal> {
  const normalized = normalizeSignal({
    patientId: data.patientId,
    deviceId: data.deviceId,
    signalType: 'heartrate',
    value: data.value,
    unit: 'bpm',
    timestamp: data.timestamp || new Date().toISOString(),
  });

  const key = normalized.patientId;
  if (!signalStore.has(key)) {
    signalStore.set(key, []);
  }
  signalStore.get(key)!.push(normalized);

  return normalized;
}

/**
 * Ingest movement / step data.
 */
export async function ingestMovement(data: {
  patientId: string;
  steps: number;
  activeMinutes?: number;
  deviceId?: string;
  timestamp?: string;
}): Promise<NormalizedSignal> {
  const normalized = normalizeSignal({
    patientId: data.patientId,
    deviceId: data.deviceId,
    signalType: 'movement',
    value: data.steps,
    unit: 'steps',
    timestamp: data.timestamp || new Date().toISOString(),
    metadata: { activeMinutes: data.activeMinutes },
  });

  const key = normalized.patientId;
  if (!signalStore.has(key)) {
    signalStore.set(key, []);
  }
  signalStore.get(key)!.push(normalized);

  return normalized;
}

/**
 * Ingest sleep data.
 */
export async function ingestSleep(data: {
  patientId: string;
  totalMinutes: number;
  deepMinutes?: number;
  lightMinutes?: number;
  awakenings?: number;
  deviceId?: string;
  timestamp?: string;
}): Promise<NormalizedSignal> {
  const normalized = normalizeSignal({
    patientId: data.patientId,
    deviceId: data.deviceId,
    signalType: 'sleep',
    value: data.totalMinutes,
    unit: 'minutes',
    timestamp: data.timestamp || new Date().toISOString(),
    metadata: {
      deepMinutes: data.deepMinutes,
      lightMinutes: data.lightMinutes,
      awakenings: data.awakenings,
    },
  });

  const key = normalized.patientId;
  if (!signalStore.has(key)) {
    signalStore.set(key, []);
  }
  signalStore.get(key)!.push(normalized);

  return normalized;
}

// ── Aggregation ───────────────────────────────────────────

/**
 * Generate a daily summary of all wearable data for a patient.
 */
export async function getDailySummary(
  patientId: string,
  date?: string,
): Promise<DailySummary> {
  const targetDate = date || new Date().toISOString().split('T')[0];
  const signals = signalStore.get(patientId) || [];

  // Filter signals for the target date
  const daySignals = signals.filter((s) =>
    s.timestamp.startsWith(targetDate),
  );

  // Heart rate aggregation
  const hrSignals = daySignals.filter((s) => s.signalType === 'heartrate');
  const hrValues = hrSignals.map((s) => s.value);
  const heartRate = {
    min: hrValues.length > 0 ? Math.min(...hrValues) : 0,
    max: hrValues.length > 0 ? Math.max(...hrValues) : 0,
    avg: hrValues.length > 0 ? Math.round(hrValues.reduce((a, b) => a + b, 0) / hrValues.length) : 0,
    resting: hrValues.length > 0 ? Math.min(...hrValues.filter((v) => v > 40)) || 0 : 0,
    readings: hrValues.length,
  };

  // Movement aggregation
  const moveSignals = daySignals.filter((s) => s.signalType === 'movement');
  const movement = {
    steps: moveSignals.reduce((sum, s) => sum + s.value, 0),
    activeMinutes: moveSignals.length * 5, // Estimate 5 min per reading
    readings: moveSignals.length,
  };

  // Sleep aggregation
  const sleepSignals = daySignals.filter((s) => s.signalType === 'sleep');
  const totalSleepMin = sleepSignals.reduce((sum, s) => sum + s.value, 0);
  const sleepQuality: DailySummary['sleep']['quality'] =
    totalSleepMin >= 420 ? 'excellent' :
    totalSleepMin >= 360 ? 'good' :
    totalSleepMin >= 300 ? 'fair' : 'poor';

  const sleep = {
    totalMinutes: totalSleepMin,
    deepMinutes: Math.round(totalSleepMin * 0.2),
    lightMinutes: Math.round(totalSleepMin * 0.6),
    awakenings: sleepSignals.length > 0 ? Math.max(1, sleepSignals.length - 1) : 0,
    quality: sleepQuality,
    readings: sleepSignals.length,
  };

  // Generate alerts
  const alerts: string[] = [];
  if (heartRate.max > 120) alerts.push('Elevated heart rate detected');
  if (heartRate.min > 0 && heartRate.min < 50) alerts.push('Low heart rate detected');
  if (movement.steps < 500 && moveSignals.length > 0) alerts.push('Low activity level');
  if (totalSleepMin > 0 && totalSleepMin < 300) alerts.push('Poor sleep quality');

  return {
    patientId,
    date: targetDate,
    heartRate,
    movement,
    sleep,
    alerts,
    generatedAt: new Date().toISOString(),
  };
}
