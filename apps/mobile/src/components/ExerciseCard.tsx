import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeText } from './SafeText';
import { colors, spacing, layout, shadows, fontSize } from '../constants/theme';
import { MAX_CHOICES_PER_SCREEN, MIN_BUTTON_HEIGHT } from '../constants/accessibility';

interface ExerciseCardProps {
  /** The question or prompt text */
  prompt: string;
  /** Answer options (max 3 shown) */
  options: string[];
  /** Currently selected answer */
  selectedAnswer: string | null;
  /** Callback when an option is selected */
  onSelectAnswer: (answer: string) => void;
  /** Optional hint text */
  hint?: string;
  /** Whether interaction is disabled (e.g., while showing feedback) */
  disabled?: boolean;
}

/**
 * Card layout for exercise prompts.
 * Shows the question and up to 3 large answer buttons.
 */
export function ExerciseCard({
  prompt,
  options,
  selectedAnswer,
  onSelectAnswer,
  hint,
  disabled = false,
}: ExerciseCardProps) {
  // Enforce max choices
  const displayOptions = options.slice(0, MAX_CHOICES_PER_SCREEN);

  return (
    <View style={styles.card} accessibilityRole="form">
      <SafeText variant="h2" center bold style={styles.prompt}>
        {prompt}
      </SafeText>

      {hint && (
        <SafeText variant="body" center color={colors.text.muted} style={styles.hint}>
          {hint}
        </SafeText>
      )}

      <View style={styles.options}>
        {displayOptions.map((option) => {
          const isSelected = selectedAnswer === option;
          return (
            <TouchableOpacity
              key={option}
              style={[
                styles.optionButton,
                isSelected && styles.optionSelected,
                disabled && styles.optionDisabled,
              ]}
              onPress={() => onSelectAnswer(option)}
              disabled={disabled}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={option}
              accessibilityState={{ selected: isSelected, disabled }}
            >
              <SafeText
                variant="bodyLarge"
                center
                bold={isSelected}
                color={isSelected ? colors.white : colors.text.primary}
              >
                {option}
              </SafeText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    ...shadows.card,
  },
  prompt: {
    marginBottom: spacing.xl,
  },
  hint: {
    marginBottom: spacing.lg,
    fontStyle: 'italic',
  },
  options: {
    gap: spacing.lg,
  },
  optionButton: {
    minHeight: MIN_BUTTON_HEIGHT,
    borderRadius: layout.buttonBorderRadius,
    borderWidth: 2,
    borderColor: colors.border.medium,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.primary,
  },
  optionSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  optionDisabled: {
    opacity: 0.6,
  },
});
