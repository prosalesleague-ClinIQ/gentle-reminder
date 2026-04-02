/**
 * ObservationMapper.ts
 *
 * Maps cognitive scores, biomarker readings, and therapy sessions from the
 * Gentle Reminder internal format to FHIR R4 Observation resources.
 * Uses proper LOINC codes for each cognitive domain and biomarker type.
 */

import type {
  FHIRObservation,
  FHIRCodeableConcept,
  FHIRQuantity,
  FHIRReference,
  FHIRCoding,
  FHIRObservationComponent,
  InternalCognitiveScore,
  InternalBiomarker,
  InternalSession,
} from './types';
import { LOINC_CODES } from './types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LOINC_SYSTEM = 'http://loinc.org';
const UCUM_SYSTEM = 'http://unitsofmeasure.org';
const OBSERVATION_CATEGORY_SYSTEM = 'http://terminology.hl7.org/CodeSystem/observation-category';
const GENTLE_REMINDER_SYSTEM = 'https://gentlereminder.health/observation-id';

// Cognitive domain -> LOINC mapping
const COGNITIVE_DOMAIN_LOINC: Record<string, { code: string; display: string }> = {
  memory: LOINC_CODES.MEMORY_SCORE,
  attention: LOINC_CODES.ATTENTION_SCORE,
  language: LOINC_CODES.LANGUAGE_SCORE,
  visuospatial: LOINC_CODES.VISUOSPATIAL_SCORE,
  executive: LOINC_CODES.EXECUTIVE_FUNCTION_SCORE,
  orientation: LOINC_CODES.ORIENTATION_SCORE,
  overall: LOINC_CODES.MOCA_TOTAL,
};

// Biomarker type -> LOINC mapping
const BIOMARKER_LOINC: Record<string, { code: string; display: string; unit: string; ucumCode: string }> = {
  heartRate: { ...LOINC_CODES.HEART_RATE, unit: 'beats/minute', ucumCode: '/min' },
  hrv: { ...LOINC_CODES.HEART_RATE_VARIABILITY, unit: 'ms', ucumCode: 'ms' },
  oxygenSaturation: { ...LOINC_CODES.OXYGEN_SATURATION, unit: '%', ucumCode: '%' },
  respiratoryRate: { ...LOINC_CODES.RESPIRATORY_RATE, unit: 'breaths/minute', ucumCode: '/min' },
  temperature: { ...LOINC_CODES.BODY_TEMPERATURE, unit: 'degrees Celsius', ucumCode: 'Cel' },
  steps: { ...LOINC_CODES.STEP_COUNT, unit: 'steps', ucumCode: '{steps}' },
  sleep: { ...LOINC_CODES.SLEEP_DURATION, unit: 'minutes', ucumCode: 'min' },
};

// Cognitive instrument -> LOINC mapping
const INSTRUMENT_LOINC: Record<string, { code: string; display: string }> = {
  MMSE: LOINC_CODES.MMSE_TOTAL,
  MoCA: LOINC_CODES.MOCA_TOTAL,
  CDR: LOINC_CODES.CDR_GLOBAL,
  'ADAS-Cog': LOINC_CODES.ADAS_COG,
  SLUMS: LOINC_CODES.SLUMS,
  GDS: LOINC_CODES.GDS_SCORE,
  NPI: LOINC_CODES.NPI_TOTAL,
  Barthel: LOINC_CODES.BARTHEL_INDEX,
  FAQ: LOINC_CODES.FAQ_SCORE,
};

// ---------------------------------------------------------------------------
// ObservationMapper
// ---------------------------------------------------------------------------

export class ObservationMapper {

  // -------------------------------------------------------------------------
  // Cognitive Score -> FHIR Observation
  // -------------------------------------------------------------------------

  /**
   * Maps a cognitive assessment score to a FHIR Observation.
   */
  mapCognitiveScoreToObservation(
    score: InternalCognitiveScore,
    patientRef?: FHIRReference
  ): FHIRObservation {
    const loincEntry = COGNITIVE_DOMAIN_LOINC[score.domain] ?? LOINC_CODES.MOCA_TOTAL;
    const instrumentLoinc = INSTRUMENT_LOINC[score.instrument];

    const observation: FHIRObservation = {
      resourceType: 'Observation',
      id: score.id,
      meta: {
        lastUpdated: new Date().toISOString(),
        profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-observation-survey'],
      },
      identifier: [
        {
          system: GENTLE_REMINDER_SYSTEM,
          value: score.id,
        },
      ],
      status: 'final',
      category: [
        this.buildCategory('survey', 'Survey'),
        {
          coding: [
            {
              system: 'https://gentlereminder.health/category',
              code: 'cognitive-assessment',
              display: 'Cognitive Assessment',
            },
          ],
        },
      ],
      code: instrumentLoinc
        ? this.buildCodeableConcept(instrumentLoinc.code, instrumentLoinc.display, LOINC_SYSTEM)
        : this.buildCodeableConcept(loincEntry.code, loincEntry.display, LOINC_SYSTEM),
      subject: patientRef ?? { reference: `Patient/${score.patientId}` },
      effectiveDateTime: score.date,
      issued: new Date().toISOString(),
      valueQuantity: this.buildQuantity(score.score, '{score}', UCUM_SYSTEM),
    };

    // Add components for domain breakdown
    const components: FHIRObservationComponent[] = [];

    // Score component
    components.push({
      code: this.buildCodeableConcept(loincEntry.code, loincEntry.display, LOINC_SYSTEM),
      valueQuantity: this.buildQuantity(score.score, '{score}', UCUM_SYSTEM),
    });

    // Max score component
    if (score.maxScore > 0) {
      components.push({
        code: this.buildCodeableConcept('max-score', 'Maximum possible score', GENTLE_REMINDER_SYSTEM),
        valueInteger: score.maxScore,
      });
    }

    // Percentage component
    if (score.maxScore > 0) {
      const percentage = (score.score / score.maxScore) * 100;
      components.push({
        code: this.buildCodeableConcept('score-percentage', 'Score as percentage', GENTLE_REMINDER_SYSTEM),
        valueQuantity: this.buildQuantity(Math.round(percentage * 10) / 10, '%', UCUM_SYSTEM),
      });
    }

    // Domain component
    components.push({
      code: this.buildCodeableConcept('cognitive-domain', 'Cognitive domain assessed', GENTLE_REMINDER_SYSTEM),
      valueString: score.domain,
    });

    observation.component = components;

    // Add reference range for known instruments
    observation.referenceRange = this.getCognitiveReferenceRange(score.instrument, score.maxScore);

    // Interpretation
    if (score.maxScore > 0) {
      const pct = score.score / score.maxScore;
      observation.interpretation = [this.buildInterpretation(pct)];
    }

    // Notes
    if (score.notes) {
      observation.note = [{ text: score.notes }];
    }

    // Assessor
    if (score.assessorId) {
      observation.performer = [{ reference: `Practitioner/${score.assessorId}` }];
    }

    return observation;
  }

  // -------------------------------------------------------------------------
  // Biomarker -> FHIR Observation
  // -------------------------------------------------------------------------

  /**
   * Maps a biomarker reading (heart rate, HRV, SpO2, etc.) to a FHIR Observation.
   */
  mapBiomarkerToObservation(
    biomarker: InternalBiomarker,
    patientRef?: FHIRReference
  ): FHIRObservation {
    const mapping = BIOMARKER_LOINC[biomarker.type];
    if (!mapping) {
      throw new Error(`Unknown biomarker type: ${biomarker.type}`);
    }

    const observation: FHIRObservation = {
      resourceType: 'Observation',
      id: biomarker.id,
      meta: {
        lastUpdated: new Date().toISOString(),
        profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-vital-signs'],
      },
      identifier: [
        {
          system: GENTLE_REMINDER_SYSTEM,
          value: biomarker.id,
        },
      ],
      status: 'final',
      category: [
        this.buildCategory('vital-signs', 'Vital Signs'),
      ],
      code: this.buildCodeableConcept(mapping.code, mapping.display, LOINC_SYSTEM),
      subject: patientRef ?? { reference: `Patient/${biomarker.patientId}` },
      effectiveDateTime: biomarker.timestamp,
      issued: new Date().toISOString(),
      valueQuantity: this.buildQuantity(biomarker.value, mapping.ucumCode, UCUM_SYSTEM),
    };

    // Add source device
    if (biomarker.source) {
      observation.device = {
        display: biomarker.source,
      };
    }

    // Add reference ranges for known biomarkers
    observation.referenceRange = this.getBiomarkerReferenceRange(biomarker.type);

    // Add interpretation
    const interp = this.interpretBiomarker(biomarker.type, biomarker.value);
    if (interp) {
      observation.interpretation = [interp];
    }

    return observation;
  }

  // -------------------------------------------------------------------------
  // Session -> FHIR Observation
  // -------------------------------------------------------------------------

  /**
   * Maps a therapy/exercise session to a FHIR Observation.
   */
  mapSessionToObservation(
    session: InternalSession,
    patientRef?: FHIRReference
  ): FHIRObservation {
    const observation: FHIRObservation = {
      resourceType: 'Observation',
      id: session.id,
      meta: {
        lastUpdated: new Date().toISOString(),
      },
      identifier: [
        {
          system: GENTLE_REMINDER_SYSTEM,
          value: session.id,
        },
      ],
      status: 'final',
      category: [
        this.buildCategory('survey', 'Survey'),
        {
          coding: [
            {
              system: 'https://gentlereminder.health/category',
              code: 'therapy-session',
              display: 'Therapy Session',
            },
          ],
        },
      ],
      code: {
        coding: [
          {
            system: 'https://gentlereminder.health/session-type',
            code: session.type,
            display: `${session.type} session`,
          },
        ],
        text: `${session.type} therapy session`,
      },
      subject: patientRef ?? { reference: `Patient/${session.patientId}` },
      effectivePeriod: {
        start: session.startTime,
        end: session.endTime,
      },
      issued: new Date().toISOString(),
    };

    // Score if available
    if (session.score !== undefined) {
      observation.valueQuantity = this.buildQuantity(session.score, '{score}', UCUM_SYSTEM);
    }

    // Components
    const components: FHIRObservationComponent[] = [];

    // Completion percentage
    components.push({
      code: this.buildCodeableConcept('completion-pct', 'Completion percentage', GENTLE_REMINDER_SYSTEM),
      valueQuantity: this.buildQuantity(session.completionPercentage, '%', UCUM_SYSTEM),
    });

    // Domain
    if (session.domain) {
      components.push({
        code: this.buildCodeableConcept('cognitive-domain', 'Cognitive domain', GENTLE_REMINDER_SYSTEM),
        valueString: session.domain,
      });
    }

    // Duration
    const startMs = new Date(session.startTime).getTime();
    const endMs = new Date(session.endTime).getTime();
    const durationMin = (endMs - startMs) / 60000;
    if (durationMin > 0) {
      components.push({
        code: this.buildCodeableConcept('session-duration', 'Session duration', GENTLE_REMINDER_SYSTEM),
        valueQuantity: this.buildQuantity(Math.round(durationMin * 10) / 10, 'min', UCUM_SYSTEM),
      });
    }

    observation.component = components;

    // Notes
    if (session.notes) {
      observation.note = [{ text: session.notes }];
    }

    return observation;
  }

  // -------------------------------------------------------------------------
  // Builder helpers
  // -------------------------------------------------------------------------

  /**
   * Builds a FHIR Quantity.
   */
  buildQuantity(value: number, unit: string, system: string): FHIRQuantity {
    return {
      value,
      unit,
      system,
      code: unit,
    };
  }

  /**
   * Builds a FHIR CodeableConcept with a single coding.
   */
  buildCodeableConcept(code: string, display: string, system: string): FHIRCodeableConcept {
    return {
      coding: [{ system, code, display }],
      text: display,
    };
  }

  /**
   * Builds a FHIR Coding.
   */
  buildCoding(code: string, display: string, system: string): FHIRCoding {
    return { system, code, display };
  }

  // -------------------------------------------------------------------------
  // Interpretation helpers
  // -------------------------------------------------------------------------

  private buildCategory(code: string, display: string): FHIRCodeableConcept {
    return {
      coding: [
        {
          system: OBSERVATION_CATEGORY_SYSTEM,
          code,
          display,
        },
      ],
    };
  }

  private buildInterpretation(scoreRatio: number): FHIRCodeableConcept {
    const interpSystem = 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation';
    if (scoreRatio >= 0.85) {
      return { coding: [{ system: interpSystem, code: 'N', display: 'Normal' }], text: 'Within normal range' };
    } else if (scoreRatio >= 0.65) {
      return { coding: [{ system: interpSystem, code: 'L', display: 'Low' }], text: 'Below normal' };
    } else if (scoreRatio >= 0.45) {
      return { coding: [{ system: interpSystem, code: 'LL', display: 'Critically low' }], text: 'Significantly below normal' };
    } else {
      return { coding: [{ system: interpSystem, code: 'LL', display: 'Critically low' }], text: 'Severely impaired' };
    }
  }

  private interpretBiomarker(type: string, value: number): FHIRCodeableConcept | null {
    const interpSystem = 'http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation';

    switch (type) {
      case 'heartRate':
        if (value > 100) return { coding: [{ system: interpSystem, code: 'H', display: 'High' }], text: 'Tachycardia' };
        if (value < 60) return { coding: [{ system: interpSystem, code: 'L', display: 'Low' }], text: 'Bradycardia' };
        return { coding: [{ system: interpSystem, code: 'N', display: 'Normal' }] };
      case 'oxygenSaturation':
        if (value < 90) return { coding: [{ system: interpSystem, code: 'LL', display: 'Critically low' }], text: 'Hypoxemia' };
        if (value < 95) return { coding: [{ system: interpSystem, code: 'L', display: 'Low' }] };
        return { coding: [{ system: interpSystem, code: 'N', display: 'Normal' }] };
      case 'respiratoryRate':
        if (value > 20) return { coding: [{ system: interpSystem, code: 'H', display: 'High' }], text: 'Tachypnea' };
        if (value < 12) return { coding: [{ system: interpSystem, code: 'L', display: 'Low' }], text: 'Bradypnea' };
        return { coding: [{ system: interpSystem, code: 'N', display: 'Normal' }] };
      default:
        return null;
    }
  }

  // -------------------------------------------------------------------------
  // Reference ranges
  // -------------------------------------------------------------------------

  private getCognitiveReferenceRange(instrument: string, maxScore: number) {
    const ranges = [];
    if (maxScore > 0) {
      ranges.push({
        high: { value: maxScore, unit: '{score}', system: UCUM_SYSTEM, code: '{score}' },
        text: `Normal range for ${instrument}`,
      });
    }

    // Instrument-specific cutoffs
    switch (instrument) {
      case 'MoCA':
        ranges.push({
          low: { value: 26, unit: '{score}', system: UCUM_SYSTEM, code: '{score}' },
          high: { value: 30, unit: '{score}', system: UCUM_SYSTEM, code: '{score}' },
          type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/referencerange-meaning', code: 'normal' }] },
          text: 'Normal cognition (26-30)',
        });
        break;
      case 'MMSE':
        ranges.push({
          low: { value: 24, unit: '{score}', system: UCUM_SYSTEM, code: '{score}' },
          high: { value: 30, unit: '{score}', system: UCUM_SYSTEM, code: '{score}' },
          type: { coding: [{ system: 'http://terminology.hl7.org/CodeSystem/referencerange-meaning', code: 'normal' }] },
          text: 'Normal cognition (24-30)',
        });
        break;
    }

    return ranges.length > 0 ? ranges : undefined;
  }

  private getBiomarkerReferenceRange(type: string) {
    switch (type) {
      case 'heartRate':
        return [{ low: { value: 60 }, high: { value: 100 }, text: 'Normal resting heart rate' }];
      case 'oxygenSaturation':
        return [{ low: { value: 95 }, high: { value: 100 }, text: 'Normal SpO2' }];
      case 'respiratoryRate':
        return [{ low: { value: 12 }, high: { value: 20 }, text: 'Normal respiratory rate' }];
      case 'temperature':
        return [{ low: { value: 36.1 }, high: { value: 37.2 }, text: 'Normal body temperature (Celsius)' }];
      default:
        return undefined;
    }
  }
}

export default ObservationMapper;
