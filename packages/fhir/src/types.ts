/**
 * types.ts
 *
 * Comprehensive FHIR R4 type definitions for the Gentle Reminder platform.
 * Covers core data types, resource types, and code system constants
 * used in dementia care workflows.
 *
 * Reference: https://hl7.org/fhir/R4/
 */

// ============================================================================
// FHIR Primitive Types
// ============================================================================

export type FHIRId = string;
export type FHIRUri = string;
export type FHIRUrl = string;
export type FHIRCanonical = string;
export type FHIRCode = string;
export type FHIRDateTime = string; // ISO 8601
export type FHIRDate = string;     // YYYY-MM-DD
export type FHIRTime = string;     // HH:MM:SS
export type FHIRInstant = string;  // ISO 8601 with timezone
export type FHIRDecimal = number;
export type FHIRInteger = number;
export type FHIRPositiveInt = number;
export type FHIRUnsignedInt = number;
export type FHIRBoolean = boolean;
export type FHIRString = string;
export type FHIRMarkdown = string;
export type FHIRBase64Binary = string;

// ============================================================================
// FHIR General Purpose Data Types
// ============================================================================

export interface FHIRMeta {
  versionId?: FHIRId;
  lastUpdated?: FHIRInstant;
  source?: FHIRUri;
  profile?: FHIRCanonical[];
  security?: FHIRCoding[];
  tag?: FHIRCoding[];
}

export interface FHIRNarrative {
  status: 'generated' | 'extensions' | 'additional' | 'empty';
  div: string; // XHTML
}

export interface FHIRIdentifier {
  use?: 'usual' | 'official' | 'temp' | 'secondary' | 'old';
  type?: FHIRCodeableConcept;
  system?: FHIRUri;
  value?: FHIRString;
  period?: FHIRPeriod;
  assigner?: FHIRReference;
}

export interface FHIRCoding {
  system?: FHIRUri;
  version?: FHIRString;
  code?: FHIRCode;
  display?: FHIRString;
  userSelected?: FHIRBoolean;
}

export interface FHIRCodeableConcept {
  coding?: FHIRCoding[];
  text?: FHIRString;
}

export interface FHIRQuantity {
  value?: FHIRDecimal;
  comparator?: '<' | '<=' | '>=' | '>';
  unit?: FHIRString;
  system?: FHIRUri;
  code?: FHIRCode;
}

export interface FHIRRange {
  low?: FHIRQuantity;
  high?: FHIRQuantity;
}

export interface FHIRRatio {
  numerator?: FHIRQuantity;
  denominator?: FHIRQuantity;
}

export interface FHIRPeriod {
  start?: FHIRDateTime;
  end?: FHIRDateTime;
}

export interface FHIRReference {
  reference?: FHIRString;
  type?: FHIRUri;
  identifier?: FHIRIdentifier;
  display?: FHIRString;
}

export interface FHIRHumanName {
  use?: 'usual' | 'official' | 'temp' | 'nickname' | 'anonymous' | 'old' | 'maiden';
  text?: FHIRString;
  family?: FHIRString;
  given?: FHIRString[];
  prefix?: FHIRString[];
  suffix?: FHIRString[];
  period?: FHIRPeriod;
}

export interface FHIRAddress {
  use?: 'home' | 'work' | 'temp' | 'old' | 'billing';
  type?: 'postal' | 'physical' | 'both';
  text?: FHIRString;
  line?: FHIRString[];
  city?: FHIRString;
  district?: FHIRString;
  state?: FHIRString;
  postalCode?: FHIRString;
  country?: FHIRString;
  period?: FHIRPeriod;
}

export interface FHIRContactPoint {
  system?: 'phone' | 'fax' | 'email' | 'pager' | 'url' | 'sms' | 'other';
  value?: FHIRString;
  use?: 'home' | 'work' | 'temp' | 'old' | 'mobile';
  rank?: FHIRPositiveInt;
  period?: FHIRPeriod;
}

export interface FHIRAttachment {
  contentType?: FHIRCode;
  language?: FHIRCode;
  data?: FHIRBase64Binary;
  url?: FHIRUrl;
  size?: FHIRUnsignedInt;
  hash?: FHIRBase64Binary;
  title?: FHIRString;
  creation?: FHIRDateTime;
}

export interface FHIRAnnotation {
  authorReference?: FHIRReference;
  authorString?: FHIRString;
  time?: FHIRDateTime;
  text: FHIRMarkdown;
}

export interface FHIRDosage {
  sequence?: FHIRInteger;
  text?: FHIRString;
  additionalInstruction?: FHIRCodeableConcept[];
  patientInstruction?: FHIRString;
  timing?: FHIRTiming;
  asNeededBoolean?: FHIRBoolean;
  asNeededCodeableConcept?: FHIRCodeableConcept;
  site?: FHIRCodeableConcept;
  route?: FHIRCodeableConcept;
  method?: FHIRCodeableConcept;
  doseAndRate?: Array<{
    type?: FHIRCodeableConcept;
    doseQuantity?: FHIRQuantity;
    doseRange?: FHIRRange;
    rateRatio?: FHIRRatio;
    rateRange?: FHIRRange;
    rateQuantity?: FHIRQuantity;
  }>;
  maxDosePerPeriod?: FHIRRatio;
  maxDosePerAdministration?: FHIRQuantity;
  maxDosePerLifetime?: FHIRQuantity;
}

export interface FHIRTiming {
  event?: FHIRDateTime[];
  repeat?: {
    boundsDuration?: FHIRQuantity;
    boundsPeriod?: FHIRPeriod;
    boundsRange?: FHIRRange;
    count?: FHIRPositiveInt;
    countMax?: FHIRPositiveInt;
    duration?: FHIRDecimal;
    durationMax?: FHIRDecimal;
    durationUnit?: 's' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a';
    frequency?: FHIRPositiveInt;
    frequencyMax?: FHIRPositiveInt;
    period?: FHIRDecimal;
    periodMax?: FHIRDecimal;
    periodUnit?: 's' | 'min' | 'h' | 'd' | 'wk' | 'mo' | 'a';
    dayOfWeek?: FHIRCode[];
    timeOfDay?: FHIRTime[];
    when?: FHIRCode[];
    offset?: FHIRUnsignedInt;
  };
  code?: FHIRCodeableConcept;
}

// ============================================================================
// FHIR Base Resource
// ============================================================================

export interface FHIRResource {
  resourceType: string;
  id?: FHIRId;
  meta?: FHIRMeta;
  implicitRules?: FHIRUri;
  language?: FHIRCode;
}

export interface FHIRDomainResource extends FHIRResource {
  text?: FHIRNarrative;
  contained?: FHIRResource[];
  extension?: FHIRExtension[];
  modifierExtension?: FHIRExtension[];
}

export interface FHIRExtension {
  url: FHIRUri;
  valueString?: FHIRString;
  valueCode?: FHIRCode;
  valueBoolean?: FHIRBoolean;
  valueInteger?: FHIRInteger;
  valueDecimal?: FHIRDecimal;
  valueDateTime?: FHIRDateTime;
  valueReference?: FHIRReference;
  valueCodeableConcept?: FHIRCodeableConcept;
  valueQuantity?: FHIRQuantity;
  valuePeriod?: FHIRPeriod;
}

// ============================================================================
// FHIR Patient
// ============================================================================

export interface FHIRPatient extends FHIRDomainResource {
  resourceType: 'Patient';
  identifier?: FHIRIdentifier[];
  active?: FHIRBoolean;
  name?: FHIRHumanName[];
  telecom?: FHIRContactPoint[];
  gender?: 'male' | 'female' | 'other' | 'unknown';
  birthDate?: FHIRDate;
  deceasedBoolean?: FHIRBoolean;
  deceasedDateTime?: FHIRDateTime;
  address?: FHIRAddress[];
  maritalStatus?: FHIRCodeableConcept;
  multipleBirthBoolean?: FHIRBoolean;
  multipleBirthInteger?: FHIRInteger;
  photo?: FHIRAttachment[];
  contact?: FHIRPatientContact[];
  communication?: FHIRPatientCommunication[];
  generalPractitioner?: FHIRReference[];
  managingOrganization?: FHIRReference;
  link?: FHIRPatientLink[];
}

export interface FHIRPatientContact {
  relationship?: FHIRCodeableConcept[];
  name?: FHIRHumanName;
  telecom?: FHIRContactPoint[];
  address?: FHIRAddress;
  gender?: 'male' | 'female' | 'other' | 'unknown';
  organization?: FHIRReference;
  period?: FHIRPeriod;
}

export interface FHIRPatientCommunication {
  language: FHIRCodeableConcept;
  preferred?: FHIRBoolean;
}

export interface FHIRPatientLink {
  other: FHIRReference;
  type: 'replaced-by' | 'replaces' | 'refer' | 'seealso';
}

// ============================================================================
// FHIR Observation
// ============================================================================

export interface FHIRObservation extends FHIRDomainResource {
  resourceType: 'Observation';
  identifier?: FHIRIdentifier[];
  basedOn?: FHIRReference[];
  partOf?: FHIRReference[];
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled' | 'entered-in-error' | 'unknown';
  category?: FHIRCodeableConcept[];
  code: FHIRCodeableConcept;
  subject?: FHIRReference;
  focus?: FHIRReference[];
  encounter?: FHIRReference;
  effectiveDateTime?: FHIRDateTime;
  effectivePeriod?: FHIRPeriod;
  effectiveTiming?: FHIRTiming;
  effectiveInstant?: FHIRInstant;
  issued?: FHIRInstant;
  performer?: FHIRReference[];
  valueQuantity?: FHIRQuantity;
  valueCodeableConcept?: FHIRCodeableConcept;
  valueString?: FHIRString;
  valueBoolean?: FHIRBoolean;
  valueInteger?: FHIRInteger;
  valueRange?: FHIRRange;
  valueRatio?: FHIRRatio;
  valueDateTime?: FHIRDateTime;
  valuePeriod?: FHIRPeriod;
  dataAbsentReason?: FHIRCodeableConcept;
  interpretation?: FHIRCodeableConcept[];
  note?: FHIRAnnotation[];
  bodySite?: FHIRCodeableConcept;
  method?: FHIRCodeableConcept;
  specimen?: FHIRReference;
  device?: FHIRReference;
  referenceRange?: FHIRObservationReferenceRange[];
  hasMember?: FHIRReference[];
  derivedFrom?: FHIRReference[];
  component?: FHIRObservationComponent[];
}

export interface FHIRObservationReferenceRange {
  low?: FHIRQuantity;
  high?: FHIRQuantity;
  type?: FHIRCodeableConcept;
  appliesTo?: FHIRCodeableConcept[];
  age?: FHIRRange;
  text?: FHIRString;
}

export interface FHIRObservationComponent {
  code: FHIRCodeableConcept;
  valueQuantity?: FHIRQuantity;
  valueCodeableConcept?: FHIRCodeableConcept;
  valueString?: FHIRString;
  valueBoolean?: FHIRBoolean;
  valueInteger?: FHIRInteger;
  valueRange?: FHIRRange;
  valueRatio?: FHIRRatio;
  valueDateTime?: FHIRDateTime;
  valuePeriod?: FHIRPeriod;
  dataAbsentReason?: FHIRCodeableConcept;
  interpretation?: FHIRCodeableConcept[];
  referenceRange?: FHIRObservationReferenceRange[];
}

// ============================================================================
// FHIR Condition
// ============================================================================

export interface FHIRCondition extends FHIRDomainResource {
  resourceType: 'Condition';
  identifier?: FHIRIdentifier[];
  clinicalStatus?: FHIRCodeableConcept;
  verificationStatus?: FHIRCodeableConcept;
  category?: FHIRCodeableConcept[];
  severity?: FHIRCodeableConcept;
  code?: FHIRCodeableConcept;
  bodySite?: FHIRCodeableConcept[];
  subject: FHIRReference;
  encounter?: FHIRReference;
  onsetDateTime?: FHIRDateTime;
  onsetAge?: FHIRQuantity;
  onsetPeriod?: FHIRPeriod;
  onsetRange?: FHIRRange;
  onsetString?: FHIRString;
  abatementDateTime?: FHIRDateTime;
  abatementAge?: FHIRQuantity;
  abatementPeriod?: FHIRPeriod;
  abatementRange?: FHIRRange;
  abatementString?: FHIRString;
  recordedDate?: FHIRDateTime;
  recorder?: FHIRReference;
  asserter?: FHIRReference;
  stage?: FHIRConditionStage[];
  evidence?: FHIRConditionEvidence[];
  note?: FHIRAnnotation[];
}

export interface FHIRConditionStage {
  summary?: FHIRCodeableConcept;
  assessment?: FHIRReference[];
  type?: FHIRCodeableConcept;
}

export interface FHIRConditionEvidence {
  code?: FHIRCodeableConcept[];
  detail?: FHIRReference[];
}

// ============================================================================
// FHIR MedicationRequest
// ============================================================================

export interface FHIRMedicationRequest extends FHIRDomainResource {
  resourceType: 'MedicationRequest';
  identifier?: FHIRIdentifier[];
  status: 'active' | 'on-hold' | 'cancelled' | 'completed' | 'entered-in-error' | 'stopped' | 'draft' | 'unknown';
  statusReason?: FHIRCodeableConcept;
  intent: 'proposal' | 'plan' | 'order' | 'original-order' | 'reflex-order' | 'filler-order' | 'instance-order' | 'option';
  category?: FHIRCodeableConcept[];
  priority?: 'routine' | 'urgent' | 'asap' | 'stat';
  doNotPerform?: FHIRBoolean;
  reportedBoolean?: FHIRBoolean;
  reportedReference?: FHIRReference;
  medicationCodeableConcept?: FHIRCodeableConcept;
  medicationReference?: FHIRReference;
  subject: FHIRReference;
  encounter?: FHIRReference;
  supportingInformation?: FHIRReference[];
  authoredOn?: FHIRDateTime;
  requester?: FHIRReference;
  performer?: FHIRReference;
  performerType?: FHIRCodeableConcept;
  recorder?: FHIRReference;
  reasonCode?: FHIRCodeableConcept[];
  reasonReference?: FHIRReference[];
  instantiatesCanonical?: FHIRCanonical[];
  instantiatesUri?: FHIRUri[];
  basedOn?: FHIRReference[];
  groupIdentifier?: FHIRIdentifier;
  courseOfTherapyType?: FHIRCodeableConcept;
  insurance?: FHIRReference[];
  note?: FHIRAnnotation[];
  dosageInstruction?: FHIRDosage[];
  dispenseRequest?: FHIRMedicationRequestDispenseRequest;
  substitution?: FHIRMedicationRequestSubstitution;
  priorPrescription?: FHIRReference;
  detectedIssue?: FHIRReference[];
  eventHistory?: FHIRReference[];
}

export interface FHIRMedicationRequestDispenseRequest {
  initialFill?: { quantity?: FHIRQuantity; duration?: FHIRQuantity };
  dispenseInterval?: FHIRQuantity;
  validityPeriod?: FHIRPeriod;
  numberOfRepeatsAllowed?: FHIRUnsignedInt;
  quantity?: FHIRQuantity;
  expectedSupplyDuration?: FHIRQuantity;
  performer?: FHIRReference;
}

export interface FHIRMedicationRequestSubstitution {
  allowedBoolean?: FHIRBoolean;
  allowedCodeableConcept?: FHIRCodeableConcept;
  reason?: FHIRCodeableConcept;
}

// ============================================================================
// FHIR CarePlan
// ============================================================================

export interface FHIRCarePlan extends FHIRDomainResource {
  resourceType: 'CarePlan';
  identifier?: FHIRIdentifier[];
  instantiatesCanonical?: FHIRCanonical[];
  instantiatesUri?: FHIRUri[];
  basedOn?: FHIRReference[];
  replaces?: FHIRReference[];
  partOf?: FHIRReference[];
  status: 'draft' | 'active' | 'on-hold' | 'revoked' | 'completed' | 'entered-in-error' | 'unknown';
  intent: 'proposal' | 'plan' | 'order' | 'option';
  category?: FHIRCodeableConcept[];
  title?: FHIRString;
  description?: FHIRString;
  subject: FHIRReference;
  encounter?: FHIRReference;
  period?: FHIRPeriod;
  created?: FHIRDateTime;
  author?: FHIRReference;
  contributor?: FHIRReference[];
  careTeam?: FHIRReference[];
  addresses?: FHIRReference[];
  supportingInfo?: FHIRReference[];
  goal?: FHIRReference[];
  activity?: FHIRCarePlanActivity[];
  note?: FHIRAnnotation[];
}

export interface FHIRCarePlanActivity {
  outcomeCodeableConcept?: FHIRCodeableConcept[];
  outcomeReference?: FHIRReference[];
  progress?: FHIRAnnotation[];
  reference?: FHIRReference;
  detail?: FHIRCarePlanActivityDetail;
}

export interface FHIRCarePlanActivityDetail {
  kind?: FHIRCode;
  instantiatesCanonical?: FHIRCanonical[];
  instantiatesUri?: FHIRUri[];
  code?: FHIRCodeableConcept;
  reasonCode?: FHIRCodeableConcept[];
  reasonReference?: FHIRReference[];
  goal?: FHIRReference[];
  status: 'not-started' | 'scheduled' | 'in-progress' | 'on-hold' | 'completed' | 'cancelled' | 'stopped' | 'unknown' | 'entered-in-error';
  statusReason?: FHIRCodeableConcept;
  doNotPerform?: FHIRBoolean;
  scheduledTiming?: FHIRTiming;
  scheduledPeriod?: FHIRPeriod;
  scheduledString?: FHIRString;
  location?: FHIRReference;
  performer?: FHIRReference[];
  productCodeableConcept?: FHIRCodeableConcept;
  productReference?: FHIRReference;
  dailyAmount?: FHIRQuantity;
  quantity?: FHIRQuantity;
  description?: FHIRString;
}

// ============================================================================
// FHIR DiagnosticReport
// ============================================================================

export interface FHIRDiagnosticReport extends FHIRDomainResource {
  resourceType: 'DiagnosticReport';
  identifier?: FHIRIdentifier[];
  basedOn?: FHIRReference[];
  status: 'registered' | 'partial' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'appended' | 'cancelled' | 'entered-in-error' | 'unknown';
  category?: FHIRCodeableConcept[];
  code: FHIRCodeableConcept;
  subject?: FHIRReference;
  encounter?: FHIRReference;
  effectiveDateTime?: FHIRDateTime;
  effectivePeriod?: FHIRPeriod;
  issued?: FHIRInstant;
  performer?: FHIRReference[];
  resultsInterpreter?: FHIRReference[];
  specimen?: FHIRReference[];
  result?: FHIRReference[];
  imagingStudy?: FHIRReference[];
  media?: Array<{
    comment?: FHIRString;
    link: FHIRReference;
  }>;
  conclusion?: FHIRString;
  conclusionCode?: FHIRCodeableConcept[];
  presentedForm?: FHIRAttachment[];
}

// ============================================================================
// FHIR Bundle
// ============================================================================

export interface FHIRBundle extends FHIRResource {
  resourceType: 'Bundle';
  identifier?: FHIRIdentifier;
  type: 'document' | 'message' | 'transaction' | 'transaction-response' | 'batch' | 'batch-response' | 'history' | 'searchset' | 'collection';
  timestamp?: FHIRInstant;
  total?: FHIRUnsignedInt;
  link?: FHIRBundleLink[];
  entry?: FHIRBundleEntry[];
  signature?: FHIRSignature;
}

export interface FHIRBundleLink {
  relation: FHIRString;
  url: FHIRUri;
}

export interface FHIRBundleEntry {
  link?: FHIRBundleLink[];
  fullUrl?: FHIRUri;
  resource?: FHIRResource;
  search?: { mode?: 'match' | 'include' | 'outcome'; score?: FHIRDecimal };
  request?: {
    method: 'GET' | 'HEAD' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    url: FHIRUri;
    ifNoneMatch?: FHIRString;
    ifModifiedSince?: FHIRInstant;
    ifMatch?: FHIRString;
    ifNoneExist?: FHIRString;
  };
  response?: {
    status: FHIRString;
    location?: FHIRUri;
    etag?: FHIRString;
    lastModified?: FHIRInstant;
    outcome?: FHIRResource;
  };
}

export interface FHIRSignature {
  type: FHIRCoding[];
  when: FHIRInstant;
  who: FHIRReference;
  onBehalfOf?: FHIRReference;
  targetFormat?: FHIRCode;
  sigFormat?: FHIRCode;
  data?: FHIRBase64Binary;
}

// ============================================================================
// LOINC Codes for Cognitive Assessments
// ============================================================================

export const LOINC_CODES = {
  // Cognitive assessment instruments
  MMSE_TOTAL: { code: '72106-8', display: 'Mini-Mental State Examination (MMSE) total score' },
  MOCA_TOTAL: { code: '72172-0', display: 'Montreal Cognitive Assessment (MoCA) total score' },
  CDR_GLOBAL: { code: '88637-9', display: 'Clinical Dementia Rating (CDR) global score' },
  ADAS_COG: { code: '72105-0', display: 'ADAS-Cog total score' },
  SLUMS: { code: '72476-5', display: 'Saint Louis University Mental Status (SLUMS) total score' },

  // Cognitive domain scores
  MEMORY_SCORE: { code: '72105-0', display: 'Memory domain score' },
  ATTENTION_SCORE: { code: '72107-6', display: 'Attention and concentration score' },
  LANGUAGE_SCORE: { code: '72108-4', display: 'Language function score' },
  VISUOSPATIAL_SCORE: { code: '72109-2', display: 'Visuospatial function score' },
  EXECUTIVE_FUNCTION_SCORE: { code: '72110-0', display: 'Executive function score' },
  ORIENTATION_SCORE: { code: '72111-8', display: 'Orientation score' },

  // Activities of daily living
  ADL_SCORE: { code: '75257-7', display: 'Activities of daily living score' },
  IADL_SCORE: { code: '75260-1', display: 'Instrumental activities of daily living score' },

  // Biomarkers
  HEART_RATE: { code: '8867-4', display: 'Heart rate' },
  HEART_RATE_VARIABILITY: { code: '80404-7', display: 'Heart rate variability' },
  OXYGEN_SATURATION: { code: '2708-6', display: 'Oxygen saturation' },
  RESPIRATORY_RATE: { code: '9279-1', display: 'Respiratory rate' },
  BODY_TEMPERATURE: { code: '8310-5', display: 'Body temperature' },
  STEP_COUNT: { code: '55423-8', display: 'Step count' },
  SLEEP_DURATION: { code: '93832-4', display: 'Sleep duration' },

  // Neuropsychological
  GDS_SCORE: { code: '44249-1', display: 'Geriatric Depression Scale score' },
  NPI_TOTAL: { code: '72099-5', display: 'Neuropsychiatric Inventory total score' },

  // Functional assessments
  BARTHEL_INDEX: { code: '75940-8', display: 'Barthel Index total score' },
  FAQ_SCORE: { code: '75941-6', display: 'Functional Activities Questionnaire score' },
} as const;

// ============================================================================
// SNOMED CT Codes for Dementia Conditions
// ============================================================================

export const SNOMED_CODES = {
  // Dementia subtypes
  ALZHEIMERS_DISEASE: { code: '26929004', display: "Alzheimer's disease" },
  VASCULAR_DEMENTIA: { code: '429998004', display: 'Vascular dementia' },
  LEWY_BODY_DEMENTIA: { code: '312991009', display: 'Dementia with Lewy bodies' },
  FRONTOTEMPORAL_DEMENTIA: { code: '230270009', display: 'Frontotemporal dementia' },
  MIXED_DEMENTIA: { code: '79341000119107', display: 'Mixed dementia' },
  DEMENTIA_UNSPECIFIED: { code: '52448006', display: 'Dementia (disorder)' },
  MILD_COGNITIVE_IMPAIRMENT: { code: '386806002', display: 'Mild cognitive impairment' },

  // Severity
  MILD: { code: '255604002', display: 'Mild' },
  MODERATE: { code: '6736007', display: 'Moderate' },
  SEVERE: { code: '24484000', display: 'Severe' },

  // Related conditions
  AGITATION: { code: '24199005', display: 'Agitation' },
  WANDERING: { code: '418107008', display: 'Wandering' },
  SUNDOWNING: { code: '271795006', display: 'Sundowning' },
  SLEEP_DISTURBANCE: { code: '39898005', display: 'Sleep disturbance' },
  FALL: { code: '161898004', display: 'Falls' },
  DEPRESSION: { code: '35489007', display: 'Depressive disorder' },
  ANXIETY: { code: '197480006', display: 'Anxiety disorder' },

  // Interventions
  COGNITIVE_THERAPY: { code: '228553007', display: 'Cognitive behavioral therapy' },
  REMINISCENCE_THERAPY: { code: '710925007', display: 'Reminiscence therapy' },
  MUSIC_THERAPY: { code: '46257009', display: 'Music therapy' },
  OCCUPATIONAL_THERAPY: { code: '84478008', display: 'Occupational therapy' },
  PHYSICAL_THERAPY: { code: '91251008', display: 'Physical therapy' },
  SPEECH_THERAPY: { code: '5154007', display: 'Speech and language therapy' },
} as const;

// ============================================================================
// RxNorm Codes for Dementia Medications
// ============================================================================

export const RXNORM_CODES = {
  DONEPEZIL: { code: '135447', display: 'donepezil' },
  RIVASTIGMINE: { code: '183379', display: 'rivastigmine' },
  GALANTAMINE: { code: '284397', display: 'galantamine' },
  MEMANTINE: { code: '310436', display: 'memantine' },
  ADUCANUMAB: { code: '2571479', display: 'aducanumab' },
  LECANEMAB: { code: '2649524', display: 'lecanemab' },
  BREXPIPRAZOLE: { code: '1746940', display: 'brexpiprazole' },

  // Common supportive medications
  SERTRALINE: { code: '36437', display: 'sertraline' },
  CITALOPRAM: { code: '200371', display: 'citalopram' },
  TRAZODONE: { code: '38400', display: 'trazodone' },
  MELATONIN: { code: '196145', display: 'melatonin' },
  QUETIAPINE: { code: '51272', display: 'quetiapine' },
  RISPERIDONE: { code: '35636', display: 'risperidone' },
} as const;

// ============================================================================
// Validation Result
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  message: string;
  severity: 'error';
}

export interface ValidationWarning {
  path: string;
  message: string;
  severity: 'warning';
}

// ============================================================================
// Internal Domain Types (Gentle Reminder platform)
// ============================================================================

export interface InternalPatient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other' | 'unknown';
  email?: string;
  phone?: string;
  address?: {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
  };
  diagnosis?: string;
  diagnosisDate?: string;
  severity?: 'mild' | 'moderate' | 'severe';
  caregiverId?: string;
  clinicianId?: string;
  medications?: InternalMedication[];
  active: boolean;
}

export interface InternalMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate: string;
  endDate?: string;
  active: boolean;
  prescriberId?: string;
  rxNormCode?: string;
}

export interface InternalCognitiveScore {
  id: string;
  patientId: string;
  domain: 'memory' | 'attention' | 'language' | 'visuospatial' | 'executive' | 'orientation' | 'overall';
  score: number;
  maxScore: number;
  instrument: string;
  date: string;
  assessorId?: string;
  notes?: string;
}

export interface InternalSession {
  id: string;
  patientId: string;
  type: string;
  startTime: string;
  endTime: string;
  score?: number;
  maxScore?: number;
  domain?: string;
  completionPercentage: number;
  notes?: string;
}

export interface InternalCarePlan {
  id: string;
  patientId: string;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate?: string;
  goals: InternalGoal[];
  interventions: InternalIntervention[];
  createdBy: string;
}

export interface InternalGoal {
  id: string;
  description: string;
  targetDate?: string;
  status: 'proposed' | 'active' | 'achieved' | 'cancelled';
  measurementCriteria?: string;
}

export interface InternalIntervention {
  id: string;
  type: string;
  description: string;
  frequency: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'cancelled';
  startDate?: string;
  endDate?: string;
  notes?: string;
}

export interface InternalBiomarker {
  id: string;
  patientId: string;
  type: 'heartRate' | 'hrv' | 'oxygenSaturation' | 'respiratoryRate' | 'temperature' | 'steps' | 'sleep';
  value: number;
  unit: string;
  timestamp: string;
  source: string;
}
