import React from 'react';
import { Text as RNText, type TextProps, StyleSheet } from 'react-native';
import { useAccessibility } from '../hooks/useAccessibility';
import { fontSize as themeFontSize, fontWeight, lineHeight } from '../constants/theme';
import { MIN_FONT_SIZE } from '../constants/accessibility';

interface SafeTextProps extends TextProps {
  /** Text variant for preset sizing */
  variant?: 'body' | 'bodyLarge' | 'subheading' | 'h3' | 'h2' | 'h1' | 'display';
  /** Override color */
  color?: string;
  /** Bold text */
  bold?: boolean;
  /** Center alignment */
  center?: boolean;
  children: React.ReactNode;
}

/**
 * Text component with enforced 24pt minimum font size.
 * Respects the user's font scale preference from accessibility settings.
 */
export function SafeText({
  variant = 'body',
  color,
  bold = false,
  center = false,
  style,
  children,
  ...props
}: SafeTextProps) {
  const { scaledFontSize, textColor } = useAccessibility();

  const baseSize = themeFontSize[variant] || themeFontSize.body;
  const computedSize = scaledFontSize(baseSize);
  const resolvedColor = color || textColor;

  return (
    <RNText
      style={[
        styles.base,
        {
          fontSize: Math.max(computedSize, MIN_FONT_SIZE),
          color: resolvedColor,
          fontWeight: bold ? fontWeight.bold : fontWeight.regular,
          textAlign: center ? 'center' : 'left',
        },
        style,
      ]}
      accessibilityRole="text"
      {...props}
    >
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  base: {
    lineHeight: undefined, // Let RN compute from fontSize
  },
});
