/**
 * PricingEngine - Calculates pricing, compares plans, and recommends tiers
 * for the Gentle Reminder dementia care platform.
 */

import {
  PricingTier,
  SubscriptionPlan,
  PlanFeature,
  PlanLimits,
  PlanComparison,
  LimitChange,
  PlanRecommendation,
  ProrationResult,
  BillingPeriod,
} from './types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ANNUAL_DISCOUNT_RATE = 0.10; // 10% discount for annual billing
const QUARTERLY_DISCOUNT_RATE = 0.05; // 5% discount for quarterly billing
const VOLUME_DISCOUNT_THRESHOLD_1 = 50; // 5% off above 50 patients
const VOLUME_DISCOUNT_THRESHOLD_2 = 100; // 10% off above 100 patients
const VOLUME_DISCOUNT_THRESHOLD_3 = 250; // 15% off above 250 patients
const VOLUME_DISCOUNT_RATE_1 = 0.05;
const VOLUME_DISCOUNT_RATE_2 = 0.10;
const VOLUME_DISCOUNT_RATE_3 = 0.15;

// ---------------------------------------------------------------------------
// Plan Definitions
// ---------------------------------------------------------------------------

const STANDARD_FEATURES: PlanFeature[] = [
  { id: 'cognitive_exercises', name: 'Cognitive Exercises', description: 'Core cognitive exercise library with adaptive difficulty', included: true },
  { id: 'patient_profiles', name: 'Patient Profiles', description: 'Create and manage patient profiles with preferences', included: true },
  { id: 'basic_reporting', name: 'Basic Reporting', description: 'Session summaries and weekly progress snapshots', included: true },
  { id: 'caregiver_portal', name: 'Caregiver Portal', description: 'View patient progress and session history', included: true },
  { id: 'email_notifications', name: 'Email Notifications', description: 'Session reminders and weekly summaries via email', included: true },
  { id: 'data_export_csv', name: 'CSV Data Export', description: 'Export patient data and results in CSV format', included: true },
  { id: 'gentle_feedback', name: 'Gentle AI Feedback', description: 'Warm, encouraging feedback messages during sessions', included: true },
  { id: 'spaced_repetition', name: 'Spaced Repetition', description: 'Intelligent scheduling of review exercises', included: true },
  { id: 'advanced_analytics', name: 'Advanced Analytics', description: 'Detailed trend analysis and decline detection', included: false },
  { id: 'clinician_dashboard', name: 'Clinician Dashboard', description: 'Multi-patient clinical oversight dashboard', included: false },
  { id: 'sms_notifications', name: 'SMS Notifications', description: 'Session reminders and alerts via SMS', included: false },
  { id: 'api_access', name: 'API Access', description: 'Programmatic access to patient data and results', included: false },
  { id: 'custom_exercises', name: 'Custom Exercises', description: 'Create facility-specific exercises and prompts', included: false },
  { id: 'hipaa_audit_log', name: 'HIPAA Audit Log', description: 'Complete audit trail for HIPAA compliance', included: false },
  { id: 'multi_facility', name: 'Multi-Facility Management', description: 'Manage multiple care locations from one account', included: false },
  { id: 'priority_support', name: 'Priority Support', description: 'Dedicated support channel with 4-hour SLA', included: false },
  { id: 'white_label', name: 'White Label', description: 'Custom branding and logo on patient-facing screens', included: false },
  { id: 'sso_integration', name: 'SSO Integration', description: 'Single sign-on with SAML/OIDC identity providers', included: false },
];

const PROFESSIONAL_FEATURES: PlanFeature[] = STANDARD_FEATURES.map((f) => {
  const upgraded = [
    'advanced_analytics',
    'clinician_dashboard',
    'sms_notifications',
    'api_access',
    'custom_exercises',
    'hipaa_audit_log',
  ];
  if (upgraded.includes(f.id)) {
    return { ...f, included: true };
  }
  return { ...f };
});

const ENTERPRISE_FEATURES: PlanFeature[] = STANDARD_FEATURES.map((f) => ({
  ...f,
  included: true,
}));

const STANDARD_LIMITS: PlanLimits = {
  maxPatients: 25,
  maxCaregivers: 50,
  maxClinicians: 3,
  maxStorageGb: 10,
  maxApiCallsPerMonth: 0,
  maxSessionsPerDay: 100,
  maxReportExports: 20,
  maxSmsNotifications: 0,
  maxEmailNotifications: 500,
};

const PROFESSIONAL_LIMITS: PlanLimits = {
  maxPatients: 100,
  maxCaregivers: 200,
  maxClinicians: 15,
  maxStorageGb: 50,
  maxApiCallsPerMonth: 50000,
  maxSessionsPerDay: 500,
  maxReportExports: 100,
  maxSmsNotifications: 1000,
  maxEmailNotifications: 5000,
};

const ENTERPRISE_LIMITS: PlanLimits = {
  maxPatients: 999999,
  maxCaregivers: 999999,
  maxClinicians: 999999,
  maxStorageGb: 500,
  maxApiCallsPerMonth: 999999,
  maxSessionsPerDay: 999999,
  maxReportExports: 999999,
  maxSmsNotifications: 10000,
  maxEmailNotifications: 999999,
};

/** Full plan catalogue */
export const PLANS: Record<PricingTier, SubscriptionPlan> = {
  [PricingTier.STANDARD]: {
    id: 'plan_standard_v1',
    name: 'Standard',
    tier: PricingTier.STANDARD,
    description: 'Perfect for small care homes and individual caregivers. Includes core cognitive exercises with gentle, adaptive feedback.',
    pricePerPatient: 12,
    basePrice: 49,
    features: STANDARD_FEATURES,
    limits: STANDARD_LIMITS,
    billingPeriod: BillingPeriod.MONTHLY,
    trialDays: 14,
    isPopular: false,
    sortOrder: 1,
  },
  [PricingTier.PROFESSIONAL]: {
    id: 'plan_professional_v1',
    name: 'Professional',
    tier: PricingTier.PROFESSIONAL,
    description: 'Designed for mid-size facilities with clinical teams. Advanced analytics, clinician dashboard, and SMS notifications included.',
    pricePerPatient: 9,
    basePrice: 149,
    features: PROFESSIONAL_FEATURES,
    limits: PROFESSIONAL_LIMITS,
    billingPeriod: BillingPeriod.MONTHLY,
    trialDays: 30,
    isPopular: true,
    sortOrder: 2,
  },
  [PricingTier.ENTERPRISE]: {
    id: 'plan_enterprise_v1',
    name: 'Enterprise',
    tier: PricingTier.ENTERPRISE,
    description: 'Unlimited scale for large healthcare organisations. White-label branding, SSO, dedicated support, and multi-facility management.',
    pricePerPatient: 6,
    basePrice: 499,
    features: ENTERPRISE_FEATURES,
    limits: ENTERPRISE_LIMITS,
    billingPeriod: BillingPeriod.MONTHLY,
    trialDays: 30,
    isPopular: false,
    sortOrder: 3,
  },
};

// ---------------------------------------------------------------------------
// Volume Discount Helpers
// ---------------------------------------------------------------------------

function getVolumeDiscountRate(patientCount: number): number {
  if (patientCount >= VOLUME_DISCOUNT_THRESHOLD_3) return VOLUME_DISCOUNT_RATE_3;
  if (patientCount >= VOLUME_DISCOUNT_THRESHOLD_2) return VOLUME_DISCOUNT_RATE_2;
  if (patientCount >= VOLUME_DISCOUNT_THRESHOLD_1) return VOLUME_DISCOUNT_RATE_1;
  return 0;
}

function applyVolumeDiscount(amount: number, patientCount: number): number {
  const rate = getVolumeDiscountRate(patientCount);
  return amount * (1 - rate);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Calculate the monthly price for a plan given the patient count.
 * Applies volume discounts automatically.
 */
export function calculateMonthlyPrice(plan: SubscriptionPlan, patientCount: number): number {
  const baseCost = plan.basePrice;
  const perPatientCost = plan.pricePerPatient * patientCount;
  const subtotal = baseCost + perPatientCost;
  const discounted = applyVolumeDiscount(subtotal, patientCount);
  return Math.round(discounted * 100) / 100;
}

/**
 * Calculate the annual price, including the 10% annual discount.
 * Returns the total for 12 months.
 */
export function calculateAnnualPrice(plan: SubscriptionPlan, patientCount: number): number {
  const monthly = calculateMonthlyPrice(plan, patientCount);
  const annual = monthly * 12;
  const discounted = annual * (1 - ANNUAL_DISCOUNT_RATE);
  return Math.round(discounted * 100) / 100;
}

/**
 * Calculate the quarterly price, including the 5% quarterly discount.
 * Returns the total for 3 months.
 */
export function calculateQuarterlyPrice(plan: SubscriptionPlan, patientCount: number): number {
  const monthly = calculateMonthlyPrice(plan, patientCount);
  const quarterly = monthly * 3;
  const discounted = quarterly * (1 - QUARTERLY_DISCOUNT_RATE);
  return Math.round(discounted * 100) / 100;
}

/**
 * Get the effective monthly price for any billing period.
 */
export function getEffectiveMonthlyPrice(
  plan: SubscriptionPlan,
  patientCount: number,
  period: BillingPeriod,
): number {
  switch (period) {
    case BillingPeriod.ANNUAL:
      return Math.round((calculateAnnualPrice(plan, patientCount) / 12) * 100) / 100;
    case BillingPeriod.QUARTERLY:
      return Math.round((calculateQuarterlyPrice(plan, patientCount) / 3) * 100) / 100;
    case BillingPeriod.MONTHLY:
    default:
      return calculateMonthlyPrice(plan, patientCount);
  }
}

/**
 * Check whether a specific feature is available on a given tier.
 */
export function getFeatureAccess(tier: PricingTier, featureId: string): boolean {
  const plan = PLANS[tier];
  const feature = plan.features.find((f) => f.id === featureId);
  return feature?.included ?? false;
}

/**
 * Get the limits object for a pricing tier.
 */
export function getPlanLimits(tier: PricingTier): PlanLimits {
  return { ...PLANS[tier].limits };
}

/**
 * Get the full plan definition for a tier.
 */
export function getPlan(tier: PricingTier): SubscriptionPlan {
  return { ...PLANS[tier] };
}

/**
 * Get the plan definition by plan ID string.
 */
export function getPlanById(planId: string): SubscriptionPlan | null {
  for (const plan of Object.values(PLANS)) {
    if (plan.id === planId) return { ...plan };
  }
  return null;
}

/**
 * Get all available plans sorted by sortOrder.
 */
export function getAllPlans(): SubscriptionPlan[] {
  return Object.values(PLANS).sort((a, b) => a.sortOrder - b.sortOrder);
}

/**
 * Compare two tiers and return a detailed comparison object.
 */
export function comparePlans(currentTier: PricingTier, comparedTier: PricingTier): PlanComparison {
  const current = PLANS[currentTier];
  const compared = PLANS[comparedTier];

  const currentFeatureIds = new Set(current.features.filter((f) => f.included).map((f) => f.id));
  const comparedFeatureIds = new Set(compared.features.filter((f) => f.included).map((f) => f.id));

  const additionalFeatures = compared.features
    .filter((f) => f.included && !currentFeatureIds.has(f.id))
    .map((f) => f.name);

  const removedFeatures = current.features
    .filter((f) => f.included && !comparedFeatureIds.has(f.id))
    .map((f) => f.name);

  const limitKeys: (keyof PlanLimits)[] = [
    'maxPatients', 'maxCaregivers', 'maxClinicians', 'maxStorageGb',
    'maxApiCallsPerMonth', 'maxSessionsPerDay', 'maxReportExports',
    'maxSmsNotifications', 'maxEmailNotifications',
  ];

  const limitChanges: LimitChange[] = limitKeys.map((key) => {
    const currentVal = current.limits[key];
    const newVal = compared.limits[key];
    const change = newVal - currentVal;
    let direction: 'increase' | 'decrease' | 'unchanged' = 'unchanged';
    if (change > 0) direction = 'increase';
    else if (change < 0) direction = 'decrease';

    return { metric: key, currentLimit: currentVal, newLimit: newVal, change, direction };
  });

  const priceDifference = compared.basePrice - current.basePrice;

  let recommendation = '';
  if (priceDifference > 0 && additionalFeatures.length > 0) {
    recommendation = `Upgrading to ${compared.name} adds ${additionalFeatures.length} features for an additional $${priceDifference}/month base cost.`;
  } else if (priceDifference < 0 && removedFeatures.length > 0) {
    recommendation = `Downgrading to ${compared.name} saves $${Math.abs(priceDifference)}/month but removes ${removedFeatures.length} features.`;
  } else if (priceDifference === 0) {
    recommendation = 'Both plans have the same base price.';
  } else {
    recommendation = `Switching to ${compared.name} changes the base price by $${priceDifference}/month.`;
  }

  return {
    currentTier,
    comparedTier,
    priceDifference,
    additionalFeatures,
    removedFeatures,
    limitChanges,
    recommendation,
  };
}

/**
 * Get a recommended plan based on patient count and requirements.
 */
export function getRecommendedPlan(
  patientCount: number,
  requirements: {
    needsClinicalDashboard?: boolean;
    needsApiAccess?: boolean;
    needsSms?: boolean;
    needsMultiFacility?: boolean;
    needsSso?: boolean;
    needsWhiteLabel?: boolean;
    needsHipaaAudit?: boolean;
    budgetPerMonth?: number;
  } = {},
): PlanRecommendation {
  const reasons: string[] = [];
  let recommendedTier: PricingTier = PricingTier.STANDARD;

  // Check enterprise requirements first
  if (requirements.needsMultiFacility || requirements.needsSso || requirements.needsWhiteLabel) {
    recommendedTier = PricingTier.ENTERPRISE;
    if (requirements.needsMultiFacility) reasons.push('Multi-facility management requires Enterprise tier');
    if (requirements.needsSso) reasons.push('SSO integration requires Enterprise tier');
    if (requirements.needsWhiteLabel) reasons.push('White-label branding requires Enterprise tier');
  }
  // Check professional requirements
  else if (
    requirements.needsClinicalDashboard ||
    requirements.needsApiAccess ||
    requirements.needsSms ||
    requirements.needsHipaaAudit
  ) {
    recommendedTier = PricingTier.PROFESSIONAL;
    if (requirements.needsClinicalDashboard) reasons.push('Clinician dashboard requires Professional tier or above');
    if (requirements.needsApiAccess) reasons.push('API access requires Professional tier or above');
    if (requirements.needsSms) reasons.push('SMS notifications require Professional tier or above');
    if (requirements.needsHipaaAudit) reasons.push('HIPAA audit log requires Professional tier or above');
  }

  // Check patient count against limits
  if (patientCount > PROFESSIONAL_LIMITS.maxPatients) {
    recommendedTier = PricingTier.ENTERPRISE;
    reasons.push(`${patientCount} patients exceeds the Professional limit of ${PROFESSIONAL_LIMITS.maxPatients}`);
  } else if (patientCount > STANDARD_LIMITS.maxPatients && recommendedTier === PricingTier.STANDARD) {
    recommendedTier = PricingTier.PROFESSIONAL;
    reasons.push(`${patientCount} patients exceeds the Standard limit of ${STANDARD_LIMITS.maxPatients}`);
  }

  // Budget check: if recommended plan exceeds budget, suggest lower tier
  const plan = PLANS[recommendedTier];
  const monthlyEstimate = calculateMonthlyPrice(plan, patientCount);
  const annualEstimate = calculateAnnualPrice(plan, patientCount);

  if (requirements.budgetPerMonth && monthlyEstimate > requirements.budgetPerMonth) {
    reasons.push(`Note: Estimated cost of $${monthlyEstimate}/month exceeds budget of $${requirements.budgetPerMonth}/month`);
  }

  if (reasons.length === 0) {
    reasons.push('Standard plan covers your current requirements');
  }

  let alternativeTier: PricingTier | null = null;
  if (recommendedTier === PricingTier.ENTERPRISE) {
    alternativeTier = PricingTier.PROFESSIONAL;
  } else if (recommendedTier === PricingTier.PROFESSIONAL) {
    alternativeTier = PricingTier.STANDARD;
  }

  return {
    recommendedTier,
    plan,
    monthlyEstimate,
    annualEstimate,
    reasons,
    alternativeTier,
  };
}

/**
 * Calculate proration when changing plans mid-billing-cycle.
 *
 * @param currentPlan  The plan being switched away from
 * @param newPlan      The plan being switched to
 * @param daysRemaining Number of days remaining in the current billing period
 * @param totalDaysInPeriod Total days in the billing period (e.g. 30)
 * @param currentPatientCount Patient count for the current plan
 * @param newPatientCount Patient count for the new plan (defaults to current)
 */
export function calculateProration(
  currentPlan: SubscriptionPlan,
  newPlan: SubscriptionPlan,
  daysRemaining: number,
  totalDaysInPeriod: number = 30,
  currentPatientCount: number = 1,
  newPatientCount?: number,
): ProrationResult {
  const effectiveNewPatients = newPatientCount ?? currentPatientCount;

  const currentMonthly = calculateMonthlyPrice(currentPlan, currentPatientCount);
  const newMonthly = calculateMonthlyPrice(newPlan, effectiveNewPatients);

  const currentDailyRate = currentMonthly / totalDaysInPeriod;
  const newDailyRate = newMonthly / totalDaysInPeriod;

  const creditAmount = Math.round(currentDailyRate * daysRemaining * 100) / 100;
  const chargeAmount = Math.round(newDailyRate * daysRemaining * 100) / 100;
  const netAmount = Math.round((chargeAmount - creditAmount) * 100) / 100;

  return {
    daysRemaining,
    totalDaysInPeriod,
    currentDailyRate: Math.round(currentDailyRate * 100) / 100,
    newDailyRate: Math.round(newDailyRate * 100) / 100,
    creditAmount,
    chargeAmount,
    netAmount,
  };
}

/**
 * Estimate the total cost for a given number of months.
 */
export function estimateTotalCost(
  tier: PricingTier,
  patientCount: number,
  months: number,
  period: BillingPeriod = BillingPeriod.MONTHLY,
): number {
  const plan = PLANS[tier];
  const effectiveMonthly = getEffectiveMonthlyPrice(plan, patientCount, period);
  return Math.round(effectiveMonthly * months * 100) / 100;
}

/**
 * Get a formatted pricing breakdown suitable for display.
 */
export function getPricingBreakdown(tier: PricingTier, patientCount: number): {
  basePriceLabel: string;
  perPatientLabel: string;
  volumeDiscountLabel: string;
  monthlyTotal: number;
  annualTotal: number;
  annualSavings: number;
} {
  const plan = PLANS[tier];
  const baseCost = plan.basePrice;
  const perPatientCost = plan.pricePerPatient * patientCount;
  const subtotal = baseCost + perPatientCost;
  const volumeRate = getVolumeDiscountRate(patientCount);
  const volumeDiscount = subtotal * volumeRate;
  const monthlyTotal = calculateMonthlyPrice(plan, patientCount);
  const annualTotal = calculateAnnualPrice(plan, patientCount);
  const annualSavings = (monthlyTotal * 12) - annualTotal;

  return {
    basePriceLabel: `Base: $${baseCost}/mo`,
    perPatientLabel: `${patientCount} patients x $${plan.pricePerPatient} = $${perPatientCost}/mo`,
    volumeDiscountLabel: volumeRate > 0
      ? `Volume discount (${volumeRate * 100}%): -$${Math.round(volumeDiscount * 100) / 100}/mo`
      : 'No volume discount',
    monthlyTotal,
    annualTotal,
    annualSavings: Math.round(annualSavings * 100) / 100,
  };
}
