import { RawSignal, NormalizedSignal, AlertPayload } from './types';
import { normalizeSignal } from './SignalNormalizer';

interface RollingStats {
  values: number[];
  mean: number;
  stddev: number;
}

const DEFAULT_WINDOW_SIZE = 100;
const ANOMALY_THRESHOLD = 2.0;

export class EventStreamProcessor {
  private windows: Map<string, RollingStats> = new Map();
  private windowSize: number;

  constructor(windowSize: number = DEFAULT_WINDOW_SIZE) {
    this.windowSize = windowSize;
  }

  processEvent(signal: RawSignal): { normalized: NormalizedSignal; alerts: AlertPayload[] } {
    const normalized = normalizeSignal(signal);
    const alerts: AlertPayload[] = [];

    const key = `${signal.patientId}:${signal.type}`;
    const stats = this.getOrCreateWindow(key);

    // Check for anomaly before updating the window
    if (stats.values.length >= 5) {
      const zScore = stats.stddev > 0
        ? Math.abs(signal.value - stats.mean) / stats.stddev
        : 0;

      if (zScore > ANOMALY_THRESHOLD) {
        alerts.push(
          this.generateAlert(
            signal,
            `Value ${signal.value} is ${zScore.toFixed(1)} standard deviations from rolling mean ${stats.mean.toFixed(1)}`
          )
        );
      }
    }

    // Update the sliding window
    this.updateWindow(key, signal.value);

    return { normalized, alerts };
  }

  generateAlert(signal: RawSignal, reason: string): AlertPayload {
    const key = `${signal.patientId}:${signal.type}`;
    const stats = this.windows.get(key);
    const deviation = stats && stats.stddev > 0
      ? Math.abs(signal.value - stats.mean) / stats.stddev
      : 0;

    let severity: 'low' | 'medium' | 'high';
    if (deviation > 3) {
      severity = 'high';
    } else if (deviation > 2.5) {
      severity = 'medium';
    } else {
      severity = 'low';
    }

    return {
      patientId: signal.patientId,
      signalType: signal.type,
      value: signal.value,
      reason,
      severity,
      timestamp: signal.timestamp,
    };
  }

  private getOrCreateWindow(key: string): RollingStats {
    if (!this.windows.has(key)) {
      this.windows.set(key, { values: [], mean: 0, stddev: 0 });
    }
    return this.windows.get(key)!;
  }

  private updateWindow(key: string, value: number): void {
    const stats = this.getOrCreateWindow(key);

    stats.values.push(value);

    // Trim to window size
    if (stats.values.length > this.windowSize) {
      stats.values.shift();
    }

    // Recompute stats
    const n = stats.values.length;
    stats.mean = stats.values.reduce((sum, v) => sum + v, 0) / n;

    if (n >= 2) {
      const squaredDiffs = stats.values.map((v) => (v - stats.mean) ** 2);
      stats.stddev = Math.sqrt(squaredDiffs.reduce((sum, v) => sum + v, 0) / (n - 1));
    } else {
      stats.stddev = 0;
    }
  }

  /** Resets internal state for a given patient and signal type, or all if no key given. */
  reset(patientId?: string, signalType?: string): void {
    if (patientId && signalType) {
      this.windows.delete(`${patientId}:${signalType}`);
    } else {
      this.windows.clear();
    }
  }
}
