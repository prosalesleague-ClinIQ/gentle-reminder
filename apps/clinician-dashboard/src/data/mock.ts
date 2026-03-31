// Mock clinical data for the Gentle Reminder Clinician Dashboard

export interface ClinicalPatient {
  id: string;
  name: string;
  age: number;
  sex: 'M' | 'F';
  diagnosisStage: 'Mild' | 'Moderate' | 'Severe';
  mmseEstimate: number;
  lastAssessment: string;
  cognitiveScore: number;
  medicationNotes: string;
  primaryCaregiver: string;
  enrolledStudy: string | null;
  status: 'Active' | 'Inactive' | 'Under Review';
}

export interface ClinicalReport {
  id: string;
  patientId: string;
  patientName: string;
  reportType: 'Weekly Summary' | 'Monthly Assessment' | 'Decline Report' | 'Medication Review' | 'Caregiver Feedback';
  date: string;
  scoreSummary: string;
  status: 'Complete' | 'Pending Review' | 'Draft' | 'Approved';
  generatedBy: string;
}

export interface CohortStats {
  studyName: string;
  enrolled: number;
  completed: number;
  active: number;
  dropouts: number;
  avgAge: number;
  completionRate: number;
}

export interface DeidentifiedRecord {
  subjectId: string;
  ageRange: string;
  sex: 'M' | 'F';
  stage: string;
  baselineMMSE: number;
  currentMMSE: number;
  monthsEnrolled: number;
  interventionGroup: string;
  adherenceRate: number;
}

export const patients: ClinicalPatient[] = [
  {
    id: 'PT-001',
    name: 'Margaret Thompson',
    age: 78,
    sex: 'F',
    diagnosisStage: 'Mild',
    mmseEstimate: 24,
    lastAssessment: '2026-03-28',
    cognitiveScore: 82,
    medicationNotes: 'Donepezil 10mg daily. Stable on current regimen.',
    primaryCaregiver: 'Sarah Thompson (daughter)',
    enrolledStudy: 'GR-2026-A',
    status: 'Active',
  },
  {
    id: 'PT-002',
    name: 'Robert Chen',
    age: 81,
    sex: 'M',
    diagnosisStage: 'Moderate',
    mmseEstimate: 18,
    lastAssessment: '2026-03-25',
    cognitiveScore: 61,
    medicationNotes: 'Memantine 20mg, Donepezil 10mg. Review scheduled April.',
    primaryCaregiver: 'Linda Chen (spouse)',
    enrolledStudy: 'GR-2026-A',
    status: 'Active',
  },
  {
    id: 'PT-003',
    name: 'Dorothy Williams',
    age: 74,
    sex: 'F',
    diagnosisStage: 'Mild',
    mmseEstimate: 26,
    lastAssessment: '2026-03-27',
    cognitiveScore: 88,
    medicationNotes: 'Rivastigmine patch 9.5mg. Skin irritation noted - rotate site.',
    primaryCaregiver: 'James Williams (spouse)',
    enrolledStudy: null,
    status: 'Active',
  },
  {
    id: 'PT-004',
    name: 'Harold Martinez',
    age: 85,
    sex: 'M',
    diagnosisStage: 'Severe',
    mmseEstimate: 10,
    lastAssessment: '2026-03-20',
    cognitiveScore: 34,
    medicationNotes: 'Memantine 20mg. Increased agitation - consider dose adjustment.',
    primaryCaregiver: 'Maria Martinez (daughter-in-law)',
    enrolledStudy: 'GR-2026-B',
    status: 'Under Review',
  },
  {
    id: 'PT-005',
    name: 'Eleanor Davis',
    age: 72,
    sex: 'F',
    diagnosisStage: 'Mild',
    mmseEstimate: 25,
    lastAssessment: '2026-03-29',
    cognitiveScore: 85,
    medicationNotes: 'Galantamine 16mg ER. Well-tolerated. No changes.',
    primaryCaregiver: 'Michael Davis (son)',
    enrolledStudy: 'GR-2026-C',
    status: 'Active',
  },
  {
    id: 'PT-006',
    name: 'Frank Johnson',
    age: 79,
    sex: 'M',
    diagnosisStage: 'Moderate',
    mmseEstimate: 16,
    lastAssessment: '2026-03-22',
    cognitiveScore: 55,
    medicationNotes: 'Donepezil 10mg, Memantine 10mg. Titrating memantine up.',
    primaryCaregiver: 'Patricia Johnson (spouse)',
    enrolledStudy: 'GR-2026-A',
    status: 'Active',
  },
];

export const reports: ClinicalReport[] = [
  {
    id: 'RPT-001',
    patientId: 'PT-001',
    patientName: 'Margaret Thompson',
    reportType: 'Weekly Summary',
    date: '2026-03-28',
    scoreSummary: 'Cognitive score stable at 82. No significant changes.',
    status: 'Approved',
    generatedBy: 'System (Auto)',
  },
  {
    id: 'RPT-002',
    patientId: 'PT-002',
    patientName: 'Robert Chen',
    reportType: 'Monthly Assessment',
    date: '2026-03-25',
    scoreSummary: 'Score declined from 68 to 61. Recommend medication review.',
    status: 'Pending Review',
    generatedBy: 'Dr. Sarah Kim',
  },
  {
    id: 'RPT-003',
    patientId: 'PT-004',
    patientName: 'Harold Martinez',
    reportType: 'Decline Report',
    date: '2026-03-20',
    scoreSummary: 'Significant decline detected. MMSE estimate dropped 3 pts.',
    status: 'Complete',
    generatedBy: 'System (Auto)',
  },
  {
    id: 'RPT-004',
    patientId: 'PT-003',
    patientName: 'Dorothy Williams',
    reportType: 'Weekly Summary',
    date: '2026-03-27',
    scoreSummary: 'Stable performance. High engagement with daily prompts.',
    status: 'Approved',
    generatedBy: 'System (Auto)',
  },
  {
    id: 'RPT-005',
    patientId: 'PT-006',
    patientName: 'Frank Johnson',
    reportType: 'Medication Review',
    date: '2026-03-22',
    scoreSummary: 'Memantine titration ongoing. Monitor for side effects.',
    status: 'Pending Review',
    generatedBy: 'Dr. Alan Rhodes',
  },
  {
    id: 'RPT-006',
    patientId: 'PT-005',
    patientName: 'Eleanor Davis',
    reportType: 'Monthly Assessment',
    date: '2026-03-15',
    scoreSummary: 'Score improved from 81 to 85. Positive response to prompts.',
    status: 'Approved',
    generatedBy: 'Dr. Sarah Kim',
  },
  {
    id: 'RPT-007',
    patientId: 'PT-001',
    patientName: 'Margaret Thompson',
    reportType: 'Caregiver Feedback',
    date: '2026-03-18',
    scoreSummary: 'Caregiver reports improved daily routine adherence.',
    status: 'Complete',
    generatedBy: 'System (Auto)',
  },
  {
    id: 'RPT-008',
    patientId: 'PT-002',
    patientName: 'Robert Chen',
    reportType: 'Decline Report',
    date: '2026-03-10',
    scoreSummary: 'Pattern of decline over 4-week period. Flagged for review.',
    status: 'Draft',
    generatedBy: 'Dr. Alan Rhodes',
  },
];

export const cohortStats: CohortStats[] = [
  {
    studyName: 'GR-2026-A: Digital Prompt Efficacy',
    enrolled: 24,
    completed: 8,
    active: 14,
    dropouts: 2,
    avgAge: 76.3,
    completionRate: 87.5,
  },
  {
    studyName: 'GR-2026-B: Caregiver Burden Reduction',
    enrolled: 16,
    completed: 3,
    active: 12,
    dropouts: 1,
    avgAge: 79.1,
    completionRate: 93.8,
  },
  {
    studyName: 'GR-2026-C: Early Stage Intervention',
    enrolled: 8,
    completed: 0,
    active: 8,
    dropouts: 0,
    avgAge: 71.5,
    completionRate: 100,
  },
];

export const deidentifiedData: DeidentifiedRecord[] = [
  { subjectId: 'S-0001', ageRange: '70-74', sex: 'F', stage: 'Mild', baselineMMSE: 25, currentMMSE: 26, monthsEnrolled: 6, interventionGroup: 'Digital Prompts', adherenceRate: 94 },
  { subjectId: 'S-0002', ageRange: '80-84', sex: 'M', stage: 'Moderate', baselineMMSE: 19, currentMMSE: 18, monthsEnrolled: 6, interventionGroup: 'Digital Prompts', adherenceRate: 78 },
  { subjectId: 'S-0003', ageRange: '75-79', sex: 'F', stage: 'Mild', baselineMMSE: 23, currentMMSE: 24, monthsEnrolled: 4, interventionGroup: 'Control', adherenceRate: 82 },
  { subjectId: 'S-0004', ageRange: '85-89', sex: 'M', stage: 'Severe', baselineMMSE: 12, currentMMSE: 10, monthsEnrolled: 5, interventionGroup: 'Digital Prompts', adherenceRate: 65 },
  { subjectId: 'S-0005', ageRange: '70-74', sex: 'F', stage: 'Mild', baselineMMSE: 26, currentMMSE: 27, monthsEnrolled: 3, interventionGroup: 'Control', adherenceRate: 91 },
  { subjectId: 'S-0006', ageRange: '75-79', sex: 'M', stage: 'Moderate', baselineMMSE: 17, currentMMSE: 16, monthsEnrolled: 6, interventionGroup: 'Digital Prompts', adherenceRate: 73 },
  { subjectId: 'S-0007', ageRange: '70-74', sex: 'F', stage: 'Mild', baselineMMSE: 24, currentMMSE: 25, monthsEnrolled: 2, interventionGroup: 'Digital Prompts', adherenceRate: 96 },
  { subjectId: 'S-0008', ageRange: '80-84', sex: 'M', stage: 'Moderate', baselineMMSE: 15, currentMMSE: 14, monthsEnrolled: 6, interventionGroup: 'Control', adherenceRate: 69 },
];

export const overviewStats = {
  totalPatients: 48,
  activeStudies: 3,
  reportsGenerated: 127,
  avgCognitiveScore: 71,
};

export const cognitiveDistribution = {
  mild: { count: 22, percentage: 46 },
  moderate: { count: 17, percentage: 35 },
  severe: { count: 9, percentage: 19 },
};

export const recentReports = reports.slice(0, 5);
