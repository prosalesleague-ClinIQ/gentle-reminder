import React, { useCallback, useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  ActivityIndicator,
} from 'react-native';
import { Platform } from 'react-native';
import { colors, fontSize, fontWeight, layout, shadows, spacing } from '../constants/theme';
import { TOUCH_DEBOUNCE_MS } from '../constants/accessibility';

interface BigButtonProps {
  title: string;
  onPress: () => void;
  icon?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'accent';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

/**
 * Large 100px tall button with icon support.
 * Designed for elderly users with generous touch targets.
 */
export function BigButton({
  title,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}: BigButtonProps) {
  const lastPressRef = useRef(0);

  const handlePress = useCallback(() => {
    const now = Date.now();
    if (now - lastPressRef.current < TOUCH_DEBOUNCE_MS) return;
    lastPressRef.current = now;

    if (Platform.OS !== 'web') {
      import('expo-haptics').then((Haptics) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      }).catch(() => {});
    }
    onPress();
  }, [onPress]);

  const variantStyles = getVariantStyles(variant, disabled);

  return (
    <TouchableOpacity
      style={[styles.button, variantStyles.button, style]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || title}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {loading ? (
        <ActivityIndicator size="large" color={variantStyles.textColor} />
      ) : (
        <>
          {icon && icon}
          <Text style={[styles.text, { color: variantStyles.textColor }, textStyle]}>
            {title}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
}

function getVariantStyles(variant: string, disabled: boolean) {
  const opacity = disabled ? 0.5 : 1;

  switch (variant) {
    case 'secondary':
      return {
        button: {
          backgroundColor: colors.secondary[500],
          opacity,
        } as ViewStyle,
        textColor: colors.text.inverse,
      };
    case 'accent':
      return {
        button: {
          backgroundColor: colors.accent[500],
          opacity,
        } as ViewStyle,
        textColor: colors.text.primary,
      };
    default:
      return {
        button: {
          backgroundColor: colors.primary[500],
          opacity,
        } as ViewStyle,
        textColor: colors.text.inverse,
      };
  }
}

const styles = StyleSheet.create({
  button: {
    height: 100,
    minWidth: layout.minButtonWidth,
    borderRadius: layout.buttonBorderRadius,
    paddingHorizontal: spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.md,
    ...shadows.button,
  },
  text: {
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
  },
});
