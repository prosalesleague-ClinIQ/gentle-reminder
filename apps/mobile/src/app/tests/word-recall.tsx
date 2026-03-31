import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SafeText } from '../../components/SafeText';
import { BigButton } from '../../components/BigButton';
import { ExerciseCard } from '../../components/ExerciseCard';
import { HomeButton } from '../../components/HomeButton';
import { colors, spacing, layout, shadows } from '../../constants/theme';

const WORDS = ['apple', 'chair', 'sunset'];
const DISPLAY_TIME_MS = 5000;

type Phase = 'memorize' | 'recall' | 'results';

function scoreRecall(input: string, target: string[]): { matched: string[]; score: number } {
  const normalized = input
    .toLowerCase()
    .split(/[\s,;.]+/)
    .map((w) => w.trim())
    .filter(Boolean);

  const matched: string[] = [];
  for (const word of target) {
    if (normalized.includes(word.toLowerCase())) {
      matched.push(word);
    }
  }
  return { matched, score: matched.length };
}

function getFeedback(score: number, total: number): string {
  if (score === total) return 'Perfect recall! Amazing memory!';
  if (score >= 2) return 'Great job remembering those!';
  if (score === 1) return 'You remembered one - that counts!';
  return 'No worries - memory is a muscle. Keep trying!';
}

/**
 * Word Recall Test.
 * Phase 1: Show 3 simple words for 5 seconds.
 * Phase 2: Patient types what they remember.
 * Gentle scoring that celebrates any words remembered.
 */
export default function WordRecallScreen() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('memorize');
  const [countdown, setCountdown] = useState(DISPLAY_TIME_MS / 1000);
  const [result, setResult] = useState<{ matched: string[]; score: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Countdown during memorize phase
  useEffect(() => {
    if (phase !== 'memorize') return;

    setCountdown(DISPLAY_TIME_MS / 1000);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          setPhase('recall');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const handleSubmit = useCallback(
    (answer: string) => {
      const res = scoreRecall(answer, WORDS);
      setResult(res);
      setPhase('results');

      if (Platform.OS !== 'web') {
        import('expo-haptics')
          .then((H) => H.notificationAsync(H.NotificationFeedbackType.Success))
          .catch(() => {});
      }
    },
    []
  );

  const handlePlayAgain = useCallback(() => {
    setPhase('memorize');
    setResult(null);
  }, []);

  if (phase === 'memorize') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <SafeText variant="h2" bold center color={colors.text.primary}>
            Remember these words
          </SafeText>
          <SafeText variant="body" center color={colors.text.secondary}>
            You have {countdown} seconds
          </SafeText>
          <View style={styles.wordsCard}>
            {WORDS.map((word) => (
              <SafeText
                key={word}
                variant="display"
                bold
                center
                color={colors.primary[500]}
              >
                {word}
              </SafeText>
            ))}
          </View>
          <View style={styles.timerBar}>
            <View
              style={[
                styles.timerFill,
                { width: `${(countdown / (DISPLAY_TIME_MS / 1000)) * 100}%` },
              ]}
            />
          </View>
        </View>
        <HomeButton />
      </SafeAreaView>
    );
  }

  if (phase === 'recall') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <SafeText variant="h2" bold center color={colors.text.primary} style={styles.recallHeading}>
            What words do you remember?
          </SafeText>
          <SafeText variant="body" center color={colors.text.secondary} style={styles.recallHint}>
            Type all the words you can recall, separated by spaces.
          </SafeText>
          <ExerciseCard
            prompt="Type the words you remember"
            options={[]}
            selectedAnswer={null}
            onSelectAnswer={handleSubmit}
            inputPlaceholder="Type words here..."
            hint="Separate words with spaces"
          />
        </View>
        <HomeButton />
      </SafeAreaView>
    );
  }

  // Results phase
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.resultsContainer}>
        <SafeText variant="h1" bold center color={colors.text.primary}>
          Well Done!
        </SafeText>
        <View style={styles.resultCard}>
          <SafeText variant="body" center color={colors.text.secondary}>
            Words remembered
          </SafeText>
          <SafeText variant="display" bold center color={colors.primary[500]}>
            {result?.score ?? 0} / {WORDS.length}
          </SafeText>
          {result && result.matched.length > 0 && (
            <SafeText variant="body" center color={colors.text.secondary}>
              You got: {result.matched.join(', ')}
            </SafeText>
          )}
          <SafeText variant="h3" center color={colors.feedback.celebrated} bold>
            {getFeedback(result?.score ?? 0, WORDS.length)}
          </SafeText>
        </View>
        <BigButton title="Play Again" onPress={handlePlayAgain} variant="secondary" />
        <BigButton title="Back to Games" onPress={() => router.back()} variant="primary" />
      </View>
      <HomeButton />
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
    justifyContent: 'center',
    gap: spacing.xl,
  },
  wordsCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xxxl || spacing.xl,
    alignItems: 'center',
    gap: spacing.lg,
    ...shadows.card,
  },
  timerBar: {
    height: 8,
    backgroundColor: colors.border.light,
    borderRadius: 4,
    overflow: 'hidden',
  },
  timerFill: {
    height: '100%',
    backgroundColor: colors.primary[500],
    borderRadius: 4,
  },
  recallHeading: {
    marginBottom: spacing.sm,
  },
  recallHint: {
    marginBottom: spacing.lg,
  },
  resultsContainer: {
    flex: 1,
    padding: layout.screenPadding,
    justifyContent: 'center',
    gap: spacing.xl,
  },
  resultCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.card,
  },
});
