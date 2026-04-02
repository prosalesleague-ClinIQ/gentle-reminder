/**
 * InvoiceGenerator - Creates, formats, and manages invoices for the
 * Gentle Reminder billing module.
 */

import {
  Invoice,
  InvoiceLineItem,
  InvoiceStatus,
  Subscription,
  UsageRecord,
  PlanLimits,
  Currency,
  SubscriptionPlan,
  BillingPeriod,
} from './types';
import { PLANS, calculateMonthlyPrice } from './PricingEngine';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

let invoiceSequence = 1000;

/**
 * Generate a unique, human-readable invoice number in GR-YYYY-XXXX format.
 */
export function generateInvoiceNumber(): string {
  invoiceSequence += 1;
  const year = new Date().getFullYear();
  const seq = String(invoiceSequence).padStart(4, '0');
  return `GR-${year}-${seq}`;
}

/**
 * Generate a unique ID for an invoice or line item.
 */
function generateId(prefix: string): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).substring(2, 8);
  return `${prefix}_${ts}${rand}`;
}

/**
 * Retrieve the plan associated with a subscription, or null.
 */
function getPlanForSubscription(subscription: Subscription): SubscriptionPlan | null {
  for (const plan of Object.values(PLANS)) {
    if (plan.id === subscription.planId) return plan;
  }
  return null;
}

/**
 * Get the number of days in a month (0-indexed month).
 */
function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// ---------------------------------------------------------------------------
// Line Item Generation
// ---------------------------------------------------------------------------

/**
 * Generate the standard line items for a subscription period.
 */
export function generateLineItems(
  subscription: Subscription,
  usage: UsageRecord,
): InvoiceLineItem[] {
  const plan = getPlanForSubscription(subscription);
  if (!plan) {
    throw new Error(`Unknown plan ID: ${subscription.planId}`);
  }

  const items: InvoiceLineItem[] = [];

  // 1. Base platform fee
  items.push({
    id: generateId('li'),
    description: `${plan.name} Plan - Base Platform Fee`,
    quantity: 1,
    unitPrice: plan.basePrice,
    amount: plan.basePrice,
    type: 'base',
  });

  // 2. Per-patient charge
  const patientCount = Math.max(usage.activePatients, subscription.patientCount);
  const perPatientTotal = plan.pricePerPatient * patientCount;
  items.push({
    id: generateId('li'),
    description: `Per-Patient Fee (${patientCount} active patients x $${plan.pricePerPatient})`,
    quantity: patientCount,
    unitPrice: plan.pricePerPatient,
    amount: perPatientTotal,
    type: 'per_patient',
  });

  return items;
}

/**
 * Calculate overage charges when usage exceeds plan limits.
 */
export function calculateOverageCharges(
  usage: UsageRecord,
  limits: PlanLimits,
): InvoiceLineItem[] {
  const overageItems: InvoiceLineItem[] = [];

  // Storage overage: $2 per extra GB
  if (usage.storageGb > limits.maxStorageGb) {
    const overage = usage.storageGb - limits.maxStorageGb;
    const unitPrice = 2.0;
    overageItems.push({
      id: generateId('li'),
      description: `Storage Overage (${overage.toFixed(1)} GB over ${limits.maxStorageGb} GB limit)`,
      quantity: Math.ceil(overage),
      unitPrice,
      amount: Math.round(Math.ceil(overage) * unitPrice * 100) / 100,
      type: 'overage',
    });
  }

  // API call overage: $0.005 per call above limit
  if (limits.maxApiCallsPerMonth > 0 && usage.apiCalls > limits.maxApiCallsPerMonth) {
    const overage = usage.apiCalls - limits.maxApiCallsPerMonth;
    const unitPrice = 0.005;
    overageItems.push({
      id: generateId('li'),
      description: `API Call Overage (${overage.toLocaleString()} calls over ${limits.maxApiCallsPerMonth.toLocaleString()} limit)`,
      quantity: overage,
      unitPrice,
      amount: Math.round(overage * unitPrice * 100) / 100,
      type: 'overage',
    });
  }

  // SMS overage: $0.05 per SMS above limit
  if (limits.maxSmsNotifications > 0 && usage.smsNotifications > limits.maxSmsNotifications) {
    const overage = usage.smsNotifications - limits.maxSmsNotifications;
    const unitPrice = 0.05;
    overageItems.push({
      id: generateId('li'),
      description: `SMS Notification Overage (${overage} messages over ${limits.maxSmsNotifications} limit)`,
      quantity: overage,
      unitPrice,
      amount: Math.round(overage * unitPrice * 100) / 100,
      type: 'overage',
    });
  }

  // Email overage: $0.01 per email above limit
  if (usage.emailNotifications > limits.maxEmailNotifications) {
    const overage = usage.emailNotifications - limits.maxEmailNotifications;
    const unitPrice = 0.01;
    overageItems.push({
      id: generateId('li'),
      description: `Email Notification Overage (${overage} emails over ${limits.maxEmailNotifications} limit)`,
      quantity: overage,
      unitPrice,
      amount: Math.round(overage * unitPrice * 100) / 100,
      type: 'overage',
    });
  }

  // Report export overage: $0.50 per export above limit
  if (usage.reportExports > limits.maxReportExports) {
    const overage = usage.reportExports - limits.maxReportExports;
    const unitPrice = 0.5;
    overageItems.push({
      id: generateId('li'),
      description: `Report Export Overage (${overage} exports over ${limits.maxReportExports} limit)`,
      quantity: overage,
      unitPrice,
      amount: Math.round(overage * unitPrice * 100) / 100,
      type: 'overage',
    });
  }

  // Patient count overage (if somehow exceeded)
  if (usage.activePatients > limits.maxPatients && limits.maxPatients < 999999) {
    const overage = usage.activePatients - limits.maxPatients;
    const unitPrice = 15.0; // Premium rate for over-limit patients
    overageItems.push({
      id: generateId('li'),
      description: `Patient Overage (${overage} patients over ${limits.maxPatients} limit)`,
      quantity: overage,
      unitPrice,
      amount: Math.round(overage * unitPrice * 100) / 100,
      type: 'overage',
    });
  }

  return overageItems;
}

// ---------------------------------------------------------------------------
// Full Invoice Generation
// ---------------------------------------------------------------------------

/**
 * Generate a complete monthly invoice for a subscription.
 */
export function generateMonthlyInvoice(
  subscription: Subscription,
  usage: UsageRecord,
  taxRate: number = 0,
): Invoice {
  const plan = getPlanForSubscription(subscription);
  if (!plan) {
    throw new Error(`Unknown plan ID: ${subscription.planId}`);
  }

  const baseItems = generateLineItems(subscription, usage);
  const overageItems = calculateOverageCharges(usage, plan.limits);
  const allItems = [...baseItems, ...overageItems];

  const subtotal = allItems.reduce((sum, item) => sum + item.amount, 0);
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  const amount = Math.round((subtotal + tax) * 100) / 100;

  // Add tax line item if applicable
  if (tax > 0) {
    allItems.push({
      id: generateId('li'),
      description: `Tax (${(taxRate * 100).toFixed(1)}%)`,
      quantity: 1,
      unitPrice: tax,
      amount: tax,
      type: 'tax',
    });
  }

  const now = new Date();
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + 30);

  const periodStart = subscription.currentPeriodStart;
  const periodEnd = subscription.currentPeriodEnd;

  return {
    id: generateId('inv'),
    invoiceNumber: generateInvoiceNumber(),
    subscriptionId: subscription.id,
    facilityId: subscription.facilityId,
    amount,
    subtotal: Math.round(subtotal * 100) / 100,
    tax,
    taxRate,
    currency: Currency.USD,
    status: InvoiceStatus.PENDING,
    lineItems: allItems,
    dueDate,
    issuedAt: now,
    paidAt: null,
    periodStart,
    periodEnd,
    notes: `Invoice for ${plan.name} Plan - ${formatDateRange(periodStart, periodEnd)}`,
    metadata: {
      planId: plan.id,
      tier: plan.tier,
      patientCount: usage.activePatients,
    },
    createdAt: now,
    updatedAt: now,
  };
}

/**
 * Generate a proration invoice when changing plans mid-cycle.
 */
export function generateProrationInvoice(
  subscription: Subscription,
  creditAmount: number,
  chargeAmount: number,
  newPlanId: string,
): Invoice {
  const items: InvoiceLineItem[] = [];

  if (creditAmount > 0) {
    items.push({
      id: generateId('li'),
      description: 'Proration credit for unused time on previous plan',
      quantity: 1,
      unitPrice: -creditAmount,
      amount: -creditAmount,
      type: 'credit',
    });
  }

  if (chargeAmount > 0) {
    items.push({
      id: generateId('li'),
      description: 'Proration charge for remaining time on new plan',
      quantity: 1,
      unitPrice: chargeAmount,
      amount: chargeAmount,
      type: 'proration',
    });
  }

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const amount = Math.max(0, Math.round(subtotal * 100) / 100);
  const now = new Date();
  const dueDate = new Date(now);
  dueDate.setDate(dueDate.getDate() + 7); // Proration invoices due sooner

  return {
    id: generateId('inv'),
    invoiceNumber: generateInvoiceNumber(),
    subscriptionId: subscription.id,
    facilityId: subscription.facilityId,
    amount,
    subtotal: Math.round(subtotal * 100) / 100,
    tax: 0,
    taxRate: 0,
    currency: Currency.USD,
    status: amount > 0 ? InvoiceStatus.PENDING : InvoiceStatus.PAID,
    lineItems: items,
    dueDate,
    issuedAt: now,
    paidAt: amount <= 0 ? now : null,
    periodStart: subscription.currentPeriodStart,
    periodEnd: subscription.currentPeriodEnd,
    notes: `Plan change proration - switching to plan ${newPlanId}`,
    metadata: { previousPlanId: subscription.planId, newPlanId },
    createdAt: now,
    updatedAt: now,
  };
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateRange(start: Date, end: Date): string {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

function formatCurrency(amount: number, currency: Currency = Currency.USD): string {
  const symbols: Record<Currency, string> = {
    [Currency.USD]: '$',
    [Currency.EUR]: '\u20AC',
    [Currency.GBP]: '\u00A3',
    [Currency.AUD]: 'A$',
    [Currency.CAD]: 'C$',
  };
  const symbol = symbols[currency] || '$';
  const absAmount = Math.abs(amount);
  const formatted = absAmount.toFixed(2);
  return amount < 0 ? `-${symbol}${formatted}` : `${symbol}${formatted}`;
}

/**
 * Format an invoice as plain text suitable for email or printing.
 */
export function formatInvoiceAsText(invoice: Invoice): string {
  const lines: string[] = [];
  const divider = '='.repeat(60);
  const thinDivider = '-'.repeat(60);

  lines.push(divider);
  lines.push('  GENTLE REMINDER - INVOICE');
  lines.push(divider);
  lines.push('');
  lines.push(`Invoice Number:  ${invoice.invoiceNumber}`);
  lines.push(`Invoice Date:    ${formatDate(invoice.issuedAt)}`);
  lines.push(`Due Date:        ${formatDate(invoice.dueDate)}`);
  lines.push(`Status:          ${invoice.status.toUpperCase()}`);
  lines.push(`Facility ID:     ${invoice.facilityId}`);
  lines.push('');
  lines.push(`Billing Period:  ${formatDateRange(invoice.periodStart, invoice.periodEnd)}`);
  lines.push('');
  lines.push(thinDivider);
  lines.push('  DESCRIPTION                              QTY    AMOUNT');
  lines.push(thinDivider);

  for (const item of invoice.lineItems) {
    const desc = item.description.substring(0, 42).padEnd(42);
    const qty = String(item.quantity).padStart(5);
    const amt = formatCurrency(item.amount, invoice.currency).padStart(10);
    lines.push(`  ${desc} ${qty} ${amt}`);
  }

  lines.push(thinDivider);
  lines.push(`${'Subtotal:'.padStart(52)} ${formatCurrency(invoice.subtotal, invoice.currency).padStart(10)}`);

  if (invoice.tax > 0) {
    lines.push(`${`Tax (${(invoice.taxRate * 100).toFixed(1)}%):`.padStart(52)} ${formatCurrency(invoice.tax, invoice.currency).padStart(10)}`);
  }

  lines.push(`${'TOTAL DUE:'.padStart(52)} ${formatCurrency(invoice.amount, invoice.currency).padStart(10)}`);
  lines.push('');

  if (invoice.paidAt) {
    lines.push(`Paid on: ${formatDate(invoice.paidAt)}`);
  }

  if (invoice.notes) {
    lines.push('');
    lines.push(`Notes: ${invoice.notes}`);
  }

  lines.push('');
  lines.push(divider);
  lines.push('  Thank you for choosing Gentle Reminder.');
  lines.push('  Questions? Contact billing@gentlereminder.care');
  lines.push(divider);

  return lines.join('\n');
}

/**
 * Format an invoice as a complete HTML document suitable for
 * rendering in a browser or embedding in an email.
 */
export function formatInvoiceAsHTML(invoice: Invoice): string {
  const lineItemRows = invoice.lineItems
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(item.description)}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: right;">${formatCurrency(item.unitPrice, invoice.currency)}</td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #eee; text-align: right; font-weight: ${item.type === 'credit' ? 'bold; color: #16a34a' : 'normal'};">${formatCurrency(item.amount, invoice.currency)}</td>
      </tr>`,
    )
    .join('\n');

  const statusColor = invoice.status === InvoiceStatus.PAID ? '#16a34a' : invoice.status === InvoiceStatus.OVERDUE ? '#dc2626' : '#2563eb';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoiceNumber}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 680px; margin: 24px auto; background: #fff; border-radius: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">

    <!-- Header -->
    <div style="background: linear-gradient(135deg, #7c3aed, #6d28d9); padding: 32px; color: #fff;">
      <h1 style="margin: 0; font-size: 22px; font-weight: 600;">Gentle Reminder</h1>
      <p style="margin: 4px 0 0; opacity: 0.85; font-size: 14px;">Compassionate cognitive care technology</p>
    </div>

    <!-- Invoice Meta -->
    <div style="padding: 24px 32px; border-bottom: 1px solid #e2e8f0;">
      <div style="display: flex; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
        <div>
          <p style="margin: 0; font-size: 13px; color: #64748b;">INVOICE</p>
          <p style="margin: 2px 0 0; font-size: 18px; font-weight: 600; color: #1e293b;">${invoice.invoiceNumber}</p>
        </div>
        <div style="text-align: right;">
          <span style="display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; color: #fff; background: ${statusColor};">
            ${invoice.status.toUpperCase().replace('_', ' ')}
          </span>
        </div>
      </div>
      <div style="margin-top: 16px; display: flex; gap: 32px; flex-wrap: wrap;">
        <div>
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">Issue Date</p>
          <p style="margin: 2px 0 0; font-size: 14px; color: #334155;">${formatDate(invoice.issuedAt)}</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">Due Date</p>
          <p style="margin: 2px 0 0; font-size: 14px; color: #334155;">${formatDate(invoice.dueDate)}</p>
        </div>
        <div>
          <p style="margin: 0; font-size: 12px; color: #94a3b8;">Billing Period</p>
          <p style="margin: 2px 0 0; font-size: 14px; color: #334155;">${formatDateRange(invoice.periodStart, invoice.periodEnd)}</p>
        </div>
      </div>
    </div>

    <!-- Line Items -->
    <div style="padding: 24px 32px;">
      <table style="width: 100%; border-collapse: collapse;">
        <thead>
          <tr style="background: #f8fafc;">
            <th style="padding: 10px 12px; text-align: left; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Description</th>
            <th style="padding: 10px 12px; text-align: center; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Qty</th>
            <th style="padding: 10px 12px; text-align: right; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Unit Price</th>
            <th style="padding: 10px 12px; text-align: right; font-size: 12px; color: #64748b; font-weight: 600; text-transform: uppercase;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${lineItemRows}
        </tbody>
      </table>
    </div>

    <!-- Totals -->
    <div style="padding: 0 32px 24px; text-align: right;">
      <div style="display: inline-block; min-width: 240px; text-align: right;">
        <div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #64748b;">
          <span>Subtotal</span>
          <span style="margin-left: 32px;">${formatCurrency(invoice.subtotal, invoice.currency)}</span>
        </div>
        ${
          invoice.tax > 0
            ? `<div style="display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; color: #64748b;">
            <span>Tax (${(invoice.taxRate * 100).toFixed(1)}%)</span>
            <span style="margin-left: 32px;">${formatCurrency(invoice.tax, invoice.currency)}</span>
          </div>`
            : ''
        }
        <div style="display: flex; justify-content: space-between; padding: 12px 0 0; font-size: 18px; font-weight: 700; color: #1e293b; border-top: 2px solid #e2e8f0; margin-top: 8px;">
          <span>Total Due</span>
          <span style="margin-left: 32px;">${formatCurrency(invoice.amount, invoice.currency)}</span>
        </div>
      </div>
    </div>

    ${
      invoice.paidAt
        ? `<div style="padding: 16px 32px; background: #f0fdf4; border-top: 1px solid #bbf7d0;">
        <p style="margin: 0; color: #16a34a; font-size: 14px; font-weight: 600;">Paid on ${formatDate(invoice.paidAt)}</p>
      </div>`
        : ''
    }

    ${
      invoice.notes
        ? `<div style="padding: 16px 32px; border-top: 1px solid #e2e8f0;">
        <p style="margin: 0; font-size: 13px; color: #64748b;">${escapeHtml(invoice.notes)}</p>
      </div>`
        : ''
    }

    <!-- Footer -->
    <div style="padding: 24px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
      <p style="margin: 0; font-size: 13px; color: #94a3b8;">Thank you for choosing Gentle Reminder.</p>
      <p style="margin: 4px 0 0; font-size: 13px; color: #94a3b8;">Questions? Contact <a href="mailto:billing@gentlereminder.care" style="color: #7c3aed;">billing@gentlereminder.care</a></p>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Escape HTML special characters for safe rendering.
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
