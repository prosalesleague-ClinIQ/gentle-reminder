import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { fontSize, fontWeight, lineHeight, enforceFontFloor } from '../theme/typography';

export type TextVariant = 'body' | 'bodyLarge' | 'subheading' | 'h3' | 'h2' | 'h1' | 'display';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
  color?: string;
  bold?: boolean;
  center?: boolean;
}

const variantStyles: Record<TextVariant, { size: number; weight: string; height: number }> = {
  body: { size: fontSize.body, weight: fontWeight.regular, height: lineHeight.relaxed },
  bodyLarge: { size: fontSize.bodyLarge, weight: fontWeight.regular, height: lineHeight.relaxed },
  subheading: { size: fontSize.subheading, weight: fontWeight.medium, height: lineHeight.normal },
  h3: { size: fontSize.h3, weight: fontWeight.semibold, height: lineHeight.normal },
  h2: { size: fontSize.h2, weight: fontWeight.bold, height: lineHeight.tight },
  h1: { size: fontSize.h1, weight: fontWeight.bold, height: lineHeight.tight },
  display: { size: fontSize.display, weight: fontWeight.bold, height: lineHeight.tight },
};

export function Text({ variant = 'body', color, bold, center, style, ...props }: TextProps) {
  const variantStyle = variantStyles[variant];

  return (
    <RNText
      style={[
        {
          // HARD FLOOR: enforceFontFloor guarantees minimum 24pt
          fontSize: enforceFontFloor(variantStyle.size),
          fontWeight: bold ? fontWeight.bold : (variantStyle.weight as any),
          lineHeight: enforceFontFloor(variantStyle.size) * variantStyle.height,
          color: color ?? colors.text.primary,
          textAlign: center ? 'center' : undefined,
        },
        style,
      ]}
      accessible
      {...props}
    />
  );
}
