export const en = {
  // Navigation
  clinicalOverview: 'Clinical Overview',
  patientDetail: 'Patient Detail',
  clinicalReports: 'Clinical Reports',
  biomarkerTracking: 'Biomarker Tracking',
  medications: 'Medications',
  timeline: 'Timeline',
  research: 'Research',

  // Clinical Overview
  facilityStatus: 'Facility Status',
  totalPatients: 'Total Patients',
  activeAlerts: 'Active Alerts',
  scheduledAssessments: 'Scheduled Assessments',
  averageCognitiveScore: 'Average Cognitive Score',

  // Patient Detail
  cognitiveTrajectory: 'Cognitive Trajectory',
  domainBreakdown: 'Domain Breakdown',
  sessionHistory: 'Session History',
  medicationAdherence: 'Medication Adherence',
  behavioralNotes: 'Behavioral Notes',

  // Cognitive Domains
  orientation: 'Orientation',
  memory: 'Memory',
  attention: 'Attention',
  language: 'Language',
  visuospatial: 'Visuospatial',
  executiveFunction: 'Executive Function',

  // Reports
  generateReport: 'Generate Report',
  exportPDF: 'Export PDF',
  dateRange: 'Date Range',
  includeRawData: 'Include Raw Data',
  reportType: 'Report Type',
  progressReport: 'Progress Report',
  clinicalSummary: 'Clinical Summary',
  comprehensiveAssessment: 'Comprehensive Assessment',

  // Biomarkers
  heartRate: 'Heart Rate',
  heartRateVariability: 'Heart Rate Variability',
  sleepArchitecture: 'Sleep Architecture',
  gaitAnalysis: 'Gait Analysis',
  speechPatterns: 'Speech Patterns',
  hesitationFrequency: 'Hesitation Frequency',
  wordFindingLatency: 'Word-Finding Latency',

  // Trends
  improving: 'Improving',
  stable: 'Stable',
  declining: 'Declining',
  significantDecline: 'Significant Decline',
  baseline: 'Baseline',
  percentChange: '% Change',

  // Research
  dataExport: 'Data Export',
  cohortSelection: 'Cohort Selection',
  deidentifiedData: 'De-identified Data',
  exportFormat: 'Export Format',
  enrollmentCriteria: 'Enrollment Criteria',

  // Actions
  viewDetails: 'View Details',
  comparePatients: 'Compare Patients',
  addAnnotation: 'Add Annotation',
  flagForReview: 'Flag for Review',
} as const;

export type ClinicalTranslationKey = keyof typeof en;
