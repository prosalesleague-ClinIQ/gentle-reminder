import { DataExporter } from '../src/DataExporter';
import { Deidentifier } from '../src/Deidentifier';
import { CohortBuilder } from '../src/CohortBuilder';
import {
  DeidentifiedRecord,
  ExportConfig,
  PatientRecord,
  CohortCriteria,
} from '../src/types';

// ── Test Fixtures ──────────────────────────────────────────────

function makePatient(overrides: Partial<PatientRecord> = {}): PatientRecord {
  return {
    id: 'patient-001',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    dateOfBirth: new Date('1950-06-15'),
    city: 'Portland',
    state: 'OR',
    gender: 'female',
    cognitiveStage: 'mild',
    diagnosisDate: new Date('2023-01-10'),
    sessions: [
      {
        date: '2024-01-15',
        overallScore: 72,
        orientation: 80,
        identity: 70,
        memory: 65,
        responseTimeMs: 1200,
        durationMs: 300000,
      },
      {
        date: '2024-02-15',
        overallScore: 75,
        orientation: 82,
        identity: 72,
        memory: 68,
        responseTimeMs: 1100,
        durationMs: 280000,
      },
    ],
    biomarkers: [
      { date: '2024-01-15', type: 'speech_rate', value: 120, unit: 'wpm' },
      { date: '2024-02-15', type: 'speech_rate', value: 125, unit: 'wpm' },
    ],
    ...overrides,
  };
}

function makeDeidentifiedRecord(
  overrides: Partial<DeidentifiedRecord> = {}
): DeidentifiedRecord {
  return {
    subjectId: 'abc123def456',
    age: 74,
    gender: 'female',
    cognitiveStage: 'mild',
    scores: [
      {
        date: '2024-01-15',
        overallScore: 72,
        orientation: 80,
        identity: 70,
        memory: 65,
        responseTimeMs: 1200,
        sessionDurationMs: 300000,
      },
      {
        date: '2024-02-15',
        overallScore: 75,
        orientation: 82,
        identity: 72,
        memory: 68,
        responseTimeMs: 1100,
        sessionDurationMs: 280000,
      },
    ],
    biomarkers: [
      { date: '2024-01-15', type: 'speech_rate', value: 120, unit: 'wpm' },
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

// ── CSV Export Tests ────────────────────────────────────────────

describe('DataExporter.exportToCSV', () => {
  it('should produce valid CSV with correct headers', () => {
    const records = [makeDeidentifiedRecord()];
    const csv = DataExporter.exportToCSV(records, baseConfig);
    const lines = csv.split('\n');

    expect(lines[0]).toBe(
      'subject_id,date,cognitive_score,orientation,identity,memory,response_time_ms,session_duration'
    );
    expect(lines.length).toBe(3); // header + 2 score rows
  });

  it('should include correct data values in CSV rows', () => {
    const records = [makeDeidentifiedRecord()];
    const csv = DataExporter.exportToCSV(records, baseConfig);
    const lines = csv.split('\n');
    const row1 = lines[1].split(',');

    expect(row1[0]).toBe('abc123def456'); // subject_id
    expect(row1[1]).toBe('2024-01-15'); // date
    expect(row1[2]).toBe('72'); // cognitive_score
    expect(row1[3]).toBe('80'); // orientation
  });

  it('should filter by date range', () => {
    const records = [makeDeidentifiedRecord()];
    const csv = DataExporter.exportToCSV(records, {
      ...baseConfig,
      dateRange: {
        start: new Date('2024-02-01'),
        end: new Date('2024-03-01'),
      },
    });
    const lines = csv.split('\n');
    expect(lines.length).toBe(2); // header + 1 row (only Feb)
    expect(lines[1]).toContain('2024-02-15');
  });
});

// ── JSON Export Tests ──────────────────────────────────────────

describe('DataExporter.exportToJSON', () => {
  it('should produce valid JSON with all fields', () => {
    const records = [makeDeidentifiedRecord()];
    const json = DataExporter.exportToJSON(records, baseConfig);
    const parsed = JSON.parse(json);

    expect(Array.isArray(parsed)).toBe(true);
    expect(parsed[0].subjectId).toBe('abc123def456');
    expect(parsed[0].scores).toHaveLength(2);
  });

  it('should exclude biomarkers when includeRaw is false', () => {
    const records = [makeDeidentifiedRecord()];
    const json = DataExporter.exportToJSON(records, {
      ...baseConfig,
      includeRaw: false,
    });
    const parsed = JSON.parse(json);
    expect(parsed[0].biomarkers).toBeUndefined();
  });

  it('should include biomarkers when includeRaw is true', () => {
    const records = [makeDeidentifiedRecord()];
    const json = DataExporter.exportToJSON(records, {
      ...baseConfig,
      includeRaw: true,
    });
    const parsed = JSON.parse(json);
    expect(parsed[0].biomarkers).toBeDefined();
    expect(parsed[0].biomarkers).toHaveLength(1);
  });
});

// ── FHIR Export Tests ──────────────────────────────────────────

describe('DataExporter.exportToFHIR', () => {
  it('should produce a FHIR Bundle with Observation resources', () => {
    const records = [makeDeidentifiedRecord()];
    const bundle = DataExporter.exportToFHIR(records, baseConfig) as any;

    expect(bundle.resourceType).toBe('Bundle');
    expect(bundle.type).toBe('collection');
    expect(bundle.total).toBe(2);
    expect(bundle.entry).toHaveLength(2);
  });

  it('should have correct FHIR Observation structure', () => {
    const records = [makeDeidentifiedRecord()];
    const bundle = DataExporter.exportToFHIR(records, baseConfig) as any;
    const obs = bundle.entry[0].resource;

    expect(obs.resourceType).toBe('Observation');
    expect(obs.status).toBe('final');
    expect(obs.subject.reference).toBe('Patient/abc123def456');
    expect(obs.valueQuantity.value).toBe(72);
    expect(obs.component).toBeDefined();
    expect(obs.component.length).toBeGreaterThan(0);
  });
});

// ── Deidentification Tests ─────────────────────────────────────

describe('Deidentifier', () => {
  it('should remove PII (name, email, city, exact DOB)', () => {
    const patient = makePatient();
    const deidentified = Deidentifier.deidentifyPatient(patient, 'test-salt');

    // Should NOT contain PII
    const json = JSON.stringify(deidentified);
    expect(json).not.toContain('Alice');
    expect(json).not.toContain('Johnson');
    expect(json).not.toContain('alice@example.com');
    expect(json).not.toContain('Portland');
    expect(json).not.toContain('1950-06-15');

    // Should contain age (not exact DOB)
    expect(deidentified.age).toBeGreaterThanOrEqual(70);
    expect(deidentified.age).toBeLessThanOrEqual(80);
  });

  it('should preserve cognitive scores and biomarkers', () => {
    const patient = makePatient();
    const deidentified = Deidentifier.deidentifyPatient(patient, 'test-salt');

    expect(deidentified.scores).toHaveLength(2);
    expect(deidentified.scores[0].overallScore).toBe(72);
    expect(deidentified.biomarkers).toHaveLength(2);
  });

  it('should generate deterministic subject IDs (same input = same hash)', () => {
    const id1 = Deidentifier.generateSubjectId('patient-001', 'trial-A', 'salt123');
    const id2 = Deidentifier.generateSubjectId('patient-001', 'trial-A', 'salt123');
    expect(id1).toBe(id2);
  });

  it('should generate different IDs for different inputs', () => {
    const id1 = Deidentifier.generateSubjectId('patient-001', 'trial-A', 'salt123');
    const id2 = Deidentifier.generateSubjectId('patient-002', 'trial-A', 'salt123');
    expect(id1).not.toBe(id2);
  });
});

// ── Cohort Builder Tests ───────────────────────────────────────

describe('CohortBuilder', () => {
  const meta = {
    id: 'cohort-1',
    name: 'Test Cohort',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
  };

  it('should filter patients by cognitive stage', () => {
    const patients = [
      makePatient({ id: 'p1', cognitiveStage: 'mild' }),
      makePatient({ id: 'p2', cognitiveStage: 'moderate' }),
      makePatient({ id: 'p3', cognitiveStage: 'mild' }),
    ];

    const criteria: CohortCriteria = { cognitiveStages: ['mild'] };
    const cohort = CohortBuilder.buildCohort(patients, criteria, meta);

    expect(cohort.patients).toHaveLength(2);
    expect(cohort.patients).toContain('p1');
    expect(cohort.patients).toContain('p3');
    expect(cohort.patients).not.toContain('p2');
  });

  it('should filter patients by minimum sessions', () => {
    const patients = [
      makePatient({ id: 'p1', sessions: [{ date: '2024-01-15', overallScore: 70 }] }),
      makePatient({ id: 'p2' }), // 2 sessions from fixture
    ];

    const criteria: CohortCriteria = { minSessions: 2 };
    const cohort = CohortBuilder.buildCohort(patients, criteria, meta);

    expect(cohort.patients).toHaveLength(1);
    expect(cohort.patients[0]).toBe('p2');
  });

  it('should compute cognitive score outcome measures', () => {
    const patient = makePatient();
    const baselineDate = new Date('2024-01-31');
    const measures = CohortBuilder.computeOutcomeMeasures(patient, baselineDate);

    const cogMeasure = measures.find((m) => m.type === 'cognitive_score');
    expect(cogMeasure).toBeDefined();
    expect(cogMeasure!.baseline).toBe(72); // Jan session
    expect(cogMeasure!.current).toBe(75); // Feb session
    expect(cogMeasure!.change).toBe(3);
  });

  it('should compute engagement rate outcome measures', () => {
    const patient = makePatient();
    const baselineDate = new Date('2024-01-31');
    const measures = CohortBuilder.computeOutcomeMeasures(patient, baselineDate);

    const engagement = measures.find((m) => m.type === 'engagement_rate');
    expect(engagement).toBeDefined();
    expect(engagement!.current).toBeGreaterThan(0);
  });
});
