/**
 * Comprehensive tests for the @gentle-reminder/billing package.
 */

import {
  // Pricing
  PLANS,
  calculateMonthlyPrice,
  calculateAnnualPrice,
  calculateQuarterlyPrice,
  getFeatureAccess,
  getPlanLimits,
  getPlan,
  getPlanById,
  getAllPlans,
  comparePlans,
  getRecommendedPlan,
  calculateProration,
  estimateTotalCost,
  getPricingBreakdown,
  getEffectiveMonthlyPrice,

  // Invoice
  generateInvoiceNumber,
  generateLineItems,
  calculateOverageCharges,
  generateMonthlyInvoice,
  formatInvoiceAsText,
  formatInvoiceAsHTML,

  // Subscription
  createSubscription,
  upgradeSubscription,
  downgradeSubscription,
  cancelSubscription,
  reactivateSubscription,
  getSubscriptionStatus,
  checkTrialExpiry,
  handlePaymentFailure,
  updatePatientCount,
  getSubscription,
  getSubscriptionsForFacility,
  getEventLog,
  resetDemoData,

  // Usage
  recordUsage,
  getDailyUsage,
  getMonthlyUsage,
  getUsageSummary,
  checkUsageLimits,
  calculateStorageUsage,
  generateDemoUsageData,
  clearUsageData,
  resetAllUsageData,

  // Types / Enums
  PricingTier,
  SubscriptionStatus,
  BillingPeriod,
  UsageMetricType,
  InvoiceStatus,
  Currency,
} from '../src';

// ---------------------------------------------------------------------------
// Setup & teardown
// ---------------------------------------------------------------------------

beforeEach(() => {
  resetDemoData();
  resetAllUsageData();
});

// ---------------------------------------------------------------------------
// Pricing Engine Tests
// ---------------------------------------------------------------------------

describe('PricingEngine', () => {
  test('PLANS contains all three tiers', () => {
    expect(PLANS[PricingTier.STANDARD]).toBeDefined();
    expect(PLANS[PricingTier.PROFESSIONAL]).toBeDefined();
    expect(PLANS[PricingTier.ENTERPRISE]).toBeDefined();
  });

  test('calculateMonthlyPrice for Standard with 10 patients', () => {
    const plan = PLANS[PricingTier.STANDARD];
    const price = calculateMonthlyPrice(plan, 10);
    // Base $49 + 10 * $12 = $169 (no volume discount below 50)
    expect(price).toBe(169);
  });

  test('calculateMonthlyPrice applies volume discount at 50+ patients', () => {
    const plan = PLANS[PricingTier.STANDARD];
    const priceWithoutDiscount = plan.basePrice + plan.pricePerPatient * 55;
    const price = calculateMonthlyPrice(plan, 55);
    // 5% discount
    expect(price).toBe(Math.round(priceWithoutDiscount * 0.95 * 100) / 100);
    expect(price).toBeLessThan(priceWithoutDiscount);
  });

  test('calculateMonthlyPrice applies 10% volume discount at 100+ patients', () => {
    const plan = PLANS[PricingTier.PROFESSIONAL];
    const priceNoDiscount = plan.basePrice + plan.pricePerPatient * 100;
    const price = calculateMonthlyPrice(plan, 100);
    expect(price).toBe(Math.round(priceNoDiscount * 0.9 * 100) / 100);
  });

  test('calculateAnnualPrice applies 10% annual discount', () => {
    const plan = PLANS[PricingTier.STANDARD];
    const monthly = calculateMonthlyPrice(plan, 10);
    const annual = calculateAnnualPrice(plan, 10);
    const expectedAnnual = Math.round(monthly * 12 * 0.9 * 100) / 100;
    expect(annual).toBe(expectedAnnual);
  });

  test('calculateQuarterlyPrice applies 5% quarterly discount', () => {
    const plan = PLANS[PricingTier.STANDARD];
    const monthly = calculateMonthlyPrice(plan, 10);
    const quarterly = calculateQuarterlyPrice(plan, 10);
    const expectedQuarterly = Math.round(monthly * 3 * 0.95 * 100) / 100;
    expect(quarterly).toBe(expectedQuarterly);
  });

  test('getEffectiveMonthlyPrice returns correct price per billing period', () => {
    const plan = PLANS[PricingTier.STANDARD];
    const monthly = getEffectiveMonthlyPrice(plan, 10, BillingPeriod.MONTHLY);
    const annualMonthly = getEffectiveMonthlyPrice(plan, 10, BillingPeriod.ANNUAL);
    expect(annualMonthly).toBeLessThan(monthly);
  });

  test('getFeatureAccess correctly checks standard tier', () => {
    expect(getFeatureAccess(PricingTier.STANDARD, 'cognitive_exercises')).toBe(true);
    expect(getFeatureAccess(PricingTier.STANDARD, 'clinician_dashboard')).toBe(false);
    expect(getFeatureAccess(PricingTier.STANDARD, 'api_access')).toBe(false);
  });

  test('getFeatureAccess correctly checks professional tier', () => {
    expect(getFeatureAccess(PricingTier.PROFESSIONAL, 'cognitive_exercises')).toBe(true);
    expect(getFeatureAccess(PricingTier.PROFESSIONAL, 'clinician_dashboard')).toBe(true);
    expect(getFeatureAccess(PricingTier.PROFESSIONAL, 'sso_integration')).toBe(false);
  });

  test('getFeatureAccess correctly checks enterprise tier', () => {
    expect(getFeatureAccess(PricingTier.ENTERPRISE, 'sso_integration')).toBe(true);
    expect(getFeatureAccess(PricingTier.ENTERPRISE, 'white_label')).toBe(true);
    expect(getFeatureAccess(PricingTier.ENTERPRISE, 'multi_facility')).toBe(true);
  });

  test('getPlanLimits returns correct limits for each tier', () => {
    const standard = getPlanLimits(PricingTier.STANDARD);
    expect(standard.maxPatients).toBe(25);

    const professional = getPlanLimits(PricingTier.PROFESSIONAL);
    expect(professional.maxPatients).toBe(100);

    const enterprise = getPlanLimits(PricingTier.ENTERPRISE);
    expect(enterprise.maxPatients).toBe(999999);
  });

  test('getPlan and getPlanById return matching plans', () => {
    const plan = getPlan(PricingTier.PROFESSIONAL);
    const planById = getPlanById(plan.id);
    expect(planById).toBeDefined();
    expect(planById!.tier).toBe(PricingTier.PROFESSIONAL);
  });

  test('getAllPlans returns plans sorted by sortOrder', () => {
    const plans = getAllPlans();
    expect(plans).toHaveLength(3);
    expect(plans[0].tier).toBe(PricingTier.STANDARD);
    expect(plans[1].tier).toBe(PricingTier.PROFESSIONAL);
    expect(plans[2].tier).toBe(PricingTier.ENTERPRISE);
  });

  test('comparePlans returns added and removed features', () => {
    const comparison = comparePlans(PricingTier.STANDARD, PricingTier.PROFESSIONAL);
    expect(comparison.additionalFeatures.length).toBeGreaterThan(0);
    expect(comparison.removedFeatures).toHaveLength(0);
    expect(comparison.priceDifference).toBe(100); // 149 - 49
  });

  test('getRecommendedPlan for small facility returns Standard', () => {
    const rec = getRecommendedPlan(10);
    expect(rec.recommendedTier).toBe(PricingTier.STANDARD);
  });

  test('getRecommendedPlan for clinical needs returns Professional', () => {
    const rec = getRecommendedPlan(30, { needsClinicalDashboard: true });
    expect(rec.recommendedTier).toBe(PricingTier.PROFESSIONAL);
  });

  test('getRecommendedPlan for SSO need returns Enterprise', () => {
    const rec = getRecommendedPlan(10, { needsSso: true });
    expect(rec.recommendedTier).toBe(PricingTier.ENTERPRISE);
  });

  test('getRecommendedPlan for large patient count returns Enterprise', () => {
    const rec = getRecommendedPlan(200);
    expect(rec.recommendedTier).toBe(PricingTier.ENTERPRISE);
  });

  test('calculateProration computes net charge for upgrade', () => {
    const current = PLANS[PricingTier.STANDARD];
    const target = PLANS[PricingTier.PROFESSIONAL];
    const result = calculateProration(current, target, 15, 30, 10);
    expect(result.daysRemaining).toBe(15);
    expect(result.netAmount).toBeGreaterThan(0);
    expect(result.creditAmount).toBeGreaterThan(0);
    expect(result.chargeAmount).toBeGreaterThan(result.creditAmount);
  });

  test('estimateTotalCost for 12 months', () => {
    const total = estimateTotalCost(PricingTier.STANDARD, 10, 12, BillingPeriod.MONTHLY);
    expect(total).toBe(169 * 12);
  });

  test('getPricingBreakdown returns formatted labels', () => {
    const breakdown = getPricingBreakdown(PricingTier.STANDARD, 10);
    expect(breakdown.basePriceLabel).toContain('$49');
    expect(breakdown.perPatientLabel).toContain('10 patients');
    expect(breakdown.monthlyTotal).toBe(169);
    expect(breakdown.annualSavings).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Invoice Generator Tests
// ---------------------------------------------------------------------------

describe('InvoiceGenerator', () => {
  test('generateInvoiceNumber produces sequential GR-YYYY-XXXX format', () => {
    const num1 = generateInvoiceNumber();
    const num2 = generateInvoiceNumber();
    expect(num1).toMatch(/^GR-\d{4}-\d{4,}$/);
    expect(num2).toMatch(/^GR-\d{4}-\d{4,}$/);
    expect(num1).not.toBe(num2);
  });

  test('generateLineItems creates base and per-patient items', () => {
    const sub = createSubscription({
      facilityId: 'fac_test',
      planId: PLANS[PricingTier.STANDARD].id,
      paymentMethodId: 'pm_test',
      patientCount: 10,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    const usage = {
      facilityId: 'fac_test',
      date: new Date(),
      activePatients: 10,
      sessionsCount: 50,
      storageGb: 3,
      apiCalls: 0,
      caregiverAccounts: 15,
      clinicianAccounts: 2,
      reportExports: 5,
      smsNotifications: 0,
      emailNotifications: 100,
    };

    const items = generateLineItems(sub, usage);
    expect(items.length).toBeGreaterThanOrEqual(2);
    expect(items.find((i) => i.type === 'base')).toBeDefined();
    expect(items.find((i) => i.type === 'per_patient')).toBeDefined();
  });

  test('calculateOverageCharges detects storage overage', () => {
    const limits = getPlanLimits(PricingTier.STANDARD);
    const usage = {
      facilityId: 'fac_test',
      date: new Date(),
      activePatients: 10,
      sessionsCount: 50,
      storageGb: limits.maxStorageGb + 5,
      apiCalls: 0,
      caregiverAccounts: 15,
      clinicianAccounts: 2,
      reportExports: 5,
      smsNotifications: 0,
      emailNotifications: 100,
    };

    const overages = calculateOverageCharges(usage, limits);
    expect(overages.length).toBeGreaterThan(0);
    const storageOverage = overages.find((o) => o.description.includes('Storage'));
    expect(storageOverage).toBeDefined();
    expect(storageOverage!.amount).toBe(10); // 5 GB * $2
  });

  test('generateMonthlyInvoice creates a complete invoice', () => {
    const sub = createSubscription({
      facilityId: 'fac_inv',
      planId: PLANS[PricingTier.PROFESSIONAL].id,
      paymentMethodId: 'pm_test',
      patientCount: 20,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    const usage = {
      facilityId: 'fac_inv',
      date: new Date(),
      activePatients: 20,
      sessionsCount: 100,
      storageGb: 10,
      apiCalls: 1000,
      caregiverAccounts: 30,
      clinicianAccounts: 5,
      reportExports: 10,
      smsNotifications: 200,
      emailNotifications: 500,
    };

    const invoice = generateMonthlyInvoice(sub, usage);
    expect(invoice.invoiceNumber).toMatch(/^GR-/);
    expect(invoice.status).toBe(InvoiceStatus.PENDING);
    expect(invoice.amount).toBeGreaterThan(0);
    expect(invoice.lineItems.length).toBeGreaterThanOrEqual(2);
    expect(invoice.currency).toBe(Currency.USD);
  });

  test('formatInvoiceAsText produces readable output', () => {
    const sub = createSubscription({
      facilityId: 'fac_fmt',
      planId: PLANS[PricingTier.STANDARD].id,
      paymentMethodId: 'pm_test',
      patientCount: 5,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    const usage = {
      facilityId: 'fac_fmt',
      date: new Date(),
      activePatients: 5,
      sessionsCount: 20,
      storageGb: 2,
      apiCalls: 0,
      caregiverAccounts: 10,
      clinicianAccounts: 1,
      reportExports: 2,
      smsNotifications: 0,
      emailNotifications: 50,
    };

    const invoice = generateMonthlyInvoice(sub, usage);
    const text = formatInvoiceAsText(invoice);
    expect(text).toContain('GENTLE REMINDER');
    expect(text).toContain(invoice.invoiceNumber);
    expect(text).toContain('TOTAL DUE');
    expect(text).toContain('billing@gentlereminder.care');
  });

  test('formatInvoiceAsHTML produces valid HTML', () => {
    const sub = createSubscription({
      facilityId: 'fac_html',
      planId: PLANS[PricingTier.STANDARD].id,
      paymentMethodId: 'pm_test',
      patientCount: 5,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    const usage = {
      facilityId: 'fac_html',
      date: new Date(),
      activePatients: 5,
      sessionsCount: 20,
      storageGb: 2,
      apiCalls: 0,
      caregiverAccounts: 10,
      clinicianAccounts: 1,
      reportExports: 2,
      smsNotifications: 0,
      emailNotifications: 50,
    };

    const invoice = generateMonthlyInvoice(sub, usage);
    const html = formatInvoiceAsHTML(invoice);
    expect(html).toContain('<!DOCTYPE html>');
    expect(html).toContain('Gentle Reminder');
    expect(html).toContain(invoice.invoiceNumber);
    expect(html).toContain('Total Due');
  });
});

// ---------------------------------------------------------------------------
// Subscription Manager Tests
// ---------------------------------------------------------------------------

describe('SubscriptionManager', () => {
  test('createSubscription creates a trial subscription', () => {
    const sub = createSubscription({
      facilityId: 'fac_1',
      planId: PLANS[PricingTier.STANDARD].id,
      paymentMethodId: 'pm_1',
      patientCount: 10,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    expect(sub.id).toBeDefined();
    expect(sub.status).toBe(SubscriptionStatus.TRIAL);
    expect(sub.tier).toBe(PricingTier.STANDARD);
    expect(sub.patientCount).toBe(10);
    expect(sub.trialEndDate).toBeDefined();
  });

  test('createSubscription prevents duplicate active subscriptions', () => {
    createSubscription({
      facilityId: 'fac_dup',
      planId: PLANS[PricingTier.STANDARD].id,
      paymentMethodId: 'pm_1',
      patientCount: 5,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    expect(() =>
      createSubscription({
        facilityId: 'fac_dup',
        planId: PLANS[PricingTier.PROFESSIONAL].id,
        paymentMethodId: 'pm_1',
        patientCount: 5,
        billingPeriod: BillingPeriod.MONTHLY,
      }),
    ).toThrow(/already has an active subscription/);
  });

  test('upgradeSubscription moves to higher tier with proration', () => {
    const sub = createSubscription({
      facilityId: 'fac_up',
      planId: PLANS[PricingTier.STANDARD].id,
      paymentMethodId: 'pm_1',
      patientCount: 10,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    const result = upgradeSubscription({
      subscriptionId: sub.id,
      newPlanId: PLANS[PricingTier.PROFESSIONAL].id,
      effectiveImmediately: true,
    });

    expect(result.subscription.tier).toBe(PricingTier.PROFESSIONAL);
    expect(result.subscription.status).toBe(SubscriptionStatus.ACTIVE);
    expect(result.prorationCredit).toBeGreaterThanOrEqual(0);
    expect(result.newMonthlyAmount).toBeGreaterThan(0);
  });

  test('upgradeSubscription rejects downgrade attempt', () => {
    const sub = createSubscription({
      facilityId: 'fac_nodown',
      planId: PLANS[PricingTier.PROFESSIONAL].id,
      paymentMethodId: 'pm_1',
      patientCount: 10,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    expect(() =>
      upgradeSubscription({
        subscriptionId: sub.id,
        newPlanId: PLANS[PricingTier.STANDARD].id,
        effectiveImmediately: true,
      }),
    ).toThrow(/lower-tier/);
  });

  test('downgradeSubscription moves to lower tier', () => {
    const sub = createSubscription({
      facilityId: 'fac_down',
      planId: PLANS[PricingTier.PROFESSIONAL].id,
      paymentMethodId: 'pm_1',
      patientCount: 10,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    // Need to change status to ACTIVE for downgrade (trial is fine too)
    const result = downgradeSubscription({
      subscriptionId: sub.id,
      newPlanId: PLANS[PricingTier.STANDARD].id,
      effectiveImmediately: true,
    });

    expect(result.subscription.tier).toBe(PricingTier.STANDARD);
  });

  test('cancelSubscription immediately sets cancelled status', () => {
    const sub = createSubscription({
      facilityId: 'fac_cancel',
      planId: PLANS[PricingTier.STANDARD].id,
      paymentMethodId: 'pm_1',
      patientCount: 5,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    const result = cancelSubscription({
      subscriptionId: sub.id,
      reason: 'Testing cancellation',
      cancelImmediately: true,
    });

    expect(result.subscription.status).toBe(SubscriptionStatus.CANCELLED);
    expect(result.subscription.cancelledAt).toBeDefined();
    expect(result.refundAmount).toBeGreaterThanOrEqual(0);
  });

  test('cancelSubscription at end of period keeps active status', () => {
    const sub = createSubscription({
      facilityId: 'fac_cancel2',
      planId: PLANS[PricingTier.STANDARD].id,
      paymentMethodId: 'pm_1',
      patientCount: 5,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    const result = cancelSubscription({
      subscriptionId: sub.id,
      reason: 'Switching providers',
      cancelImmediately: false,
      feedback: 'Great product, just not the right fit',
    });

    // Status stays trial/active until period end
    expect(result.subscription.status).not.toBe(SubscriptionStatus.CANCELLED);
    expect(result.subscription.endDate).toBeDefined();
  });

  test('reactivateSubscription restores cancelled subscription', () => {
    const sub = createSubscription({
      facilityId: 'fac_react',
      planId: PLANS[PricingTier.STANDARD].id,
      paymentMethodId: 'pm_1',
      patientCount: 5,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    cancelSubscription({
      subscriptionId: sub.id,
      reason: 'Testing',
      cancelImmediately: true,
    });

    const reactivated = reactivateSubscription(sub.id);
    expect(reactivated.status).toBe(SubscriptionStatus.ACTIVE);
    expect(reactivated.cancelledAt).toBeNull();
    expect(reactivated.autoRenew).toBe(true);
  });

  test('checkTrialExpiry detects active trial', () => {
    const sub = createSubscription({
      facilityId: 'fac_trial',
      planId: PLANS[PricingTier.STANDARD].id,
      paymentMethodId: 'pm_1',
      patientCount: 5,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    const status = checkTrialExpiry(sub.id);
    expect(status.isActive).toBe(true);
    expect(status.expired).toBe(false);
    expect(status.daysRemaining).toBeGreaterThan(0);
  });

  test('handlePaymentFailure marks subscription past due then suspended', () => {
    const sub = createSubscription({
      facilityId: 'fac_fail',
      planId: PLANS[PricingTier.STANDARD].id,
      paymentMethodId: 'pm_1',
      patientCount: 5,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    const result1 = handlePaymentFailure(sub.id);
    expect(result1.action).toBe('marked_past_due');
    expect(result1.retryDate).toBeDefined();

    const result2 = handlePaymentFailure(sub.id);
    expect(result2.action).toBe('marked_past_due');

    const result3 = handlePaymentFailure(sub.id);
    expect(result3.action).toBe('suspended');
    expect(result3.subscription.status).toBe(SubscriptionStatus.SUSPENDED);
  });

  test('getSubscriptionStatus returns enriched data', () => {
    const sub = createSubscription({
      facilityId: 'fac_status',
      planId: PLANS[PricingTier.STANDARD].id,
      paymentMethodId: 'pm_1',
      patientCount: 10,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    const status = getSubscriptionStatus(sub.id);
    expect(status.planName).toBe('Standard');
    expect(status.monthlyPrice).toBeGreaterThan(0);
    expect(status.isInTrial).toBe(true);
    expect(status.trialDaysRemaining).toBeGreaterThan(0);
  });

  test('updatePatientCount updates count within limits', () => {
    const sub = createSubscription({
      facilityId: 'fac_patients',
      planId: PLANS[PricingTier.STANDARD].id,
      paymentMethodId: 'pm_1',
      patientCount: 5,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    const updated = updatePatientCount(sub.id, 20);
    expect(updated.patientCount).toBe(20);
  });

  test('updatePatientCount rejects count above plan limit', () => {
    const sub = createSubscription({
      facilityId: 'fac_over',
      planId: PLANS[PricingTier.STANDARD].id,
      paymentMethodId: 'pm_1',
      patientCount: 5,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    expect(() => updatePatientCount(sub.id, 100)).toThrow(/exceeds/);
  });

  test('getSubscriptionsForFacility returns matching subscriptions', () => {
    createSubscription({
      facilityId: 'fac_multi',
      planId: PLANS[PricingTier.STANDARD].id,
      paymentMethodId: 'pm_1',
      patientCount: 5,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    const subs = getSubscriptionsForFacility('fac_multi');
    expect(subs).toHaveLength(1);
  });

  test('getEventLog records billing events', () => {
    const sub = createSubscription({
      facilityId: 'fac_events',
      planId: PLANS[PricingTier.STANDARD].id,
      paymentMethodId: 'pm_1',
      patientCount: 5,
      billingPeriod: BillingPeriod.MONTHLY,
    });

    const events = getEventLog(sub.id);
    expect(events.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Usage Tracker Tests
// ---------------------------------------------------------------------------

describe('UsageTracker', () => {
  test('recordUsage creates a daily record', () => {
    recordUsage('fac_use1', UsageMetricType.ACTIVE_PATIENTS, 15);
    const daily = getDailyUsage('fac_use1', new Date());
    expect(daily.activePatients).toBe(15);
  });

  test('recordUsage increments session count', () => {
    recordUsage('fac_use2', UsageMetricType.SESSIONS_COUNT, 10);
    recordUsage('fac_use2', UsageMetricType.SESSIONS_COUNT, 5);
    const daily = getDailyUsage('fac_use2', new Date());
    expect(daily.sessionsCount).toBe(15);
  });

  test('getMonthlyUsage aggregates across days', () => {
    const now = new Date();
    const day1 = new Date(now.getFullYear(), now.getMonth(), 1);
    const day2 = new Date(now.getFullYear(), now.getMonth(), 2);

    recordUsage('fac_month', UsageMetricType.SESSIONS_COUNT, 20, day1);
    recordUsage('fac_month', UsageMetricType.SESSIONS_COUNT, 30, day2);
    recordUsage('fac_month', UsageMetricType.ACTIVE_PATIENTS, 10, day1);
    recordUsage('fac_month', UsageMetricType.ACTIVE_PATIENTS, 12, day2);

    const monthly = getMonthlyUsage('fac_month', now.getFullYear(), now.getMonth() + 1);
    expect(monthly.sessionsCount).toBe(50);
    expect(monthly.activePatients).toBe(12); // Max, not sum
  });

  test('checkUsageLimits detects warnings near limits', () => {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    recordUsage('fac_warn', UsageMetricType.ACTIVE_PATIENTS, 22); // 88% of 25
    recordUsage('fac_warn', UsageMetricType.STORAGE_GB, 9); // 90% of 10

    const check = checkUsageLimits('fac_warn', PricingTier.STANDARD, periodStart, periodEnd);
    expect(check.withinLimits).toBe(true);
    expect(check.warnings.length).toBeGreaterThan(0);
  });

  test('checkUsageLimits detects exceeded limits', () => {
    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    recordUsage('fac_exceed', UsageMetricType.STORAGE_GB, 15); // Over 10 GB limit

    const check = checkUsageLimits('fac_exceed', PricingTier.STANDARD, periodStart, periodEnd);
    expect(check.withinLimits).toBe(false);
    expect(check.exceeded.length).toBeGreaterThan(0);
    expect(check.exceeded[0].estimatedCharge).toBeGreaterThan(0);
  });

  test('calculateStorageUsage returns breakdown', () => {
    recordUsage('fac_store', UsageMetricType.STORAGE_GB, 8);
    const summary = calculateStorageUsage('fac_store', PricingTier.STANDARD);
    expect(summary.usedGb).toBe(8);
    expect(summary.limitGb).toBe(10);
    expect(summary.percentage).toBe(80);
    expect(summary.breakdown.patientDataGb).toBeGreaterThan(0);
  });

  test('generateDemoUsageData creates records for N days', () => {
    const records = generateDemoUsageData('fac_demo', 7);
    expect(records).toHaveLength(7);
    expect(records[0].activePatients).toBeGreaterThan(0);
    expect(records[0].sessionsCount).toBeGreaterThan(0);
  });

  test('clearUsageData removes facility data', () => {
    recordUsage('fac_clear', UsageMetricType.SESSIONS_COUNT, 50);
    clearUsageData('fac_clear');
    const daily = getDailyUsage('fac_clear', new Date());
    expect(daily.sessionsCount).toBe(0);
  });
});
