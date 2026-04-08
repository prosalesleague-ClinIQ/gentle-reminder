/**
 * ExtensionHandler.ts
 *
 * FHIR R4 extension utilities for the Gentle Reminder platform.
 * Provides functions to create and apply custom extensions for
 * cognitive stage, biomarker confidence, and risk predictions.
 */

import type {
  FHIRExtension,
  FHIRDomainResource,
  FHIRCodeableConcept,
} from './types';

// ---------------------------------------------------------------------------
// Extension URL Constants
// ---------------------------------------------------------------------------

const BASE_URL = 'https://gentlereminder.health/fhir/StructureDefinition';

export const EXTENSION_URLS = {
  COGNITIVE_STAGE: `${BASE_URL}/cognitive-stage`,
  BIOMARKER_CONFIDENCE: `${BASE_URL}/biomarker-confidence`,
  RISK_PREDICTION: `${BASE_URL}/risk-prediction`,
  RISK_PROBABILITY: `${BASE_URL}/risk-probability`,
  CARE_COMPLEXITY: `${BASE_URL}/care-complexity`,
  SESSION_ENGAGEMENT: `${BASE_URL}/session-engagement`,
  DECLINE_RATE: `${BASE_URL}/decline-rate`,
} as const;

// ---------------------------------------------------------------------------
// Extension Builders
// ---------------------------------------------------------------------------

/**
 * Creates a cognitive stage extension describing the patient's current
 * cognitive decline stage (e.g. "mild", "moderate", "severe").
 */
export function createCognitiveStageExtension(
  stage: string,
): FHIRExtension {
  return {
    url: EXTENSION_URLS.COGNITIVE_STAGE,
    valueCodeableConcept: {
      coding: [
        {
          system: `${BASE_URL}/cognitive-stage-codes`,
          code: stage.toLowerCase(),
          display: formatStageDisplay(stage),
        },
      ],
      text: formatStageDisplay(stage),
    },
  };
}

/**
 * Creates a biomarker confidence extension indicating the confidence
 * level of a biomarker reading (0.0 to 1.0).
 */
export function createBiomarkerConfidenceExtension(
  confidence: number,
): FHIRExtension {
  return {
    url: EXTENSION_URLS.BIOMARKER_CONFIDENCE,
    valueDecimal: Math.max(0, Math.min(1, confidence)),
  };
}

/**
 * Creates a risk prediction extension with a risk type and probability.
 */
export function createRiskPredictionExtension(
  risk: string,
  probability: number,
): FHIRExtension {
  return {
    url: EXTENSION_URLS.RISK_PREDICTION,
    valueString: JSON.stringify({
      risk,
      probability: Math.max(0, Math.min(1, probability)),
    }),
  };
}

/**
 * Applies an array of extensions to a FHIR domain resource.
 * Merges with any existing extensions on the resource.
 */
export function applyExtensions<T extends FHIRDomainResource>(
  resource: T,
  extensions: FHIRExtension[],
): T {
  const existing = resource.extension || [];
  return {
    ...resource,
    extension: [...existing, ...extensions],
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatStageDisplay(stage: string): string {
  const stageMap: Record<string, string> = {
    mild: 'Mild Cognitive Impairment',
    moderate: 'Moderate Cognitive Impairment',
    severe: 'Severe Cognitive Impairment',
    early: 'Early Stage',
    middle: 'Middle Stage',
    late: 'Late Stage',
    unknown: 'Unknown',
    mci: 'Mild Cognitive Impairment (MCI)',
    preclinical: 'Preclinical',
  };
  return stageMap[stage.toLowerCase()] || stage;
}
