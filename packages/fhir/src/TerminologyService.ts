/**
 * TerminologyService.ts
 *
 * Local terminology lookup service for the Gentle Reminder platform.
 * Validates codes and resolves display names for LOINC, SNOMED CT,
 * and RxNorm code systems used in FHIR resources.
 */

import { LOINC_CODES, SNOMED_CODES, RXNORM_CODES } from './types';

// ---------------------------------------------------------------------------
// Supported Code Systems
// ---------------------------------------------------------------------------

const SUPPORTED_SYSTEMS = {
  LOINC: 'http://loinc.org',
  SNOMED: 'http://snomed.info/sct',
  RXNORM: 'http://www.nlm.nih.gov/research/umls/rxnorm',
} as const;

// ---------------------------------------------------------------------------
// Code Indexes (built from constants)
// ---------------------------------------------------------------------------

type CodeEntry = { code: string; display: string };

function buildIndex(codes: Record<string, CodeEntry>): Map<string, string> {
  const map = new Map<string, string>();
  for (const entry of Object.values(codes)) {
    map.set(entry.code, entry.display);
  }
  return map;
}

const loincIndex = buildIndex(LOINC_CODES as unknown as Record<string, CodeEntry>);
const snomedIndex = buildIndex(SNOMED_CODES as unknown as Record<string, CodeEntry>);
const rxnormIndex = buildIndex(RXNORM_CODES as unknown as Record<string, CodeEntry>);

function getIndexForSystem(system: string): Map<string, string> | null {
  switch (system) {
    case SUPPORTED_SYSTEMS.LOINC:
      return loincIndex;
    case SUPPORTED_SYSTEMS.SNOMED:
      return snomedIndex;
    case SUPPORTED_SYSTEMS.RXNORM:
      return rxnormIndex;
    default:
      return null;
  }
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Checks whether a given system URI is supported by this terminology service.
 */
export function isValidSystem(system: string): boolean {
  return Object.values(SUPPORTED_SYSTEMS).includes(system as any);
}

/**
 * Validates that a code exists within the specified code system.
 * Returns an object with `valid` and optional `display` fields.
 */
export function validateCode(
  system: string,
  code: string,
): { valid: boolean; display?: string } {
  const index = getIndexForSystem(system);
  if (!index) {
    return { valid: false };
  }

  const display = index.get(code);
  if (display) {
    return { valid: true, display };
  }

  return { valid: false };
}

/**
 * Looks up the display name for a code within a given system.
 * Returns `undefined` if the code or system is not found.
 */
export function lookupDisplay(
  system: string,
  code: string,
): string | undefined {
  const index = getIndexForSystem(system);
  if (!index) return undefined;
  return index.get(code);
}
