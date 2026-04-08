import { I18nManager, Platform } from 'react-native';
import { SupportedLanguage, RTL_LANGUAGES } from './types';
import { getLanguage } from './index';

/**
 * Checks if a language requires right-to-left layout.
 */
export function isRTLLanguage(lang: SupportedLanguage): boolean {
  return RTL_LANGUAGES.includes(lang);
}

/**
 * Applies RTL layout if the current language requires it.
 * Must be called after language changes (typically at app start or language switch).
 * On web, this sets the `dir` attribute on the document element.
 */
export function applyRTLLayout(lang?: SupportedLanguage): void {
  const language = lang || getLanguage();
  const shouldBeRTL = isRTLLanguage(language);

  if (Platform.OS === 'web') {
    if (typeof document !== 'undefined') {
      document.documentElement.dir = shouldBeRTL ? 'rtl' : 'ltr';
    }
  } else {
    I18nManager.forceRTL(shouldBeRTL);
    I18nManager.allowRTL(shouldBeRTL);
  }
}

/**
 * Returns the current RTL state. Useful for conditional styling.
 */
export function isRTL(): boolean {
  if (Platform.OS === 'web') {
    if (typeof document !== 'undefined') {
      return document.documentElement.dir === 'rtl';
    }
    return false;
  }
  return I18nManager.isRTL;
}

/**
 * Returns flex direction based on RTL state.
 * Use for layouts that need to reverse in RTL.
 */
export function rtlFlexDirection(): 'row' | 'row-reverse' {
  return isRTL() ? 'row-reverse' : 'row';
}

/**
 * Returns text alignment based on RTL state.
 */
export function rtlTextAlign(): 'left' | 'right' {
  return isRTL() ? 'right' : 'left';
}
