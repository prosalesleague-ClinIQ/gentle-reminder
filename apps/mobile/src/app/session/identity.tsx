import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import {
  FeedbackType,
} from '@gentle-reminder/shared-types';
import {
  generateIdentityPrompt,
  evaluateIdentityAnswer,
} from '@gentle-reminder/cognitive-engine';
import type { GeneratedPrompt, PatientContext } from '@gentle-reminder/cognitive-engine';
import { SafeText } from '../../components/SafeText';
import { ExerciseCard } from '../../components/ExerciseCard';
import { GentleFeedback } from '../../components/GentleFeedback';
import { ProgressIndicator } from '../../components/ProgressIndicator';
import { HomeButton } from '../../components/HomeButton';
import { VoicePrompt } from '../../components/VoicePrompt';
import { useVoice } from '../../hooks/useVoice';
import {
  ORIENTATION_EXERCISE_COUNT,
  TOTAL_EXERCISES_PER_SESSION,
  AUTO_ADVANCE_DELAY_MS,
} from '../../constants/exercises';
import { colors, spacing, layout, shadows } from '../../constants/theme';

/**
 * Identity Exercise screen.
 * Shows a family photo and asks the patient to identify the person.
 */
export default function IdentityScreen() {
  const router = useRouter();
  const { speak, isSpeaking } = useVoice();

  const [prompt, setPrompt] = useState<GeneratedPrompt | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<FeedbackType | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(0);

  const preferredName = 'Friend';
  const exerciseIndex = ORIENTATION_EXERCISE_COUNT; // Identity comes after orientation

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
    const generated = generateIdentityPrompt(patientContext);
    if (generated) {
      setPrompt(generated);
      speak(`${generated.prompt}`);
    }
  }, []);

  const handleSelectAnswer = useCallback(
    (answer: string) => {
      if (!prompt || showFeedback) return;

      setSelectedAnswer(answer);

      const evaluation = evaluateIdentityAnswer(
        answer,
        prompt.expectedAnswer,
        prompt.acceptableAnswers,
      );

      setFeedbackType(evaluation.feedbackType);
      setShowFeedback(true);
      setCompleted((c) => c + 1);

      setTimeout(() => {
        router.replace('/session/memory-game');
      }, AUTO_ADVANCE_DELAY_MS);
    },
    [prompt, showFeedback, router],
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
          completed={completed}
          total={TOTAL_EXERCISES_PER_SESSION}
          currentIndex={exerciseIndex}
        />

        <VoicePrompt isSpeaking={isSpeaking} label="Speaking..." />

        <View style={styles.content}>
          {/* Show photo if available */}
          {prompt.photoUrl && !showFeedback && (
            <View style={styles.photoContainer}>
              <Image
                source={{ uri: prompt.photoUrl }}
                style={styles.photo}
                contentFit="cover"
                accessibilityLabel="Photo for identification"
              />
            </View>
          )}

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
    gap: spacing.xl,
  },
  photoContainer: {
    alignSelf: 'center',
    width: 200,
    height: 200,
    borderRadius: layout.borderRadius,
    overflow: 'hidden',
    ...shadows.card,
  },
  photo: {
    width: '100%',
    height: '100%',
  },
});
