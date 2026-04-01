import { DailyReport, PatientReportData, ReportConfig, DEFAULT_REPORT_CONFIG } from './types';

export function buildWeeklyReport(
  data: PatientReportData,
  weekStart: string,
  config: ReportConfig = DEFAULT_REPORT_CONFIG,
): DailyReport {
  const startDate = new Date(weekStart);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  const weekSessions = data.sessions.filter((s) => {
    const d = new Date(s.date);
    return d >= startDate && d <= endDate;
  });

  const totalSessions = weekSessions.length;
  const avgScore = totalSessions > 0
    ? Math.round(weekSessions.reduce((sum, s) => sum + s.score, 0) / totalSessions)
    : 0;
  const totalDuration = weekSessions.reduce((sum, s) => sum + s.duration, 0);

  const sections = [
    {
      title: 'Weekly Summary',
      content: `${data.preferredName} completed ${totalSessions} sessions this week (avg score: ${avgScore}%, total time: ${Math.round(totalDuration / 60)} minutes).`,
      metrics: [
        { label: 'Sessions', value: totalSessions },
        { label: 'Avg Score', value: `${avgScore}%` },
        { label: 'Total Time', value: `${Math.round(totalDuration / 60)} min` },
      ],
    },
    {
      title: 'Cognitive Trend',
      content: weekSessions.length >= 2
        ? `Scores ranged from ${Math.min(...weekSessions.map(s => s.score))}% to ${Math.max(...weekSessions.map(s => s.score))}%.`
        : 'Insufficient data for trend analysis.',
      metrics: weekSessions.length >= 2 ? [
        { label: 'Lowest', value: `${Math.min(...weekSessions.map(s => s.score))}%` },
        { label: 'Highest', value: `${Math.max(...weekSessions.map(s => s.score))}%` },
      ] : undefined,
    },
  ];

  if (config.includeMedications && data.medications) {
    const avgAdherence = Math.round(
      data.medications.reduce((sum, m) => sum + m.adherenceRate, 0) / data.medications.length,
    );
    sections.push({
      title: 'Medication Adherence',
      content: `Overall adherence this week: ${avgAdherence}%.`,
      metrics: [{ label: 'Adherence', value: `${avgAdherence}%` }],
    });
  }

  let overallStatus: 'good' | 'attention' | 'concern' = 'good';
  if (avgScore < 50 || totalSessions < 2) overallStatus = 'concern';
  else if (avgScore < 70 || totalSessions < 4) overallStatus = 'attention';

  return {
    patientName: data.name,
    date: `${weekStart} to ${endDate.toISOString().split('T')[0]}`,
    generatedAt: new Date().toISOString(),
    sections,
    overallStatus,
    summary: overallStatus === 'good'
      ? `${data.preferredName} had a productive week with consistent engagement.`
      : overallStatus === 'attention'
      ? `${data.preferredName}'s weekly engagement could improve.`
      : `${data.preferredName} needs more support and encouragement this week.`,
  };
}
