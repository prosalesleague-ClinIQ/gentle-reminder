/**
 * fhir.service.ts
 *
 * FHIR R4 service orchestration layer for the Gentle Reminder API.
 * Translates internal domain data into FHIR-formatted resources using
 * the @gentle-reminder/fhir mappers and validator.
 *
 * Uses demo data patterns consistent with the rest of the platform.
 */

import {
  PatientMapper,
  ObservationMapper,
  BundleBuilder,
  MedicationMapper,
  CarePlanMapper,
  DiagnosticReportMapper,
  Validator,
  type FHIRResource,
  type FHIRBundle,
  type FHIRBundleEntry,
  type InternalPatient,
  type InternalCognitiveScore,
  type InternalMedication,
  type InternalCarePlan,
  type InternalBiomarker,
  type InternalSession,
  type ValidationResult,
  LOINC_CODES,
  SNOMED_CODES,
} from '@gentle-reminder/fhir';

// ---------------------------------------------------------------------------
// Mappers & Validator (singleton instances)
// ---------------------------------------------------------------------------

const patientMapper = new PatientMapper();
const observationMapper = new ObservationMapper();
const bundleBuilder = new BundleBuilder();
const medicationMapper = new MedicationMapper();
const carePlanMapper = new CarePlanMapper();
const diagnosticReportMapper = new DiagnosticReportMapper();
const validator = new Validator();

// ---------------------------------------------------------------------------
// Demo Data
// ---------------------------------------------------------------------------

const DEMO_PATIENTS: InternalPatient[] = [
  {
    id: 'patient-demo-001',
    firstName: 'Margaret',
    lastName: 'Chen',
    dateOfBirth: '1948-03-15',
    gender: 'female',
    email: 'margaret.chen@example.com',
    phone: '555-0101',
    address: {
      line1: '123 Memory Lane',
      city: 'Portland',
      state: 'OR',
      postalCode: '97201',
      country: 'US',
    },
    diagnosis: 'alzheimers',
    diagnosisDate: '2023-06-01',
    severity: 'mild',
    active: true,
    medications: [
      {
        id: 'med-001',
        name: 'donepezil',
        dosage: '10 mg',
        frequency: 'once daily',
        route: 'oral',
        startDate: '2023-06-15',
        active: true,
        rxNormCode: '135447',
      },
      {
        id: 'med-002',
        name: 'memantine',
        dosage: '10 mg',
        frequency: 'twice daily',
        route: 'oral',
        startDate: '2023-09-01',
        active: true,
        rxNormCode: '310436',
      },
    ],
  },
  {
    id: 'patient-demo-002',
    firstName: 'Robert',
    lastName: 'Williams',
    dateOfBirth: '1942-11-22',
    gender: 'male',
    email: 'robert.williams@example.com',
    phone: '555-0102',
    address: {
      line1: '456 Elm Street',
      city: 'Seattle',
      state: 'WA',
      postalCode: '98101',
      country: 'US',
    },
    diagnosis: 'vascular',
    diagnosisDate: '2022-03-10',
    severity: 'moderate',
    active: true,
    medications: [
      {
        id: 'med-003',
        name: 'galantamine',
        dosage: '16 mg',
        frequency: 'once daily',
        route: 'oral',
        startDate: '2022-04-01',
        active: true,
        rxNormCode: '284397',
      },
    ],
  },
];

const DEMO_COGNITIVE_SCORES: InternalCognitiveScore[] = [
  {
    id: 'score-001',
    patientId: 'patient-demo-001',
    domain: 'overall',
    score: 22,
    maxScore: 30,
    instrument: 'MoCA',
    date: '2024-01-15',
    notes: 'Mild cognitive impairment noted',
  },
  {
    id: 'score-002',
    patientId: 'patient-demo-001',
    domain: 'memory',
    score: 3,
    maxScore: 5,
    instrument: 'MoCA',
    date: '2024-01-15',
  },
  {
    id: 'score-003',
    patientId: 'patient-demo-002',
    domain: 'overall',
    score: 18,
    maxScore: 30,
    instrument: 'MoCA',
    date: '2024-01-10',
    notes: 'Moderate decline from previous assessment',
  },
];

const DEMO_BIOMARKERS: InternalBiomarker[] = [
  {
    id: 'bio-001',
    patientId: 'patient-demo-001',
    type: 'heartRate',
    value: 72,
    unit: 'bpm',
    timestamp: '2024-01-15T10:30:00Z',
    source: 'wearable',
  },
  {
    id: 'bio-002',
    patientId: 'patient-demo-001',
    type: 'oxygenSaturation',
    value: 97,
    unit: '%',
    timestamp: '2024-01-15T10:30:00Z',
    source: 'wearable',
  },
];

const DEMO_CARE_PLANS: InternalCarePlan[] = [
  {
    id: 'cp-001',
    patientId: 'patient-demo-001',
    title: 'Cognitive Stimulation Program',
    description: 'Daily cognitive exercises targeting memory and orientation',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-06-30',
    goals: [
      {
        id: 'goal-001',
        description: 'Maintain MoCA score above 20',
        targetDate: '2024-06-30',
        status: 'active',
        measurementCriteria: 'MoCA assessment every 3 months',
      },
    ],
    interventions: [
      {
        id: 'int-001',
        type: 'cognitive_therapy',
        description: 'Daily memory exercises via Gentle Reminder app',
        frequency: 'Daily',
        status: 'in-progress',
        startDate: '2024-01-01',
      },
      {
        id: 'int-002',
        type: 'reminiscence_therapy',
        description: 'Photo-based reminiscence sessions',
        frequency: '3x per week',
        status: 'in-progress',
        startDate: '2024-01-01',
      },
    ],
    createdBy: 'clinician-001',
  },
];

const DEMO_SESSIONS: InternalSession[] = [
  {
    id: 'sess-001',
    patientId: 'patient-demo-001',
    type: 'memory_exercise',
    startTime: '2024-01-15T09:00:00Z',
    endTime: '2024-01-15T09:15:00Z',
    score: 8,
    maxScore: 10,
    domain: 'memory',
    completionPercentage: 100,
  },
];

// ---------------------------------------------------------------------------
// Service Methods
// ---------------------------------------------------------------------------

/**
 * Returns a FHIR Patient resource for the given demo patient ID.
 */
export function getPatientAsFHIR(id: string) {
  const patient = DEMO_PATIENTS.find((p) => p.id === id);
  if (!patient) return null;
  return patientMapper.mapToFHIRPatient(patient);
}

/**
 * Returns a FHIR Bundle containing everything for a patient:
 * Patient resource, Observations, MedicationRequests, CarePlans, DiagnosticReports.
 */
export function getPatientEverything(id: string): FHIRBundle | null {
  const patient = DEMO_PATIENTS.find((p) => p.id === id);
  if (!patient) return null;

  const fhirPatient = patientMapper.mapToFHIRPatient(patient);

  const entries: FHIRBundleEntry[] = [
    {
      fullUrl: `urn:uuid:${patient.id}`,
      resource: fhirPatient,
      search: { mode: 'match' },
    },
  ];

  // Cognitive score observations
  const scores = DEMO_COGNITIVE_SCORES.filter((s) => s.patientId === id);
  for (const score of scores) {
    const obs = observationMapper.mapCognitiveScoreToObservation(score);
    entries.push({
      fullUrl: `urn:uuid:${score.id}`,
      resource: obs,
      search: { mode: 'include' },
    });
  }

  // Biomarker observations
  const biomarkers = DEMO_BIOMARKERS.filter((b) => b.patientId === id);
  for (const biomarker of biomarkers) {
    const obs = observationMapper.mapBiomarkerToObservation(biomarker);
    entries.push({
      fullUrl: `urn:uuid:${biomarker.id}`,
      resource: obs,
      search: { mode: 'include' },
    });
  }

  // Medication requests
  if (patient.medications) {
    for (const med of patient.medications) {
      const medReq = medicationMapper.mapToFHIRMedicationRequest(med, { reference: `Patient/${patient.id}` });
      entries.push({
        fullUrl: `urn:uuid:${med.id}`,
        resource: medReq,
        search: { mode: 'include' },
      });
    }
  }

  // Care plans
  const carePlans = DEMO_CARE_PLANS.filter((cp) => cp.patientId === id);
  for (const cp of carePlans) {
    const fhirCp = carePlanMapper.mapToFHIRCarePlan(cp, { reference: `Patient/${id}` });
    entries.push({
      fullUrl: `urn:uuid:${cp.id}`,
      resource: fhirCp,
      search: { mode: 'include' },
    });
  }

  // Diagnostic reports from cognitive scores
  if (scores.length > 0) {
    const scoreDates = scores.map((s) => s.date).sort();
    const report = diagnosticReportMapper.buildCognitiveAssessmentReport(
      { reference: `Patient/${id}` },
      scores,
      { start: scoreDates[0], end: scoreDates[scoreDates.length - 1] },
    );
    entries.push({
      fullUrl: `urn:uuid:diag-${id}`,
      resource: report,
      search: { mode: 'include' },
    });
  }

  return {
    resourceType: 'Bundle',
    type: 'searchset',
    total: entries.length,
    timestamp: new Date().toISOString(),
    entry: entries,
  };
}

/**
 * Searches Observation resources by patient, category, date, and code.
 */
export function searchObservations(params: {
  patient?: string;
  category?: string;
  date?: string;
  code?: string;
}): FHIRBundle {
  const entries: FHIRBundleEntry[] = [];

  // Cognitive scores
  let scores = [...DEMO_COGNITIVE_SCORES];
  if (params.patient) {
    scores = scores.filter((s) => s.patientId === params.patient);
  }
  if (params.date) {
    scores = scores.filter((s) => s.date >= params.date!);
  }

  if (!params.category || params.category === 'survey') {
    for (const score of scores) {
      const obs = observationMapper.mapCognitiveScoreToObservation(score);
      if (params.code && obs.code.coding?.[0]?.code !== params.code) continue;
      entries.push({
        fullUrl: `urn:uuid:${score.id}`,
        resource: obs,
        search: { mode: 'match' },
      });
    }
  }

  // Biomarkers
  if (!params.category || params.category === 'vital-signs') {
    let biomarkers = [...DEMO_BIOMARKERS];
    if (params.patient) {
      biomarkers = biomarkers.filter((b) => b.patientId === params.patient);
    }
    for (const biomarker of biomarkers) {
      const obs = observationMapper.mapBiomarkerToObservation(biomarker);
      if (params.code && obs.code.coding?.[0]?.code !== params.code) continue;
      entries.push({
        fullUrl: `urn:uuid:${biomarker.id}`,
        resource: obs,
        search: { mode: 'match' },
      });
    }
  }

  return {
    resourceType: 'Bundle',
    type: 'searchset',
    total: entries.length,
    timestamp: new Date().toISOString(),
    entry: entries,
  };
}

/**
 * Searches MedicationRequest resources by patient.
 */
export function searchMedicationRequests(params: {
  patient?: string;
}): FHIRBundle {
  const entries: FHIRBundleEntry[] = [];

  for (const patient of DEMO_PATIENTS) {
    if (params.patient && patient.id !== params.patient) continue;
    if (!patient.medications) continue;
    for (const med of patient.medications) {
      const medReq = medicationMapper.mapToFHIRMedicationRequest(med, { reference: `Patient/${patient.id}` });
      entries.push({
        fullUrl: `urn:uuid:${med.id}`,
        resource: medReq,
        search: { mode: 'match' },
      });
    }
  }

  return {
    resourceType: 'Bundle',
    type: 'searchset',
    total: entries.length,
    timestamp: new Date().toISOString(),
    entry: entries,
  };
}

/**
 * Searches CarePlan resources by patient.
 */
export function searchCarePlans(params: {
  patient?: string;
}): FHIRBundle {
  let plans = [...DEMO_CARE_PLANS];
  if (params.patient) {
    plans = plans.filter((cp) => cp.patientId === params.patient);
  }

  const entries: FHIRBundleEntry[] = plans.map((cp) => ({
    fullUrl: `urn:uuid:${cp.id}`,
    resource: carePlanMapper.mapToFHIRCarePlan(cp, { reference: `Patient/${cp.patientId}` }),
    search: { mode: 'match' as const },
  }));

  return {
    resourceType: 'Bundle',
    type: 'searchset',
    total: entries.length,
    timestamp: new Date().toISOString(),
    entry: entries,
  };
}

/**
 * Searches DiagnosticReport resources by patient.
 */
export function searchDiagnosticReports(params: {
  patient?: string;
}): FHIRBundle {
  const entries: FHIRBundleEntry[] = [];

  const patientIds = params.patient
    ? [params.patient]
    : DEMO_PATIENTS.map((p) => p.id);

  for (const pid of patientIds) {
    const scores = DEMO_COGNITIVE_SCORES.filter((s) => s.patientId === pid);
    if (scores.length > 0) {
      const scoreDates = scores.map((s) => s.date).sort();
      const report = diagnosticReportMapper.buildCognitiveAssessmentReport(
        { reference: `Patient/${pid}` },
        scores,
        { start: scoreDates[0], end: scoreDates[scoreDates.length - 1] },
      );
      entries.push({
        fullUrl: `urn:uuid:diag-${pid}`,
        resource: report,
        search: { mode: 'match' },
      });
    }
  }

  return {
    resourceType: 'Bundle',
    type: 'searchset',
    total: entries.length,
    timestamp: new Date().toISOString(),
    entry: entries,
  };
}

/**
 * Returns a FHIR CapabilityStatement describing the server's capabilities.
 */
export function getCapabilityStatement(): FHIRResource {
  return {
    resourceType: 'CapabilityStatement',
    id: 'gentle-reminder-fhir',
    meta: {
      lastUpdated: new Date().toISOString(),
    },
    status: 'active',
    date: new Date().toISOString().split('T')[0],
    kind: 'instance',
    software: {
      name: 'Gentle Reminder FHIR Server',
      version: '1.0.0',
    },
    fhirVersion: '4.0.1',
    format: ['json'],
    rest: [
      {
        mode: 'server',
        resource: [
          {
            type: 'Patient',
            interaction: [
              { code: 'read' },
              { code: 'search-type' },
            ],
            operation: [
              { name: '$everything', definition: 'http://hl7.org/fhir/OperationDefinition/Patient-everything' },
            ],
          },
          {
            type: 'Observation',
            interaction: [
              { code: 'search-type' },
            ],
            searchParam: [
              { name: 'patient', type: 'reference' },
              { name: 'category', type: 'token' },
              { name: 'date', type: 'date' },
              { name: 'code', type: 'token' },
            ],
          },
          {
            type: 'MedicationRequest',
            interaction: [
              { code: 'search-type' },
            ],
            searchParam: [
              { name: 'patient', type: 'reference' },
            ],
          },
          {
            type: 'CarePlan',
            interaction: [
              { code: 'search-type' },
            ],
            searchParam: [
              { name: 'patient', type: 'reference' },
            ],
          },
          {
            type: 'DiagnosticReport',
            interaction: [
              { code: 'search-type' },
            ],
            searchParam: [
              { name: 'patient', type: 'reference' },
            ],
          },
          {
            type: 'Bundle',
            interaction: [
              { code: 'create' },
            ],
          },
        ],
      },
    ],
  } as any;
}

/**
 * Validates a FHIR resource using the package Validator.
 */
export function validateResource(resource: FHIRResource): ValidationResult {
  return validator.validateResource(resource);
}

/**
 * Creates a FHIR transaction Bundle from an array of entries.
 */
export function createTransactionBundle(
  entries: FHIRBundleEntry[],
): FHIRBundle {
  return {
    resourceType: 'Bundle',
    type: 'transaction-response',
    timestamp: new Date().toISOString(),
    entry: entries.map((entry, index) => ({
      fullUrl: entry.fullUrl || `urn:uuid:txn-${index}`,
      resource: entry.resource,
      response: {
        status: '201 Created',
        lastModified: new Date().toISOString(),
      },
    })),
  };
}
