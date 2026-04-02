/**
 * WearableDataProcessor.ts
 *
 * Central processing hub for all wearable data collected from the Apple Watch.
 * Normalizes raw readings, performs statistical analysis, detects anomalies,
 * and builds daily summaries for the Gentle Reminder clinical dashboard.
 *
 * Key capabilities:
 *  - Heart rate variability (HRV) analysis (time-domain & frequency-domain)
 *  - Sleep stage analysis & quality scoring
 *  - Anomaly detection against patient baselines
 *  - Daily wearable summary aggregation
 *  - Trend detection over multi-day windows
 */

import type { HeartRateReading, SleepReading, ActivitySummary } from './HealthKitSync';
import type { AccelerometerReading, GaitAnalysis, FallEvent } from './MotionSync';

// ---------------------------------------------------------------------------
// Interfaces
// ---------------------------------------------------------------------------

export interface HRVMetrics {
  sdnn: number;           // standard deviation of NN intervals (ms)
  rmssd: number;          // root mean square of successive differences (ms)
  pnn50: number;          // % of successive intervals differing by >50ms
  meanNN: number;         // mean NN interval (ms)
  medianNN: number;
  minNN: number;
  maxNN: number;
  triangularIndex: number; // HRV triangular index
  tinn: number;           // triangular interpolation of NN histogram
  sdsd: number;           // standard deviation of successive differences
  // Frequency domain (estimated via Lomb-Scargle for irregular samples)
  vlf: number;            // very low frequency power (ms^2)
  lf: number;             // low frequency power (ms^2)
  hf: number;             // high frequency power (ms^2)
  lfHfRatio: number;      // LF/HF ratio (sympathovagal balance)
  totalPower: number;
  // Non-linear
  sd1: number;            // Poincare plot SD1
  sd2: number;            // Poincare plot SD2
  sampleEntropy: number;
  // Context
  readingCount: number;
  periodStart: number;
  periodEnd: number;
  quality: 'good' | 'fair' | 'poor';
}

export interface SleepStageAnalysis {
  totalSleepMinutes: number;
  timeInBedMinutes: number;
  sleepEfficiency: number; // %
  sleepOnsetLatency: number; // minutes
  wakeAfterSleepOnset: number; // minutes
  numberOfAwakenings: number;
  stages: {
    awake: SleepStageDetail;
    light: SleepStageDetail;
    deep: SleepStageDetail;
    rem: SleepStageDetail;
  };
  sleepScore: number; // 0-100 composite
  sleepQuality: 'excellent' | 'good' | 'fair' | 'poor';
  cycles: SleepCycle[];
  recommendations: string[];
}

export interface SleepStageDetail {
  totalMinutes: number;
  percentage: number;
  averageDuration: number;
  episodeCount: number;
}

export interface SleepCycle {
  cycleNumber: number;
  startTime: number;
  endTime: number;
  durationMinutes: number;
  hasDeepSleep: boolean;
  hasREM: boolean;
}

export interface Anomaly {
  id: string;
  type: AnomalyType;
  timestamp: number;
  metric: string;
  value: number;
  baselineValue: number;
  deviationSigma: number;
  severity: 'info' | 'warning' | 'critical';
  description: string;
  recommendedAction?: string;
}

export type AnomalyType =
  | 'heartRateHigh'
  | 'heartRateLow'
  | 'hrvDrop'
  | 'sleepDisturbance'
  | 'activityDrop'
  | 'fallDetected'
  | 'gaitDegradation'
  | 'restingHRChange'
  | 'irregularRhythm'
  | 'prolongedInactivity';

export interface BaselineMetrics {
  heartRate: { mean: number; std: number; min: number; max: number };
  restingHeartRate: { mean: number; std: number };
  hrv: { sdnn: number; rmssd: number; std: number };
  steps: { dailyMean: number; std: number };
  sleep: { totalMinutes: number; efficiency: number; std: number };
  gait: { cadence: number; stability: number; asymmetry: number };
  updatedAt: number;
  sampleDays: number;
}

export interface DailyWearableSummary {
  date: string; // YYYY-MM-DD
  heartRate: {
    average: number;
    resting: number;
    peak: number;
    min: number;
    readingCount: number;
  };
  hrv: HRVMetrics | null;
  steps: {
    total: number;
    distance: number; // meters
    flights: number;
    hourlyBreakdown: Array<{ hour: number; steps: number }>;
  };
  sleep: SleepStageAnalysis | null;
  activity: ActivitySummary | null;
  gait: GaitAnalysis | null;
  falls: FallEvent[];
  anomalies: Anomaly[];
  overallScore: number; // 0-100 wellness
  generatedAt: number;
}

export interface NormalizedSignal {
  timestamp: number;
  value: number;
  type: string;
  unit: string;
  quality: number; // 0-1
}

export interface TrendResult {
  metric: string;
  direction: 'improving' | 'stable' | 'declining';
  slope: number;
  rSquared: number;
  periodDays: number;
  significance: boolean;
  description: string;
}

// ---------------------------------------------------------------------------
// WearableDataProcessor
// ---------------------------------------------------------------------------

export class WearableDataProcessor {

  // ---------------------------------------------------------------------------
  // Raw data normalization
  // ---------------------------------------------------------------------------

  processRawHealthData(
    heartRateReadings: HeartRateReading[],
    sleepReadings: SleepReading[],
    activity: ActivitySummary | null
  ): NormalizedSignal[] {
    const signals: NormalizedSignal[] = [];

    for (const hr of heartRateReadings) {
      signals.push({
        timestamp: hr.timestamp,
        value: hr.bpm,
        type: 'heartRate',
        unit: 'bpm',
        quality: hr.confidence,
      });
    }

    for (const sr of sleepReadings) {
      const stageMap: Record<string, number> = {
        awake: 0, inBed: 0.5, asleepUnspecified: 1, asleepCore: 2, asleepDeep: 3, asleepREM: 4,
      };
      signals.push({
        timestamp: sr.startTimestamp,
        value: stageMap[sr.stage] ?? 0,
        type: 'sleepStage',
        unit: 'stage',
        quality: 1.0,
      });
    }

    if (activity) {
      signals.push(
        { timestamp: Date.parse(activity.date), value: activity.stepCount, type: 'dailySteps', unit: 'count', quality: 1.0 },
        { timestamp: Date.parse(activity.date), value: activity.activeEnergyBurned, type: 'activeEnergy', unit: 'kcal', quality: 1.0 },
        { timestamp: Date.parse(activity.date), value: activity.exerciseMinutes, type: 'exerciseMinutes', unit: 'min', quality: 1.0 }
      );
    }

    return signals.sort((a, b) => a.timestamp - b.timestamp);
  }

  // ---------------------------------------------------------------------------
  // Heart Rate Variability (HRV) analysis
  // ---------------------------------------------------------------------------

  calculateHeartRateVariability(readings: HeartRateReading[]): HRVMetrics | null {
    if (readings.length < 10) return null;

    // Convert BPM to NN intervals (ms)
    const nnIntervals: number[] = [];
    for (let i = 0; i < readings.length; i++) {
      if (readings[i].bpm > 0) {
        nnIntervals.push(60000 / readings[i].bpm);
      }
    }

    if (nnIntervals.length < 10) return null;

    // Time-domain metrics
    const meanNN = nnIntervals.reduce((a, b) => a + b, 0) / nnIntervals.length;
    const sorted = [...nnIntervals].sort((a, b) => a - b);
    const medianNN = sorted[Math.floor(sorted.length / 2)];
    const minNN = sorted[0];
    const maxNN = sorted[sorted.length - 1];

    // SDNN
    const sdnn = Math.sqrt(
      nnIntervals.reduce((sum, nn) => sum + (nn - meanNN) ** 2, 0) / nnIntervals.length
    );

    // Successive differences
    const successiveDiffs: number[] = [];
    for (let i = 1; i < nnIntervals.length; i++) {
      successiveDiffs.push(nnIntervals[i] - nnIntervals[i - 1]);
    }

    // RMSSD
    const rmssd = Math.sqrt(
      successiveDiffs.reduce((sum, d) => sum + d ** 2, 0) / successiveDiffs.length
    );

    // SDSD
    const meanDiff = successiveDiffs.reduce((a, b) => a + b, 0) / successiveDiffs.length;
    const sdsd = Math.sqrt(
      successiveDiffs.reduce((sum, d) => sum + (d - meanDiff) ** 2, 0) / successiveDiffs.length
    );

    // pNN50
    const nn50Count = successiveDiffs.filter(d => Math.abs(d) > 50).length;
    const pnn50 = (nn50Count / successiveDiffs.length) * 100;

    // Triangular index (histogram-based)
    const binWidth = 7.8125; // 1/128 seconds in ms
    const bins = new Map<number, number>();
    for (const nn of nnIntervals) {
      const bin = Math.round(nn / binWidth);
      bins.set(bin, (bins.get(bin) ?? 0) + 1);
    }
    const maxBinCount = Math.max(...bins.values());
    const triangularIndex = nnIntervals.length / maxBinCount;

    // TINN (simplified as range of bins with > maxBinCount/2)
    const halfMax = maxBinCount / 2;
    let tinnMin = Infinity;
    let tinnMax = -Infinity;
    for (const [bin, count] of bins.entries()) {
      if (count >= halfMax) {
        tinnMin = Math.min(tinnMin, bin * binWidth);
        tinnMax = Math.max(tinnMax, bin * binWidth);
      }
    }
    const tinn = tinnMax - tinnMin;

    // Frequency domain (simplified estimation via autocorrelation)
    const { vlf, lf, hf, totalPower } = this.estimateFrequencyDomain(nnIntervals, meanNN);
    const lfHfRatio = hf > 0 ? lf / hf : 0;

    // Poincare plot
    const { sd1, sd2 } = this.calculatePoincare(nnIntervals);

    // Sample entropy (m=2, r=0.2*SDNN)
    const sampleEntropy = this.calculateSampleEntropy(nnIntervals, 2, 0.2 * sdnn);

    // Quality assessment
    const quality: HRVMetrics['quality'] =
      readings.length > 100 && sdnn > 10 ? 'good' :
      readings.length > 30 ? 'fair' : 'poor';

    return {
      sdnn: round(sdnn),
      rmssd: round(rmssd),
      pnn50: round(pnn50),
      meanNN: round(meanNN),
      medianNN: round(medianNN),
      minNN: round(minNN),
      maxNN: round(maxNN),
      triangularIndex: round(triangularIndex),
      tinn: round(tinn),
      sdsd: round(sdsd),
      vlf: round(vlf),
      lf: round(lf),
      hf: round(hf),
      lfHfRatio: round(lfHfRatio, 3),
      totalPower: round(totalPower),
      sd1: round(sd1),
      sd2: round(sd2),
      sampleEntropy: round(sampleEntropy, 4),
      readingCount: readings.length,
      periodStart: readings[0].timestamp,
      periodEnd: readings[readings.length - 1].timestamp,
      quality,
    };
  }

  private estimateFrequencyDomain(
    nnIntervals: number[],
    meanNN: number
  ): { vlf: number; lf: number; hf: number; totalPower: number } {
    // Simplified Welch's method approximation using autocorrelation
    const n = nnIntervals.length;
    const detrended = nnIntervals.map(nn => nn - meanNN);

    // Autocorrelation up to lag n/2
    const maxLag = Math.min(Math.floor(n / 2), 256);
    const acf: number[] = [];
    const variance = detrended.reduce((s, v) => s + v ** 2, 0) / n;

    for (let lag = 0; lag <= maxLag; lag++) {
      let sum = 0;
      for (let i = 0; i < n - lag; i++) {
        sum += detrended[i] * detrended[i + lag];
      }
      acf.push(sum / ((n - lag) * variance || 1));
    }

    // Map autocorrelation to spectral power in bands (approximation)
    // VLF: 0.003-0.04 Hz, LF: 0.04-0.15 Hz, HF: 0.15-0.4 Hz
    const avgInterval = meanNN / 1000; // seconds
    const sampleRate = 1 / avgInterval;

    let vlf = 0, lf = 0, hf = 0;
    for (let lag = 1; lag <= maxLag; lag++) {
      const freq = sampleRate / (2 * lag);
      const power = Math.abs(acf[lag]) * variance;
      if (freq >= 0.003 && freq < 0.04) vlf += power;
      else if (freq >= 0.04 && freq < 0.15) lf += power;
      else if (freq >= 0.15 && freq < 0.4) hf += power;
    }

    return { vlf, lf, hf, totalPower: vlf + lf + hf };
  }

  private calculatePoincare(nnIntervals: number[]): { sd1: number; sd2: number } {
    if (nnIntervals.length < 3) return { sd1: 0, sd2: 0 };

    const diffs: number[] = [];
    const sums: number[] = [];
    for (let i = 0; i < nnIntervals.length - 1; i++) {
      diffs.push(nnIntervals[i + 1] - nnIntervals[i]);
      sums.push(nnIntervals[i + 1] + nnIntervals[i]);
    }

    const sd1 = Math.sqrt(diffs.reduce((s, d) => s + d ** 2, 0) / (2 * diffs.length));
    const meanSum = sums.reduce((a, b) => a + b, 0) / sums.length;
    const sd2 = Math.sqrt(sums.reduce((s, v) => s + (v - meanSum) ** 2, 0) / (2 * sums.length));

    return { sd1, sd2 };
  }

  private calculateSampleEntropy(data: number[], m: number, r: number): number {
    const n = data.length;
    if (n < m + 2) return 0;

    const countMatches = (templateLen: number): number => {
      let count = 0;
      for (let i = 0; i < n - templateLen; i++) {
        for (let j = i + 1; j < n - templateLen; j++) {
          let match = true;
          for (let k = 0; k < templateLen; k++) {
            if (Math.abs(data[i + k] - data[j + k]) > r) {
              match = false;
              break;
            }
          }
          if (match) count++;
        }
      }
      return count;
    };

    const a = countMatches(m + 1);
    const b = countMatches(m);
    if (b === 0) return 0;

    return -Math.log(a / b);
  }

  // ---------------------------------------------------------------------------
  // Sleep stage analysis
  // ---------------------------------------------------------------------------

  analyzeSleepStages(sleepData: SleepReading[]): SleepStageAnalysis | null {
    if (sleepData.length === 0) return null;

    const sorted = [...sleepData].sort((a, b) => a.startTimestamp - b.startTimestamp);

    // Stage mapping
    const stageMap: Record<string, keyof SleepStageAnalysis['stages']> = {
      awake: 'awake',
      inBed: 'awake',
      asleepUnspecified: 'light',
      asleepCore: 'light',
      asleepDeep: 'deep',
      asleepREM: 'rem',
    };

    // Accumulate stage durations
    const stageMinutes: Record<string, number> = { awake: 0, light: 0, deep: 0, rem: 0 };
    const stageCounts: Record<string, number> = { awake: 0, light: 0, deep: 0, rem: 0 };

    for (const reading of sorted) {
      const key = stageMap[reading.stage] ?? 'awake';
      stageMinutes[key] += reading.durationMinutes;
      stageCounts[key]++;
    }

    const timeInBed = sorted.reduce((s, r) => s + r.durationMinutes, 0);
    const totalSleep = stageMinutes.light + stageMinutes.deep + stageMinutes.rem;
    const sleepEfficiency = timeInBed > 0 ? (totalSleep / timeInBed) * 100 : 0;

    // Sleep onset latency (time from first inBed to first sleep)
    const firstInBed = sorted[0];
    const firstSleep = sorted.find(r => r.stage !== 'awake' && r.stage !== 'inBed');
    const sleepOnsetLatency = firstSleep
      ? (firstSleep.startTimestamp - firstInBed.startTimestamp) / 60000
      : 0;

    // WASO (wake after sleep onset)
    let waso = 0;
    if (firstSleep) {
      const awakeAfterOnset = sorted.filter(
        r => (r.stage === 'awake' || r.stage === 'inBed') && r.startTimestamp > firstSleep.startTimestamp
      );
      waso = awakeAfterOnset.reduce((s, r) => s + r.durationMinutes, 0);
    }

    const numberOfAwakenings = sorted.filter(
      (r, i) => r.stage === 'awake' && i > 0 && sorted[i - 1].stage !== 'awake'
    ).length;

    const buildDetail = (key: string): SleepStageDetail => ({
      totalMinutes: Math.round(stageMinutes[key] * 10) / 10,
      percentage: totalSleep > 0 ? Math.round((stageMinutes[key] / totalSleep) * 1000) / 10 : 0,
      averageDuration: stageCounts[key] > 0 ? Math.round((stageMinutes[key] / stageCounts[key]) * 10) / 10 : 0,
      episodeCount: stageCounts[key],
    });

    // Detect sleep cycles (simplified: deep -> REM transitions)
    const cycles: SleepCycle[] = [];
    let cycleStart: number | null = null;
    let cycleNum = 0;
    let hasDeep = false;
    let hasREM = false;

    for (const reading of sorted) {
      const stage = stageMap[reading.stage] ?? 'awake';
      if (stage === 'light' && cycleStart === null) {
        cycleStart = reading.startTimestamp;
        hasDeep = false;
        hasREM = false;
      }
      if (stage === 'deep') hasDeep = true;
      if (stage === 'rem') hasREM = true;

      if (hasREM && stage === 'awake' && cycleStart !== null) {
        cycleNum++;
        cycles.push({
          cycleNumber: cycleNum,
          startTime: cycleStart,
          endTime: reading.startTimestamp,
          durationMinutes: (reading.startTimestamp - cycleStart) / 60000,
          hasDeepSleep: hasDeep,
          hasREM: true,
        });
        cycleStart = null;
      }
    }

    // Sleep score (composite)
    let score = 50;
    if (sleepEfficiency >= 85) score += 15;
    else if (sleepEfficiency >= 75) score += 8;
    if (stageMinutes.deep >= 60) score += 10;
    else if (stageMinutes.deep >= 30) score += 5;
    if (stageMinutes.rem >= 60) score += 10;
    else if (stageMinutes.rem >= 30) score += 5;
    if (numberOfAwakenings <= 2) score += 10;
    else if (numberOfAwakenings <= 5) score += 5;
    if (sleepOnsetLatency <= 20) score += 5;
    score = Math.max(0, Math.min(100, score));

    const sleepQuality: SleepStageAnalysis['sleepQuality'] =
      score >= 85 ? 'excellent' : score >= 70 ? 'good' : score >= 50 ? 'fair' : 'poor';

    const recommendations: string[] = [];
    if (sleepEfficiency < 75) recommendations.push('Sleep efficiency is low; consider consistent sleep/wake times');
    if (stageMinutes.deep < 30) recommendations.push('Deep sleep is below target; avoid caffeine after 2pm');
    if (stageMinutes.rem < 30) recommendations.push('REM sleep is low; try to reduce late-night screen time');
    if (numberOfAwakenings > 5) recommendations.push('Frequent awakenings detected; check for environmental disturbances');
    if (sleepOnsetLatency > 30) recommendations.push('Taking too long to fall asleep; consider relaxation techniques');

    return {
      totalSleepMinutes: Math.round(totalSleep * 10) / 10,
      timeInBedMinutes: Math.round(timeInBed * 10) / 10,
      sleepEfficiency: Math.round(sleepEfficiency * 10) / 10,
      sleepOnsetLatency: Math.round(sleepOnsetLatency * 10) / 10,
      wakeAfterSleepOnset: Math.round(waso * 10) / 10,
      numberOfAwakenings,
      stages: {
        awake: buildDetail('awake'),
        light: buildDetail('light'),
        deep: buildDetail('deep'),
        rem: buildDetail('rem'),
      },
      sleepScore: score,
      sleepQuality,
      cycles,
      recommendations,
    };
  }

  // ---------------------------------------------------------------------------
  // Anomaly detection
  // ---------------------------------------------------------------------------

  detectAnomalies(
    heartRateReadings: HeartRateReading[],
    sleepData: SleepReading[],
    gait: GaitAnalysis | null,
    falls: FallEvent[],
    baseline: BaselineMetrics
  ): Anomaly[] {
    const anomalies: Anomaly[] = [];
    const now = Date.now();

    // Heart rate anomalies
    for (const hr of heartRateReadings) {
      const zScore = (hr.bpm - baseline.heartRate.mean) / (baseline.heartRate.std || 1);

      if (hr.bpm > baseline.heartRate.mean + 3 * baseline.heartRate.std && hr.bpm > 120) {
        anomalies.push({
          id: `anom_hr_high_${hr.timestamp}`,
          type: 'heartRateHigh',
          timestamp: hr.timestamp,
          metric: 'heartRate',
          value: hr.bpm,
          baselineValue: baseline.heartRate.mean,
          deviationSigma: zScore,
          severity: hr.bpm > 150 ? 'critical' : 'warning',
          description: `Heart rate ${hr.bpm} bpm is ${Math.abs(zScore).toFixed(1)} sigma above baseline`,
          recommendedAction: hr.bpm > 150 ? 'Alert caregiver immediately' : 'Monitor for sustained elevation',
        });
      }

      if (hr.bpm < 45 && hr.bpm < baseline.heartRate.mean - 2 * baseline.heartRate.std) {
        anomalies.push({
          id: `anom_hr_low_${hr.timestamp}`,
          type: 'heartRateLow',
          timestamp: hr.timestamp,
          metric: 'heartRate',
          value: hr.bpm,
          baselineValue: baseline.heartRate.mean,
          deviationSigma: zScore,
          severity: hr.bpm < 35 ? 'critical' : 'warning',
          description: `Heart rate ${hr.bpm} bpm is significantly below baseline`,
          recommendedAction: 'Check for bradycardia medication effects',
        });
      }
    }

    // HRV anomaly
    const hrv = this.calculateHeartRateVariability(heartRateReadings);
    if (hrv && baseline.hrv.sdnn > 0) {
      const hrvDrop = (baseline.hrv.sdnn - hrv.sdnn) / baseline.hrv.std;
      if (hrvDrop > 2) {
        anomalies.push({
          id: `anom_hrv_${now}`,
          type: 'hrvDrop',
          timestamp: now,
          metric: 'hrv_sdnn',
          value: hrv.sdnn,
          baselineValue: baseline.hrv.sdnn,
          deviationSigma: hrvDrop,
          severity: hrvDrop > 3 ? 'critical' : 'warning',
          description: `HRV (SDNN) dropped to ${hrv.sdnn.toFixed(1)}ms from baseline ${baseline.hrv.sdnn.toFixed(1)}ms`,
          recommendedAction: 'Check for stress, dehydration, or medication changes',
        });
      }
    }

    // Sleep anomaly
    const sleepAnalysis = this.analyzeSleepStages(sleepData);
    if (sleepAnalysis && baseline.sleep.totalMinutes > 0) {
      const sleepDiff = baseline.sleep.totalMinutes - sleepAnalysis.totalSleepMinutes;
      const sleepZ = sleepDiff / (baseline.sleep.std || 30);
      if (sleepZ > 2) {
        anomalies.push({
          id: `anom_sleep_${now}`,
          type: 'sleepDisturbance',
          timestamp: now,
          metric: 'totalSleep',
          value: sleepAnalysis.totalSleepMinutes,
          baselineValue: baseline.sleep.totalMinutes,
          deviationSigma: sleepZ,
          severity: sleepZ > 3 ? 'critical' : 'warning',
          description: `Sleep only ${sleepAnalysis.totalSleepMinutes.toFixed(0)} min vs ${baseline.sleep.totalMinutes.toFixed(0)} min baseline`,
          recommendedAction: 'Check for sundowning or environmental disruptions',
        });
      }
    }

    // Gait anomaly
    if (gait && baseline.gait.cadence > 0) {
      const cadenceDiff = Math.abs(gait.cadence - baseline.gait.cadence) / baseline.gait.cadence;
      const stabilityDrop = baseline.gait.stability - gait.stabilityIndex;

      if (cadenceDiff > 0.2 || stabilityDrop > 0.2) {
        anomalies.push({
          id: `anom_gait_${now}`,
          type: 'gaitDegradation',
          timestamp: now,
          metric: 'gaitStability',
          value: gait.stabilityIndex,
          baselineValue: baseline.gait.stability,
          deviationSigma: stabilityDrop / 0.1,
          severity: gait.risk.fallRisk === 'high' ? 'critical' : 'warning',
          description: `Gait stability dropped from ${baseline.gait.stability.toFixed(2)} to ${gait.stabilityIndex.toFixed(2)}`,
          recommendedAction: 'Schedule physical therapy evaluation',
        });
      }
    }

    // Fall events
    for (const fall of falls) {
      anomalies.push({
        id: `anom_fall_${fall.timestamp}`,
        type: 'fallDetected',
        timestamp: fall.timestamp,
        metric: 'fall',
        value: fall.impactAcceleration,
        baselineValue: 0,
        deviationSigma: fall.impactAcceleration / 3,
        severity: fall.severity === 'severe' ? 'critical' : 'warning',
        description: `Fall detected with ${fall.impactAcceleration.toFixed(1)}g impact (${fall.severity})`,
        recommendedAction: fall.severity === 'severe' ? 'Contact emergency services' : 'Check on patient',
      });
    }

    return anomalies.sort((a, b) => {
      const severityOrder = { critical: 0, warning: 1, info: 2 };
      return severityOrder[a.severity] - severityOrder[b.severity] || b.timestamp - a.timestamp;
    });
  }

  // ---------------------------------------------------------------------------
  // Daily summary
  // ---------------------------------------------------------------------------

  buildDailyWearableSummary(
    date: string,
    heartRateReadings: HeartRateReading[],
    sleepData: SleepReading[],
    activity: ActivitySummary | null,
    gait: GaitAnalysis | null,
    falls: FallEvent[],
    baseline: BaselineMetrics
  ): DailyWearableSummary {
    // Heart rate stats
    const bpms = heartRateReadings.map(r => r.bpm).filter(b => b > 0);
    const avgBpm = bpms.length > 0 ? bpms.reduce((a, b) => a + b, 0) / bpms.length : 0;
    const restingBpm = bpms.length > 0
      ? [...bpms].sort((a, b) => a - b).slice(0, Math.max(1, Math.floor(bpms.length * 0.1)))
          .reduce((a, b) => a + b, 0) / Math.max(1, Math.floor(bpms.length * 0.1))
      : 0;

    // HRV
    const hrv = this.calculateHeartRateVariability(heartRateReadings);

    // Steps hourly breakdown
    const hourlySteps: Map<number, number> = new Map();
    // If we had step readings we'd aggregate; use activity summary as fallback
    for (let h = 0; h < 24; h++) {
      hourlySteps.set(h, 0);
    }

    // Sleep
    const sleep = this.analyzeSleepStages(sleepData);

    // Anomalies
    const anomalies = this.detectAnomalies(heartRateReadings, sleepData, gait, falls, baseline);

    // Overall wellness score
    let overallScore = 70; // base
    if (sleep) {
      overallScore += (sleep.sleepScore - 50) * 0.3;
    }
    if (activity) {
      const activityRatio = activity.activeEnergyBurned / (activity.activeEnergyGoal || 500);
      overallScore += Math.min(15, activityRatio * 15);
    }
    if (hrv && baseline.hrv.sdnn > 0) {
      const hrvRatio = hrv.sdnn / baseline.hrv.sdnn;
      overallScore += (hrvRatio - 1) * 10;
    }
    const criticalAnomalies = anomalies.filter(a => a.severity === 'critical').length;
    overallScore -= criticalAnomalies * 15;
    overallScore = Math.max(0, Math.min(100, Math.round(overallScore)));

    return {
      date,
      heartRate: {
        average: round(avgBpm),
        resting: round(restingBpm),
        peak: bpms.length > 0 ? Math.max(...bpms) : 0,
        min: bpms.length > 0 ? Math.min(...bpms) : 0,
        readingCount: bpms.length,
      },
      hrv,
      steps: {
        total: activity?.stepCount ?? 0,
        distance: activity?.distanceWalkingRunning ?? 0,
        flights: activity?.flightsClimbed ?? 0,
        hourlyBreakdown: Array.from(hourlySteps.entries()).map(([hour, steps]) => ({ hour, steps })),
      },
      sleep,
      activity,
      gait,
      falls,
      anomalies,
      overallScore,
      generatedAt: Date.now(),
    };
  }

  // ---------------------------------------------------------------------------
  // Trend detection
  // ---------------------------------------------------------------------------

  detectTrends(dailySummaries: DailyWearableSummary[]): TrendResult[] {
    if (dailySummaries.length < 3) return [];

    const trends: TrendResult[] = [];
    const days = dailySummaries.length;

    // Heart rate trend
    const hrValues = dailySummaries.map((s, i) => ({ x: i, y: s.heartRate.resting })).filter(p => p.y > 0);
    if (hrValues.length >= 3) {
      const { slope, rSquared } = this.linearRegression(hrValues);
      const significance = rSquared > 0.3 && Math.abs(slope) > 0.5;
      trends.push({
        metric: 'restingHeartRate',
        direction: slope > 0.5 ? 'declining' : slope < -0.5 ? 'improving' : 'stable',
        slope: round(slope, 3),
        rSquared: round(rSquared, 3),
        periodDays: days,
        significance,
        description: significance
          ? `Resting heart rate ${slope > 0 ? 'increasing' : 'decreasing'} by ${Math.abs(slope).toFixed(1)} bpm/day`
          : 'Resting heart rate is stable',
      });
    }

    // Sleep quality trend
    const sleepValues = dailySummaries
      .map((s, i) => ({ x: i, y: s.sleep?.sleepScore ?? 0 }))
      .filter(p => p.y > 0);
    if (sleepValues.length >= 3) {
      const { slope, rSquared } = this.linearRegression(sleepValues);
      const significance = rSquared > 0.3 && Math.abs(slope) > 1;
      trends.push({
        metric: 'sleepQuality',
        direction: slope > 1 ? 'improving' : slope < -1 ? 'declining' : 'stable',
        slope: round(slope, 3),
        rSquared: round(rSquared, 3),
        periodDays: days,
        significance,
        description: significance
          ? `Sleep quality ${slope > 0 ? 'improving' : 'declining'} by ${Math.abs(slope).toFixed(1)} points/day`
          : 'Sleep quality is stable',
      });
    }

    // Overall wellness trend
    const wellnessValues = dailySummaries.map((s, i) => ({ x: i, y: s.overallScore }));
    if (wellnessValues.length >= 3) {
      const { slope, rSquared } = this.linearRegression(wellnessValues);
      const significance = rSquared > 0.25;
      trends.push({
        metric: 'overallWellness',
        direction: slope > 0.5 ? 'improving' : slope < -0.5 ? 'declining' : 'stable',
        slope: round(slope, 3),
        rSquared: round(rSquared, 3),
        periodDays: days,
        significance,
        description: significance
          ? `Overall wellness ${slope > 0 ? 'improving' : 'declining'}`
          : 'Overall wellness is stable',
      });
    }

    return trends;
  }

  private linearRegression(points: Array<{ x: number; y: number }>): { slope: number; rSquared: number } {
    const n = points.length;
    const sumX = points.reduce((s, p) => s + p.x, 0);
    const sumY = points.reduce((s, p) => s + p.y, 0);
    const sumXY = points.reduce((s, p) => s + p.x * p.y, 0);
    const sumXX = points.reduce((s, p) => s + p.x * p.x, 0);
    const sumYY = points.reduce((s, p) => s + p.y * p.y, 0);

    const denom = n * sumXX - sumX * sumX;
    if (denom === 0) return { slope: 0, rSquared: 0 };

    const slope = (n * sumXY - sumX * sumY) / denom;
    const intercept = (sumY - slope * sumX) / n;

    // R-squared
    const ssRes = points.reduce((s, p) => s + (p.y - (slope * p.x + intercept)) ** 2, 0);
    const meanY = sumY / n;
    const ssTot = points.reduce((s, p) => s + (p.y - meanY) ** 2, 0);
    const rSquared = ssTot > 0 ? 1 - ssRes / ssTot : 0;

    return { slope, rSquared };
  }
}

// ---------------------------------------------------------------------------
// Utility
// ---------------------------------------------------------------------------

function round(value: number, decimals: number = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export default WearableDataProcessor;
