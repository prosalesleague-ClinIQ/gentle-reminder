import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FeedbackType } from '@gentle-reminder/shared-types';
import {
  generatePatternPrompt,
  evaluatePatternAnswer,
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
  TOTAL_EXERCISES_PER_SESSION,
  AUTO_ADVANCE_DELAY_MS,
} from '../../constants/exercises';
import { colors, layout } from '../../constants/theme';

/**
 * Pattern matching exercise screen.
 * Shows number sequences and asks what comes next.
 */
export default function PatternScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ celebrated?: string }>();
  const { speak } = useVoice();

  const prevCelebrated = parseInt(params.celebrated || '0', 10);
  const globalIndex = ORIENTATION_EXERCISE_COUNT + IDENTITY_EXERCISE_COUNT + MEMORY_EXERCISE_COUNT;

  const [prompt, setPrompt] = useState<GeneratedPrompt | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const generated = generatePatternPrompt();
    setPrompt(generated);
    speak(generated.prompt);
  }, []);

  const handleSelectAnswer = useCallback(
    (answer: string) => {
      if (!prompt || showFeedback) return;
      setSelectedAnswer(answer);

      const evaluation = evaluatePatternAnswer(answer, prompt.expectedAnswer);
      setFeedbackType(evaluation.feedbackType);
      setFeedbackMessage(evaluation.feedbackMessage);
      setShowFeedback(true);
      speak(evaluation.feedbackMessage);

      const newCelebrated = prevCelebrated + (evaluation.feedbackType === FeedbackType.CELEBRATED ? 1 : 0);

      setTimeout(() => {
        router.push({
          pathname: '/session/clock',
          params: { celebrated: String(newCelebrated) },
        });
      }, AUTO_ADVANCE_DELAY_MS);
    },
    [prompt, showFeedback, prevCelebrated, router, speak],
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
          completed={globalIndex}
          total={TOTAL_EXERCISES_PER_SESSION}
          currentIndex={globalIndex}
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
              inputPlaceholder="What number comes next?"
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
