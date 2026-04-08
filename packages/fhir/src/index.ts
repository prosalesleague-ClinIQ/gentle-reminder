/**
 * @gentle-reminder/fhir
 *
 * FHIR R4 compliance module for the Gentle Reminder dementia care platform.
 *
 * Provides:
 *  - Comprehensive FHIR R4 type definitions
 *  - Patient, Observation, Medication, CarePlan, DiagnosticReport mappers
 *  - Bundle builder for clinical data exchange
 *  - Resource validator
 *  - LOINC, SNOMED CT, and RxNorm code constants
 */

// Types & code systems
export {
  // FHIR Primitive aliases
  type FHIRId,
  type FHIRUri,
  type FHIRCode,
  type FHIRDateTime,
  type FHIRDate,
  type FHIRInstant,
  type FHIRDecimal,
  type FHIRString,
  type FHIRBoolean,

  // General-purpose types
  type FHIRMeta,
  type FHIRNarrative,
  type FHIRIdentifier,
  type FHIRCoding,
  type FHIRCodeableConcept,
  type FHIRQuantity,
  type FHIRRange,
  type FHIRRatio,
  type FHIRPeriod,
  type FHIRReference,
  type FHIRHumanName,
  type FHIRAddress,
  type FHIRContactPoint,
  type FHIRAttachment,
  type FHIRAnnotation,
  type FHIRDosage,
  type FHIRTiming,
  type FHIRExtension,

  // Resource types
  type FHIRResource,
  type FHIRDomainResource,
  type FHIRPatient,
  type FHIRObservation,
  type FHIRCondition,
  type FHIRMedicationRequest,
  type FHIRCarePlan,
  type FHIRDiagnosticReport,
  type FHIRBundle,
  type FHIRBundleEntry,
  type FHIRSignature,

  // Sub-resource types
  type FHIRPatientContact,
  type FHIRPatientCommunication,
  type FHIRObservationComponent,
  type FHIRObservationReferenceRange,
  type FHIRConditionStage,
  type FHIRCarePlanActivity,
  type FHIRCarePlanActivityDetail,

  // Validation
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,

  // Internal domain types
  type InternalPatient,
  type InternalMedication,
  type InternalCognitiveScore,
  type InternalSession,
  type InternalCarePlan,
  type InternalGoal,
  type InternalIntervention,
  type InternalBiomarker,

  // Code system constants
  LOINC_CODES,
  SNOMED_CODES,
  RXNORM_CODES,
} from './types';

// Mappers
export { PatientMapper } from './PatientMapper';
export { ObservationMapper } from './ObservationMapper';
export { BundleBuilder } from './BundleBuilder';
export { MedicationMapper } from './MedicationMapper';
export { CarePlanMapper } from './CarePlanMapper';
export { DiagnosticReportMapper, type CognitiveTrend } from './DiagnosticReportMapper';

// Validator
export { Validator } from './Validator';

// Extension handler
export {
  EXTENSION_URLS,
  createCognitiveStageExtension,
  createBiomarkerConfidenceExtension,
  createRiskPredictionExtension,
  applyExtensions,
} from './ExtensionHandler';

// Terminology service
export {
  isValidSystem,
  validateCode,
  lookupDisplay,
} from './TerminologyService';
