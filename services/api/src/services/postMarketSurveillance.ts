/**
 * Post-Market Surveillance Service
 *
 * Tracks algorithm accuracy, alert response times, complaints, and
 * drift detection for FDA SaMD post-market surveillance requirements.
 *
 * Note: In production, these stores would be backed by a persistent
 * database. In-memory stores are used here for the initial implementation
 * and can be swapped for database-backed stores without changing the API.
 */

// --- Types ---

export interface AccuracyRecord {
  id: string;
  timestamp: Date;
  patientId: string;
  sessionId: string;
  predictedScore: number; // Gentle Reminder composite score (0-1)
  actualScore: number; // Clinician-assessed score (normalized 0-1)
  domain: string;
  algorithmVersion: string;
}

export interface AlertResponseRecord {
  id: string;
  timestamp: Date;
  alertType: 'fall' | 'medication' | 'decline' | 'distress';
  triggeredAt: Date;
  deliveredAt: Date | null;
  acknowledgedAt: Date | null;
  patientId: string;
  caregiverId: string;
}

export interface Complaint {
  id: string;
  timestamp: Date;
  source: 'patient' | 'caregiver' | 'clinician' | 'app_store' | 'support';
  category: 'scoring' | 'alerts' | 'usability' | 'privacy' | 'safety' | 'other';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  patientId?: string;
  reportedBy: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  resolution?: string;
}

export interface DriftAnalysis {
  windowStart: Date;
  windowEnd: Date;
  sampleSize: number;
  meanAbsoluteError: number;
  meanBias: number; // positive = over-predicting, negative = under-predicting
  correlationCoefficient: number;
  driftDetected: boolean;
  driftSeverity: 'none' | 'mild' | 'moderate' | 'significant';
  algorithmVersion: string;
}

export interface SafetyReport {
  generatedAt: Date;
  reportingPeriod: { start: Date; end: Date };
  accuracy: {
    totalRecords: number;
    meanAbsoluteError: number;
    meanBias: number;
    correlationCoefficient: number;
  };
  alerts: {
    totalAlerts: number;
    meanDeliveryTimeMs: number;
    p95DeliveryTimeMs: number;
    deliveryFailureRate: number;
    meanAcknowledgmentTimeMs: number;
    byType: Record<string, { count: number; meanDeliveryTimeMs: number }>;
  };
  complaints: {
    totalOpen: number;
    totalResolved: number;
    byCategory: Record<string, number>;
    bySeverity: Record<string, number>;
    criticalCount: number;
  };
  drift: DriftAnalysis | null;
}

// --- In-Memory Stores ---

const accuracyRecords: AccuracyRecord[] = [];
const alertResponseRecords: AlertResponseRecord[] = [];
const complaints: Complaint[] = [];

let idCounter = 0;
function generateId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${Date.now()}_${idCounter}`;
}

// --- Accuracy Tracking ---

export function trackAlgorithmAccuracy(input: {
  patientId: string;
  sessionId: string;
  predictedScore: number;
  actualScore: number;
  domain: string;
  algorithmVersion: string;
}): AccuracyRecord {
  const record: AccuracyRecord = {
    id: generateId('acc'),
    timestamp: new Date(),
    ...input,
  };
  accuracyRecords.push(record);
  return record;
}

// --- Alert Response Time Tracking ---

export function trackAlertResponseTime(input: {
  alertType: AlertResponseRecord['alertType'];
  triggeredAt: Date;
  deliveredAt: Date | null;
  acknowledgedAt: Date | null;
  patientId: string;
  caregiverId: string;
}): AlertResponseRecord {
  const record: AlertResponseRecord = {
    id: generateId('alert'),
    timestamp: new Date(),
    ...input,
  };
  alertResponseRecords.push(record);
  return record;
}

// --- Complaint Reporting ---

export function reportComplaint(input: {
  source: Complaint['source'];
  category: Complaint['category'];
  severity: Complaint['severity'];
  description: string;
  patientId?: string;
  reportedBy: string;
}): Complaint {
  const complaint: Complaint = {
    id: generateId('cmp'),
    timestamp: new Date(),
    status: 'open',
    ...input,
  };
  complaints.push(complaint);
  return complaint;
}

// --- Algorithm Drift Detection ---

export function detectAlgorithmDrift(
  windowDays: number = 30,
  driftThreshold: number = 0.15,
): DriftAnalysis {
  const windowEnd = new Date();
  const windowStart = new Date(windowEnd.getTime() - windowDays * 24 * 60 * 60 * 1000);

  const windowRecords = accuracyRecords.filter(
    (r) => r.timestamp >= windowStart && r.timestamp <= windowEnd,
  );

  if (windowRecords.length === 0) {
    return {
      windowStart,
      windowEnd,
      sampleSize: 0,
      meanAbsoluteError: 0,
      meanBias: 0,
      correlationCoefficient: 0,
      driftDetected: false,
      driftSeverity: 'none',
      algorithmVersion: 'N/A',
    };
  }

  // Calculate mean absolute error
  const errors = windowRecords.map((r) => Math.abs(r.predictedScore - r.actualScore));
  const meanAbsoluteError = errors.reduce((sum, e) => sum + e, 0) / errors.length;

  // Calculate mean bias (positive = over-predicting)
  const biases = windowRecords.map((r) => r.predictedScore - r.actualScore);
  const meanBias = biases.reduce((sum, b) => sum + b, 0) / biases.length;

  // Calculate Pearson correlation coefficient
  const predicted = windowRecords.map((r) => r.predictedScore);
  const actual = windowRecords.map((r) => r.actualScore);
  const correlationCoefficient = pearsonCorrelation(predicted, actual);

  // Determine drift severity
  const absBias = Math.abs(meanBias);
  let driftSeverity: DriftAnalysis['driftSeverity'] = 'none';
  if (absBias >= driftThreshold * 2) {
    driftSeverity = 'significant';
  } else if (absBias >= driftThreshold) {
    driftSeverity = 'moderate';
  } else if (absBias >= driftThreshold * 0.5) {
    driftSeverity = 'mild';
  }

  const latestVersion = windowRecords[windowRecords.length - 1]?.algorithmVersion ?? 'unknown';

  return {
    windowStart,
    windowEnd,
    sampleSize: windowRecords.length,
    meanAbsoluteError: round(meanAbsoluteError, 4),
    meanBias: round(meanBias, 4),
    correlationCoefficient: round(correlationCoefficient, 4),
    driftDetected: driftSeverity !== 'none',
    driftSeverity,
    algorithmVersion: latestVersion,
  };
}

// --- Safety Report Generation ---

export function generateSafetyReport(periodDays: number = 90): SafetyReport {
  const reportEnd = new Date();
  const reportStart = new Date(reportEnd.getTime() - periodDays * 24 * 60 * 60 * 1000);

  // Accuracy metrics
  const periodAccuracy = accuracyRecords.filter(
    (r) => r.timestamp >= reportStart && r.timestamp <= reportEnd,
  );
  const accErrors = periodAccuracy.map((r) => Math.abs(r.predictedScore - r.actualScore));
  const accBiases = periodAccuracy.map((r) => r.predictedScore - r.actualScore);
  const accPredicted = periodAccuracy.map((r) => r.predictedScore);
  const accActual = periodAccuracy.map((r) => r.actualScore);

  // Alert metrics
  const periodAlerts = alertResponseRecords.filter(
    (r) => r.timestamp >= reportStart && r.timestamp <= reportEnd,
  );
  const deliveredAlerts = periodAlerts.filter((a) => a.deliveredAt !== null);
  const deliveryTimes = deliveredAlerts.map(
    (a) => a.deliveredAt!.getTime() - a.triggeredAt.getTime(),
  );
  const acknowledgedAlerts = periodAlerts.filter((a) => a.acknowledgedAt !== null);
  const ackTimes = acknowledgedAlerts.map(
    (a) => a.acknowledgedAt!.getTime() - a.triggeredAt.getTime(),
  );

  const sortedDeliveryTimes = [...deliveryTimes].sort((a, b) => a - b);
  const p95Index = Math.floor(sortedDeliveryTimes.length * 0.95);

  // Alert type breakdown
  const byType: Record<string, { count: number; meanDeliveryTimeMs: number }> = {};
  for (const alert of periodAlerts) {
    if (!byType[alert.alertType]) {
      byType[alert.alertType] = { count: 0, meanDeliveryTimeMs: 0 };
    }
    byType[alert.alertType].count += 1;
    if (alert.deliveredAt) {
      const dt = alert.deliveredAt.getTime() - alert.triggeredAt.getTime();
      const entry = byType[alert.alertType];
      entry.meanDeliveryTimeMs =
        (entry.meanDeliveryTimeMs * (entry.count - 1) + dt) / entry.count;
    }
  }

  // Complaint metrics
  const periodComplaints = complaints.filter(
    (c) => c.timestamp >= reportStart && c.timestamp <= reportEnd,
  );
  const byCategory: Record<string, number> = {};
  const bySeverity: Record<string, number> = {};
  let criticalCount = 0;
  let openCount = 0;
  let resolvedCount = 0;

  for (const c of periodComplaints) {
    byCategory[c.category] = (byCategory[c.category] ?? 0) + 1;
    bySeverity[c.severity] = (bySeverity[c.severity] ?? 0) + 1;
    if (c.severity === 'critical') criticalCount += 1;
    if (c.status === 'open' || c.status === 'investigating') openCount += 1;
    if (c.status === 'resolved' || c.status === 'closed') resolvedCount += 1;
  }

  // Drift analysis for the period
  const drift = detectAlgorithmDrift(periodDays);

  return {
    generatedAt: new Date(),
    reportingPeriod: { start: reportStart, end: reportEnd },
    accuracy: {
      totalRecords: periodAccuracy.length,
      meanAbsoluteError:
        accErrors.length > 0
          ? round(accErrors.reduce((s, e) => s + e, 0) / accErrors.length, 4)
          : 0,
      meanBias:
        accBiases.length > 0
          ? round(accBiases.reduce((s, b) => s + b, 0) / accBiases.length, 4)
          : 0,
      correlationCoefficient:
        accPredicted.length > 1 ? round(pearsonCorrelation(accPredicted, accActual), 4) : 0,
    },
    alerts: {
      totalAlerts: periodAlerts.length,
      meanDeliveryTimeMs:
        deliveryTimes.length > 0
          ? round(deliveryTimes.reduce((s, t) => s + t, 0) / deliveryTimes.length, 0)
          : 0,
      p95DeliveryTimeMs: sortedDeliveryTimes.length > 0 ? sortedDeliveryTimes[p95Index] ?? 0 : 0,
      deliveryFailureRate:
        periodAlerts.length > 0
          ? round((periodAlerts.length - deliveredAlerts.length) / periodAlerts.length, 4)
          : 0,
      meanAcknowledgmentTimeMs:
        ackTimes.length > 0
          ? round(ackTimes.reduce((s, t) => s + t, 0) / ackTimes.length, 0)
          : 0,
      byType,
    },
    complaints: {
      totalOpen: openCount,
      totalResolved: resolvedCount,
      byCategory,
      bySeverity,
      criticalCount,
    },
    drift,
  };
}

// --- Utility Functions ---

function pearsonCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  if (n < 2) return 0;

  const meanX = x.reduce((s, v) => s + v, 0) / n;
  const meanY = y.reduce((s, v) => s + v, 0) / n;

  let numerator = 0;
  let denomX = 0;
  let denomY = 0;

  for (let i = 0; i < n; i++) {
    const dx = x[i] - meanX;
    const dy = y[i] - meanY;
    numerator += dx * dy;
    denomX += dx * dx;
    denomY += dy * dy;
  }

  const denominator = Math.sqrt(denomX * denomY);
  if (denominator === 0) return 0;

  return numerator / denominator;
}

function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

// --- Data Access (for testing/admin) ---

export function getAccuracyRecords(): AccuracyRecord[] {
  return [...accuracyRecords];
}

export function getAlertResponseRecords(): AlertResponseRecord[] {
  return [...alertResponseRecords];
}

export function getComplaints(): Complaint[] {
  return [...complaints];
}
