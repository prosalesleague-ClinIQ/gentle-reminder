/**
 * Typography System for Dementia Patients
 *
 * HARD FLOOR: No text smaller than 24pt (enforced by Text primitive).
 * All sizes are designed for readability by elderly users with
 * possible visual impairments.
 */

// Minimum font size in points - this is an absolute floor
export const MIN_FONT_SIZE = 24;

// Maximum font size
export const MAX_FONT_SIZE = 48;

export const fontSize = {
  /** Body text - 24pt minimum */
  body: 24,
  /** Slightly larger body - 26pt */
  bodyLarge: 26,
  /** Subheading - 28pt */
  subheading: 28,
  /** Heading 3 - 30pt */
  h3: 30,
  /** Heading 2 - 34pt */
  h2: 34,
  /** Heading 1 - 40pt */
  h1: 40,
  /** Display / greeting - 48pt */
  display: 48,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const lineHeight = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
};

export const fontFamily = {
  primary: undefined, // System font - most readable for the device
  mono: 'monospace',
};

/**
 * Enforces the minimum font size floor.
 * Returns the given size if >= MIN_FONT_SIZE, otherwise MIN_FONT_SIZE.
 */
export function enforceFontFloor(requestedSize: number): number {
  return Math.max(requestedSize, MIN_FONT_SIZE);
}
