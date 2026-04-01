import { SupportedLanguage, TranslationStrings } from './types';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';

const translations: Record<SupportedLanguage, TranslationStrings> = {
  en, es, fr,
  // Placeholder - same as English until translated
  de: en, zh: en, ja: en, ko: en, pt: en,
};

let currentLanguage: SupportedLanguage = 'en';

export function setLanguage(lang: SupportedLanguage): void {
  currentLanguage = lang;
}

export function getLanguage(): SupportedLanguage {
  return currentLanguage;
}

export function t(key: keyof TranslationStrings): string {
  return translations[currentLanguage][key] || translations.en[key] || key;
}

export function getAvailableLanguages(): { code: SupportedLanguage; name: string; nativeName: string }[] {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Espa\u00f1ol' },
    { code: 'fr', name: 'French', nativeName: 'Fran\u00e7ais' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'zh', name: 'Chinese', nativeName: '\u4e2d\u6587' },
    { code: 'ja', name: 'Japanese', nativeName: '\u65e5\u672c\u8a9e' },
    { code: 'ko', name: 'Korean', nativeName: '\ud55c\uad6d\uc5b4' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Portugu\u00eas' },
  ];
}

export type { SupportedLanguage, TranslationStrings };
