import { DailyReport, PatientReportData, ReportSection, ReportConfig, DEFAULT_REPORT_CONFIG } from './types';

export function buildDailyReport(
  data: PatientReportData,
  date: string,
  config: ReportConfig = DEFAULT_REPORT_CONFIG,
): DailyReport {
  const sections: ReportSection[] = [];

  // Summary section
  const todaySessions = data.sessions.filter((s) => s.date === date);
  const avgScore = todaySessions.length > 0
    ? Math.round(todaySessions.reduce((sum, s) => sum + s.score, 0) / todaySessions.length)
    : 0;

  sections.push({
    title: 'Daily Summary',
    content: todaySessions.length > 0
      ? `${data.preferredName} completed ${todaySessions.length} session(s) today with an average score of ${avgScore}%.`
      : `${data.preferredName} did not complete any sessions today.`,
    metrics: [
      { label: 'Sessions', value: todaySessions.length },
      { label: 'Avg Score', value: `${avgScore}%`, trend: avgScore >= 70 ? 'up' : avgScore >= 50 ? 'stable' : 'down' },
    ],
  });

  // Cognitive scores
  if (config.includeRawScores && data.cognitiveScores.length > 0) {
    const latest = data.cognitiveScores[data.cognitiveScores.length - 1];
    sections.push({
      title: 'Cognitive Performance',
      content: `Orientation: ${Math.round(latest.orientation * 100)}%, Identity: ${Math.round(latest.identity * 100)}%, Memory: ${Math.round(latest.memory * 100)}%`,
      metrics: [
        { label: 'Orientation', value: `${Math.round(latest.orientation * 100)}%` },
        { label: 'Identity', value: `${Math.round(latest.identity * 100)}%` },
        { label: 'Memory', value: `${Math.round(latest.memory * 100)}%` },
      ],
    });
  }

  // Medications
  if (config.includeMedications && data.medications && data.medications.length > 0) {
    const avgAdherence = Math.round(
      data.medications.reduce((sum, m) => sum + m.adherenceRate, 0) / data.medications.length,
    );
    sections.push({
      title: 'Medication Adherence',
      content: `Overall medication adherence: ${avgAdherence}%. ${data.medications.map((m) => `${m.name}: ${m.adherenceRate}%`).join(', ')}.`,
      metrics: data.medications.map((m) => ({
        label: m.name,
        value: `${m.adherenceRate}%`,
        trend: m.adherenceRate >= 90 ? 'up' as const : m.adherenceRate >= 70 ? 'stable' as const : 'down' as const,
      })),
    });
  }

  // Alerts
  if (config.includeAlerts && data.alerts && data.alerts.length > 0) {
    const todayAlerts = data.alerts.filter((a) => a.date === date);
    if (todayAlerts.length > 0) {
      sections.push({
        title: 'Alerts',
        content: todayAlerts.map((a) => `[${a.severity.toUpperCase()}] ${a.message}`).join('\n'),
      });
    }
  }

  // Biomarkers
  if (config.includeBiomarkers && data.biomarkers && data.biomarkers.length > 0) {
    sections.push({
      title: 'Biomarker Summary',
      content: data.biomarkers.map((b) => `${b.type}: ${Math.round(b.score * 100)}% (${b.trend})`).join(', '),
      metrics: data.biomarkers.map((b) => ({
        label: b.type,
        value: `${Math.round(b.score * 100)}%`,
        trend: b.trend as 'up' | 'down' | 'stable',
      })),
    });
  }

  // Determine overall status
  let overallStatus: 'good' | 'attention' | 'concern' = 'good';
  if (avgScore < 50 || (data.alerts && data.alerts.some((a) => a.severity === 'high'))) {
    overallStatus = 'concern';
  } else if (avgScore < 70 || todaySessions.length === 0) {
    overallStatus = 'attention';
  }

  const summary = overallStatus === 'good'
    ? `${data.preferredName} had a good day with stable cognitive performance.`
    : overallStatus === 'attention'
    ? `${data.preferredName}'s engagement could be improved. Consider encouraging more sessions.`
    : `${data.preferredName} may need additional attention. Review alerts and cognitive scores.`;

  return {
    patientName: data.name,
    date,
    generatedAt: new Date().toISOString(),
    sections: sections.slice(0, config.maxSections),
    overallStatus,
    summary,
  };
}

export function formatAsText(report: DailyReport): string {
  const lines: string[] = [
    `DAILY COGNITIVE REPORT`,
    `Patient: ${report.patientName}`,
    `Date: ${report.date}`,
    `Status: ${report.overallStatus.toUpperCase()}`,
    ``,
    `Summary: ${report.summary}`,
    ``,
    `---`,
  ];

  for (const section of report.sections) {
    lines.push(``, `## ${section.title}`, section.content);
    if (section.metrics) {
      for (const m of section.metrics) {
        const trend = m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '→';
        lines.push(`  ${m.label}: ${m.value} ${m.trend ? trend : ''}`);
      }
    }
  }

  lines.push(``, `---`, `Generated: ${report.generatedAt}`);
  return lines.join('\n');
}

export function formatAsHTML(report: DailyReport): string {
  const statusColor = report.overallStatus === 'good' ? '#3D8158'
    : report.overallStatus === 'attention' ? '#E5A300' : '#C0392B';

  let html = `<!DOCTYPE html><html><head><style>
    body { font-family: system-ui; max-width: 800px; margin: 0 auto; padding: 20px; color: #1A1A2E; }
    h1 { color: #1A7BC4; } h2 { color: #3A3A5C; border-bottom: 1px solid #E2E8F0; padding-bottom: 8px; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 12px; color: white; background: ${statusColor}; font-weight: 600; }
    .metric { display: inline-block; margin: 4px 8px 4px 0; padding: 4px 10px; background: #F8FAFB; border-radius: 8px; font-size: 14px; }
    .summary { background: #F8FAFB; padding: 16px; border-radius: 8px; margin: 16px 0; }
  </style></head><body>`;

  html += `<h1>Daily Cognitive Report</h1>`;
  html += `<p><strong>Patient:</strong> ${report.patientName} | <strong>Date:</strong> ${report.date} | <span class="status">${report.overallStatus}</span></p>`;
  html += `<div class="summary"><strong>Summary:</strong> ${report.summary}</div>`;

  for (const section of report.sections) {
    html += `<h2>${section.title}</h2><p>${section.content}</p>`;
    if (section.metrics) {
      for (const m of section.metrics) {
        html += `<span class="metric">${m.label}: <strong>${m.value}</strong></span>`;
      }
    }
  }

  html += `<hr><p style="color:#6B6B8D;font-size:12px;">Generated: ${report.generatedAt}</p></body></html>`;
  return html;
}
