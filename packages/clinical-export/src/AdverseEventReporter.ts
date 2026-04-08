/**
 * Structured adverse event (AE) tracking and reporting for clinical trials.
 * Supports severity classification, SAE detection, and report generation.
 */

import {
  AdverseEvent,
  AEReport,
  AESeverity,
  AESeriousness,
} from './types';

let eventCounter = 0;

/**
 * Create a new adverse event with a generated unique ID.
 */
export function createAdverseEvent(
  data: Omit<AdverseEvent, 'id'>
): AdverseEvent {
  eventCounter++;
  return {
    id: `AE-${Date.now()}-${eventCounter.toString().padStart(4, '0')}`,
    ...data,
  };
}

/**
 * Classify the severity of an adverse event based on its description and context.
 * Returns the most appropriate severity level.
 *
 * Classification rules:
 * - life_threatening: contains keywords like "life-threatening", "fatal", "ICU", "resuscitation"
 * - severe: "hospitalization", "disability", "incapacity", "surgery"
 * - moderate: "medication", "treatment required", "intervention"
 * - mild: everything else
 */
export function classifySeverity(event: AdverseEvent): AESeverity {
  const desc = event.description.toLowerCase();

  const lifeThreatening = [
    'life-threatening',
    'life threatening',
    'fatal',
    'death',
    'icu',
    'resuscitation',
    'cardiac arrest',
    'anaphylaxis',
  ];
  if (lifeThreatening.some((kw) => desc.includes(kw))) {
    return 'life_threatening';
  }

  const severe = [
    'hospitalization',
    'hospitalisation',
    'disability',
    'incapacity',
    'surgery',
    'congenital anomaly',
    'birth defect',
    'persistent',
    'significant',
  ];
  if (severe.some((kw) => desc.includes(kw))) {
    return 'severe';
  }

  const moderate = [
    'medication',
    'treatment required',
    'intervention',
    'medical attention',
    'prescription',
    'outpatient',
  ];
  if (moderate.some((kw) => desc.includes(kw))) {
    return 'moderate';
  }

  return 'mild';
}

/**
 * Determine if an adverse event qualifies as a Serious Adverse Event (SAE).
 *
 * An event is serious if any of the following apply:
 * - Severity is life_threatening
 * - Seriousness is explicitly marked as serious
 * - Outcome is fatal
 * - Description references hospitalization, disability, or congenital anomaly
 */
export function isSAE(event: AdverseEvent): boolean {
  if (event.severity === 'life_threatening') return true;
  if (event.seriousness === 'serious') return true;
  if (event.outcome === 'fatal') return true;

  const desc = event.description.toLowerCase();
  const saeKeywords = [
    'hospitalization',
    'hospitalisation',
    'inpatient',
    'disability',
    'congenital anomaly',
    'birth defect',
  ];
  return saeKeywords.some((kw) => desc.includes(kw));
}

/**
 * Generate a structured adverse event report for a date range.
 */
export function generateAEReport(
  events: AdverseEvent[],
  dateRange: { start: Date; end: Date }
): AEReport {
  const filtered = events.filter(
    (e) => e.reportDate >= dateRange.start && e.reportDate <= dateRange.end
  );

  const bySeverity: Record<AESeverity, number> = {
    mild: 0,
    moderate: 0,
    severe: 0,
    life_threatening: 0,
  };

  const bySeriousness: Record<AESeriousness, number> = {
    serious: 0,
    non_serious: 0,
  };

  let saeCount = 0;

  for (const event of filtered) {
    bySeverity[event.severity]++;
    bySeriousness[event.seriousness]++;
    if (isSAE(event)) saeCount++;
  }

  return {
    dateRange,
    totalEvents: filtered.length,
    bySeverity,
    bySeriousness,
    saeCount,
    events: filtered,
  };
}
