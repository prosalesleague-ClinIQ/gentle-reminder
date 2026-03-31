import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import { SafeText } from './SafeText';
import { BigButton } from './BigButton';
import { colors, spacing, layout, shadows, fontSize, fontWeight } from '../constants/theme';
import { MAX_CHOICES_PER_SCREEN, MIN_BUTTON_HEIGHT } from '../constants/accessibility';

interface ExerciseCardProps {
  /** The question or prompt text */
  prompt: string;
  /** Answer options (max 3 shown). If empty, shows text input instead. */
  options: string[];
  /** Currently selected answer */
  selectedAnswer: string | null;
  /** Callback when an option is selected or text is submitted */
  onSelectAnswer: (answer: string) => void;
  /** Optional hint text */
  hint?: string;
  /** Whether interaction is disabled (e.g., while showing feedback) */
  disabled?: boolean;
  /** Placeholder text for text input mode */
  inputPlaceholder?: string;
}

/**
 * Card layout for exercise prompts.
 * Shows the question with either:
 * - Up to 3 large answer buttons (when options provided)
 * - A text input field with submit button (when no options)
 */
export function ExerciseCard({
  prompt,
  options,
  selectedAnswer,
  onSelectAnswer,
  hint,
  disabled = false,
  inputPlaceholder = 'Type your answer...',
}: ExerciseCardProps) {
  const [textInput, setTextInput] = useState('');
  const displayOptions = options.slice(0, MAX_CHOICES_PER_SCREEN);
  const showTextInput = displayOptions.length === 0;

  const handleSubmitText = () => {
    if (textInput.trim()) {
      onSelectAnswer(textInput.trim());
      setTextInput('');
    }
  };

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

      {showTextInput ? (
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            value={textInput}
            onChangeText={setTextInput}
            placeholder={inputPlaceholder}
            placeholderTextColor={colors.text.muted}
            autoCapitalize="words"
            autoCorrect={false}
            editable={!disabled}
            onSubmitEditing={handleSubmitText}
            returnKeyType="done"
            accessibilityLabel="Your answer"
            accessibilityHint="Type your answer and tap Submit"
          />
          <BigButton
            title="Submit"
            onPress={handleSubmitText}
            disabled={disabled || !textInput.trim()}
            variant="primary"
            style={styles.submitButton}
          />
        </View>
      ) : (
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
      )}
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
  textInputContainer: {
    gap: spacing.lg,
  },
  textInput: {
    minHeight: MIN_BUTTON_HEIGHT,
    borderWidth: 2,
    borderColor: colors.border.medium,
    borderRadius: layout.buttonBorderRadius,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.body,
    fontWeight: fontWeight.regular,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    textAlign: 'center',
  },
  submitButton: {
    marginTop: spacing.sm,
  },
});
