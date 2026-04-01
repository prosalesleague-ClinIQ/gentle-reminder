export interface ReportMetric {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
}

export interface ReportSection {
  title: string;
  content: string;
  metrics?: ReportMetric[];
}

export interface DailyReport {
  patientName: string;
  date: string;
  generatedAt: string;
  sections: ReportSection[];
  overallStatus: 'good' | 'attention' | 'concern';
  summary: string;
}

export interface PatientReportData {
  name: string;
  preferredName: string;
  cognitiveStage: string;
  sessions: { date: string; score: number; exercises: number; duration: number }[];
  cognitiveScores: { date: string; orientation: number; identity: number; memory: number }[];
  medications?: { name: string; adherenceRate: number }[];
  alerts?: { type: string; severity: string; message: string; date: string }[];
  biomarkers?: { type: string; score: number; trend: string }[];
}

export interface ReportConfig {
  includeRawScores: boolean;
  includeBiomarkers: boolean;
  includeMedications: boolean;
  includeAlerts: boolean;
  maxSections: number;
}

export const DEFAULT_REPORT_CONFIG: ReportConfig = {
  includeRawScores: true,
  includeBiomarkers: true,
  includeMedications: true,
  includeAlerts: true,
  maxSections: 10,
};
