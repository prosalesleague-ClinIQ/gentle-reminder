export { DataExporter } from './DataExporter';
export { Deidentifier } from './Deidentifier';
export { CohortBuilder } from './CohortBuilder';
export {
  mean,
  median,
  standardDeviation,
  pairedTTest,
  wilcoxonSignedRank,
  cohensD,
  confidenceInterval,
} from './StatisticalAnalysis';
export {
  createAdverseEvent,
  classifySeverity,
  isSAE,
  generateAEReport,
} from './AdverseEventReporter';
export {
  trackDeviation,
  getDeviations,
  getAllDeviations,
  generateDeviationSummary,
  clearDeviationStore,
} from './ProtocolDeviationTracker';
export {
  checksumData,
  signRecord,
  verifySignature,
  generateAuditTrail,
  verifyAuditTrail,
} from './CFR11Compliance';
export {
  rangeCheck,
  consistencyCheck,
  completenessCheck,
  crossFieldValidation,
  validateCognitiveScore,
  validateBiomarker,
  mergeValidationResults,
} from './DataValidator';
export {
  exportToODM,
  REDCapClient,
  ODMAdapter,
} from './EDCIntegration';

export type {
  // Original types
  ExportFormat,
  ExportConfig,
  DeidentifiedRecord,
  CognitiveScoreEntry,
  BiomarkerEntry,
  TrialCohort,
  CohortCriteria,
  OutcomeMeasure,
  PatientRecord,
  SessionRecord,
  // Adverse Events
  AdverseEvent,
  AEReport,
  AESeverity,
  AESeriousness,
  AEOutcome,
  CausalityAssessment,
  // Protocol Deviations
  ProtocolDeviation,
  DeviationSummary,
  DeviationType,
  DeviationSeverity,
  // Electronic Signatures & Audit
  ElectronicSignature,
  SignedRecord,
  AuditTrailEntry,
  AuditAction,
  SignatureMeaning,
  // Data Validation
  DataValidationResult,
  ValidationIssue,
  ValidationSeverity,
  CrossFieldRule,
  // EDC Integration
  EDCExportConfig,
  EDCAdapter,
  // Statistics
  TTestResult,
  WilcoxonResult,
  ConfidenceIntervalResult,
  StatisticalResult,
} from './types';
