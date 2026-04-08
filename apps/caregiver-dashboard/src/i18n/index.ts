import { en, DashboardTranslationKey } from './en';
import { es } from './es';

type SupportedDashboardLanguage = 'en' | 'es';

const translations: Record<SupportedDashboardLanguage, Record<DashboardTranslationKey, string>> = {
  en,
  es,
};

let currentLanguage: SupportedDashboardLanguage = 'en';

export function setDashboardLanguage(lang: SupportedDashboardLanguage): void {
  currentLanguage = lang;
}

export function getDashboardLanguage(): SupportedDashboardLanguage {
  return currentLanguage;
}

export function dt(key: DashboardTranslationKey): string {
  return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

export function detectDashboardLanguage(): SupportedDashboardLanguage {
  if (typeof globalThis !== 'undefined' && typeof (globalThis as any).navigator !== 'undefined') {
    const browserLang = ((globalThis as any).navigator.language as string)?.split('-')[0];
    if (browserLang && browserLang in translations) {
      return browserLang as SupportedDashboardLanguage;
    }
  }
  return 'en';
}

export type { DashboardTranslationKey, SupportedDashboardLanguage };
