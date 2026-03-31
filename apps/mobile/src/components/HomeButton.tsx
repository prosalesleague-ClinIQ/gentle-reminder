import React, { useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, fontSize, fontWeight, spacing, shadows } from '../constants/theme';

interface HomeButtonProps {
  /** Optional callback before navigating home (e.g., to abandon session) */
  onBeforeNavigate?: () => Promise<void> | void;
}

/**
 * Persistent floating HOME button.
 * Always visible on session screens so the patient can return to safety.
 * Positioned at bottom-left of the screen.
 */
export function HomeButton({ onBeforeNavigate }: HomeButtonProps) {
  const router = useRouter();

  const handlePress = useCallback(async () => {
    if (Platform.OS !== 'web') {
      import('expo-haptics').then((H) => H.impactAsync(H.ImpactFeedbackStyle.Light)).catch(() => {});
    }
    if (onBeforeNavigate) {
      await onBeforeNavigate();
    }
    router.replace('/(tabs)/home');
  }, [router, onBeforeNavigate]);

  return (
    <TouchableOpacity
      style={styles.button}
      onPress={handlePress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Go Home"
      accessibilityHint="Returns to the home screen"
    >
      <Text style={styles.icon}>{'🏠'}</Text>
      <Text style={styles.label}>Home</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    backgroundColor: colors.white,
    borderRadius: 30,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    borderWidth: 2,
    borderColor: colors.primary[500],
    zIndex: 999,
    ...shadows.card,
  },
  icon: {
    fontSize: 28,
  },
  label: {
    fontSize: fontSize.body,
    fontWeight: fontWeight.bold,
    color: colors.primary[500],
  },
});
