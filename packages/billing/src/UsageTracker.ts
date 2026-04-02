/**
 * UsageTracker - Records, retrieves, and checks usage metrics for
 * facilities on the Gentle Reminder platform.
 *
 * Operates in demo mode with an in-memory store and can generate
 * realistic synthetic usage data for testing and demonstrations.
 */

import {
  UsageRecord,
  UsageMetricType,
  UsageLimitCheck,
  UsageLimitWarning,
  UsageLimitExceeded,
  PlanLimits,
  StorageUsageSummary,
  StorageBreakdown,
  PricingTier,
} from './types';
import { PLANS, getPlanLimits } from './PricingEngine';

// ---------------------------------------------------------------------------
// In-memory demo store
// ---------------------------------------------------------------------------

/** Map of facilityId -> date string (YYYY-MM-DD) -> UsageRecord */
const usageStore = new Map<string, Map<string, UsageRecord>>();

// Warning threshold: alert when usage reaches this percentage of the limit
const WARNING_THRESHOLD = 0.80; // 80%

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function dateKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getFacilityStore(facilityId: string): Map<string, UsageRecord> {
  let store = usageStore.get(facilityId);
  if (!store) {
    store = new Map();
    usageStore.set(facilityId, store);
  }
  return store;
}

function getOrCreateRecord(facilityId: string, date: Date): UsageRecord {
  const store = getFacilityStore(facilityId);
  const key = dateKey(date);
  let record = store.get(key);
  if (!record) {
    record = {
      facilityId,
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      activePatients: 0,
      sessionsCount: 0,
      storageGb: 0,
      apiCalls: 0,
      caregiverAccounts: 0,
      clinicianAccounts: 0,
      reportExports: 0,
      smsNotifications: 0,
      emailNotifications: 0,
    };
    store.set(key, record);
  }
  return record;
}

// ---------------------------------------------------------------------------
// Recording usage
// ---------------------------------------------------------------------------

/**
 * Record a usage event for a facility.
 * Increments the specified metric by the given amount for the current day.
 */
export function recordUsage(
  facilityId: string,
  type: UsageMetricType,
  amount: number,
  date?: Date,
): UsageRecord {
  const effectiveDate = date || new Date();
  const record = getOrCreateRecord(facilityId, effectiveDate);

  switch (type) {
    case UsageMetricType.ACTIVE_PATIENTS:
      record.activePatients = amount; // Set, don't increment
      break;
    case UsageMetricType.SESSIONS_COUNT:
      record.sessionsCount += amount;
      break;
    case UsageMetricType.STORAGE_GB:
      record.storageGb = amount; // Set to current value
      break;
    case UsageMetricType.API_CALLS:
      record.apiCalls += amount;
      break;
    case UsageMetricType.CAREGIVER_ACCOUNTS:
      record.caregiverAccounts = amount; // Set, don't increment
      break;
    case UsageMetricType.CLINICIAN_ACCOUNTS:
      record.clinicianAccounts = amount; // Set, don't increment
      break;
    case UsageMetricType.REPORT_EXPORTS:
      record.reportExports += amount;
      break;
    case UsageMetricType.SMS_NOTIFICATIONS:
      record.smsNotifications += amount;
      break;
    case UsageMetricType.EMAIL_NOTIFICATIONS:
      record.emailNotifications += amount;
      break;
  }

  return { ...record, date: new Date(record.date) };
}

// ---------------------------------------------------------------------------
// Querying usage
// ---------------------------------------------------------------------------

/**
 * Get the usage record for a specific date.
 */
export function getDailyUsage(facilityId: string, date: Date): UsageRecord {
  const store = getFacilityStore(facilityId);
  const key = dateKey(date);
  const record = store.get(key);

  if (!record) {
    return {
      facilityId,
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      activePatients: 0,
      sessionsCount: 0,
      storageGb: 0,
      apiCalls: 0,
      caregiverAccounts: 0,
      clinicianAccounts: 0,
      reportExports: 0,
      smsNotifications: 0,
      emailNotifications: 0,
    };
  }

  return { ...record, date: new Date(record.date) };
}

/**
 * Get aggregated usage for an entire month.
 * Patient counts, storage, and account counts use the max value from the month.
 * Other metrics are summed.
 */
export function getMonthlyUsage(facilityId: string, year: number, month: number): UsageRecord {
  const store = getFacilityStore(facilityId);
  const mKey = `${year}-${String(month).padStart(2, '0')}`;

  const aggregate: UsageRecord = {
    facilityId,
    date: new Date(year, month - 1, 1),
    activePatients: 0,
    sessionsCount: 0,
    storageGb: 0,
    apiCalls: 0,
    caregiverAccounts: 0,
    clinicianAccounts: 0,
    reportExports: 0,
    smsNotifications: 0,
    emailNotifications: 0,
  };

  for (const [key, record] of store.entries()) {
    if (key.startsWith(mKey)) {
      aggregate.activePatients = Math.max(aggregate.activePatients, record.activePatients);
      aggregate.sessionsCount += record.sessionsCount;
      aggregate.storageGb = Math.max(aggregate.storageGb, record.storageGb);
      aggregate.apiCalls += record.apiCalls;
      aggregate.caregiverAccounts = Math.max(aggregate.caregiverAccounts, record.caregiverAccounts);
      aggregate.clinicianAccounts = Math.max(aggregate.clinicianAccounts, record.clinicianAccounts);
      aggregate.reportExports += record.reportExports;
      aggregate.smsNotifications += record.smsNotifications;
      aggregate.emailNotifications += record.emailNotifications;
    }
  }

  return aggregate;
}

/**
 * Get a summary of usage for the current billing period.
 */
export function getUsageSummary(
  facilityId: string,
  periodStart: Date,
  periodEnd: Date,
): UsageRecord {
  const store = getFacilityStore(facilityId);
  const startKey = dateKey(periodStart);
  const endKey = dateKey(periodEnd);

  const aggregate: UsageRecord = {
    facilityId,
    date: new Date(periodStart),
    activePatients: 0,
    sessionsCount: 0,
    storageGb: 0,
    apiCalls: 0,
    caregiverAccounts: 0,
    clinicianAccounts: 0,
    reportExports: 0,
    smsNotifications: 0,
    emailNotifications: 0,
  };

  for (const [key, record] of store.entries()) {
    if (key >= startKey && key <= endKey) {
      aggregate.activePatients = Math.max(aggregate.activePatients, record.activePatients);
      aggregate.sessionsCount += record.sessionsCount;
      aggregate.storageGb = Math.max(aggregate.storageGb, record.storageGb);
      aggregate.apiCalls += record.apiCalls;
      aggregate.caregiverAccounts = Math.max(aggregate.caregiverAccounts, record.caregiverAccounts);
      aggregate.clinicianAccounts = Math.max(aggregate.clinicianAccounts, record.clinicianAccounts);
      aggregate.reportExports += record.reportExports;
      aggregate.smsNotifications += record.smsNotifications;
      aggregate.emailNotifications += record.emailNotifications;
    }
  }

  return aggregate;
}

// ---------------------------------------------------------------------------
// Limit checking
// ---------------------------------------------------------------------------

/**
 * Check whether a facility's usage is within the limits of a given plan.
 * Returns warnings for metrics approaching limits and exceeded entries.
 */
export function checkUsageLimits(
  facilityId: string,
  tier: PricingTier,
  periodStart: Date,
  periodEnd: Date,
): UsageLimitCheck {
  const limits = getPlanLimits(tier);
  const usage = getUsageSummary(facilityId, periodStart, periodEnd);

  const warnings: UsageLimitWarning[] = [];
  const exceeded: UsageLimitExceeded[] = [];

  const checks: { metric: UsageMetricType; current: number; limit: number; overageRate: number }[] = [
    { metric: UsageMetricType.ACTIVE_PATIENTS, current: usage.activePatients, limit: limits.maxPatients, overageRate: 15 },
    { metric: UsageMetricType.STORAGE_GB, current: usage.storageGb, limit: limits.maxStorageGb, overageRate: 2 },
    { metric: UsageMetricType.API_CALLS, current: usage.apiCalls, limit: limits.maxApiCallsPerMonth, overageRate: 0.005 },
    { metric: UsageMetricType.SMS_NOTIFICATIONS, current: usage.smsNotifications, limit: limits.maxSmsNotifications, overageRate: 0.05 },
    { metric: UsageMetricType.EMAIL_NOTIFICATIONS, current: usage.emailNotifications, limit: limits.maxEmailNotifications, overageRate: 0.01 },
    { metric: UsageMetricType.REPORT_EXPORTS, current: usage.reportExports, limit: limits.maxReportExports, overageRate: 0.5 },
  ];

  for (const check of checks) {
    if (check.limit <= 0 || check.limit >= 999999) continue; // Unlimited

    const percentage = check.current / check.limit;

    if (check.current > check.limit) {
      const overage = check.current - check.limit;
      exceeded.push({
        metric: check.metric,
        current: check.current,
        limit: check.limit,
        overage,
        estimatedCharge: Math.round(overage * check.overageRate * 100) / 100,
        message: `${check.metric} usage (${check.current}) has exceeded the limit of ${check.limit}. Estimated overage charge: $${(overage * check.overageRate).toFixed(2)}.`,
      });
    } else if (percentage >= WARNING_THRESHOLD) {
      warnings.push({
        metric: check.metric,
        current: check.current,
        limit: check.limit,
        percentage: Math.round(percentage * 100),
        message: `${check.metric} usage is at ${Math.round(percentage * 100)}% of the ${check.limit} limit.`,
      });
    }
  }

  return {
    withinLimits: exceeded.length === 0,
    warnings,
    exceeded,
  };
}

/**
 * Get a detailed storage usage breakdown for a facility.
 * In demo mode, generates a realistic breakdown.
 */
export function calculateStorageUsage(
  facilityId: string,
  tier: PricingTier,
): StorageUsageSummary {
  const limits = getPlanLimits(tier);
  const today = new Date();
  const dailyUsage = getDailyUsage(facilityId, today);
  const usedGb = dailyUsage.storageGb;
  const limitGb = limits.maxStorageGb;
  const percentage = limitGb > 0 ? Math.round((usedGb / limitGb) * 10000) / 100 : 0;

  // Generate a realistic breakdown
  const patientDataGb = Math.round(usedGb * 0.45 * 100) / 100;
  const mediaFilesGb = Math.round(usedGb * 0.25 * 100) / 100;
  const reportsGb = Math.round(usedGb * 0.15 * 100) / 100;
  const backupsGb = Math.round(usedGb * 0.10 * 100) / 100;
  const otherGb = Math.round((usedGb - patientDataGb - mediaFilesGb - reportsGb - backupsGb) * 100) / 100;

  const breakdown: StorageBreakdown = {
    patientDataGb,
    mediaFilesGb,
    reportsGb,
    backupsGb,
    otherGb: Math.max(0, otherGb),
  };

  return { facilityId, usedGb, limitGb, percentage, breakdown };
}

// ---------------------------------------------------------------------------
// Demo Data Generation
// ---------------------------------------------------------------------------

/**
 * Generate realistic usage data for a facility over the last N days.
 * Useful for demonstrations and testing.
 */
export function generateDemoUsageData(
  facilityId: string,
  days: number = 30,
  options: {
    basePatients?: number;
    baseSessions?: number;
    baseStorageGb?: number;
    baseApiCalls?: number;
    baseCaregivers?: number;
    baseClinicians?: number;
  } = {},
): UsageRecord[] {
  const {
    basePatients = 20,
    baseSessions = 40,
    baseStorageGb = 5.0,
    baseApiCalls = 200,
    baseCaregivers = 30,
    baseClinicians = 3,
  } = options;

  const records: UsageRecord[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    // Simulate gradual growth
    const growthFactor = 1 + (days - i) * 0.005;
    // Add some daily variance
    const variance = 0.85 + Math.random() * 0.30;
    // Weekday/weekend pattern
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const weekendFactor = isWeekend ? 0.6 : 1.0;

    const patients = Math.round(basePatients * growthFactor);
    const sessions = Math.round(baseSessions * growthFactor * variance * weekendFactor);
    const storageGrowth = baseStorageGb + (days - i) * 0.02;
    const apiCallsDaily = Math.round(baseApiCalls * growthFactor * variance * weekendFactor);
    const reportExports = isWeekend ? 0 : Math.floor(Math.random() * 3);
    const smsDaily = Math.round(sessions * 0.3 * variance);
    const emailDaily = Math.round(sessions * 0.8 * variance);

    recordUsage(facilityId, UsageMetricType.ACTIVE_PATIENTS, patients, date);
    recordUsage(facilityId, UsageMetricType.SESSIONS_COUNT, sessions, date);
    recordUsage(facilityId, UsageMetricType.STORAGE_GB, Math.round(storageGrowth * 100) / 100, date);
    recordUsage(facilityId, UsageMetricType.API_CALLS, apiCallsDaily, date);
    recordUsage(facilityId, UsageMetricType.CAREGIVER_ACCOUNTS, Math.round(baseCaregivers * growthFactor), date);
    recordUsage(facilityId, UsageMetricType.CLINICIAN_ACCOUNTS, baseClinicians, date);
    recordUsage(facilityId, UsageMetricType.REPORT_EXPORTS, reportExports, date);
    recordUsage(facilityId, UsageMetricType.SMS_NOTIFICATIONS, smsDaily, date);
    recordUsage(facilityId, UsageMetricType.EMAIL_NOTIFICATIONS, emailDaily, date);

    records.push(getDailyUsage(facilityId, date));
  }

  return records;
}

/**
 * Get usage trend data: an array of daily records for a given range.
 */
export function getUsageTrend(
  facilityId: string,
  startDate: Date,
  endDate: Date,
): UsageRecord[] {
  const records: UsageRecord[] = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    records.push(getDailyUsage(facilityId, current));
    current.setDate(current.getDate() + 1);
  }

  return records;
}

/**
 * Clear all usage data for a facility (useful for testing).
 */
export function clearUsageData(facilityId: string): void {
  usageStore.delete(facilityId);
}

/**
 * Clear all usage data across all facilities.
 */
export function resetAllUsageData(): void {
  usageStore.clear();
}
