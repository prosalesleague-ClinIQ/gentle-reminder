import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeedbackType } from '@gentle-reminder/shared-types';
import {
  generateClockPrompt,
  evaluateClockAnswer,
  generateObjectPrompt,
  evaluateObjectAnswer,
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
  IDENTITY_EXERCISE_COUNT,
  MEMORY_EXERCISE_COUNT,
  PATTERN_EXERCISE_COUNT,
  TOTAL_EXERCISES_PER_SESSION,
  AUTO_ADVANCE_DELAY_MS,
} from '../../constants/exercises';
import { colors, layout } from '../../constants/theme';

/**
 * Clock + Object exercise screen.
 * Exercise 7: Clock/time question
 * Exercise 8: Object recognition (final exercise)
 * Then navigates to session completion.
 */
export default function ClockScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ celebrated?: string }>();
  const { speak } = useVoice();

  const prevCelebrated = parseInt(params.celebrated || '0', 10);
  const baseGlobalIndex = ORIENTATION_EXERCISE_COUNT + IDENTITY_EXERCISE_COUNT + MEMORY_EXERCISE_COUNT + PATTERN_EXERCISE_COUNT;

  const [localIndex, setLocalIndex] = useState(0); // 0 = clock, 1 = object
  const [prompt, setPrompt] = useState<GeneratedPrompt | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [celebrated, setCelebrated] = useState(prevCelebrated);

  useEffect(() => {
    let generated: GeneratedPrompt;
    if (localIndex === 0) {
      generated = generateClockPrompt();
    } else {
      generated = generateObjectPrompt();
    }
    setPrompt(generated);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setFeedbackType(null);
    setFeedbackMessage('');
    speak(generated.prompt);
  }, [localIndex]);

  const handleSelectAnswer = useCallback(
    (answer: string) => {
      if (!prompt || showFeedback) return;
      setSelectedAnswer(answer);

      let evaluation;
      if (localIndex === 0) {
        evaluation = evaluateClockAnswer(answer, prompt.acceptableAnswers);
      } else {
        evaluation = evaluateObjectAnswer(answer, prompt.acceptableAnswers, prompt.expectedAnswer);
      }

      setFeedbackType(evaluation.feedbackType);
      setFeedbackMessage(evaluation.feedbackMessage);
      setShowFeedback(true);
      speak(evaluation.feedbackMessage);

      const newCelebrated = celebrated + (evaluation.feedbackType === FeedbackType.CELEBRATED ? 1 : 0);
      setCelebrated(newCelebrated);

      setTimeout(() => {
        if (localIndex === 0) {
          // Advance to object exercise
          setLocalIndex(1);
        } else {
          // Session complete!
          const score = newCelebrated / TOTAL_EXERCISES_PER_SESSION;
          router.replace({
            pathname: '/session/complete',
            params: {
              score: score.toFixed(2),
              celebrated: String(newCelebrated),
              total: String(TOTAL_EXERCISES_PER_SESSION),
            },
          });
        }
      }, AUTO_ADVANCE_DELAY_MS);
    },
    [prompt, showFeedback, localIndex, celebrated, router, speak],
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
          completed={baseGlobalIndex + localIndex}
          total={TOTAL_EXERCISES_PER_SESSION}
          currentIndex={baseGlobalIndex + localIndex}
        />

        <View style={styles.content}>
          {showFeedback && feedbackType ? (
            <GentleFeedback
              feedbackType={feedbackType}
              message={feedbackMessage}
              preferredName="Friend"
            />
          ) : (
            <ExerciseCard
              prompt={prompt.prompt}
              options={prompt.options || []}
              selectedAnswer={selectedAnswer}
              onSelectAnswer={handleSelectAnswer}
              disabled={showFeedback}
              inputPlaceholder={localIndex === 0 ? "What time is it?" : "Type your answer..."}
            />
          )}
        </View>

        <HomeButton />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background.warm },
  container: { flex: 1, padding: layout.screenPadding },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  content: { flex: 1, justifyContent: 'center' },
});
