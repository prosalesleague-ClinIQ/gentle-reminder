/**
 * fhir.test.ts
 *
 * Comprehensive test suite for the @gentle-reminder/fhir module.
 * Tests patient mapping, observation LOINC codes, bundle structure,
 * medication RxNorm mapping, care plan building, and validation.
 */

import { PatientMapper } from '../src/PatientMapper';
import { ObservationMapper } from '../src/ObservationMapper';
import { BundleBuilder } from '../src/BundleBuilder';
import { MedicationMapper } from '../src/MedicationMapper';
import { CarePlanMapper } from '../src/CarePlanMapper';
import { DiagnosticReportMapper } from '../src/DiagnosticReportMapper';
import { Validator } from '../src/Validator';
import { LOINC_CODES, SNOMED_CODES, RXNORM_CODES } from '../src/types';
import type {
  InternalPatient,
  InternalCognitiveScore,
  InternalSession,
  InternalMedication,
  InternalCarePlan,
  InternalBiomarker,
  FHIRPatient,
  FHIRObservation,
  FHIRBundle,
} from '../src/types';

// ---------------------------------------------------------------------------
// Test fixtures
// ---------------------------------------------------------------------------

const testPatient: InternalPatient = {
  id: 'pt-001',
  firstName: 'Margaret',
  lastName: 'Thompson',
  dateOfBirth: '1948-03-15',
  gender: 'female',
  email: 'margaret@example.com',
  phone: '555-0123',
  address: {
    line1: '123 Oak Street',
    line2: 'Apt 4B',
    city: 'Springfield',
    state: 'IL',
    postalCode: '62704',
    country: 'US',
  },
  diagnosis: 'alzheimers',
  diagnosisDate: '2023-06-15',
  severity: 'mild',
  caregiverId: 'cg-001',
  clinicianId: 'dr-001',
  active: true,
};

const testCognitiveScore: InternalCognitiveScore = {
  id: 'score-001',
  patientId: 'pt-001',
  domain: 'memory',
  score: 22,
  maxScore: 30,
  instrument: 'MoCA',
  date: '2024-01-15',
  assessorId: 'dr-001',
  notes: 'Patient showed mild difficulty with delayed recall.',
};

const testSession: InternalSession = {
  id: 'session-001',
  patientId: 'pt-001',
  type: 'cognitive_therapy',
  startTime: '2024-01-15T10:00:00Z',
  endTime: '2024-01-15T10:30:00Z',
  score: 85,
  maxScore: 100,
  domain: 'memory',
  completionPercentage: 95,
  notes: 'Good engagement throughout session.',
};

const testMedication: InternalMedication = {
  id: 'med-001',
  name: 'donepezil',
  dosage: '10mg',
  frequency: 'once daily',
  route: 'oral',
  startDate: '2023-07-01',
  active: true,
  prescriberId: 'dr-001',
};

const testBiomarker: InternalBiomarker = {
  id: 'bio-001',
  patientId: 'pt-001',
  type: 'heartRate',
  value: 72,
  unit: 'bpm',
  timestamp: '2024-01-15T14:30:00Z',
  source: 'Apple Watch',
};

const testCarePlan: InternalCarePlan = {
  id: 'cp-001',
  patientId: 'pt-001',
  title: 'Dementia Care Plan - Margaret Thompson',
  description: 'Comprehensive care plan for mild Alzheimer\'s disease management',
  status: 'active',
  startDate: '2024-01-01',
  endDate: '2024-06-30',
  goals: [
    {
      id: 'goal-001',
      description: 'Maintain current cognitive function level',
      targetDate: '2024-06-30',
      status: 'active',
      measurementCriteria: 'MoCA score >= 20',
    },
    {
      id: 'goal-002',
      description: 'Improve sleep quality',
      targetDate: '2024-03-31',
      status: 'active',
    },
  ],
  interventions: [
    {
      id: 'int-001',
      type: 'cognitive_therapy',
      description: 'Weekly cognitive stimulation sessions',
      frequency: 'twice weekly',
      status: 'in-progress',
      startDate: '2024-01-01',
    },
    {
      id: 'int-002',
      type: 'music_therapy',
      description: 'Music-based reminiscence therapy',
      frequency: 'once weekly',
      status: 'in-progress',
      startDate: '2024-01-15',
    },
  ],
  createdBy: 'dr-001',
};

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('PatientMapper', () => {
  const mapper = new PatientMapper();

  test('maps internal patient to FHIR Patient', () => {
    const fhir = mapper.mapToFHIRPatient(testPatient);

    expect(fhir.resourceType).toBe('Patient');
    expect(fhir.id).toBe('pt-001');
    expect(fhir.active).toBe(true);
    expect(fhir.gender).toBe('female');
    expect(fhir.birthDate).toBe('1948-03-15');
  });

  test('includes correct name', () => {
    const fhir = mapper.mapToFHIRPatient(testPatient);

    expect(fhir.name).toHaveLength(1);
    expect(fhir.name![0].family).toBe('Thompson');
    expect(fhir.name![0].given).toEqual(['Margaret']);
    expect(fhir.name![0].use).toBe('official');
  });

  test('includes telecom for phone and email', () => {
    const fhir = mapper.mapToFHIRPatient(testPatient);

    expect(fhir.telecom).toHaveLength(2);
    const phone = fhir.telecom!.find(t => t.system === 'phone');
    const email = fhir.telecom!.find(t => t.system === 'email');
    expect(phone?.value).toBe('555-0123');
    expect(email?.value).toBe('margaret@example.com');
  });

  test('includes address', () => {
    const fhir = mapper.mapToFHIRPatient(testPatient);

    expect(fhir.address).toHaveLength(1);
    expect(fhir.address![0].city).toBe('Springfield');
    expect(fhir.address![0].state).toBe('IL');
    expect(fhir.address![0].postalCode).toBe('62704');
    expect(fhir.address![0].line).toEqual(['123 Oak Street', 'Apt 4B']);
  });

  test('includes caregiver contact', () => {
    const fhir = mapper.mapToFHIRPatient(testPatient);

    expect(fhir.contact).toHaveLength(1);
    expect(fhir.contact![0].relationship![0].text).toBe('Caregiver');
  });

  test('includes general practitioner reference', () => {
    const fhir = mapper.mapToFHIRPatient(testPatient);

    expect(fhir.generalPractitioner).toHaveLength(1);
    expect(fhir.generalPractitioner![0].reference).toBe('Practitioner/dr-001');
  });

  test('round-trips patient mapping', () => {
    const fhir = mapper.mapToFHIRPatient(testPatient);
    const roundTripped = mapper.mapFromFHIRPatient(fhir);

    expect(roundTripped.firstName).toBe('Margaret');
    expect(roundTripped.lastName).toBe('Thompson');
    expect(roundTripped.dateOfBirth).toBe('1948-03-15');
    expect(roundTripped.gender).toBe('female');
    expect(roundTripped.phone).toBe('555-0123');
    expect(roundTripped.email).toBe('margaret@example.com');
    expect(roundTripped.active).toBe(true);
  });

  test('builds patient identifier with system', () => {
    const id = mapper.buildPatientIdentifier('pt-001', 'https://example.com/ids');

    expect(id.use).toBe('official');
    expect(id.system).toBe('https://example.com/ids');
    expect(id.value).toBe('pt-001');
    expect(id.type?.coding?.[0].code).toBe('MR');
  });
});

describe('ObservationMapper', () => {
  const mapper = new ObservationMapper();

  test('maps cognitive score to Observation with LOINC code', () => {
    const obs = mapper.mapCognitiveScoreToObservation(testCognitiveScore);

    expect(obs.resourceType).toBe('Observation');
    expect(obs.status).toBe('final');
    expect(obs.valueQuantity?.value).toBe(22);
  });

  test('uses correct LOINC code for MoCA instrument', () => {
    const obs = mapper.mapCognitiveScoreToObservation(testCognitiveScore);

    const coding = obs.code.coding?.[0];
    expect(coding?.system).toBe('http://loinc.org');
    expect(coding?.code).toBe(LOINC_CODES.MOCA_TOTAL.code);
  });

  test('includes observation components', () => {
    const obs = mapper.mapCognitiveScoreToObservation(testCognitiveScore);

    expect(obs.component).toBeDefined();
    expect(obs.component!.length).toBeGreaterThanOrEqual(3);
  });

  test('maps biomarker to Observation', () => {
    const obs = mapper.mapBiomarkerToObservation(testBiomarker);

    expect(obs.resourceType).toBe('Observation');
    expect(obs.status).toBe('final');
    expect(obs.valueQuantity?.value).toBe(72);
    expect(obs.code.coding?.[0].code).toBe(LOINC_CODES.HEART_RATE.code);
  });

  test('includes reference range for heart rate', () => {
    const obs = mapper.mapBiomarkerToObservation(testBiomarker);

    expect(obs.referenceRange).toBeDefined();
    expect(obs.referenceRange![0].low?.value).toBe(60);
    expect(obs.referenceRange![0].high?.value).toBe(100);
  });

  test('maps session to Observation', () => {
    const obs = mapper.mapSessionToObservation(testSession);

    expect(obs.resourceType).toBe('Observation');
    expect(obs.effectivePeriod?.start).toBe('2024-01-15T10:00:00Z');
    expect(obs.effectivePeriod?.end).toBe('2024-01-15T10:30:00Z');
    expect(obs.valueQuantity?.value).toBe(85);
  });

  test('builds correct quantity', () => {
    const qty = mapper.buildQuantity(72, 'bpm', 'http://unitsofmeasure.org');

    expect(qty.value).toBe(72);
    expect(qty.unit).toBe('bpm');
    expect(qty.system).toBe('http://unitsofmeasure.org');
  });
});

describe('BundleBuilder', () => {
  const builder = new BundleBuilder();
  const patientMapper = new PatientMapper();

  test('builds patient bundle with correct structure', () => {
    const fhirPatient = patientMapper.mapToFHIRPatient(testPatient);
    const bundle = builder.buildPatientBundle(fhirPatient, [], []);

    expect(bundle.resourceType).toBe('Bundle');
    expect(bundle.type).toBe('collection');
    expect(bundle.entry).toBeDefined();
    expect(bundle.entry!.length).toBe(1); // just patient
    expect(bundle.entry![0].resource?.resourceType).toBe('Patient');
  });

  test('builds cognitive report bundle', () => {
    const bundle = builder.buildCognitiveReportBundle(
      testPatient,
      [testCognitiveScore],
      [testSession]
    );

    expect(bundle.type).toBe('collection');
    // Patient + 1 score + 1 session + summary = 4
    expect(bundle.entry!.length).toBe(4);
    expect(bundle.total).toBe(4);
  });

  test('builds medication bundle', () => {
    const bundle = builder.buildMedicationBundle(testPatient, [testMedication]);

    expect(bundle.type).toBe('collection');
    expect(bundle.entry!.length).toBe(2); // patient + medication
    const medEntry = bundle.entry!.find(e => e.resource?.resourceType === 'MedicationRequest');
    expect(medEntry).toBeDefined();
  });

  test('builds transaction bundle with request elements', () => {
    const fhirPatient = patientMapper.mapToFHIRPatient(testPatient);
    const bundle = builder.buildTransactionBundle([fhirPatient]);

    expect(bundle.type).toBe('transaction');
    expect(bundle.entry![0].request).toBeDefined();
    expect(bundle.entry![0].request?.method).toBe('PUT');
    expect(bundle.entry![0].request?.url).toBe('Patient/pt-001');
  });

  test('validates valid bundle', () => {
    const fhirPatient = patientMapper.mapToFHIRPatient(testPatient);
    const bundle = builder.buildPatientBundle(fhirPatient, [], []);
    const result = builder.validateBundle(bundle);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('addEntry and removeEntry work correctly', () => {
    const fhirPatient = patientMapper.mapToFHIRPatient(testPatient);
    const bundle = builder.buildPatientBundle(fhirPatient, [], []);

    expect(bundle.entry!.length).toBe(1);
    builder.removeEntry(bundle, 'pt-001');
    expect(bundle.entry!.length).toBe(0);
  });
});

describe('MedicationMapper', () => {
  const mapper = new MedicationMapper();

  test('maps medication to MedicationRequest', () => {
    const medReq = mapper.mapToFHIRMedicationRequest(testMedication);

    expect(medReq.resourceType).toBe('MedicationRequest');
    expect(medReq.status).toBe('active');
    expect(medReq.intent).toBe('order');
  });

  test('looks up RxNorm code for donepezil', () => {
    const medReq = mapper.mapToFHIRMedicationRequest(testMedication);

    const coding = medReq.medicationCodeableConcept?.coding?.[0];
    expect(coding?.system).toBe('http://www.nlm.nih.gov/research/umls/rxnorm');
    expect(coding?.code).toBe(RXNORM_CODES.DONEPEZIL.code);
  });

  test('builds correct dosage', () => {
    const dosage = mapper.buildDosage('10mg', 'once daily', 'oral');

    expect(dosage.text).toContain('10mg');
    expect(dosage.doseAndRate).toBeDefined();
    expect(dosage.doseAndRate![0].doseQuantity?.value).toBe(10);
    expect(dosage.doseAndRate![0].doseQuantity?.unit).toBe('mg');
    expect(dosage.timing?.repeat?.frequency).toBe(1);
    expect(dosage.timing?.repeat?.period).toBe(1);
    expect(dosage.route?.coding?.[0].code).toBe('26643006'); // oral SNOMED
  });

  test('looks up RxNorm by name', () => {
    const result = mapper.lookupRxNorm('memantine');
    expect(result).not.toBeNull();
    expect(result!.code).toBe(RXNORM_CODES.MEMANTINE.code);
  });

  test('returns null for unknown medication', () => {
    const result = mapper.lookupRxNorm('unknownmed12345');
    expect(result).toBeNull();
  });

  test('includes dementia reason code for cholinesterase inhibitors', () => {
    const medReq = mapper.mapToFHIRMedicationRequest(testMedication);

    expect(medReq.reasonCode).toBeDefined();
    expect(medReq.reasonCode![0].coding?.[0].code).toBe('52448006'); // Dementia SNOMED
  });
});

describe('CarePlanMapper', () => {
  const mapper = new CarePlanMapper();
  const patientRef = { reference: 'Patient/pt-001', display: 'Margaret Thompson' };

  test('maps care plan to FHIR CarePlan', () => {
    const fhirCP = mapper.mapToFHIRCarePlan(testCarePlan, patientRef);

    expect(fhirCP.resourceType).toBe('CarePlan');
    expect(fhirCP.status).toBe('active');
    expect(fhirCP.intent).toBe('plan');
    expect(fhirCP.title).toBe('Dementia Care Plan - Margaret Thompson');
  });

  test('includes activities from interventions', () => {
    const fhirCP = mapper.mapToFHIRCarePlan(testCarePlan, patientRef);

    expect(fhirCP.activity).toHaveLength(2);
    expect(fhirCP.activity![0].detail?.status).toBe('in-progress');
  });

  test('maps intervention types to SNOMED codes', () => {
    const fhirCP = mapper.mapToFHIRCarePlan(testCarePlan, patientRef);

    const musicActivity = fhirCP.activity![1];
    const snomedCoding = musicActivity.detail?.code?.coding?.[0];
    expect(snomedCoding?.system).toBe('http://snomed.info/sct');
    expect(snomedCoding?.code).toBe(SNOMED_CODES.MUSIC_THERAPY.code);
  });

  test('includes goals', () => {
    const fhirCP = mapper.mapToFHIRCarePlan(testCarePlan, patientRef);

    expect(fhirCP.goal).toHaveLength(2);
    expect(fhirCP.goal![0].display).toBe('Maintain current cognitive function level');
  });
});

describe('DiagnosticReportMapper', () => {
  const mapper = new DiagnosticReportMapper();
  const patientRef = { reference: 'Patient/pt-001', display: 'Margaret Thompson' };

  test('builds cognitive assessment report', () => {
    const report = mapper.buildCognitiveAssessmentReport(
      patientRef,
      [testCognitiveScore],
      { start: '2024-01-01', end: '2024-01-31' }
    );

    expect(report.resourceType).toBe('DiagnosticReport');
    expect(report.status).toBe('final');
    expect(report.result).toHaveLength(1);
    expect(report.conclusion).toBeTruthy();
  });

  test('builds decline report with SNOMED codes', () => {
    const trends = [
      {
        domain: 'memory',
        direction: 'declining' as const,
        slopePerMonth: -2.5,
        significance: true,
        startScore: 25,
        endScore: 20,
        periodMonths: 6,
      },
    ];

    const report = mapper.buildDeclineReport(
      patientRef,
      trends,
      { start: '2023-07-01', end: '2024-01-01' },
      'alzheimers'
    );

    expect(report.resourceType).toBe('DiagnosticReport');
    expect(report.conclusionCode).toBeDefined();
    const snomedCode = report.conclusionCode!.find(
      c => c.coding?.[0].code === SNOMED_CODES.ALZHEIMERS_DISEASE.code
    );
    expect(snomedCode).toBeDefined();
  });
});

describe('Validator', () => {
  const validator = new Validator();

  test('validates valid Patient', () => {
    const patientMapper = new PatientMapper();
    const fhirPatient = patientMapper.mapToFHIRPatient(testPatient);
    const result = validator.validatePatient(fhirPatient);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  test('catches missing Observation status', () => {
    const obs: FHIRObservation = {
      resourceType: 'Observation',
      status: undefined as any,
      code: { coding: [{ system: 'http://loinc.org', code: '8867-4' }] },
    };
    const result = validator.validateObservation(obs);

    expect(result.valid).toBe(false);
    const statusError = result.errors.find(e => e.path === 'status');
    expect(statusError).toBeDefined();
  });

  test('catches missing Observation code', () => {
    const obs: FHIRObservation = {
      resourceType: 'Observation',
      status: 'final',
      code: undefined as any,
    };
    const result = validator.validateObservation(obs);

    expect(result.valid).toBe(false);
    const codeError = result.errors.find(e => e.path === 'code');
    expect(codeError).toBeDefined();
  });

  test('validates generic resource dispatch', () => {
    const patientMapper = new PatientMapper();
    const fhirPatient = patientMapper.mapToFHIRPatient(testPatient);
    const result = validator.validateResource(fhirPatient);

    expect(result.valid).toBe(true);
  });

  test('catches null resource', () => {
    const result = validator.validateResource(null as any);

    expect(result.valid).toBe(false);
    expect(result.errors[0].message).toContain('null or undefined');
  });

  test('catches missing resourceType', () => {
    const result = validator.validateResource({} as any);

    expect(result.valid).toBe(false);
    expect(result.errors[0].path).toBe('resourceType');
  });

  test('catches invalid Patient gender', () => {
    const patient: FHIRPatient = {
      resourceType: 'Patient',
      gender: 'invalid' as any,
      name: [{ family: 'Test' }],
      birthDate: '2000-01-01',
    };
    const result = validator.validatePatient(patient);

    const genderError = result.errors.find(e => e.path === 'gender');
    expect(genderError).toBeDefined();
  });

  test('catches invalid date format', () => {
    const patient: FHIRPatient = {
      resourceType: 'Patient',
      birthDate: 'not-a-date',
      name: [{ family: 'Test' }],
    };
    const result = validator.validatePatient(patient);

    const dateError = result.errors.find(e => e.path === 'birthDate');
    expect(dateError).toBeDefined();
  });
});

describe('Code System Constants', () => {
  test('LOINC_CODES has expected cognitive assessment codes', () => {
    expect(LOINC_CODES.MMSE_TOTAL.code).toBe('72106-8');
    expect(LOINC_CODES.MOCA_TOTAL.code).toBe('72172-0');
    expect(LOINC_CODES.CDR_GLOBAL.code).toBe('88637-9');
    expect(LOINC_CODES.HEART_RATE.code).toBe('8867-4');
  });

  test('SNOMED_CODES has expected dementia codes', () => {
    expect(SNOMED_CODES.ALZHEIMERS_DISEASE.code).toBe('26929004');
    expect(SNOMED_CODES.VASCULAR_DEMENTIA.code).toBe('429998004');
    expect(SNOMED_CODES.LEWY_BODY_DEMENTIA.code).toBe('312991009');
    expect(SNOMED_CODES.MILD_COGNITIVE_IMPAIRMENT.code).toBe('386806002');
  });

  test('RXNORM_CODES has expected medication codes', () => {
    expect(RXNORM_CODES.DONEPEZIL.code).toBe('135447');
    expect(RXNORM_CODES.MEMANTINE.code).toBe('310436');
    expect(RXNORM_CODES.RIVASTIGMINE.code).toBe('183379');
    expect(RXNORM_CODES.GALANTAMINE.code).toBe('284397');
  });
});
