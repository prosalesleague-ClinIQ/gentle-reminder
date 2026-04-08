import { Platform } from 'react-native';
import { SupportedLanguage, TranslationStrings } from './types';
import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { zh } from './zh';
import { ja } from './ja';
import { ko } from './ko';
import { pt } from './pt';
import { ar } from './ar';
import { hi } from './hi';

const translations: Record<SupportedLanguage, TranslationStrings> = {
  en, es, fr, de, zh, ja, ko, pt, ar, hi,
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

/**
 * Detects the user's preferred language from the device/browser locale.
 * Falls back to 'en' if no supported language matches.
 */
export function detectLanguage(): SupportedLanguage {
  try {
    let locale: string | undefined;

    if (Platform.OS === 'web') {
      locale = typeof navigator !== 'undefined' ? navigator.language : undefined;
    } else {
      // Expo localization — dynamically imported to avoid web bundling issues
      try {
        const Localization = require('expo-localization');
        const locales = Localization.getLocales?.();
        locale = locales?.[0]?.languageCode;
      } catch {
        // expo-localization not available
      }
    }

    if (locale) {
      const langCode = locale.split('-')[0].toLowerCase() as SupportedLanguage;
      if (langCode in translations) {
        return langCode;
      }
    }
  } catch {
    // Detection failed, fall back to English
  }

  return 'en';
}

export function getAvailableLanguages(): { code: SupportedLanguage; name: string; nativeName: string }[] {
  return [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  ];
}

export type { SupportedLanguage, TranslationStrings };
export { plural, formatDate, formatTime, formatDateTime, formatNumber, formatPercent, formatDuration, getDayName, formatRelativeTime } from './formatters';
export { isRTL, isRTLLanguage, applyRTLLayout, rtlFlexDirection, rtlTextAlign } from './rtl';
