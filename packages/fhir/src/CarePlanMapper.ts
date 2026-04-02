/**
 * CarePlanMapper.ts
 *
 * Maps internal care plan data to FHIR R4 CarePlan resources.
 * Includes activity building, goal construction, and intervention mapping
 * for dementia-specific therapeutic activities.
 */

import type {
  FHIRCarePlan,
  FHIRCarePlanActivity,
  FHIRCarePlanActivityDetail,
  FHIRReference,
  FHIRCodeableConcept,
  FHIRAnnotation,
  FHIRPeriod,
  InternalCarePlan,
  InternalGoal,
  InternalIntervention,
} from './types';
import { SNOMED_CODES } from './types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const SNOMED_SYSTEM = 'http://snomed.info/sct';
const GENTLE_REMINDER_SYSTEM = 'https://gentlereminder.health';
const CARE_PLAN_CATEGORY_SYSTEM = 'http://hl7.org/fhir/us/core/CodeSystem/careplan-category';

// Intervention type -> SNOMED mapping
const INTERVENTION_SNOMED: Record<string, { code: string; display: string }> = {
  'cognitive_therapy': SNOMED_CODES.COGNITIVE_THERAPY,
  'reminiscence': SNOMED_CODES.REMINISCENCE_THERAPY,
  'music_therapy': SNOMED_CODES.MUSIC_THERAPY,
  'occupational_therapy': SNOMED_CODES.OCCUPATIONAL_THERAPY,
  'physical_therapy': SNOMED_CODES.PHYSICAL_THERAPY,
  'speech_therapy': SNOMED_CODES.SPEECH_THERAPY,
  'cognitive': SNOMED_CODES.COGNITIVE_THERAPY,
  'music': SNOMED_CODES.MUSIC_THERAPY,
  'physical': SNOMED_CODES.PHYSICAL_THERAPY,
  'occupational': SNOMED_CODES.OCCUPATIONAL_THERAPY,
  'speech': SNOMED_CODES.SPEECH_THERAPY,
};

// Status mapping
const STATUS_MAP: Record<string, FHIRCarePlan['status']> = {
  draft: 'draft',
  active: 'active',
  completed: 'completed',
  cancelled: 'revoked',
};

const ACTIVITY_STATUS_MAP: Record<string, FHIRCarePlanActivityDetail['status']> = {
  'not-started': 'not-started',
  'in-progress': 'in-progress',
  completed: 'completed',
  cancelled: 'cancelled',
};

// ---------------------------------------------------------------------------
// CarePlanMapper
// ---------------------------------------------------------------------------

export class CarePlanMapper {

  /**
   * Maps an internal care plan to a FHIR R4 CarePlan resource.
   */
  mapToFHIRCarePlan(
    carePlan: InternalCarePlan,
    patientRef: FHIRReference
  ): FHIRCarePlan {
    const fhirCarePlan: FHIRCarePlan = {
      resourceType: 'CarePlan',
      id: carePlan.id,
      meta: {
        lastUpdated: new Date().toISOString(),
        profile: ['http://hl7.org/fhir/us/core/StructureDefinition/us-core-careplan'],
      },
      identifier: [
        {
          system: `${GENTLE_REMINDER_SYSTEM}/careplan-id`,
          value: carePlan.id,
        },
      ],
      status: STATUS_MAP[carePlan.status] ?? 'unknown',
      intent: 'plan',
      category: [
        {
          coding: [
            {
              system: CARE_PLAN_CATEGORY_SYSTEM,
              code: 'assess-plan',
              display: 'Assessment and Plan of Treatment',
            },
          ],
        },
        {
          coding: [
            {
              system: `${GENTLE_REMINDER_SYSTEM}/category`,
              code: 'dementia-care',
              display: 'Dementia Care Plan',
            },
          ],
        },
      ],
      title: carePlan.title,
      description: carePlan.description,
      subject: patientRef,
      period: this.buildPeriod(carePlan.startDate, carePlan.endDate),
      created: carePlan.startDate,
      author: {
        reference: `Practitioner/${carePlan.createdBy}`,
        display: 'Care Plan Author',
      },
      // Map goals as references (goals would be separate Goal resources in a full implementation)
      goal: carePlan.goals.map(g => ({
        reference: `#goal-${g.id}`,
        display: g.description,
      })),
      // Map interventions as activities
      activity: carePlan.interventions.map(intervention =>
        this.buildActivity(intervention, patientRef)
      ),
    };

    // Add notes for goals as contained annotations
    if (carePlan.goals.length > 0) {
      fhirCarePlan.note = carePlan.goals.map(g => ({
        text: `Goal: ${g.description}${g.targetDate ? ` (target: ${g.targetDate})` : ''} - Status: ${g.status}`,
      }));
    }

    // Add addresses for dementia condition
    fhirCarePlan.addresses = [
      {
        reference: 'Condition/dementia',
        display: 'Dementia (disorder)',
      },
    ];

    return fhirCarePlan;
  }

  /**
   * Builds a FHIR CarePlan Activity from an internal intervention.
   */
  buildActivity(
    intervention: InternalIntervention,
    patientRef?: FHIRReference
  ): FHIRCarePlanActivity {
    const snomedCode = INTERVENTION_SNOMED[intervention.type.toLowerCase()] ??
      INTERVENTION_SNOMED[intervention.type.toLowerCase().replace(/[_\s]therapy$/, '')];

    const detail: FHIRCarePlanActivityDetail = {
      kind: 'ServiceRequest',
      code: snomedCode
        ? {
            coding: [{
              system: SNOMED_SYSTEM,
              code: snomedCode.code,
              display: snomedCode.display,
            }],
            text: intervention.description,
          }
        : {
            coding: [{
              system: `${GENTLE_REMINDER_SYSTEM}/intervention-type`,
              code: intervention.type,
              display: intervention.type.replace(/_/g, ' '),
            }],
            text: intervention.description,
          },
      status: ACTIVITY_STATUS_MAP[intervention.status] ?? 'not-started',
      description: intervention.description,
    };

    // Period
    if (intervention.startDate || intervention.endDate) {
      detail.scheduledPeriod = this.buildPeriod(intervention.startDate, intervention.endDate);
    }

    // Frequency as scheduled string
    if (intervention.frequency) {
      detail.scheduledString = intervention.frequency;
    }

    const activity: FHIRCarePlanActivity = {
      detail,
    };

    // Progress notes
    if (intervention.notes) {
      activity.progress = [
        {
          time: new Date().toISOString(),
          text: intervention.notes,
        },
      ];
    }

    return activity;
  }

  /**
   * Builds a goal description annotation.
   */
  buildGoal(
    goal: InternalGoal
  ): { description: string; targetDate?: string; status: string; fhirAnnotation: FHIRAnnotation } {
    return {
      description: goal.description,
      targetDate: goal.targetDate,
      status: goal.status,
      fhirAnnotation: {
        time: new Date().toISOString(),
        text: `Goal: ${goal.description} | Status: ${goal.status}${goal.targetDate ? ` | Target: ${goal.targetDate}` : ''}${goal.measurementCriteria ? ` | Criteria: ${goal.measurementCriteria}` : ''}`,
      },
    };
  }

  /**
   * Builds a FHIR Period from start/end date strings.
   */
  private buildPeriod(start?: string, end?: string): FHIRPeriod | undefined {
    if (!start && !end) return undefined;
    return { start, end };
  }
}

export default CarePlanMapper;
