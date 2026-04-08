import { SupportedLanguage } from './types';
import { getLanguage } from './index';

const LOCALE_MAP: Record<SupportedLanguage, string> = {
  en: 'en-US',
  es: 'es-ES',
  fr: 'fr-FR',
  de: 'de-DE',
  zh: 'zh-CN',
  ja: 'ja-JP',
  ko: 'ko-KR',
  pt: 'pt-BR',
  ar: 'ar-SA',
  hi: 'hi-IN',
};

function getLocale(lang?: SupportedLanguage): string {
  return LOCALE_MAP[lang || getLanguage()] || 'en-US';
}

// ── Date Formatting ─────────────────────────────────────────

/**
 * Formats a date using locale-appropriate formatting.
 * Suitable for displaying dates to dementia patients in familiar formats.
 */
export function formatDate(
  date: Date,
  style: 'full' | 'long' | 'medium' | 'short' = 'long',
  lang?: SupportedLanguage,
): string {
  const locale = getLocale(lang);
  try {
    return new Intl.DateTimeFormat(locale, { dateStyle: style }).format(date);
  } catch {
    return date.toLocaleDateString();
  }
}

/**
 * Formats a time using locale-appropriate formatting.
 */
export function formatTime(
  date: Date,
  style: 'full' | 'long' | 'medium' | 'short' = 'short',
  lang?: SupportedLanguage,
): string {
  const locale = getLocale(lang);
  try {
    return new Intl.DateTimeFormat(locale, { timeStyle: style }).format(date);
  } catch {
    return date.toLocaleTimeString();
  }
}

/**
 * Formats date and time together.
 */
export function formatDateTime(
  date: Date,
  lang?: SupportedLanguage,
): string {
  const locale = getLocale(lang);
  try {
    return new Intl.DateTimeFormat(locale, {
      dateStyle: 'long',
      timeStyle: 'short',
    }).format(date);
  } catch {
    return date.toLocaleString();
  }
}

/**
 * Returns day name for orientation exercises.
 * E.g., "Monday" in English, "月曜日" in Japanese.
 */
export function getDayName(date: Date, lang?: SupportedLanguage): string {
  const locale = getLocale(lang);
  try {
    return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(date);
  } catch {
    return date.toLocaleDateString(undefined, { weekday: 'long' });
  }
}

/**
 * Returns relative time description (e.g., "2 hours ago", "in 30 minutes").
 */
export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  lang?: SupportedLanguage,
): string {
  const locale = getLocale(lang);
  try {
    return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(value, unit);
  } catch {
    return `${Math.abs(value)} ${unit}${value < 0 ? ' ago' : ''}`;
  }
}

// ── Number Formatting ───────────────────────────────────────

/**
 * Formats a number using locale-appropriate separators and decimals.
 */
export function formatNumber(
  value: number,
  decimals?: number,
  lang?: SupportedLanguage,
): string {
  const locale = getLocale(lang);
  const options: Intl.NumberFormatOptions = {};
  if (decimals !== undefined) {
    options.minimumFractionDigits = decimals;
    options.maximumFractionDigits = decimals;
  }
  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch {
    return value.toFixed(decimals);
  }
}

/**
 * Formats a percentage value.
 */
export function formatPercent(
  value: number,
  lang?: SupportedLanguage,
): string {
  const locale = getLocale(lang);
  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      maximumFractionDigits: 0,
    }).format(value / 100);
  } catch {
    return `${Math.round(value)}%`;
  }
}

// ── Pluralization ───────────────────────────────────────────

type PluralForms = {
  zero?: string;
  one: string;
  two?: string;
  few?: string;
  many?: string;
  other: string;
};

/**
 * Selects the correct plural form for a count.
 * Handles Arabic dual forms, Slavic complex plurals, and Asian languages with no plurals.
 *
 * Usage:
 *   plural(count, { one: '1 session', other: `${count} sessions` })
 *   plural(count, { zero: 'No meds', one: '1 med', other: `${count} meds` })
 */
export function plural(
  count: number,
  forms: PluralForms,
  lang?: SupportedLanguage,
): string {
  const locale = getLocale(lang);
  try {
    const rules = new Intl.PluralRules(locale);
    const category = count === 0 && forms.zero !== undefined ? 'zero' : rules.select(count);
    return (forms as Record<string, string | undefined>)[category] || forms.other;
  } catch {
    if (count === 0 && forms.zero) return forms.zero;
    if (count === 1) return forms.one;
    return forms.other;
  }
}

// ── Duration Formatting ─────────────────────────────────────

/**
 * Formats duration in minutes to a human-readable string.
 * For session time display.
 */
export function formatDuration(
  totalMinutes: number,
  lang?: SupportedLanguage,
): string {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);
  const locale = getLocale(lang);

  try {
    const parts: string[] = [];
    const listFormat = new Intl.ListFormat(locale, { style: 'long', type: 'conjunction' });

    if (hours > 0) {
      parts.push(plural(hours, { one: '1h', other: `${hours}h` }, lang));
    }
    if (minutes > 0 || hours === 0) {
      parts.push(plural(minutes, { one: '1m', other: `${minutes}m` }, lang));
    }

    return parts.length > 1 ? listFormat.format(parts) : parts[0];
  } catch {
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  }
}
