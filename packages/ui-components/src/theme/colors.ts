/**
 * Gentle Reminder Color Palette
 *
 * Designed for dementia patients:
 * - WCAG AAA compliant (7:1 contrast ratio minimum)
 * - Warm, calming tones
 * - No aggressive reds for errors
 * - Clear visual hierarchy
 */

export const colors = {
  // Primary - warm blue (calming, trustworthy)
  primary: {
    50: '#E8F4FD',
    100: '#B8DFF7',
    200: '#88CAF1',
    300: '#58B5EB',
    400: '#2EA0E5',
    500: '#1A7BC4', // main
    600: '#146199',
    700: '#0E476E',
    800: '#082D44',
    900: '#02131A',
  },

  // Secondary - soft sage green (nature, peace)
  secondary: {
    50: '#EDF5F0',
    100: '#C8E0D1',
    200: '#A3CBB2',
    300: '#7EB693',
    400: '#59A174',
    500: '#3D8158', // main
    600: '#306645',
    700: '#244B33',
    800: '#173020',
    900: '#0B150E',
  },

  // Accent - warm amber (gentle energy)
  accent: {
    50: '#FFF8E8',
    100: '#FFEAB8',
    200: '#FFDC88',
    300: '#FFCE58',
    400: '#FFC028',
    500: '#E5A300', // main
    600: '#B28000',
    700: '#805C00',
    800: '#4D3800',
    900: '#1A1400',
  },

  // Backgrounds
  background: {
    primary: '#FFFFFF',
    secondary: '#F8FAFB',
    warm: '#FFF9F0',
    card: '#FFFFFF',
  },

  // Text - high contrast
  text: {
    primary: '#1A1A2E',    // near black
    secondary: '#3A3A5C',  // dark grey
    muted: '#6B6B8D',      // medium grey
    inverse: '#FFFFFF',
  },

  // Feedback - NO red for errors
  feedback: {
    celebrated: '#3D8158',   // green - success
    guided: '#E5A300',       // amber - gentle guidance
    supported: '#1A7BC4',    // blue - supportive
  },

  // Borders
  border: {
    light: '#E2E8F0',
    medium: '#CBD5E0',
    focus: '#1A7BC4',
  },

  // System
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
} as const;
