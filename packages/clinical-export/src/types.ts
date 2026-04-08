/**
 * Clinical trial data export types.
 * Used for research data export, de-identification, and cohort management.
 */

export type ExportFormat = 'csv' | 'json' | 'fhir';

export interface ExportConfig {
  /** Output format */
  format: ExportFormat;
  /** Date range filter */
  dateRange?: {
    start: Date;
    end: Date;
  };
  /** Specific patient IDs to include (empty = all) */
  patientIds: string[];
  /** Include raw session data */
  includeRaw: boolean;
  /** Apply de-identification before export */
  deidentify: boolean;
}

export interface DeidentifiedRecord {
  /** Hashed subject identifier */
  subjectId: string;
  /** Age in years (exact DOB removed) */
  age: number;
  /** Gender (optional) */
  gender?: string;
  /** Current cognitive stage */
  cognitiveStage: string;
  /** Array of cognitive scores over time */
  scores: CognitiveScoreEntry[];
  /** Array of biomarker readings */
  biomarkers: BiomarkerEntry[];
}

export interface CognitiveScoreEntry {
  date: string;
  overallScore: number;
  orientation?: number;
  identity?: number;
  memory?: number;
  responseTimeMs?: number;
  sessionDurationMs?: number;
}

export interface BiomarkerEntry {
  date: string;
  type: string;
  value: number;
  unit: string;
}

export interface TrialCohort {
  /** Cohort identifier */
  id: string;
  /** Human-readable name */
  name: string;
  /** Criteria used to build this cohort */
  enrollmentCriteria: CohortCriteria;
  /** Patient IDs in the cohort */
  patients: string[];
  /** Trial start date */
  startDate: Date;
  /** Trial end date */
  endDate: Date;
}

export interface CohortCriteria {
  /** Cognitive stage filter (e.g., 'mild', 'moderate') */
  cognitiveStages?: string[];
  /** Minimum age */
  minAge?: number;
  /** Maximum age */
  maxAge?: number;
  /** Minimum number of completed sessions */
  minSessions?: number;
  /** Diagnosis date range */
  diagnosisDateRange?: {
    start: Date;
    end: Date;
  };
}

export interface OutcomeMeasure {
  /** Type of outcome measure */
  type: 'cognitive_score' | 'biomarker_trend' | 'engagement_rate';
  /** Baseline value */
  baseline: number;
  /** Current value */
  current: number;
  /** Absolute change from baseline */
  change: number;
  /** Timepoint label (e.g., 'week_4', 'month_3') */
  timepoint: string;
}

export interface PatientRecord {
  id: string;
  name: string;
  email?: string;
  dateOfBirth: Date;
  city?: string;
  state?: string;
  gender?: string;
  cognitiveStage: string;
  diagnosisDate?: Date;
  sessions: SessionRecord[];
  biomarkers: BiomarkerEntry[];
}

export interface SessionRecord {
  date: string;
  overallScore: number;
  orientation?: number;
  identity?: number;
  memory?: number;
  responseTimeMs?: number;
  durationMs?: number;
}

// ── Adverse Events ──

export type AESeverity = 'mild' | 'moderate' | 'severe' | 'life_threatening';
export type AESeriousness = 'serious' | 'non_serious';
export type AEOutcome =
  | 'recovered'
  | 'recovering'
  | 'not_recovered'
  | 'fatal'
  | 'unknown';

export type CausalityAssessment =
  | 'definite'
  | 'probable'
  | 'possible'
  | 'unlikely'
  | 'unrelated';

export interface AdverseEvent {
  id: string;
  patientId: string;
  description: string;
  severity: AESeverity;
  seriousness: AESeriousness;
  meddraCoding?: string;
  onsetDate: Date;
  reportDate: Date;
  outcome: AEOutcome;
  causalityAssessment: CausalityAssessment;
}

export interface AEReport {
  dateRange: { start: Date; end: Date };
  totalEvents: number;
  bySeverity: Record<AESeverity, number>;
  bySeriousness: Record<AESeriousness, number>;
  saeCount: number;
  events: AdverseEvent[];
}

// ── Protocol Deviations ──

export type DeviationType =
  | 'missed_visit'
  | 'out_of_window'
  | 'eligibility_violation'
  | 'other';

export type DeviationSeverity = 'minor' | 'major' | 'critical';

export interface ProtocolDeviation {
  id: string;
  patientId: string;
  type: DeviationType;
  description: string;
  date: Date;
  severity: DeviationSeverity;
  corrective_action?: string;
}

export interface DeviationSummary {
  totalDeviations: number;
  byType: Record<DeviationType, number>;
  bySeverity: Record<DeviationSeverity, number>;
  affectedPatients: string[];
  deviations: ProtocolDeviation[];
}

// ── Electronic Signatures (21 CFR Part 11) ──

export type SignatureMeaning = 'authored' | 'reviewed' | 'approved';

export interface ElectronicSignature {
  userId: string;
  meaning: SignatureMeaning;
  timestamp: string;
  hash: string;
}

export interface SignedRecord<T = unknown> {
  data: T;
  signature: ElectronicSignature;
}

export interface AuditTrailEntry {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
  checksum: string;
}

export interface AuditAction {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  previousValue?: string;
  newValue?: string;
  reason?: string;
}

// ── Data Validation ──

export type ValidationSeverity = 'error' | 'warning';

export interface ValidationIssue {
  field: string;
  message: string;
  severity: ValidationSeverity;
  value?: unknown;
}

export interface DataValidationResult {
  valid: boolean;
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
}

export interface CrossFieldRule {
  fields: string[];
  validate: (record: Record<string, unknown>) => ValidationIssue | null;
}

// ── EDC Integration ──

export interface EDCExportConfig {
  studyOID: string;
  studyName: string;
  protocolName: string;
  siteOID?: string;
  siteName?: string;
  creationDateTime?: string;
}

export interface EDCAdapter {
  exportRecords(records: DeidentifiedRecord[]): string | Promise<string>;
  importRecords(data: string): DeidentifiedRecord[] | Promise<DeidentifiedRecord[]>;
}

// ── Statistical Results ──

export interface TTestResult {
  t: number;
  p: number;
  df: number;
  significant: boolean;
}

export interface WilcoxonResult {
  W: number;
  p: number;
  significant: boolean;
}

export interface ConfidenceIntervalResult {
  lower: number;
  upper: number;
  mean: number;
}

export type StatisticalResult = TTestResult | WilcoxonResult | ConfidenceIntervalResult;
