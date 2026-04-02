/**
 * @gentle-reminder/billing
 *
 * Complete billing and subscription management for the
 * Gentle Reminder dementia care platform.
 */

// Types
export {
  PricingTier,
  SubscriptionStatus,
  InvoiceStatus,
  PaymentMethodType,
  BillingEventType,
  Currency,
  BillingPeriod,
  UsageMetricType,
} from './types';

export type {
  PlanFeature,
  PlanLimits,
  SubscriptionPlan,
  Subscription,
  InvoiceLineItem,
  Invoice,
  PaymentMethod,
  BillingAddress,
  UsageRecord,
  BillingEvent,
  CreateSubscriptionInput,
  ChangePlanInput,
  CancelSubscriptionInput,
  PlanChangeResult,
  CancelResult,
  TrialStatus,
  UsageLimitCheck,
  UsageLimitWarning,
  UsageLimitExceeded,
  PlanComparison,
  LimitChange,
  StorageUsageSummary,
  StorageBreakdown,
  PlanRecommendation,
  ProrationResult,
} from './types';

// Pricing Engine
export {
  PLANS,
  calculateMonthlyPrice,
  calculateAnnualPrice,
  calculateQuarterlyPrice,
  getEffectiveMonthlyPrice,
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
} from './PricingEngine';

// Invoice Generator
export {
  generateInvoiceNumber,
  generateLineItems,
  calculateOverageCharges,
  generateMonthlyInvoice,
  generateProrationInvoice,
  formatInvoiceAsText,
  formatInvoiceAsHTML,
} from './InvoiceGenerator';

// Subscription Manager
export {
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
  getInvoices,
  resetDemoData,
} from './SubscriptionManager';

// Usage Tracker
export {
  recordUsage,
  getDailyUsage,
  getMonthlyUsage,
  getUsageSummary,
  checkUsageLimits,
  calculateStorageUsage,
  generateDemoUsageData,
  getUsageTrend,
  clearUsageData,
  resetAllUsageData,
} from './UsageTracker';
