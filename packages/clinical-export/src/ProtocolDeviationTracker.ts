/**
 * Protocol deviation tracking for clinical trials.
 * Records, queries, and summarizes deviations from the study protocol.
 */

import {
  ProtocolDeviation,
  DeviationSummary,
  DeviationType,
  DeviationSeverity,
} from './types';

/**
 * In-memory store for protocol deviations.
 * In production this would be backed by a database.
 */
const deviationStore: ProtocolDeviation[] = [];

let deviationCounter = 0;

/**
 * Record a new protocol deviation.
 * Assigns a unique ID if one is not already present.
 */
export function trackDeviation(deviation: ProtocolDeviation): ProtocolDeviation {
  const stored: ProtocolDeviation = {
    ...deviation,
    id: deviation.id || `PD-${Date.now()}-${(++deviationCounter).toString().padStart(4, '0')}`,
  };
  deviationStore.push(stored);
  return stored;
}

/**
 * Retrieve deviations for a specific patient within an optional date range.
 */
export function getDeviations(
  patientId: string,
  dateRange?: { start: Date; end: Date }
): ProtocolDeviation[] {
  return deviationStore.filter((d) => {
    if (d.patientId !== patientId) return false;
    if (dateRange) {
      const devDate = new Date(d.date);
      return devDate >= dateRange.start && devDate <= dateRange.end;
    }
    return true;
  });
}

/**
 * Retrieve all stored deviations, optionally filtered by date range.
 */
export function getAllDeviations(
  dateRange?: { start: Date; end: Date }
): ProtocolDeviation[] {
  if (!dateRange) return [...deviationStore];
  return deviationStore.filter((d) => {
    const devDate = new Date(d.date);
    return devDate >= dateRange.start && devDate <= dateRange.end;
  });
}

/**
 * Generate a summary of protocol deviations.
 */
export function generateDeviationSummary(
  deviations: ProtocolDeviation[]
): DeviationSummary {
  const byType: Record<DeviationType, number> = {
    missed_visit: 0,
    out_of_window: 0,
    eligibility_violation: 0,
    other: 0,
  };

  const bySeverity: Record<DeviationSeverity, number> = {
    minor: 0,
    major: 0,
    critical: 0,
  };

  const affectedPatientsSet = new Set<string>();

  for (const dev of deviations) {
    byType[dev.type]++;
    bySeverity[dev.severity]++;
    affectedPatientsSet.add(dev.patientId);
  }

  return {
    totalDeviations: deviations.length,
    byType,
    bySeverity,
    affectedPatients: Array.from(affectedPatientsSet),
    deviations,
  };
}

/**
 * Reset the in-memory store (useful for testing).
 */
export function clearDeviationStore(): void {
  deviationStore.length = 0;
  deviationCounter = 0;
}
