/**
 * Billing and Subscription Types for Gentle Reminder
 *
 * Comprehensive type definitions for the billing module covering
 * subscription plans, invoices, payment methods, usage tracking,
 * and billing events for the dementia care platform.
 */

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------

/** Pricing tiers available for facilities */
export enum PricingTier {
  STANDARD = 'standard',
  PROFESSIONAL = 'professional',
  ENTERPRISE = 'enterprise',
}

/** Current status of a subscription */
export enum SubscriptionStatus {
  ACTIVE = 'active',
  TRIAL = 'trial',
  PAST_DUE = 'past_due',
  CANCELLED = 'cancelled',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
  EXPIRED = 'expired',
}

/** Status of an individual invoice */
export enum InvoiceStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  PAID = 'paid',
  OVERDUE = 'overdue',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  PARTIALLY_PAID = 'partially_paid',
}

/** Supported payment method types */
export enum PaymentMethodType {
  CREDIT_CARD = 'credit_card',
  DEBIT_CARD = 'debit_card',
  BANK_TRANSFER = 'bank_transfer',
  INVOICE_BILLING = 'invoice_billing',
}

/** Types of billing events for audit trail */
export enum BillingEventType {
  SUBSCRIPTION_CREATED = 'subscription_created',
  SUBSCRIPTION_UPGRADED = 'subscription_upgraded',
  SUBSCRIPTION_DOWNGRADED = 'subscription_downgraded',
  SUBSCRIPTION_CANCELLED = 'subscription_cancelled',
  SUBSCRIPTION_REACTIVATED = 'subscription_reactivated',
  SUBSCRIPTION_SUSPENDED = 'subscription_suspended',
  PAYMENT_SUCCEEDED = 'payment_succeeded',
  PAYMENT_FAILED = 'payment_failed',
  PAYMENT_REFUNDED = 'payment_refunded',
  INVOICE_GENERATED = 'invoice_generated',
  INVOICE_SENT = 'invoice_sent',
  INVOICE_PAID = 'invoice_paid',
  INVOICE_OVERDUE = 'invoice_overdue',
  TRIAL_STARTED = 'trial_started',
  TRIAL_ENDING_SOON = 'trial_ending_soon',
  TRIAL_EXPIRED = 'trial_expired',
  USAGE_LIMIT_WARNING = 'usage_limit_warning',
  USAGE_LIMIT_EXCEEDED = 'usage_limit_exceeded',
  OVERAGE_CHARGE_APPLIED = 'overage_charge_applied',
  PLAN_PRICE_CHANGED = 'plan_price_changed',
  CREDIT_APPLIED = 'credit_applied',
  DISCOUNT_APPLIED = 'discount_applied',
}

/** Supported currencies */
export enum Currency {
  USD = 'USD',
  EUR = 'EUR',
  GBP = 'GBP',
  AUD = 'AUD',
  CAD = 'CAD',
}

/** Billing period frequency */
export enum BillingPeriod {
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  ANNUAL = 'annual',
}

/** Usage metric types */
export enum UsageMetricType {
  ACTIVE_PATIENTS = 'active_patients',
  SESSIONS_COUNT = 'sessions_count',
  STORAGE_GB = 'storage_gb',
  API_CALLS = 'api_calls',
  CAREGIVER_ACCOUNTS = 'caregiver_accounts',
  CLINICIAN_ACCOUNTS = 'clinician_accounts',
  REPORT_EXPORTS = 'report_exports',
  SMS_NOTIFICATIONS = 'sms_notifications',
  EMAIL_NOTIFICATIONS = 'email_notifications',
}

// ---------------------------------------------------------------------------
// Core Interfaces
// ---------------------------------------------------------------------------

/** Feature flag within a subscription plan */
export interface PlanFeature {
  id: string;
  name: string;
  description: string;
  included: boolean;
  limit?: number;
  overage?: {
    unitPrice: number;
    unitDescription: string;
  };
}

/** Limits associated with a plan */
export interface PlanLimits {
  maxPatients: number;
  maxCaregivers: number;
  maxClinicians: number;
  maxStorageGb: number;
  maxApiCallsPerMonth: number;
  maxSessionsPerDay: number;
  maxReportExports: number;
  maxSmsNotifications: number;
  maxEmailNotifications: number;
}

/** Full plan definition */
export interface SubscriptionPlan {
  id: string;
  name: string;
  tier: PricingTier;
  description: string;
  pricePerPatient: number;
  basePrice: number;
  features: PlanFeature[];
  limits: PlanLimits;
  billingPeriod: BillingPeriod;
  trialDays: number;
  isPopular: boolean;
  sortOrder: number;
}

/** Active subscription for a facility */
export interface Subscription {
  id: string;
  facilityId: string;
  planId: string;
  tier: PricingTier;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date | null;
  trialEndDate: Date | null;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  patientCount: number;
  billingPeriod: BillingPeriod;
  paymentMethodId: string | null;
  autoRenew: boolean;
  cancelledAt: Date | null;
  cancellationReason: string | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/** Single line item on an invoice */
export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  type: 'base' | 'per_patient' | 'overage' | 'credit' | 'discount' | 'tax' | 'proration';
  metadata?: Record<string, unknown>;
}

/** Full invoice */
export interface Invoice {
  id: string;
  invoiceNumber: string;
  subscriptionId: string;
  facilityId: string;
  amount: number;
  subtotal: number;
  tax: number;
  taxRate: number;
  currency: Currency;
  status: InvoiceStatus;
  lineItems: InvoiceLineItem[];
  dueDate: Date;
  issuedAt: Date;
  paidAt: Date | null;
  periodStart: Date;
  periodEnd: Date;
  notes: string;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

/** Payment method on file */
export interface PaymentMethod {
  id: string;
  facilityId: string;
  type: PaymentMethodType;
  last4: string;
  brand: string;
  expiresAt: Date;
  isDefault: boolean;
  billingName: string;
  billingEmail: string;
  billingAddress: BillingAddress;
  createdAt: Date;
  updatedAt: Date;
}

/** Billing address for payment methods */
export interface BillingAddress {
  line1: string;
  line2: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/** Usage record for a facility over a period */
export interface UsageRecord {
  facilityId: string;
  date: Date;
  activePatients: number;
  sessionsCount: number;
  storageGb: number;
  apiCalls: number;
  caregiverAccounts: number;
  clinicianAccounts: number;
  reportExports: number;
  smsNotifications: number;
  emailNotifications: number;
}

/** Billing event for the audit trail */
export interface BillingEvent {
  id: string;
  type: BillingEventType;
  subscriptionId: string;
  facilityId: string;
  amount: number;
  currency: Currency;
  description: string;
  metadata: Record<string, unknown>;
  timestamp: Date;
}

// ---------------------------------------------------------------------------
// Input / DTO types
// ---------------------------------------------------------------------------

/** Input for creating a new subscription */
export interface CreateSubscriptionInput {
  facilityId: string;
  planId: string;
  paymentMethodId: string;
  patientCount: number;
  billingPeriod: BillingPeriod;
  couponCode?: string;
  metadata?: Record<string, unknown>;
}

/** Input for upgrading / downgrading */
export interface ChangePlanInput {
  subscriptionId: string;
  newPlanId: string;
  effectiveImmediately: boolean;
}

/** Input for cancellation */
export interface CancelSubscriptionInput {
  subscriptionId: string;
  reason: string;
  cancelImmediately: boolean;
  feedback?: string;
}

/** Result of a plan change */
export interface PlanChangeResult {
  subscription: Subscription;
  prorationCredit: number;
  effectiveDate: Date;
  newMonthlyAmount: number;
  invoice: Invoice | null;
}

/** Result of a cancellation */
export interface CancelResult {
  subscription: Subscription;
  finalInvoice: Invoice | null;
  effectiveDate: Date;
  refundAmount: number;
}

/** Trial status check result */
export interface TrialStatus {
  isActive: boolean;
  expired: boolean;
  daysRemaining: number;
  trialEndDate: Date | null;
  upgradeRequired: boolean;
}

/** Usage limits check result */
export interface UsageLimitCheck {
  withinLimits: boolean;
  warnings: UsageLimitWarning[];
  exceeded: UsageLimitExceeded[];
}

/** Warning when approaching a usage limit */
export interface UsageLimitWarning {
  metric: UsageMetricType;
  current: number;
  limit: number;
  percentage: number;
  message: string;
}

/** Notification when a limit has been exceeded */
export interface UsageLimitExceeded {
  metric: UsageMetricType;
  current: number;
  limit: number;
  overage: number;
  estimatedCharge: number;
  message: string;
}

/** Plan comparison result */
export interface PlanComparison {
  currentTier: PricingTier;
  comparedTier: PricingTier;
  priceDifference: number;
  additionalFeatures: string[];
  removedFeatures: string[];
  limitChanges: LimitChange[];
  recommendation: string;
}

/** Individual limit change between plans */
export interface LimitChange {
  metric: string;
  currentLimit: number;
  newLimit: number;
  change: number;
  direction: 'increase' | 'decrease' | 'unchanged';
}

/** Storage usage summary */
export interface StorageUsageSummary {
  facilityId: string;
  usedGb: number;
  limitGb: number;
  percentage: number;
  breakdown: StorageBreakdown;
}

/** Storage breakdown by category */
export interface StorageBreakdown {
  patientDataGb: number;
  mediaFilesGb: number;
  reportsGb: number;
  backupsGb: number;
  otherGb: number;
}

/** Recommended plan result */
export interface PlanRecommendation {
  recommendedTier: PricingTier;
  plan: SubscriptionPlan;
  monthlyEstimate: number;
  annualEstimate: number;
  reasons: string[];
  alternativeTier: PricingTier | null;
}

/** Proration calculation result */
export interface ProrationResult {
  daysRemaining: number;
  totalDaysInPeriod: number;
  currentDailyRate: number;
  newDailyRate: number;
  creditAmount: number;
  chargeAmount: number;
  netAmount: number;
}
