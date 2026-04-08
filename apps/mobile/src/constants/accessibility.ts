/**
 * Accessibility constants for the Gentle Reminder mobile app.
 *
 * These constants enforce UX requirements for dementia patients:
 * - Large, readable text
 * - Large touch targets
 * - Limited choices to reduce cognitive load
 * - High contrast for visibility
 */

/** Minimum font size in points - absolute floor for all text */
export const MIN_FONT_SIZE = 24;

/** Minimum button/touch target height in pixels */
export const MIN_BUTTON_HEIGHT = 80;

/** Minimum button/touch target width in pixels */
export const MIN_BUTTON_WIDTH = 80;

/** Maximum number of choices shown on any single screen */
export const MAX_CHOICES_PER_SCREEN = 3;

/** Minimum contrast ratio (WCAG AAA) */
export const MIN_CONTRAST_RATIO = 7;

/** Default font scale multiplier (1.0 = normal) */
export const DEFAULT_FONT_SCALE = 1.0;

/** Maximum font scale multiplier */
export const MAX_FONT_SCALE = 1.5;

/** Minimum font scale multiplier */
export const MIN_FONT_SCALE = 1.0;

/** Font scale step size for settings adjustments */
export const FONT_SCALE_STEP = 0.1;

/** Whether voice guidance is enabled by default */
export const DEFAULT_VOICE_ENABLED = true;

/** Whether high contrast mode is enabled by default */
export const DEFAULT_HIGH_CONTRAST = false;

/** Animation duration in ms - kept short for clarity */
export const ANIMATION_DURATION_MS = 300;

/** Delay before auto-advancing to next exercise in ms */
export const AUTO_ADVANCE_DELAY_MS = 2000;

/** Touch debounce interval in ms to prevent double-taps */
export const TOUCH_DEBOUNCE_MS = 500;

/** Whether voice navigation mode is enabled by default */
export const DEFAULT_VOICE_NAV_MODE = false;

/** Default voice navigation speech speed */
export const DEFAULT_VOICE_NAV_SPEED: 'slow' | 'normal' | 'fast' = 'slow';

/** Whether elements are announced on focus by default */
export const DEFAULT_ANNOUNCE_ON_FOCUS = true;

/** Speech rate values for voice navigation speeds */
export const VOICE_NAV_RATES = {
  slow: 0.55,
  normal: 0.72,
  fast: 0.9,
} as const;
