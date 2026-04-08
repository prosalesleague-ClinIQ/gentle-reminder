import { buildDailyReport } from '../src/DailyReportBuilder';
import { PatientReportData, ReportConfig, DEFAULT_REPORT_CONFIG } from '../src/types';

const mockPatientData: PatientReportData = {
  patientId: 'pat-123',
  preferredName: 'Margaret',
  sessions: [
    { date: '2026-04-07', score: 85, duration: 15, type: 'orientation' },
    { date: '2026-04-07', score: 72, duration: 10, type: 'memory' },
    { date: '2026-04-06', score: 60, duration: 12, type: 'identity' },
  ],
  cognitiveScores: [
    { date: '2026-04-07', orientation: 0.85, identity: 0.78, memory: 0.72 },
  ],
  medications: [
    { name: 'Donepezil', adherenceRate: 95 },
    { name: 'Memantine', adherenceRate: 88 },
  ],
  alerts: [],
};

describe('Daily Report Builder', () => {
  it('should generate a daily report with summary section', () => {
    const report = buildDailyReport(mockPatientData, '2026-04-07');
    expect(report.sections.length).toBeGreaterThan(0);
    expect(report.sections[0].title).toBe('Daily Summary');
    expect(report.sections[0].content).toContain('Margaret');
    expect(report.sections[0].content).toContain('2 session(s)');
  });

  it('should calculate correct average score', () => {
    const report = buildDailyReport(mockPatientData, '2026-04-07');
    // avg of 85 and 72 = 79 (rounded)
    expect(report.sections[0].content).toContain('79%');
  });

  it('should handle days with no sessions', () => {
    const report = buildDailyReport(mockPatientData, '2026-04-05');
    expect(report.sections[0].content).toContain('did not complete any sessions');
  });

  it('should include cognitive scores when config allows', () => {
    const config: ReportConfig = { ...DEFAULT_REPORT_CONFIG, includeRawScores: true };
    const report = buildDailyReport(mockPatientData, '2026-04-07', config);
    const cogSection = report.sections.find((s) => s.title === 'Cognitive Performance');
    expect(cogSection).toBeTruthy();
    expect(cogSection!.content).toContain('85%'); // orientation
  });

  it('should include medication adherence when config allows', () => {
    const config: ReportConfig = { ...DEFAULT_REPORT_CONFIG, includeMedications: true };
    const report = buildDailyReport(mockPatientData, '2026-04-07', config);
    const medSection = report.sections.find((s) => s.title === 'Medication Adherence');
    expect(medSection).toBeTruthy();
    expect(medSection!.content).toContain('Donepezil');
  });

  it('should use default config when none provided', () => {
    const report = buildDailyReport(mockPatientData, '2026-04-07');
    expect(report).toBeTruthy();
    expect(report.sections.length).toBeGreaterThanOrEqual(1);
  });
});
