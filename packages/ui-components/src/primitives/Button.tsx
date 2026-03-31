import React from 'react';
import {
  TouchableOpacity,
  TouchableOpacityProps,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';
import { Text } from './Text';
import { colors } from '../theme/colors';
import { layout, shadows, spacing } from '../theme/spacing';
import { fontSize, fontWeight } from '../theme/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'gentle';

interface ButtonProps extends Omit<TouchableOpacityProps, 'style'> {
  title: string;
  variant?: ButtonVariant;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const variantColors: Record<ButtonVariant, { bg: string; text: string; border?: string }> = {
  primary: { bg: colors.primary[500], text: colors.white },
  secondary: { bg: colors.secondary[500], text: colors.white },
  outline: { bg: colors.transparent, text: colors.primary[500], border: colors.primary[500] },
  gentle: { bg: colors.background.warm, text: colors.text.primary, border: colors.border.light },
};

/**
 * Button primitive with enforced minimum touch target.
 *
 * HARD FLOOR: minHeight 80px, minWidth 80px.
 * These cannot be overridden to ensure dementia patients
 * can reliably tap buttons.
 */
export function Button({
  title,
  variant = 'primary',
  fullWidth = false,
  style,
  disabled,
  ...props
}: ButtonProps) {
  const colorSet = variantColors[variant];

  return (
    <TouchableOpacity
      style={[
        styles.base,
        {
          backgroundColor: disabled ? colors.border.light : colorSet.bg,
          borderColor: colorSet.border,
          borderWidth: colorSet.border ? 2 : 0,
        },
        fullWidth && styles.fullWidth,
        style,
      ]}
      activeOpacity={0.7}
      disabled={disabled}
      accessible
      accessibilityRole="button"
      accessibilityLabel={title}
      {...props}
    >
      <Text
        variant="subheading"
        bold
        center
        color={disabled ? colors.text.muted : colorSet.text}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    // HARD FLOORS - cannot be smaller
    minHeight: layout.minButtonHeight,
    minWidth: layout.minButtonWidth,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    borderRadius: layout.buttonBorderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  fullWidth: {
    width: '100%',
  },
});
