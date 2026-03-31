import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeText } from './SafeText';
import { colors, spacing } from '../constants/theme';

interface ProgressIndicatorProps {
  /** Number of completed exercises */
  completed: number;
  /** Total number of exercises */
  total: number;
  /** Current exercise index (0-based) */
  currentIndex: number;
}

/**
 * Session progress dots.
 * Shows which exercises are done, current, and remaining.
 */
export function ProgressIndicator({
  completed,
  total,
  currentIndex,
}: ProgressIndicatorProps) {
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={`Exercise ${currentIndex + 1} of ${total}`}>
      <View style={styles.dots}>
        {Array.from({ length: total }, (_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              i < completed && styles.dotCompleted,
              i === currentIndex && styles.dotCurrent,
              i > currentIndex && styles.dotPending,
            ]}
          />
        ))}
      </View>
      <SafeText variant="body" center color={colors.text.secondary}>
        {currentIndex + 1} of {total}
      </SafeText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  dots: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  dotCompleted: {
    backgroundColor: colors.feedback.celebrated,
  },
  dotCurrent: {
    backgroundColor: colors.primary[500],
    width: 24,
    borderRadius: 12,
  },
  dotPending: {
    backgroundColor: colors.border.light,
  },
});
