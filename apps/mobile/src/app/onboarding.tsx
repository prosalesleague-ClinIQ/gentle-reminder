import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../components/SafeText';
import { BigButton } from '../components/BigButton';
import { colors, spacing, layout, shadows, fontSize, fontWeight } from '../constants/theme';
import { MIN_BUTTON_HEIGHT } from '../constants/accessibility';

/**
 * Patient onboarding flow.
 * Collects basic information in a gentle, step-by-step process.
 * Maximum 3 choices per screen, large text, encouraging tone.
 */

const STEPS = [
  { key: 'welcome', title: 'Welcome!', subtitle: "Let's get to know you" },
  { key: 'name', title: 'What should we call you?', subtitle: 'Your preferred name' },
  { key: 'city', title: 'Where do you live?', subtitle: 'Your city or town' },
  { key: 'family', title: 'Tell us about your family', subtitle: 'Who is closest to you?' },
  { key: 'done', title: "You're all set!", subtitle: "Let's get started" },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [familyName, setFamilyName] = useState('');

  const currentStep = STEPS[step];

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const renderStepContent = () => {
    switch (currentStep.key) {
      case 'welcome':
        return (
          <View style={styles.centeredContent}>
            <SafeText variant="display" center>💙</SafeText>
            <SafeText variant="h2" center bold color={colors.primary[500]} style={styles.stepTitle}>
              Welcome to Gentle Reminder
            </SafeText>
            <SafeText variant="bodyLarge" center color={colors.text.secondary}>
              This app helps you exercise your mind, stay connected with family, and preserve your precious memories.
            </SafeText>
            <SafeText variant="body" center color={colors.text.muted} style={styles.stepHint}>
              We'll ask you a few simple questions to personalize your experience.
            </SafeText>
          </View>
        );

      case 'name':
        return (
          <View style={styles.inputContent}>
            <SafeText variant="h2" center bold>{currentStep.title}</SafeText>
            <TextInput
              style={styles.textInput}
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={colors.text.muted}
              autoCapitalize="words"
              accessibilityLabel="Your preferred name"
            />
            <SafeText variant="body" center color={colors.text.muted}>
              We'll use this name to greet you each day
            </SafeText>
          </View>
        );

      case 'city':
        return (
          <View style={styles.inputContent}>
            <SafeText variant="h2" center bold>{currentStep.title}</SafeText>
            <TextInput
              style={styles.textInput}
              value={city}
              onChangeText={setCity}
              placeholder="Your city"
              placeholderTextColor={colors.text.muted}
              autoCapitalize="words"
              accessibilityLabel="Your city"
            />
            <SafeText variant="body" center color={colors.text.muted}>
              This helps with orientation exercises
            </SafeText>
          </View>
        );

      case 'family':
        return (
          <View style={styles.inputContent}>
            <SafeText variant="h2" center bold>{currentStep.title}</SafeText>
            <TextInput
              style={styles.textInput}
              value={familyName}
              onChangeText={setFamilyName}
              placeholder="A family member's name"
              placeholderTextColor={colors.text.muted}
              autoCapitalize="words"
              accessibilityLabel="Family member name"
            />
            <SafeText variant="body" center color={colors.text.muted}>
              You can add more family members later
            </SafeText>
          </View>
        );

      case 'done':
        return (
          <View style={styles.centeredContent}>
            <SafeText variant="display" center>🌟</SafeText>
            <SafeText variant="h2" center bold color={colors.feedback.celebrated}>
              {name ? `Welcome, ${name}!` : 'Welcome!'}
            </SafeText>
            <SafeText variant="bodyLarge" center color={colors.text.secondary}>
              Everything is set up and ready. You can start your first cognitive session, explore your family connections, or record a story.
            </SafeText>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Progress */}
        <View style={styles.progressContainer}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.progressDot,
                i <= step && styles.progressDotActive,
                i < step && styles.progressDotComplete,
              ]}
            />
          ))}
        </View>

        {/* Content */}
        <View style={styles.content}>
          {renderStepContent()}
        </View>

        {/* Navigation */}
        <View style={styles.navigation}>
          {step > 0 && step < STEPS.length - 1 && (
            <BigButton
              title="Back"
              onPress={handleBack}
              variant="accent"
              style={styles.navButton}
            />
          )}
          <BigButton
            title={step === STEPS.length - 1 ? "Let's Go!" : 'Continue'}
            onPress={handleNext}
            variant="primary"
            style={[styles.navButton, step === 0 && styles.fullWidth]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.warm,
  },
  scrollContent: {
    flexGrow: 1,
    padding: layout.screenPadding,
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xxl,
  },
  progressDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.border.light,
  },
  progressDotActive: {
    backgroundColor: colors.primary[500],
  },
  progressDotComplete: {
    backgroundColor: colors.feedback.celebrated,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: spacing.xxl,
  },
  centeredContent: {
    alignItems: 'center',
    gap: spacing.xl,
  },
  inputContent: {
    gap: spacing.xl,
    alignItems: 'center',
  },
  stepTitle: {
    marginTop: spacing.lg,
  },
  stepHint: {
    marginTop: spacing.md,
  },
  textInput: {
    width: '100%',
    height: MIN_BUTTON_HEIGHT,
    borderWidth: 2,
    borderColor: colors.border.medium,
    borderRadius: layout.buttonBorderRadius,
    paddingHorizontal: spacing.lg,
    fontSize: fontSize.bodyLarge,
    fontWeight: fontWeight.medium,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    textAlign: 'center',
  },
  navigation: {
    flexDirection: 'row',
    gap: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxl,
  },
  navButton: {
    flex: 1,
  },
  fullWidth: {
    flex: 1,
  },
});
