import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeedbackType } from '@gentle-reminder/shared-types';
import {
  generateDatePrompt,
  generateNamePrompt,
  generateLocationPrompt,
  evaluateOrientationAnswer,
} from '@gentle-reminder/cognitive-engine';
import type { GeneratedPrompt } from '@gentle-reminder/cognitive-engine';
import { SafeText } from '../../components/SafeText';
import { ExerciseCard } from '../../components/ExerciseCard';
import { GentleFeedback } from '../../components/GentleFeedback';
import { ProgressIndicator } from '../../components/ProgressIndicator';
import { HomeButton } from '../../components/HomeButton';
import { useVoice } from '../../hooks/useVoice';
import {
  ORIENTATION_EXERCISE_COUNT,
  TOTAL_EXERCISES_PER_SESSION,
  AUTO_ADVANCE_DELAY_MS,
} from '../../constants/exercises';
import { colors, layout } from '../../constants/theme';

/**
 * Orientation Exercise screen.
 * Tests date, name, and location awareness with gentle feedback.
 */
export default function OrientationScreen() {
  const router = useRouter();
  const { speak, isSpeaking } = useVoice();

  const preferredName = 'Friend';
  const city = 'Portland';

  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [prompt, setPrompt] = useState<GeneratedPrompt | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  const patientContext = {
    preferredName,
    city,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    familyMembers: [],
  };

  // Generate the prompt for the current exercise
  useEffect(() => {
    let generated: GeneratedPrompt | null = null;

    switch (exerciseIndex) {
      case 0:
        generated = generateDatePrompt();
        break;
      case 1:
        generated = generateNamePrompt(patientContext);
        break;
      case 2:
        generated = generateLocationPrompt(patientContext);
        break;
    }

    if (generated) {
      setPrompt(generated);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setFeedbackType(null);
      setFeedbackMessage('');
      speak(generated.prompt);
    }
  }, [exerciseIndex]);

  const handleSelectAnswer = useCallback(
    (answer: string) => {
      if (!prompt || showFeedback) return;

      setSelectedAnswer(answer);

      const evaluation = evaluateOrientationAnswer(
        answer,
        prompt.expectedAnswer,
        prompt.acceptableAnswers,
      );

      setFeedbackType(evaluation.feedbackType);
      setFeedbackMessage(evaluation.feedbackMessage);
      setShowFeedback(true);

      speak(evaluation.feedbackMessage);

      // Auto-advance after feedback display
      setTimeout(() => {
        if (exerciseIndex < ORIENTATION_EXERCISE_COUNT - 1) {
          setExerciseIndex((i) => i + 1);
        } else {
          router.push('/session/identity');
        }
      }, AUTO_ADVANCE_DELAY_MS);
    },
    [prompt, showFeedback, exerciseIndex, router, speak],
  );

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
          completed={exerciseIndex}
          total={TOTAL_EXERCISES_PER_SESSION}
          currentIndex={exerciseIndex}
        />

        <View style={styles.content}>
          {showFeedback && feedbackType ? (
            <GentleFeedback
              feedbackType={feedbackType}
              message={feedbackMessage}
              preferredName={preferredName}
            />
          ) : (
            <ExerciseCard
              prompt={prompt.prompt}
              options={prompt.options || []}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={handleSelectAnswer}
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
});
