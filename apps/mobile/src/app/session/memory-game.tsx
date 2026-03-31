import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  FeedbackType,
} from '@gentle-reminder/shared-types';
import {
  generateCategoryPrompt,
  generateObjectPrompt,
  evaluateCategoryAnswer,
  evaluateObjectAnswer,
} from '@gentle-reminder/cognitive-engine';
import type { GeneratedPrompt, PatientContext } from '@gentle-reminder/cognitive-engine';
import { SafeText } from '../../components/SafeText';
import { ExerciseCard } from '../../components/ExerciseCard';
import { GentleFeedback } from '../../components/GentleFeedback';
import { ProgressIndicator } from '../../components/ProgressIndicator';
import { HomeButton } from '../../components/HomeButton';
import { BigButton } from '../../components/BigButton';
import { VoicePrompt } from '../../components/VoicePrompt';
import { useVoice } from '../../hooks/useVoice';
import { getCompletionMessage } from '../../utils/scoring';
import {
  ORIENTATION_EXERCISE_COUNT,
  IDENTITY_EXERCISE_COUNT,
  MEMORY_EXERCISE_COUNT,
  TOTAL_EXERCISES_PER_SESSION,
  AUTO_ADVANCE_DELAY_MS,
} from '../../constants/exercises';
import { colors, spacing, layout, shadows } from '../../constants/theme';

/**
 * Memory Game screen.
 * Category naming and object recognition exercises.
 * Also handles session completion.
 */
export default function MemoryGameScreen() {
  const router = useRouter();
  const { speak, isSpeaking } = useVoice();

  const [localExerciseIndex, setLocalExerciseIndex] = useState(0);
  const [prompt, setPrompt] = useState<GeneratedPrompt | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [demoCelebrated, setDemoCelebrated] = useState(0);

  const preferredName = 'Friend';
  const globalExerciseIndex = ORIENTATION_EXERCISE_COUNT + IDENTITY_EXERCISE_COUNT + localExerciseIndex;

  const patientContext: PatientContext = {
    preferredName,
    city: 'Melbourne',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    familyMembers: [
      { displayName: 'Lisa', relationship: 'child' },
      { displayName: 'Robert', relationship: 'spouse' },
      { displayName: 'Emma', relationship: 'grandchild' },
    ],
  };

  useEffect(() => {
    if (isCompleted) return;

    let generated: GeneratedPrompt | null = null;

    switch (localExerciseIndex) {
      case 0:
        generated = generateCategoryPrompt(patientContext);
        break;
      case 1:
        generated = generateObjectPrompt(patientContext);
        break;
    }

    if (generated) {
      setPrompt(generated);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setFeedbackType(null);
      speak(generated.prompt);
    }
  }, [localExerciseIndex, isCompleted]);

  const handleSelectAnswer = useCallback(
    (answer: string) => {
      if (!prompt || showFeedback) return;

      setSelectedAnswer(answer);

      let evaluation;
      if (localExerciseIndex === 0) {
        evaluation = evaluateCategoryAnswer(answer, prompt.expectedAnswer, prompt.acceptableAnswers);
      } else {
        evaluation = evaluateObjectAnswer(answer, prompt.expectedAnswer, prompt.acceptableAnswers);
      }

      setFeedbackType(evaluation.feedbackType);
      setShowFeedback(true);
      setCompleted((c) => c + 1);
      if (evaluation.feedbackType === FeedbackType.CELEBRATED) {
        setDemoCelebrated((c) => c + 1);
      }

      setTimeout(() => {
        if (localExerciseIndex < MEMORY_EXERCISE_COUNT - 1) {
          setLocalExerciseIndex((i) => i + 1);
        } else {
          handleSessionComplete();
        }
      }, AUTO_ADVANCE_DELAY_MS);
    },
    [prompt, showFeedback, localExerciseIndex],
  );

  const handleSessionComplete = useCallback(() => {
    setIsCompleted(true);
    const message = getCompletionMessage(
      demoCelebrated,
      TOTAL_EXERCISES_PER_SESSION,
      preferredName,
    );
    speak(message);
  }, [demoCelebrated, preferredName, speak]);

  const handleGoHome = useCallback(() => {
    router.replace('/(tabs)/home');
  }, [router]);

  // Completion screen
  if (isCompleted) {
    const completionMsg = getCompletionMessage(
      demoCelebrated,
      TOTAL_EXERCISES_PER_SESSION,
      preferredName,
    );

    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.completionContainer}>
          <SafeText variant="display" center bold color={colors.feedback.celebrated}>
            Session Complete!
          </SafeText>

          <VoicePrompt isSpeaking={isSpeaking} label="Speaking..." />

          <View style={styles.completionCard}>
            <SafeText variant="h3" center>
              {completionMsg}
            </SafeText>

            <SafeText variant="body" center color={colors.text.secondary}>
              You completed all the exercises. Great job today!
            </SafeText>
          </View>

          <BigButton
            title="Back to Home"
            onPress={handleGoHome}
            variant="primary"
            style={styles.homeButton}
            accessibilityHint="Return to the home screen"
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Exercise screen
  if (!prompt) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <SafeText variant="h3" center>Loading exercise...</SafeText>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ProgressIndicator
          completed={completed}
          total={TOTAL_EXERCISES_PER_SESSION}
          currentIndex={globalExerciseIndex}
        />

        <VoicePrompt isSpeaking={isSpeaking} label="Speaking..." />

        <View style={styles.content}>
          {showFeedback && feedbackType ? (
            <GentleFeedback
              feedbackType={feedbackType}
              preferredName={preferredName}
              speakFeedback
            />
          ) : (
            <ExerciseCard
              prompt={prompt.prompt}
              options={prompt.options || []}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={handleSelectAnswer}
              hint={undefined}
              disabled={showFeedback}
            />
          )}
        </View>

        <HomeButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.warm,
  },
  container: {
    flex: 1,
    padding: layout.screenPadding,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  completionContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: layout.screenPadding,
    gap: spacing.xxl,
  },
  completionCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xxl,
    gap: spacing.xl,
    ...shadows.card,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    gap: spacing.xs,
  },
  homeButton: {
    marginTop: spacing.lg,
  },
});
