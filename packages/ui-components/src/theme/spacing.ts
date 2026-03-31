/**
 * Spacing and Layout Constants
 *
 * Generous spacing for touch targets and readability.
 * All touch targets meet minimum 80px requirement.
 */

export const spacing = {
  /** 4px */
  xs: 4,
  /** 8px */
  sm: 8,
  /** 12px */
  md: 12,
  /** 16px */
  lg: 16,
  /** 24px */
  xl: 24,
  /** 32px */
  xxl: 32,
  /** 48px */
  xxxl: 48,
} as const;

export const layout = {
  /** Minimum touch target height: 80px */
  minButtonHeight: 80,
  /** Minimum touch target width: 80px */
  minButtonWidth: 80,
  /** Maximum button height: 120px */
  maxButtonHeight: 120,
  /** Screen padding: 24px */
  screenPadding: 24,
  /** Card padding: 20px */
  cardPadding: 20,
  /** Maximum choices per screen */
  maxChoicesPerScreen: 3,
  /** Border radius for cards */
  borderRadius: 16,
  /** Border radius for buttons */
  buttonBorderRadius: 12,
  /** Photo card size */
  photoCardSize: 160,
  /** Profile photo size */
  profilePhotoSize: 200,
} as const;

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  button: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
} as const;
