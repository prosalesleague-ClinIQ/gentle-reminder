import { useMemo } from 'react';
import { useSettingsStore } from '../stores/settingsStore';
import { MIN_FONT_SIZE } from '../constants/accessibility';
import { colors } from '../constants/theme';

/**
 * Accessibility settings hook.
 * Computes derived values for font sizing, colors, and accessibility features.
 */
export function useAccessibility() {
  const {
    fontScale,
    voiceEnabled,
    highContrastMode,
    increaseFontScale,
    decreaseFontScale,
    toggleVoice,
    toggleHighContrast,
    resetSettings,
  } = useSettingsStore();

  /** Scale a font size according to the user's font scale preference */
  const scaledFontSize = useMemo(
    () =>
      (baseSize: number): number => {
        const scaled = Math.round(baseSize * fontScale);
        return Math.max(scaled, MIN_FONT_SIZE);
      },
    [fontScale],
  );

  /** Get the appropriate text color based on high contrast mode */
  const textColor = useMemo(
    () => (highContrastMode ? colors.black : colors.text.primary),
    [highContrastMode],
  );

  /** Get the appropriate background color based on high contrast mode */
  const backgroundColor = useMemo(
    () => (highContrastMode ? colors.white : colors.background.primary),
    [highContrastMode],
  );

  /** Get the appropriate secondary background based on high contrast mode */
  const secondaryBackgroundColor = useMemo(
    () => (highContrastMode ? colors.white : colors.background.warm),
    [highContrastMode],
  );

  /** Get feedback colors - always high contrast for clarity */
  const feedbackColors = useMemo(
    () => ({
      celebrated: colors.feedback.celebrated,
      guided: colors.feedback.guided,
      supported: colors.feedback.supported,
    }),
    [],
  );

  return {
    fontScale,
    voiceEnabled,
    highContrastMode,
    scaledFontSize,
    textColor,
    backgroundColor,
    secondaryBackgroundColor,
    feedbackColors,
    increaseFontScale,
    decreaseFontScale,
    toggleVoice,
    toggleHighContrast,
    resetSettings,
  };
}
