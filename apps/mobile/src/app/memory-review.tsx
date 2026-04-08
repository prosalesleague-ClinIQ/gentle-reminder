import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../components/SafeText';
import { BigButton } from '../components/BigButton';
import { VoiceNavWrapper } from '../components/VoiceNavWrapper';
import { useAICompanion } from '../hooks/useAICompanion';
import { exerciseManager } from '../services/ExerciseManager';
import type { MemoryCard } from '@gentle-reminder/cognitive-engine/exercises/spaced-repetition';
import { colors, spacing, layout, shadows } from '../constants/theme';

/**
 * Spaced Repetition Memory Review Screen.
 *
 * Shows memory cards that are due for review (family members, places, events).
 * Uses the SM-2 algorithm adapted for dementia patients:
 * - Shorter intervals (max 7 days)
 * - No penalty for forgetting
 * - Gentle encouragement always
 */

type ReviewState = 'prompt' | 'reveal' | 'complete';

export default function MemoryReviewScreen() {
  const router = useRouter();
  const ai = useAICompanion('memory-review');
  const [dueCards, setDueCards] = useState<MemoryCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewState, setReviewState] = useState<ReviewState>('prompt');
  const [reviewedCount, setReviewedCount] = useState(0);

  useEffect(() => {
    const schedule = exerciseManager.getReviewSchedule();
    setDueCards(schedule.dueNow);
    if (schedule.dueNow.length === 0) {
      ai.speak('You have no memory cards to review right now. Great job keeping up!');
    } else {
      ai.speak(`You have ${schedule.dueNow.length} memory cards to review. Let me show you the first one.`);
    }
  }, []);

  const currentCard = dueCards[currentIndex];

  const handleReveal = useCallback(() => {
    setReviewState('reveal');
    if (currentCard) {
      ai.speak(`The answer is: ${currentCard.answer}`);
    }
  }, [currentCard, ai]);

  const handleRate = useCallback(async (quality: number) => {
    if (!currentCard) return;

    exerciseManager.reviewCard(currentCard.id, quality);
    setReviewedCount((prev) => prev + 1);

    if (quality >= 3) {
      await ai.speak('Wonderful! You remembered that well.');
    } else {
      await ai.speak('That is perfectly okay. We will practice this one again soon.');
    }

    // Move to next card or complete
    if (currentIndex + 1 < dueCards.length) {
      setCurrentIndex((prev) => prev + 1);
      setReviewState('prompt');
      await ai.speak('Here is the next one.');
    } else {
      setReviewState('complete');
      await ai.speak(`You reviewed ${reviewedCount + 1} memory cards. You are doing great at keeping your memories strong.`);
    }
  }, [currentCard, currentIndex, dueCards.length, reviewedCount, ai]);

  if (dueCards.length === 0) {
    return (
      <VoiceNavWrapper screenName="memory-review">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centerContent}>
            <SafeText variant="h1" bold style={styles.emoji}>🌟</SafeText>
            <SafeText variant="h2" bold center>All Caught Up!</SafeText>
            <SafeText variant="body" center color={colors.text.secondary} style={styles.subtitle}>
              No memory cards to review right now. Check back later!
            </SafeText>
            <BigButton
              label="Go Home"
              onPress={() => router.push('/(tabs)/home' as any)}
              style={styles.homeButton}
            />
          </View>
        </SafeAreaView>
      </VoiceNavWrapper>
    );
  }

  if (reviewState === 'complete') {
    return (
      <VoiceNavWrapper screenName="memory-review">
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.centerContent}>
            <SafeText variant="h1" bold style={styles.emoji}>🎉</SafeText>
            <SafeText variant="h2" bold center>Review Complete!</SafeText>
            <SafeText variant="body" center color={colors.text.secondary} style={styles.subtitle}>
              You reviewed {reviewedCount} memory cards today. Every review helps keep your memories strong.
            </SafeText>
            <BigButton
              label="Go Home"
              onPress={() => router.push('/(tabs)/home' as any)}
              style={styles.homeButton}
            />
          </View>
        </SafeAreaView>
      </VoiceNavWrapper>
    );
  }

  return (
    <VoiceNavWrapper screenName="memory-review">
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            accessibilityLabel="Go back"
          >
            <SafeText variant="h3" color={colors.primary[500]}>Back</SafeText>
          </TouchableOpacity>

          <SafeText variant="h1" bold style={styles.heading}>Memory Review</SafeText>
          <SafeText variant="body" color={colors.text.secondary}>
            Card {currentIndex + 1} of {dueCards.length}
          </SafeText>

          {/* Card */}
          <View style={styles.card}>
            <View style={styles.categoryBadge}>
              <SafeText variant="caption" bold color="#FFFFFF">
                {currentCard.category.toUpperCase()}
              </SafeText>
            </View>

            <SafeText variant="h2" bold center style={styles.prompt}>
              {currentCard.prompt}
            </SafeText>

            {reviewState === 'prompt' && (
              <BigButton
                label="Show Answer"
                onPress={handleReveal}
                style={styles.revealButton}
              />
            )}

            {reviewState === 'reveal' && (
              <>
                <View style={styles.answerBox}>
                  <SafeText variant="h3" bold center color="#00897B">
                    {currentCard.answer}
                  </SafeText>
                </View>

                <SafeText variant="body" center color={colors.text.secondary} style={styles.rateLabel}>
                  How well did you remember?
                </SafeText>

                <View style={styles.rateRow}>
                  <TouchableOpacity
                    style={[styles.rateButton, styles.rateForgot]}
                    onPress={() => handleRate(1)}
                    accessibilityLabel="I forgot"
                  >
                    <SafeText variant="body" bold color="#FFFFFF">Forgot</SafeText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.rateButton, styles.rateHard]}
                    onPress={() => handleRate(3)}
                    accessibilityLabel="I remembered with difficulty"
                  >
                    <SafeText variant="body" bold color="#FFFFFF">Hard</SafeText>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.rateButton, styles.rateEasy]}
                    onPress={() => handleRate(5)}
                    accessibilityLabel="I remembered easily"
                  >
                    <SafeText variant="body" bold color="#FFFFFF">Easy!</SafeText>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </VoiceNavWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background.main },
  scrollContent: { padding: layout.screenPadding, paddingBottom: 120 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing.xxl },
  backButton: { marginBottom: spacing.md, padding: spacing.sm, alignSelf: 'flex-start' },
  heading: { marginBottom: spacing.sm },
  emoji: { fontSize: 72, marginBottom: spacing.lg },
  subtitle: { marginTop: spacing.md, marginBottom: spacing.xxl },
  homeButton: { marginTop: spacing.xl },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: layout.borderRadius,
    padding: spacing.xxl,
    marginTop: spacing.xl,
    alignItems: 'center',
    ...shadows.card,
    borderTopWidth: 6,
    borderTopColor: '#7C3AED',
  },
  categoryBadge: {
    backgroundColor: '#7C3AED',
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    marginBottom: spacing.lg,
  },
  prompt: { marginBottom: spacing.xl },
  revealButton: { width: '100%' },
  answerBox: {
    backgroundColor: '#F0FFF4',
    borderRadius: 16,
    padding: spacing.xl,
    width: '100%',
    marginBottom: spacing.xl,
    borderWidth: 2,
    borderColor: '#00897B',
  },
  rateLabel: { marginBottom: spacing.md },
  rateRow: { flexDirection: 'row', gap: spacing.md, width: '100%' },
  rateButton: {
    flex: 1,
    height: 80,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
  rateForgot: { backgroundColor: '#F59E0B' },
  rateHard: { backgroundColor: '#6366F1' },
  rateEasy: { backgroundColor: '#10B981' },
});
