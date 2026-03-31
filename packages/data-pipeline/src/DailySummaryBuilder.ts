import { NormalizedSignal, AlertPayload, DailySummary } from './types';

function mean(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

function getHourFromTimestamp(timestamp: number): number {
  return new Date(timestamp).getUTCHours();
}

function filterByType(signals: NormalizedSignal[], type: string): NormalizedSignal[] {
  return signals.filter((s) => s.type === type || s.type === type.replace('_', ''));
}

function buildHeartRateStats(signals: NormalizedSignal[]): DailySummary['heartRate'] {
  const hrSignals = signals.filter(
    (s) => s.type === 'heart_rate' || s.type === 'heartRate'
  );

  if (hrSignals.length === 0) {
    return { avg: 0, min: 0, max: 0, resting: 0 };
  }

  const values = hrSignals.map((s) => s.value);
  const sorted = [...values].sort((a, b) => a - b);

  // Resting heart rate: approximate as the 10th percentile
  const restingIdx = Math.floor(sorted.length * 0.1);
  const resting = sorted[restingIdx];

  return {
    avg: Math.round(mean(values)),
    min: sorted[0],
    max: sorted[sorted.length - 1],
    resting: Math.round(resting),
  };
}

function buildStepsStats(signals: NormalizedSignal[]): DailySummary['steps'] {
  const stepSignals = signals.filter((s) => s.type === 'steps');

  const hourly = new Array(24).fill(0);

  for (const signal of stepSignals) {
    const hour = getHourFromTimestamp(signal.timestamp);
    hourly[hour] += signal.value;
  }

  const total = hourly.reduce((sum, v) => sum + v, 0);

  return { total, hourly };
}

function buildSleepStats(signals: NormalizedSignal[]): DailySummary['sleep'] {
  const sleepSignals = signals.filter(
    (s) => s.type === 'sleep' || s.type === 'sleep_quality' || s.type === 'sleepQuality'
  );

  if (sleepSignals.length === 0) {
    return { duration: 0, quality: 0, wakeCount: 0 };
  }

  // Duration from metadata if available, otherwise estimate from signal count
  const durationSignals = sleepSignals.filter((s) => s.metadata?.duration);
  const duration =
    durationSignals.length > 0
      ? mean(durationSignals.map((s) => s.metadata!.duration as number))
      : sleepSignals.length * 30; // Estimate: each reading ~30 min apart

  const quality = mean(sleepSignals.map((s) => s.normalizedValue));

  // Count wake events: transitions where quality drops significantly
  let wakeCount = 0;
  const sorted = [...sleepSignals].sort((a, b) => a.timestamp - b.timestamp);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].normalizedValue < 0.3 && sorted[i - 1].normalizedValue >= 0.3) {
      wakeCount++;
    }
  }

  return {
    duration: Math.round(duration),
    quality: Math.round(quality * 100) / 100,
    wakeCount,
  };
}

function buildCognitiveStats(signals: NormalizedSignal[]): DailySummary['cognitiveActivity'] {
  const cogSignals = signals.filter(
    (s) =>
      s.type === 'cognitive' ||
      s.type === 'exercise' ||
      s.type === 'response_time' ||
      s.type === 'responseTime' ||
      s.type === 'score'
  );

  if (cogSignals.length === 0) {
    return { sessions: 0, avgScore: 0, exercises: 0 };
  }

  const scoreSignals = cogSignals.filter(
    (s) => s.type === 'score' || s.type === 'cognitive'
  );

  // Group by session: signals within 30 min of each other belong to the same session
  const sorted = [...cogSignals].sort((a, b) => a.timestamp - b.timestamp);
  let sessions = 1;
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i].timestamp - sorted[i - 1].timestamp > 30 * 60 * 1000) {
      sessions++;
    }
  }

  return {
    sessions,
    avgScore: scoreSignals.length > 0 ? Math.round(mean(scoreSignals.map((s) => s.value))) : 0,
    exercises: cogSignals.length,
  };
}

export function buildDailySummary(
  signals: NormalizedSignal[],
  date: string
): DailySummary {
  const patientId = signals.length > 0 ? signals[0].patientId : '';

  return {
    patientId,
    date,
    heartRate: buildHeartRateStats(signals),
    steps: buildStepsStats(signals),
    sleep: buildSleepStats(signals),
    cognitiveActivity: buildCognitiveStats(signals),
    alerts: [],
  };
}
