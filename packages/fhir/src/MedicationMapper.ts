/**
 * MedicationMapper.ts
 *
 * Maps internal medication records to FHIR R4 MedicationRequest resources.
 * Includes RxNorm code lookups for common dementia medications and
 * structured dosage building.
 */

import type {
  FHIRMedicationRequest,
  FHIRCodeableConcept,
  FHIRDosage,
  FHIRReference,
  FHIRQuantity,
  FHIRTiming,
  InternalMedication,
} from './types';
import { RXNORM_CODES } from './types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const RXNORM_SYSTEM = 'http://www.nlm.nih.gov/research/umls/rxnorm';
const SNOMED_SYSTEM = 'http://snomed.info/sct';
const UCUM_SYSTEM = 'http://unitsofmeasure.org';
const GENTLE_REMINDER_SYSTEM = 'https://gentlereminder.health/medication-id';

// RxNorm lookup by normalized medication name
const RXNORM_LOOKUP: Record<string, { code: string; display: string }> = {};
for (const [key, value] of Object.entries(RXNORM_CODES)) {
  RXNORM_LOOKUP[value.display.toLowerCase()] = value;
  RXNORM_LOOKUP[key.toLowerCase()] = value;
}

// Common route codes (SNOMED CT)
const ROUTE_CODES: Record<string, { code: string; display: string }> = {
  oral: { code: '26643006', display: 'Oral route' },
  sublingual: { code: '37839007', display: 'Sublingual route' },
  transdermal: { code: '45890007', display: 'Transdermal route' },
  intravenous: { code: '47625008', display: 'Intravenous route' },
  intramuscular: { code: '78421000', display: 'Intramuscular route' },
  subcutaneous: { code: '34206005', display: 'Subcutaneous route' },
  inhalation: { code: '18679011000001101', display: 'Inhalation route' },
  topical: { code: '6064005', display: 'Topical route' },
  rectal: { code: '37161004', display: 'Rectal route' },
  nasal: { code: '46713006', display: 'Nasal route' },
};

// Frequency parsing
const FREQUENCY_MAP: Record<string, { frequency: number; period: number; periodUnit: 'd' | 'h' | 'wk' }> = {
  'once daily': { frequency: 1, period: 1, periodUnit: 'd' },
  'daily': { frequency: 1, period: 1, periodUnit: 'd' },
  'qd': { frequency: 1, period: 1, periodUnit: 'd' },
  'twice daily': { frequency: 2, period: 1, periodUnit: 'd' },
  'bid': { frequency: 2, period: 1, periodUnit: 'd' },
  'three times daily': { frequency: 3, period: 1, periodUnit: 'd' },
  'tid': { frequency: 3, period: 1, periodUnit: 'd' },
  'four times daily': { frequency: 4, period: 1, periodUnit: 'd' },
  'qid': { frequency: 4, period: 1, periodUnit: 'd' },
  'every morning': { frequency: 1, period: 1, periodUnit: 'd' },
  'every evening': { frequency: 1, period: 1, periodUnit: 'd' },
  'at bedtime': { frequency: 1, period: 1, periodUnit: 'd' },
  'qhs': { frequency: 1, period: 1, periodUnit: 'd' },
  'every 4 hours': { frequency: 1, period: 4, periodUnit: 'h' },
  'every 6 hours': { frequency: 1, period: 6, periodUnit: 'h' },
  'every 8 hours': { frequency: 1, period: 8, periodUnit: 'h' },
  'every 12 hours': { frequency: 1, period: 12, periodUnit: 'h' },
  'weekly': { frequency: 1, period: 1, periodUnit: 'wk' },
  'once weekly': { frequency: 1, period: 1, periodUnit: 'wk' },
};

// ---------------------------------------------------------------------------
// MedicationMapper
// ---------------------------------------------------------------------------

export class MedicationMapper {

  /**
   * Maps an internal medication to a FHIR MedicationRequest.
   */
  mapToFHIRMedicationRequest(
    medication: InternalMedication,
    patientRef?: FHIRReference
  ): FHIRMedicationRequest {
    const rxNormCode = this.lookupRxNorm(medication.name, medication.rxNormCode);

    const request: FHIRMedicationRequest = {
      resourceType: 'MedicationRequest',
      id: medication.id,
      meta: {
        lastUpdated: new Date().toISOString(),
        profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-medicationrequest'],
      },
      identifier: [
        {
          system: GENTLE_REMINDER_SYSTEM,
          value: medication.id,
        },
      ],
      status: medication.active ? 'active' : 'completed',
      intent: 'order',
      category: [
        {
          coding: [
            {
              system: 'http://terminology.hl7.org/CodeSystem/medicationrequest-category',
              code: 'community',
              display: 'Community',
            },
          ],
        },
      ],
      medicationCodeableConcept: rxNormCode
        ? {
            coding: [
              {
                system: RXNORM_SYSTEM,
                code: rxNormCode.code,
                display: rxNormCode.display,
              },
            ],
            text: medication.name,
          }
        : {
            text: medication.name,
          },
      subject: patientRef ?? { reference: 'Patient/unknown' },
      authoredOn: medication.startDate,
      dosageInstruction: [
        this.buildDosage(medication.dosage, medication.frequency, medication.route),
      ],
    };

    // Prescriber
    if (medication.prescriberId) {
      request.requester = {
        reference: `Practitioner/${medication.prescriberId}`,
      };
    }

    // Validity period
    if (medication.startDate || medication.endDate) {
      request.dispenseRequest = {
        validityPeriod: {
          start: medication.startDate,
          end: medication.endDate,
        },
      };
    }

    // Reason codes for dementia medications
    const reasonCode = this.getDementiaReasonCode(medication.name);
    if (reasonCode) {
      request.reasonCode = [reasonCode];
    }

    return request;
  }

  /**
   * Builds a FHIR Dosage from dosage string, frequency, and route.
   */
  buildDosage(dosageStr: string, frequency: string, route: string): FHIRDosage {
    const dosage: FHIRDosage = {
      text: `${dosageStr} ${route} ${frequency}`,
    };

    // Parse dose quantity from dosage string (e.g., "5mg", "10 mg", "23mg/mL")
    const doseMatch = dosageStr.match(/(\d+(?:\.\d+)?)\s*(mg|mcg|g|ml|mL|IU|units?)/i);
    if (doseMatch) {
      const value = parseFloat(doseMatch[1]);
      const unit = doseMatch[2].toLowerCase();
      const ucumUnit = this.mapDoseUnit(unit);

      dosage.doseAndRate = [
        {
          type: {
            coding: [{
              system: 'http://terminology.hl7.org/CodeSystem/dose-rate-type',
              code: 'ordered',
              display: 'Ordered',
            }],
          },
          doseQuantity: {
            value,
            unit: ucumUnit,
            system: UCUM_SYSTEM,
            code: ucumUnit,
          },
        },
      ];
    }

    // Parse timing from frequency
    const timing = this.parseFrequency(frequency);
    if (timing) {
      dosage.timing = timing;
    }

    // Route
    const routeCode = this.lookupRoute(route);
    if (routeCode) {
      dosage.route = {
        coding: [{
          system: SNOMED_SYSTEM,
          code: routeCode.code,
          display: routeCode.display,
        }],
        text: route,
      };
    }

    return dosage;
  }

  // -------------------------------------------------------------------------
  // RxNorm lookup
  // -------------------------------------------------------------------------

  /**
   * Looks up RxNorm code by medication name or explicit code.
   */
  lookupRxNorm(name: string, explicitCode?: string): { code: string; display: string } | null {
    if (explicitCode) {
      // Find by explicit code
      for (const entry of Object.values(RXNORM_CODES)) {
        if (entry.code === explicitCode) return entry;
      }
      return { code: explicitCode, display: name };
    }

    // Normalize and look up
    const normalized = name.toLowerCase().trim();
    if (RXNORM_LOOKUP[normalized]) {
      return RXNORM_LOOKUP[normalized];
    }

    // Partial match
    for (const [key, value] of Object.entries(RXNORM_LOOKUP)) {
      if (normalized.includes(key) || key.includes(normalized)) {
        return value;
      }
    }

    return null;
  }

  // -------------------------------------------------------------------------
  // Helpers
  // -------------------------------------------------------------------------

  private parseFrequency(frequency: string): FHIRTiming | null {
    const normalized = frequency.toLowerCase().trim();
    const mapped = FREQUENCY_MAP[normalized];

    if (mapped) {
      return {
        repeat: {
          frequency: mapped.frequency,
          period: mapped.period,
          periodUnit: mapped.periodUnit,
        },
        code: {
          text: frequency,
        },
      };
    }

    // Try to parse "every N hours/days" pattern
    const everyMatch = normalized.match(/every\s+(\d+)\s+(hour|day|week|minute)/i);
    if (everyMatch) {
      const period = parseInt(everyMatch[1]);
      const unitMap: Record<string, 'h' | 'd' | 'wk' | 'min'> = {
        hour: 'h', day: 'd', week: 'wk', minute: 'min',
      };
      return {
        repeat: {
          frequency: 1,
          period,
          periodUnit: unitMap[everyMatch[2].toLowerCase()] ?? 'd',
        },
        code: { text: frequency },
      };
    }

    return { code: { text: frequency } };
  }

  private lookupRoute(route: string): { code: string; display: string } | null {
    const normalized = route.toLowerCase().trim();
    return ROUTE_CODES[normalized] ?? null;
  }

  private mapDoseUnit(unit: string): string {
    const map: Record<string, string> = {
      mg: 'mg',
      mcg: 'ug',
      g: 'g',
      ml: 'mL',
      iu: '[IU]',
      unit: '{unit}',
      units: '{unit}',
    };
    return map[unit.toLowerCase()] ?? unit;
  }

  private getDementiaReasonCode(medicationName: string): FHIRCodeableConcept | null {
    const name = medicationName.toLowerCase();
    const dementiaKeywords = ['donepezil', 'rivastigmine', 'galantamine', 'memantine', 'aducanumab', 'lecanemab'];

    if (dementiaKeywords.some(kw => name.includes(kw))) {
      return {
        coding: [{
          system: SNOMED_SYSTEM,
          code: '52448006',
          display: 'Dementia (disorder)',
        }],
        text: 'Dementia management',
      };
    }

    return null;
  }
}

export default MedicationMapper;
