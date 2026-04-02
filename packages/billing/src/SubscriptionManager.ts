/**
 * SubscriptionManager - Manages the full lifecycle of subscriptions
 * for the Gentle Reminder platform. Uses an in-memory store for demo mode.
 */

import {
  Subscription,
  SubscriptionStatus,
  PricingTier,
  BillingPeriod,
  CreateSubscriptionInput,
  ChangePlanInput,
  CancelSubscriptionInput,
  PlanChangeResult,
  CancelResult,
  TrialStatus,
  Invoice,
  BillingEvent,
  BillingEventType,
  Currency,
} from './types';
import { PLANS, calculateMonthlyPrice, calculateProration } from './PricingEngine';
import { generateMonthlyInvoice, generateProrationInvoice, generateInvoiceNumber } from './InvoiceGenerator';

// ---------------------------------------------------------------------------
// In-memory demo store
// ---------------------------------------------------------------------------

const subscriptionStore = new Map<string, Subscription>();
const eventLog: BillingEvent[] = [];
const invoiceStore: Invoice[] = [];

let idCounter = 1000;

function generateId(prefix: string): string {
  idCounter += 1;
  return `${prefix}_${idCounter}_${Date.now().toString(36)}`;
}

function recordEvent(
  type: BillingEventType,
  subscriptionId: string,
  facilityId: string,
  amount: number,
  description: string,
  metadata: Record<string, unknown> = {},
): BillingEvent {
  const event: BillingEvent = {
    id: generateId('evt'),
    type,
    subscriptionId,
    facilityId,
    amount,
    currency: Currency.USD,
    description,
    metadata,
    timestamp: new Date(),
  };
  eventLog.push(event);
  return event;
}

function cloneSub(sub: Subscription): Subscription {
  return { ...sub, startDate: new Date(sub.startDate), endDate: sub.endDate ? new Date(sub.endDate) : null, trialEndDate: sub.trialEndDate ? new Date(sub.trialEndDate) : null, currentPeriodStart: new Date(sub.currentPeriodStart), currentPeriodEnd: new Date(sub.currentPeriodEnd), cancelledAt: sub.cancelledAt ? new Date(sub.cancelledAt) : null, createdAt: new Date(sub.createdAt), updatedAt: new Date(sub.updatedAt), metadata: { ...sub.metadata } };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Create a new subscription for a facility.
 * Starts in TRIAL status if the plan has a trial period.
 */
export function createSubscription(input: CreateSubscriptionInput): Subscription {
  const plan = Object.values(PLANS).find((p) => p.id === input.planId);
  if (!plan) {
    throw new Error(`Unknown plan ID: ${input.planId}`);
  }

  // Check if facility already has an active subscription
  for (const existing of subscriptionStore.values()) {
    if (
      existing.facilityId === input.facilityId &&
      (existing.status === SubscriptionStatus.ACTIVE || existing.status === SubscriptionStatus.TRIAL)
    ) {
      throw new Error(`Facility ${input.facilityId} already has an active subscription: ${existing.id}`);
    }
  }

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  const trialEndDate = plan.trialDays > 0 ? new Date(now.getTime() + plan.trialDays * 24 * 60 * 60 * 1000) : null;

  const subscription: Subscription = {
    id: generateId('sub'),
    facilityId: input.facilityId,
    planId: plan.id,
    tier: plan.tier,
    status: plan.trialDays > 0 ? SubscriptionStatus.TRIAL : SubscriptionStatus.ACTIVE,
    startDate: now,
    endDate: null,
    trialEndDate,
    currentPeriodStart: now,
    currentPeriodEnd: periodEnd,
    patientCount: input.patientCount,
    billingPeriod: input.billingPeriod || BillingPeriod.MONTHLY,
    paymentMethodId: input.paymentMethodId,
    autoRenew: true,
    cancelledAt: null,
    cancellationReason: null,
    metadata: input.metadata || {},
    createdAt: now,
    updatedAt: now,
  };

  subscriptionStore.set(subscription.id, subscription);

  const eventType = plan.trialDays > 0 ? BillingEventType.TRIAL_STARTED : BillingEventType.SUBSCRIPTION_CREATED;
  recordEvent(
    eventType,
    subscription.id,
    subscription.facilityId,
    0,
    `${plan.name} subscription created for facility ${input.facilityId}`,
    { planId: plan.id, patientCount: input.patientCount, trialDays: plan.trialDays },
  );

  return cloneSub(subscription);
}

/**
 * Upgrade a subscription to a higher-tier plan.
 * Applies proration for the remaining billing period.
 */
export function upgradeSubscription(input: ChangePlanInput): PlanChangeResult {
  const subscription = subscriptionStore.get(input.subscriptionId);
  if (!subscription) {
    throw new Error(`Subscription not found: ${input.subscriptionId}`);
  }

  if (subscription.status === SubscriptionStatus.CANCELLED || subscription.status === SubscriptionStatus.SUSPENDED) {
    throw new Error(`Cannot upgrade a ${subscription.status} subscription`);
  }

  const currentPlan = Object.values(PLANS).find((p) => p.id === subscription.planId);
  const newPlan = Object.values(PLANS).find((p) => p.id === input.newPlanId);

  if (!currentPlan) throw new Error(`Current plan not found: ${subscription.planId}`);
  if (!newPlan) throw new Error(`New plan not found: ${input.newPlanId}`);

  if (newPlan.sortOrder <= currentPlan.sortOrder) {
    throw new Error('upgradeSubscription can only move to a higher-tier plan. Use downgradeSubscription instead.');
  }

  // Calculate proration
  const now = new Date();
  const msRemaining = subscription.currentPeriodEnd.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));
  const totalDays = Math.ceil(
    (subscription.currentPeriodEnd.getTime() - subscription.currentPeriodStart.getTime()) / (24 * 60 * 60 * 1000),
  );

  const proration = calculateProration(currentPlan, newPlan, daysRemaining, totalDays, subscription.patientCount);

  // Update subscription
  subscription.planId = newPlan.id;
  subscription.tier = newPlan.tier;
  subscription.status = SubscriptionStatus.ACTIVE; // Upgrade from trial -> active
  subscription.updatedAt = now;

  subscriptionStore.set(subscription.id, subscription);

  // Generate proration invoice if there is a charge
  let invoice: Invoice | null = null;
  if (proration.netAmount > 0) {
    invoice = generateProrationInvoice(subscription, proration.creditAmount, proration.chargeAmount, newPlan.id);
    invoiceStore.push(invoice);
  }

  recordEvent(
    BillingEventType.SUBSCRIPTION_UPGRADED,
    subscription.id,
    subscription.facilityId,
    proration.netAmount,
    `Upgraded from ${currentPlan.name} to ${newPlan.name}`,
    { previousPlanId: currentPlan.id, newPlanId: newPlan.id, proration },
  );

  const newMonthlyAmount = calculateMonthlyPrice(newPlan, subscription.patientCount);

  return {
    subscription: cloneSub(subscription),
    prorationCredit: proration.creditAmount,
    effectiveDate: now,
    newMonthlyAmount,
    invoice,
  };
}

/**
 * Downgrade a subscription to a lower-tier plan.
 * Downgrade takes effect at the end of the current billing period.
 */
export function downgradeSubscription(input: ChangePlanInput): PlanChangeResult {
  const subscription = subscriptionStore.get(input.subscriptionId);
  if (!subscription) {
    throw new Error(`Subscription not found: ${input.subscriptionId}`);
  }

  if (subscription.status === SubscriptionStatus.CANCELLED || subscription.status === SubscriptionStatus.SUSPENDED) {
    throw new Error(`Cannot downgrade a ${subscription.status} subscription`);
  }

  const currentPlan = Object.values(PLANS).find((p) => p.id === subscription.planId);
  const newPlan = Object.values(PLANS).find((p) => p.id === input.newPlanId);

  if (!currentPlan) throw new Error(`Current plan not found: ${subscription.planId}`);
  if (!newPlan) throw new Error(`New plan not found: ${input.newPlanId}`);

  if (newPlan.sortOrder >= currentPlan.sortOrder) {
    throw new Error('downgradeSubscription can only move to a lower-tier plan. Use upgradeSubscription instead.');
  }

  // Check if patient count fits in new plan limits
  if (subscription.patientCount > newPlan.limits.maxPatients && newPlan.limits.maxPatients < 999999) {
    throw new Error(
      `Cannot downgrade: current patient count (${subscription.patientCount}) exceeds ${newPlan.name} plan limit (${newPlan.limits.maxPatients})`,
    );
  }

  const effectiveDate = input.effectiveImmediately ? new Date() : new Date(subscription.currentPeriodEnd);

  if (input.effectiveImmediately) {
    subscription.planId = newPlan.id;
    subscription.tier = newPlan.tier;
  } else {
    subscription.metadata = {
      ...subscription.metadata,
      pendingDowngrade: { newPlanId: newPlan.id, effectiveDate: effectiveDate.toISOString() },
    };
  }

  subscription.updatedAt = new Date();
  subscriptionStore.set(subscription.id, subscription);

  recordEvent(
    BillingEventType.SUBSCRIPTION_DOWNGRADED,
    subscription.id,
    subscription.facilityId,
    0,
    `Downgraded from ${currentPlan.name} to ${newPlan.name} (effective ${effectiveDate.toISOString()})`,
    { previousPlanId: currentPlan.id, newPlanId: newPlan.id, effectiveDate: effectiveDate.toISOString() },
  );

  const newMonthlyAmount = calculateMonthlyPrice(newPlan, subscription.patientCount);

  return {
    subscription: cloneSub(subscription),
    prorationCredit: 0,
    effectiveDate,
    newMonthlyAmount,
    invoice: null,
  };
}

/**
 * Cancel a subscription. Optionally cancel immediately or at end of period.
 */
export function cancelSubscription(input: CancelSubscriptionInput): CancelResult {
  const subscription = subscriptionStore.get(input.subscriptionId);
  if (!subscription) {
    throw new Error(`Subscription not found: ${input.subscriptionId}`);
  }

  if (subscription.status === SubscriptionStatus.CANCELLED) {
    throw new Error('Subscription is already cancelled');
  }

  const now = new Date();

  subscription.cancelledAt = now;
  subscription.cancellationReason = input.reason;
  subscription.autoRenew = false;
  subscription.updatedAt = now;

  let effectiveDate: Date;
  let refundAmount = 0;

  if (input.cancelImmediately) {
    subscription.status = SubscriptionStatus.CANCELLED;
    subscription.endDate = now;
    effectiveDate = now;

    // Calculate refund for unused time
    const msRemaining = subscription.currentPeriodEnd.getTime() - now.getTime();
    const daysRemaining = Math.max(0, Math.ceil(msRemaining / (24 * 60 * 60 * 1000)));
    const totalDays = Math.ceil(
      (subscription.currentPeriodEnd.getTime() - subscription.currentPeriodStart.getTime()) / (24 * 60 * 60 * 1000),
    );

    const plan = Object.values(PLANS).find((p) => p.id === subscription.planId);
    if (plan && daysRemaining > 0 && totalDays > 0) {
      const monthlyPrice = calculateMonthlyPrice(plan, subscription.patientCount);
      refundAmount = Math.round(((monthlyPrice / totalDays) * daysRemaining) * 100) / 100;
    }
  } else {
    // Cancel at end of period
    effectiveDate = new Date(subscription.currentPeriodEnd);
    subscription.endDate = effectiveDate;
  }

  subscriptionStore.set(subscription.id, subscription);

  if (input.feedback) {
    subscription.metadata = { ...subscription.metadata, cancellationFeedback: input.feedback };
  }

  recordEvent(
    BillingEventType.SUBSCRIPTION_CANCELLED,
    subscription.id,
    subscription.facilityId,
    refundAmount,
    `Subscription cancelled. Reason: ${input.reason}. Effective: ${effectiveDate.toISOString()}`,
    { reason: input.reason, immediate: input.cancelImmediately, refundAmount, feedback: input.feedback },
  );

  return {
    subscription: cloneSub(subscription),
    finalInvoice: null,
    effectiveDate,
    refundAmount,
  };
}

/**
 * Reactivate a cancelled or suspended subscription.
 */
export function reactivateSubscription(subscriptionId: string): Subscription {
  const subscription = subscriptionStore.get(subscriptionId);
  if (!subscription) {
    throw new Error(`Subscription not found: ${subscriptionId}`);
  }

  if (subscription.status !== SubscriptionStatus.CANCELLED && subscription.status !== SubscriptionStatus.SUSPENDED) {
    throw new Error(`Subscription is ${subscription.status}, not cancelled or suspended`);
  }

  const now = new Date();
  const periodEnd = new Date(now);
  periodEnd.setMonth(periodEnd.getMonth() + 1);

  subscription.status = SubscriptionStatus.ACTIVE;
  subscription.cancelledAt = null;
  subscription.cancellationReason = null;
  subscription.endDate = null;
  subscription.autoRenew = true;
  subscription.currentPeriodStart = now;
  subscription.currentPeriodEnd = periodEnd;
  subscription.updatedAt = now;

  // Remove pending downgrade metadata
  const { pendingDowngrade, cancellationFeedback, ...restMeta } = subscription.metadata as Record<string, unknown>;
  subscription.metadata = restMeta;

  subscriptionStore.set(subscriptionId, subscription);

  recordEvent(
    BillingEventType.SUBSCRIPTION_REACTIVATED,
    subscription.id,
    subscription.facilityId,
    0,
    `Subscription reactivated`,
  );

  return cloneSub(subscription);
}

/**
 * Get the detailed status of a subscription, including computed properties.
 */
export function getSubscriptionStatus(subscriptionId: string): {
  subscription: Subscription;
  planName: string;
  monthlyPrice: number;
  daysUntilRenewal: number;
  isInTrial: boolean;
  trialDaysRemaining: number;
  hasPendingDowngrade: boolean;
  pendingDowngradePlan: string | null;
} {
  const subscription = subscriptionStore.get(subscriptionId);
  if (!subscription) {
    throw new Error(`Subscription not found: ${subscriptionId}`);
  }

  const plan = Object.values(PLANS).find((p) => p.id === subscription.planId);
  const planName = plan?.name || 'Unknown';
  const monthlyPrice = plan ? calculateMonthlyPrice(plan, subscription.patientCount) : 0;

  const now = new Date();
  const msUntilRenewal = subscription.currentPeriodEnd.getTime() - now.getTime();
  const daysUntilRenewal = Math.max(0, Math.ceil(msUntilRenewal / (24 * 60 * 60 * 1000)));

  const isInTrial = subscription.status === SubscriptionStatus.TRIAL;
  let trialDaysRemaining = 0;
  if (isInTrial && subscription.trialEndDate) {
    const msTrialRemaining = subscription.trialEndDate.getTime() - now.getTime();
    trialDaysRemaining = Math.max(0, Math.ceil(msTrialRemaining / (24 * 60 * 60 * 1000)));
  }

  const pendingDowngrade = subscription.metadata?.pendingDowngrade as { newPlanId: string } | undefined;
  const hasPendingDowngrade = !!pendingDowngrade;
  const pendingDowngradePlan = pendingDowngrade?.newPlanId || null;

  return {
    subscription: cloneSub(subscription),
    planName,
    monthlyPrice,
    daysUntilRenewal,
    isInTrial,
    trialDaysRemaining,
    hasPendingDowngrade,
    pendingDowngradePlan,
  };
}

/**
 * Check if a trial subscription has expired.
 */
export function checkTrialExpiry(subscriptionId: string): TrialStatus {
  const subscription = subscriptionStore.get(subscriptionId);
  if (!subscription) {
    throw new Error(`Subscription not found: ${subscriptionId}`);
  }

  if (subscription.status !== SubscriptionStatus.TRIAL) {
    return {
      isActive: false,
      expired: false,
      daysRemaining: 0,
      trialEndDate: subscription.trialEndDate,
      upgradeRequired: false,
    };
  }

  const now = new Date();
  if (!subscription.trialEndDate) {
    return { isActive: true, expired: false, daysRemaining: 0, trialEndDate: null, upgradeRequired: false };
  }

  const msRemaining = subscription.trialEndDate.getTime() - now.getTime();
  const daysRemaining = Math.ceil(msRemaining / (24 * 60 * 60 * 1000));
  const expired = daysRemaining <= 0;

  if (expired) {
    // Auto-expire the trial
    subscription.status = SubscriptionStatus.EXPIRED;
    subscription.endDate = subscription.trialEndDate;
    subscription.updatedAt = now;
    subscriptionStore.set(subscriptionId, subscription);

    recordEvent(
      BillingEventType.TRIAL_EXPIRED,
      subscription.id,
      subscription.facilityId,
      0,
      'Trial period has expired',
    );
  } else if (daysRemaining <= 3) {
    recordEvent(
      BillingEventType.TRIAL_ENDING_SOON,
      subscription.id,
      subscription.facilityId,
      0,
      `Trial ending in ${daysRemaining} days`,
    );
  }

  return {
    isActive: !expired,
    expired,
    daysRemaining: Math.max(0, daysRemaining),
    trialEndDate: subscription.trialEndDate,
    upgradeRequired: expired,
  };
}

/**
 * Handle a payment failure for a subscription.
 * Marks as PAST_DUE on first failure, SUSPENDED on subsequent failures.
 */
export function handlePaymentFailure(subscriptionId: string): {
  action: 'marked_past_due' | 'suspended' | 'no_action';
  subscription: Subscription;
  retryDate: Date | null;
} {
  const subscription = subscriptionStore.get(subscriptionId);
  if (!subscription) {
    throw new Error(`Subscription not found: ${subscriptionId}`);
  }

  const now = new Date();
  const failureCount = ((subscription.metadata?.paymentFailures as number) || 0) + 1;

  subscription.metadata = { ...subscription.metadata, paymentFailures: failureCount, lastPaymentFailure: now.toISOString() };
  subscription.updatedAt = now;

  let action: 'marked_past_due' | 'suspended' | 'no_action';
  let retryDate: Date | null = null;

  if (failureCount === 1) {
    subscription.status = SubscriptionStatus.PAST_DUE;
    action = 'marked_past_due';
    retryDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000); // Retry in 3 days

    recordEvent(
      BillingEventType.PAYMENT_FAILED,
      subscription.id,
      subscription.facilityId,
      0,
      `Payment failed (attempt ${failureCount}). Will retry on ${retryDate.toISOString()}.`,
      { failureCount, retryDate: retryDate.toISOString() },
    );
  } else if (failureCount === 2) {
    subscription.status = SubscriptionStatus.PAST_DUE;
    action = 'marked_past_due';
    retryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // Retry in 7 days

    recordEvent(
      BillingEventType.PAYMENT_FAILED,
      subscription.id,
      subscription.facilityId,
      0,
      `Payment failed again (attempt ${failureCount}). Final retry on ${retryDate.toISOString()}.`,
      { failureCount, retryDate: retryDate.toISOString() },
    );
  } else {
    subscription.status = SubscriptionStatus.SUSPENDED;
    action = 'suspended';

    recordEvent(
      BillingEventType.SUBSCRIPTION_SUSPENDED,
      subscription.id,
      subscription.facilityId,
      0,
      `Subscription suspended after ${failureCount} payment failures.`,
      { failureCount },
    );
  }

  subscriptionStore.set(subscriptionId, subscription);

  return {
    action,
    subscription: cloneSub(subscription),
    retryDate,
  };
}

/**
 * Update the patient count on a subscription.
 */
export function updatePatientCount(subscriptionId: string, newCount: number): Subscription {
  const subscription = subscriptionStore.get(subscriptionId);
  if (!subscription) {
    throw new Error(`Subscription not found: ${subscriptionId}`);
  }

  const plan = Object.values(PLANS).find((p) => p.id === subscription.planId);
  if (plan && newCount > plan.limits.maxPatients && plan.limits.maxPatients < 999999) {
    throw new Error(
      `Patient count ${newCount} exceeds ${plan.name} plan limit of ${plan.limits.maxPatients}. Consider upgrading.`,
    );
  }

  subscription.patientCount = newCount;
  subscription.updatedAt = new Date();
  subscriptionStore.set(subscriptionId, subscription);

  return cloneSub(subscription);
}

/**
 * Get a subscription by ID.
 */
export function getSubscription(subscriptionId: string): Subscription | null {
  const sub = subscriptionStore.get(subscriptionId);
  return sub ? cloneSub(sub) : null;
}

/**
 * Get all subscriptions for a facility.
 */
export function getSubscriptionsForFacility(facilityId: string): Subscription[] {
  const results: Subscription[] = [];
  for (const sub of subscriptionStore.values()) {
    if (sub.facilityId === facilityId) {
      results.push(cloneSub(sub));
    }
  }
  return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Get the billing event log, optionally filtered by subscription.
 */
export function getEventLog(subscriptionId?: string): BillingEvent[] {
  if (subscriptionId) {
    return eventLog.filter((e) => e.subscriptionId === subscriptionId);
  }
  return [...eventLog];
}

/**
 * Get all stored invoices, optionally filtered.
 */
export function getInvoices(filter?: { subscriptionId?: string; facilityId?: string; status?: string }): Invoice[] {
  let results = [...invoiceStore];
  if (filter?.subscriptionId) results = results.filter((i) => i.subscriptionId === filter.subscriptionId);
  if (filter?.facilityId) results = results.filter((i) => i.facilityId === filter.facilityId);
  if (filter?.status) results = results.filter((i) => i.status === filter.status);
  return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Clear all demo data (useful for testing).
 */
export function resetDemoData(): void {
  subscriptionStore.clear();
  eventLog.length = 0;
  invoiceStore.length = 0;
  idCounter = 1000;
}
