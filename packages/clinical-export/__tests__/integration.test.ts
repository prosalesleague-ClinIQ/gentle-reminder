/**
 * Clinical export integration tests.
 *
 * End-to-end tests for CSV/JSON/FHIR export, de-identification,
 * and cohort building with complex enrollment criteria.
 */
import { DataExporter } from '../src/DataExporter';
import { Deidentifier } from '../src/Deidentifier';
import { CohortBuilder } from '../src/CohortBuilder';
import type {
  DeidentifiedRecord,
  ExportConfig,
  PatientRecord,
  CohortCriteria,
} from '../src/types';

// ---------------------------------------------------------------------------
// Test data factory
// ---------------------------------------------------------------------------
function makePatient(overrides: Partial<PatientRecord> = {}): PatientRecord {
  return {
    id: 'patient-001',
    name: 'Margaret Thompson',
    email: 'margaret@example.com',
    dateOfBirth: new Date('1948-03-15'),
    city: 'Dublin',
    state: 'Leinster',
    gender: 'female',
    cognitiveStage: 'mild',
    diagnosisDate: new Date('2023-06-01'),
    sessions: [
      { date: '2025-01-15', overallScore: 72, orientation: 80, identity: 70, memory: 65, responseTimeMs: 3200, durationMs: 1200000 },
      { date: '2025-02-01', overallScore: 75, orientation: 82, identity: 72, memory: 68, responseTimeMs: 3000, durationMs: 1100000 },
      { date: '2025-03-01', overallScore: 78, orientation: 85, identity: 74, memory: 72, responseTimeMs: 2800, durationMs: 1050000 },
    ],
    biomarkers: [
      { date: '2025-01-15', type: 'cortisol', value: 15.2, unit: 'ug/dL' },
      { date: '2025-03-01', type: 'cortisol', value: 14.1, unit: 'ug/dL' },
    ],
    ...overrides,
  };
}

function makeDeidentified(overrides: Partial<DeidentifiedRecord> = {}): DeidentifiedRecord {
  return {
    subjectId: 'abc123',
    age: 77,
    gender: 'female',
    cognitiveStage: 'mild',
    scores: [
      { date: '2025-01-15', overallScore: 72, orientation: 80, identity: 70, memory: 65, responseTimeMs: 3200, sessionDurationMs: 1200000 },
      { date: '2025-02-01', overallScore: 75, orientation: 82, identity: 72, memory: 68, responseTimeMs: 3000, sessionDurationMs: 1100000 },
      { date: '2025-03-01', overallScore: 78, orientation: 85, identity: 74, memory: 72, responseTimeMs: 2800, sessionDurationMs: 1050000 },
    ],
    biomarkers: [
      { date: '2025-01-15', type: 'cortisol', value: 15.2, unit: 'ug/dL' },
      { date: '2025-03-01', type: 'cortisol', value: 14.1, unit: 'ug/dL' },
    ],
    ...overrides,
  };
}

const baseConfig: ExportConfig = {
  format: 'csv',
  patientIds: [],
  includeRaw: false,
  deidentify: true,
};

// ---------------------------------------------------------------------------
// 1. CSV Export
// ---------------------------------------------------------------------------
describe('CSV Export', () => {
  it('exports multiple patients to CSV with headers', () => {
    const data = [
      makeDeidentified({ subjectId: 'P001' }),
      makeDeidentified({ subjectId: 'P002' }),
    ];

    const csv = DataExporter.exportToCSV(data, baseConfig);
    const lines = csv.split('\n');

    // First line is headers
    expect(lines[0]).toContain('subject_id');
    expect(lines[0]).toContain('cognitive_score');
    expect(lines[0]).toContain('orientation');

    // Each patient has 3 scores, so 6 data lines + 1 header = 7 total
    expect(lines.length).toBe(7);
  });

  it('includes all score fields in each CSV row', () => {
    const data = [makeDeidentified()];
    const csv = DataExporter.exportToCSV(data, baseConfig);
    const dataLine = csv.split('\n')[1];
    const fields = dataLine.split(',');

    expect(fields[0]).toBe('abc123'); // subject_id
    expect(fields[1]).toBe('2025-01-15'); // date
    expect(fields[2]).toBe('72'); // cognitive_score
    expect(fields[3]).toBe('80'); // orientation
  });

  it('filters by date range in CSV export', () => {
    const data = [makeDeidentified()];
    const config: ExportConfig = {
      ...baseConfig,
      dateRange: {
        start: new Date('2025-02-01'),
        end: new Date('2025-02-28'),
      },
    };

    const csv = DataExporter.exportToCSV(data, config);
    const lines = csv.split('\n');

    // Only 1 score falls in February + 1 header = 2 lines
    expect(lines.length).toBe(2);
    expect(lines[1]).toContain('2025-02-01');
  });

  it('filters by patient IDs', () => {
    const data = [
      makeDeidentified({ subjectId: 'P001' }),
      makeDeidentified({ subjectId: 'P002' }),
    ];
    const config: ExportConfig = {
      ...baseConfig,
      patientIds: ['P001'],
    };

    const csv = DataExporter.exportToCSV(data, config);
    expect(csv).toContain('P001');
    expect(csv).not.toContain('P002');
  });
});

// ---------------------------------------------------------------------------
// 2. FHIR Bundle Export
// ---------------------------------------------------------------------------
describe('FHIR Export', () => {
  it('exports as a FHIR Bundle with correct resourceType', () => {
    const data = [makeDeidentified()];
    const bundle = DataExporter.exportToFHIR(data, baseConfig) as any;

    expect(bundle.resourceType).toBe('Bundle');
    expect(bundle.type).toBe('collection');
    expect(bundle.total).toBe(3); // 3 scores
  });

  it('each entry is a FHIR Observation resource', () => {
    const data = [makeDeidentified()];
    const bundle = DataExporter.exportToFHIR(data, baseConfig) as any;

    const entry = bundle.entry[0];
    expect(entry.resource.resourceType).toBe('Observation');
    expect(entry.resource.status).toBe('final');
  });

  it('includes subject reference with de-identified ID', () => {
    const data = [makeDeidentified({ subjectId: 'anon-123' })];
    const bundle = DataExporter.exportToFHIR(data, baseConfig) as any;

    const entry = bundle.entry[0];
    expect(entry.resource.subject.reference).toBe('Patient/anon-123');
  });

  it('includes cognitive score as valueQuantity', () => {
    const data = [makeDeidentified()];
    const bundle = DataExporter.exportToFHIR(data, baseConfig) as any;

    const entry = bundle.entry[0];
    expect(entry.resource.valueQuantity.value).toBe(72);
    expect(entry.resource.valueQuantity.unit).toBe('score');
  });

  it('includes orientation, identity, memory as components', () => {
    const data = [makeDeidentified()];
    const bundle = DataExporter.exportToFHIR(data, baseConfig) as any;

    const components = bundle.entry[0].resource.component;
    const componentTexts = components.map((c: any) => c.code.text);

    expect(componentTexts).toContain('orientation');
    expect(componentTexts).toContain('identity');
    expect(componentTexts).toContain('memory');
  });

  it('uses the correct FHIR coding system', () => {
    const data = [makeDeidentified()];
    const bundle = DataExporter.exportToFHIR(data, baseConfig) as any;

    const coding = bundle.entry[0].resource.code.coding[0];
    expect(coding.system).toContain('gentle-reminder');
    expect(coding.code).toBe('cognitive-score');
  });

  it('applies date range filter to FHIR export', () => {
    const data = [makeDeidentified()];
    const config: ExportConfig = {
      ...baseConfig,
      dateRange: { start: new Date('2025-03-01'), end: new Date('2025-03-31') },
    };

    const bundle = DataExporter.exportToFHIR(data, config) as any;
    expect(bundle.total).toBe(1);
    expect(bundle.entry[0].resource.effectiveDateTime).toBe('2025-03-01');
  });
});

// ---------------------------------------------------------------------------
// 3. De-identification
// ---------------------------------------------------------------------------
describe('Deidentification', () => {
  const SALT = 'test-salt-2025';

  it('generates a deterministic subject ID from patient + salt', () => {
    const id1 = Deidentifier.generateSubjectId('patient-001', 'trial-A', SALT);
    const id2 = Deidentifier.generateSubjectId('patient-001', 'trial-A', SALT);
    expect(id1).toBe(id2);
  });

  it('generates different IDs for different patients', () => {
    const id1 = Deidentifier.generateSubjectId('patient-001', 'trial-A', SALT);
    const id2 = Deidentifier.generateSubjectId('patient-002', 'trial-A', SALT);
    expect(id1).not.toBe(id2);
  });

  it('generates different IDs with different salts', () => {
    const id1 = Deidentifier.generateSubjectId('patient-001', 'trial-A', 'salt-1');
    const id2 = Deidentifier.generateSubjectId('patient-001', 'trial-A', 'salt-2');
    expect(id1).not.toBe(id2);
  });

  it('removes name and email from de-identified record', () => {
    const patient = makePatient();
    const deidentified = Deidentifier.deidentifyPatient(patient, SALT);

    expect(deidentified).not.toHaveProperty('name');
    expect(deidentified).not.toHaveProperty('email');
    expect(deidentified).not.toHaveProperty('city');
    expect(deidentified).not.toHaveProperty('dateOfBirth');
  });

  it('preserves age (not exact DOB)', () => {
    const patient = makePatient({ dateOfBirth: new Date('1948-03-15') });
    const deidentified = Deidentifier.deidentifyPatient(patient, SALT);

    expect(deidentified.age).toBeGreaterThanOrEqual(75);
    expect(deidentified.age).toBeLessThanOrEqual(80);
  });

  it('preserves cognitive scores and biomarkers', () => {
    const patient = makePatient();
    const deidentified = Deidentifier.deidentifyPatient(patient, SALT);

    expect(deidentified.scores).toHaveLength(3);
    expect(deidentified.scores[0].overallScore).toBe(72);
    expect(deidentified.biomarkers).toHaveLength(2);
  });

  it('preserves cognitive stage', () => {
    const patient = makePatient({ cognitiveStage: 'moderate' });
    const deidentified = Deidentifier.deidentifyPatient(patient, SALT);
    expect(deidentified.cognitiveStage).toBe('moderate');
  });
});

// ---------------------------------------------------------------------------
// 4. Cohort Building
// ---------------------------------------------------------------------------
describe('Cohort Building', () => {
  const patients = [
    makePatient({ id: 'p1', cognitiveStage: 'mild', dateOfBirth: new Date('1950-01-01') }),
    makePatient({ id: 'p2', cognitiveStage: 'moderate', dateOfBirth: new Date('1940-01-01') }),
    makePatient({ id: 'p3', cognitiveStage: 'mild', dateOfBirth: new Date('1960-01-01') }),
    makePatient({
      id: 'p4',
      cognitiveStage: 'severe',
      dateOfBirth: new Date('1935-01-01'),
      sessions: [], // no sessions
    }),
  ];

  const cohortMeta = {
    id: 'cohort-1',
    name: 'Mild Cognitive Impairment Study',
    startDate: new Date('2025-01-01'),
    endDate: new Date('2025-12-31'),
  };

  it('filters patients by cognitive stage', () => {
    const criteria: CohortCriteria = { cognitiveStages: ['mild'] };
    const cohort = CohortBuilder.buildCohort(patients, criteria, cohortMeta);

    expect(cohort.patients).toContain('p1');
    expect(cohort.patients).toContain('p3');
    expect(cohort.patients).not.toContain('p2');
    expect(cohort.patients).not.toContain('p4');
  });

  it('filters patients by age range', () => {
    const criteria: CohortCriteria = { minAge: 70, maxAge: 80 };
    const cohort = CohortBuilder.buildCohort(patients, criteria, cohortMeta);

    // p1 (born 1950) is ~75, p3 (born 1960) is ~65 -> excluded
    expect(cohort.patients).toContain('p1');
    expect(cohort.patients).not.toContain('p3');
  });

  it('filters patients by minimum sessions', () => {
    const criteria: CohortCriteria = { minSessions: 1 };
    const cohort = CohortBuilder.buildCohort(patients, criteria, cohortMeta);

    // p4 has no sessions
    expect(cohort.patients).not.toContain('p4');
    expect(cohort.patients).toContain('p1');
  });

  it('applies multiple criteria simultaneously', () => {
    const criteria: CohortCriteria = {
      cognitiveStages: ['mild'],
      minSessions: 1,
      minAge: 60,
    };
    const cohort = CohortBuilder.buildCohort(patients, criteria, cohortMeta);

    // p1: mild, 3 sessions, age ~75 -> included
    // p3: mild, 3 sessions, age ~65 -> included
    expect(cohort.patients).toContain('p1');
    expect(cohort.patients).toContain('p3');
    expect(cohort.patients).not.toContain('p2');
  });

  it('returns empty cohort when no patients match', () => {
    const criteria: CohortCriteria = { cognitiveStages: ['non_existent'] };
    const cohort = CohortBuilder.buildCohort(patients, criteria, cohortMeta);
    expect(cohort.patients).toHaveLength(0);
  });

  it('preserves cohort metadata', () => {
    const criteria: CohortCriteria = {};
    const cohort = CohortBuilder.buildCohort(patients, criteria, cohortMeta);

    expect(cohort.id).toBe('cohort-1');
    expect(cohort.name).toBe('Mild Cognitive Impairment Study');
    expect(cohort.startDate).toEqual(cohortMeta.startDate);
    expect(cohort.endDate).toEqual(cohortMeta.endDate);
  });

  it('computes outcome measures with cognitive score change', () => {
    const patient = makePatient();
    const baseline = new Date('2025-01-31');
    const measures = CohortBuilder.computeOutcomeMeasures(patient, baseline);

    const cogMeasure = measures.find((m) => m.type === 'cognitive_score');
    expect(cogMeasure).toBeDefined();
    expect(cogMeasure!.baseline).toBeLessThanOrEqual(cogMeasure!.current);
    expect(cogMeasure!.change).toBeGreaterThanOrEqual(0);
  });

  it('computes engagement rate as sessions per week', () => {
    const patient = makePatient();
    const baseline = new Date('2025-01-31');
    const measures = CohortBuilder.computeOutcomeMeasures(patient, baseline);

    const engagementMeasure = measures.find((m) => m.type === 'engagement_rate');
    expect(engagementMeasure).toBeDefined();
    expect(engagementMeasure!.current).toBeGreaterThan(0);
  });

  it('computes biomarker trends', () => {
    const patient = makePatient();
    const baseline = new Date('2025-01-31');
    const measures = CohortBuilder.computeOutcomeMeasures(patient, baseline);

    const biomarkerMeasure = measures.find((m) => m.type === 'biomarker_trend');
    // Patient has cortisol readings before and after baseline
    expect(biomarkerMeasure).toBeDefined();
  });
});
