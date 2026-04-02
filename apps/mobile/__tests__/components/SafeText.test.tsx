/**
 * SafeText component tests.
 *
 * Validates that text is always rendered at or above the 24pt
 * minimum font size, and that all seven variants, bold, center,
 * and custom color props work correctly.
 */
import React from 'react';
import { render } from '@testing-library/react-native';
import { SafeText } from '../../src/components/SafeText';
import { MIN_FONT_SIZE } from '../../src/constants/accessibility';

// ---------------------------------------------------------------------------
// Mock the useAccessibility hook (provides font scaling + text color)
// ---------------------------------------------------------------------------
jest.mock('../../src/hooks/useAccessibility', () => ({
  useAccessibility: () => ({
    scaledFontSize: (size: number) => size,
    textColor: '#1A1A1A',
  }),
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getTextStyle(element: any): Record<string, any> {
  const styles = element.props.style;
  if (Array.isArray(styles)) {
    return Object.assign({}, ...styles.filter(Boolean));
  }
  return styles || {};
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------
describe('SafeText', () => {
  // ---- Basic rendering ----------------------------------------------------

  it('renders children text', () => {
    const { getByText } = render(<SafeText>Hello World</SafeText>);
    expect(getByText('Hello World')).toBeTruthy();
  });

  it('renders with accessibility role "text"', () => {
    const { getByText } = render(<SafeText>Accessible</SafeText>);
    const element = getByText('Accessible');
    expect(element.props.accessibilityRole).toBe('text');
  });

  // ---- Variant rendering --------------------------------------------------

  const variants = ['body', 'bodyLarge', 'subheading', 'h3', 'h2', 'h1', 'display'] as const;

  variants.forEach((variant) => {
    it(`renders the "${variant}" variant`, () => {
      const { getByText } = render(
        <SafeText variant={variant}>Variant: {variant}</SafeText>
      );
      expect(getByText(`Variant: ${variant}`)).toBeTruthy();
    });
  });

  // ---- Font size floor ----------------------------------------------------

  it('enforces a minimum font size of 24pt (MIN_FONT_SIZE)', () => {
    // The body variant should still be at least 24pt
    const { getByText } = render(<SafeText variant="body">Small?</SafeText>);
    const element = getByText('Small?');
    const style = getTextStyle(element);
    expect(style.fontSize).toBeGreaterThanOrEqual(MIN_FONT_SIZE);
  });

  it('does not reduce font size below MIN_FONT_SIZE even when base size is small', () => {
    // Even if the theme defines a smaller size, SafeText uses Math.max
    const { getByText } = render(<SafeText variant="body">Floor</SafeText>);
    const element = getByText('Floor');
    const style = getTextStyle(element);
    expect(style.fontSize).toBeGreaterThanOrEqual(24);
  });

  it('allows font size above MIN_FONT_SIZE for large variants', () => {
    const { getByText } = render(<SafeText variant="display">Big</SafeText>);
    const element = getByText('Big');
    const style = getTextStyle(element);
    expect(style.fontSize).toBeGreaterThanOrEqual(MIN_FONT_SIZE);
  });

  // ---- Bold prop ----------------------------------------------------------

  it('applies bold font weight when bold=true', () => {
    const { getByText } = render(<SafeText bold>Bold Text</SafeText>);
    const element = getByText('Bold Text');
    const style = getTextStyle(element);
    // fontWeight should be '700' or 'bold' or the theme's bold value
    expect(['700', 'bold', '800']).toContain(String(style.fontWeight));
  });

  it('applies regular font weight when bold=false', () => {
    const { getByText } = render(<SafeText bold={false}>Regular</SafeText>);
    const element = getByText('Regular');
    const style = getTextStyle(element);
    expect(['400', 'normal', '500', undefined]).toContain(
      style.fontWeight ? String(style.fontWeight) : undefined
    );
  });

  // ---- Center prop --------------------------------------------------------

  it('centers text when center=true', () => {
    const { getByText } = render(<SafeText center>Centered</SafeText>);
    const element = getByText('Centered');
    const style = getTextStyle(element);
    expect(style.textAlign).toBe('center');
  });

  it('uses left alignment when center=false', () => {
    const { getByText } = render(<SafeText center={false}>Left</SafeText>);
    const element = getByText('Left');
    const style = getTextStyle(element);
    expect(style.textAlign).toBe('left');
  });

  // ---- Custom color prop --------------------------------------------------

  it('applies a custom color when provided', () => {
    const { getByText } = render(
      <SafeText color="#FF0000">Red Text</SafeText>
    );
    const element = getByText('Red Text');
    const style = getTextStyle(element);
    expect(style.color).toBe('#FF0000');
  });

  it('uses the default text color from useAccessibility when no color prop', () => {
    const { getByText } = render(<SafeText>Default Color</SafeText>);
    const element = getByText('Default Color');
    const style = getTextStyle(element);
    expect(style.color).toBe('#1A1A1A');
  });

  // ---- Combining props ----------------------------------------------------

  it('combines bold + center + custom color', () => {
    const { getByText } = render(
      <SafeText bold center color="#00FF00">
        Combined
      </SafeText>
    );
    const element = getByText('Combined');
    const style = getTextStyle(element);
    expect(style.textAlign).toBe('center');
    expect(style.color).toBe('#00FF00');
    expect(['700', 'bold', '800']).toContain(String(style.fontWeight));
  });
});
