import {
  PatientRecord,
  TrialCohort,
  CohortCriteria,
  OutcomeMeasure,
} from './types';

/**
 * Builds clinical trial cohorts and computes outcome measures.
 */
export class CohortBuilder {
  /**
   * Filter patients by enrollment criteria and build a cohort.
   */
  static buildCohort(
    patients: PatientRecord[],
    criteria: CohortCriteria,
    cohortMeta: { id: string; name: string; startDate: Date; endDate: Date }
  ): TrialCohort {
    const filtered = patients.filter((patient) => {
      // Filter by cognitive stage
      if (
        criteria.cognitiveStages &&
        criteria.cognitiveStages.length > 0 &&
        !criteria.cognitiveStages.includes(patient.cognitiveStage)
      ) {
        return false;
      }

      // Filter by age range
      const age = CohortBuilder.calculateAge(patient.dateOfBirth);
      if (criteria.minAge !== undefined && age < criteria.minAge) return false;
      if (criteria.maxAge !== undefined && age > criteria.maxAge) return false;

      // Filter by minimum sessions
      if (
        criteria.minSessions !== undefined &&
        patient.sessions.length < criteria.minSessions
      ) {
        return false;
      }

      // Filter by diagnosis date range
      if (criteria.diagnosisDateRange && patient.diagnosisDate) {
        const diagDate = new Date(patient.diagnosisDate);
        if (
          diagDate < criteria.diagnosisDateRange.start ||
          diagDate > criteria.diagnosisDateRange.end
        ) {
          return false;
        }
      }

      return true;
    });

    return {
      id: cohortMeta.id,
      name: cohortMeta.name,
      enrollmentCriteria: criteria,
      patients: filtered.map((p) => p.id),
      startDate: cohortMeta.startDate,
      endDate: cohortMeta.endDate,
    };
  }

  /**
   * Compute outcome measures for a patient relative to a baseline date.
   * Returns cognitive score change, biomarker trends, and engagement rate.
   */
  static computeOutcomeMeasures(
    patient: PatientRecord,
    baselineDate: Date
  ): OutcomeMeasure[] {
    const measures: OutcomeMeasure[] = [];

    // Cognitive score change
    const sortedSessions = [...patient.sessions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const baselineSessions = sortedSessions.filter(
      (s) => new Date(s.date) <= baselineDate
    );
    const postBaselineSessions = sortedSessions.filter(
      (s) => new Date(s.date) > baselineDate
    );

    if (baselineSessions.length > 0 && postBaselineSessions.length > 0) {
      const baselineScore =
        baselineSessions.reduce((sum, s) => sum + s.overallScore, 0) /
        baselineSessions.length;
      const currentScore =
        postBaselineSessions.reduce((sum, s) => sum + s.overallScore, 0) /
        postBaselineSessions.length;

      const lastSession = postBaselineSessions[postBaselineSessions.length - 1];
      const weeksDiff = Math.round(
        (new Date(lastSession.date).getTime() - baselineDate.getTime()) /
          (7 * 24 * 60 * 60 * 1000)
      );

      measures.push({
        type: 'cognitive_score',
        baseline: Math.round(baselineScore * 100) / 100,
        current: Math.round(currentScore * 100) / 100,
        change: Math.round((currentScore - baselineScore) * 100) / 100,
        timepoint: `week_${weeksDiff}`,
      });
    }

    // Biomarker trends
    if (patient.biomarkers.length > 0) {
      const biomarkersByType = new Map<string, { date: string; value: number }[]>();
      for (const bm of patient.biomarkers) {
        if (!biomarkersByType.has(bm.type)) {
          biomarkersByType.set(bm.type, []);
        }
        biomarkersByType.get(bm.type)!.push({ date: bm.date, value: bm.value });
      }

      for (const [type, entries] of biomarkersByType) {
        const sorted = entries.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        const baseline = sorted.find(
          (e) => new Date(e.date) <= baselineDate
        );
        const latest = sorted[sorted.length - 1];

        if (baseline && latest && baseline !== latest) {
          const weeksDiff = Math.round(
            (new Date(latest.date).getTime() - baselineDate.getTime()) /
              (7 * 24 * 60 * 60 * 1000)
          );

          measures.push({
            type: 'biomarker_trend',
            baseline: baseline.value,
            current: latest.value,
            change: Math.round((latest.value - baseline.value) * 100) / 100,
            timepoint: `week_${weeksDiff}`,
          });
        }
      }
    }

    // Engagement rate (sessions per week since baseline)
    if (postBaselineSessions.length > 0) {
      const lastSession = postBaselineSessions[postBaselineSessions.length - 1];
      const totalWeeks = Math.max(
        1,
        (new Date(lastSession.date).getTime() - baselineDate.getTime()) /
          (7 * 24 * 60 * 60 * 1000)
      );
      const sessionsPerWeek =
        Math.round((postBaselineSessions.length / totalWeeks) * 100) / 100;

      // Baseline engagement: sessions per week before baseline
      const preBaselineWeeks =
        baselineSessions.length > 0
          ? Math.max(
              1,
              (baselineDate.getTime() -
                new Date(baselineSessions[0].date).getTime()) /
                (7 * 24 * 60 * 60 * 1000)
            )
          : 1;
      const baselineRate =
        Math.round((baselineSessions.length / preBaselineWeeks) * 100) / 100;

      measures.push({
        type: 'engagement_rate',
        baseline: baselineRate,
        current: sessionsPerWeek,
        change: Math.round((sessionsPerWeek - baselineRate) * 100) / 100,
        timepoint: `week_${Math.round(totalWeeks)}`,
      });
    }

    return measures;
  }

  private static calculateAge(dob: Date): number {
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const monthDiff = now.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  }
}
