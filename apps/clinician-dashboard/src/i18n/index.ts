import { en, ClinicalTranslationKey } from './en';

type SupportedClinicalLanguage = 'en';

const translations: Record<SupportedClinicalLanguage, Record<ClinicalTranslationKey, string>> = {
  en,
};

let currentLanguage: SupportedClinicalLanguage = 'en';

export function setClinicalLanguage(lang: SupportedClinicalLanguage): void {
  currentLanguage = lang;
}

export function getClinicalLanguage(): SupportedClinicalLanguage {
  return currentLanguage;
}

export function ct(key: ClinicalTranslationKey): string {
  return translations[currentLanguage]?.[key] || translations.en[key] || key;
}

export type { ClinicalTranslationKey, SupportedClinicalLanguage };
