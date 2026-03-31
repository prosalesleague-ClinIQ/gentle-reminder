import React, { useState, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SafeText } from '../../components/SafeText';
import { BigButton } from '../../components/BigButton';
import { ProgressIndicator } from '../../components/ProgressIndicator';
import { HomeButton } from '../../components/HomeButton';
import { colors, spacing, layout, shadows } from '../../constants/theme';

const TOTAL_ROUNDS = 5;
const SQUARE_SIZE = 60;
const PATTERN_COLORS = ['#E57373', '#64B5F6', '#81C784', '#FFD54F', '#CE93D8', '#FF8A65'];

interface PatternData {
  left: string[];
  right: string[];
  same: boolean;
}

function generatePattern(): string[] {
  const result: string[] = [];
  for (let i = 0; i < 3; i++) {
    result.push(PATTERN_COLORS[Math.floor(Math.random() * PATTERN_COLORS.length)]);
  }
  return result;
}

function generateRound(): PatternData {
  const left = generatePattern();
  const same = Math.random() > 0.5;
  if (same) {
    return { left, right: [...left], same: true };
  }
  // Ensure at least one square is different
  const right = [...left];
  const changeIndex = Math.floor(Math.random() * 3);
  let newColor = PATTERN_COLORS[Math.floor(Math.random() * PATTERN_COLORS.length)];
  while (newColor === right[changeIndex]) {
    newColor = PATTERN_COLORS[Math.floor(Math.random() * PATTERN_COLORS.length)];
  }
  right[changeIndex] = newColor;
  return { left, right, same: false };
}

function getFeedback(correct: number, total: number): string {
  const pct = correct / total;
  if (pct >= 0.8) return 'Excellent pattern matching!';
  if (pct >= 0.6) return 'Good eye for detail!';
  return 'Great effort! Keep practicing!';
}

/**
 * Visual Pattern Match Test.
 * Shows 2 patterns of 3 colored squares side by side.
 * Patient taps "Same" or "Different". 5 rounds with feedback.
 */
export default function VisualMatchScreen() {
  const router = useRouter();
  const [round, setRound] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [responseTimes, setResponseTimes] = useState<number[]>([]);
  const roundStartRef = useRef(Date.now());

  const rounds = useMemo(() => {
    return Array.from({ length: TOTAL_ROUNDS }, () => generateRound());
  }, []);

  const currentPattern = rounds[round];

  const handleAnswer = useCallback(
    (userSaidSame: boolean) => {
      if (answered) return;
      const elapsed = Date.now() - roundStartRef.current;
      setResponseTimes((prev) => [...prev, elapsed]);

      const isCorrect = userSaidSame === currentPattern.same;
      if (isCorrect) setCorrect((c) => c + 1);
      setLastCorrect(isCorrect);
      setAnswered(true);

      if (Platform.OS !== 'web') {
        import('expo-haptics')
          .then((H) =>
            H.notificationAsync(
              isCorrect
                ? H.NotificationFeedbackType.Success
                : H.NotificationFeedbackType.Warning
            )
          )
          .catch(() => {});
      }
    },
    [answered, currentPattern, round]
  );

  const handleNext = useCallback(() => {
    const nextRound = round + 1;
    if (nextRound >= TOTAL_ROUNDS) {
      setShowResults(true);
    } else {
      setRound(nextRound);
      setAnswered(false);
      setLastCorrect(null);
      roundStartRef.current = Date.now();
    }
  }, [round]);

  if (showResults) {
    const avgTime =
      responseTimes.length > 0
        ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
        : 0;

    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.resultsContainer}>
          <SafeText variant="h1" bold center color={colors.text.primary}>
            All Done!
          </SafeText>
          <View style={styles.resultCard}>
            <SafeText variant="body" center color={colors.text.secondary}>
              You got
            </SafeText>
            <SafeText variant="display" bold center color={colors.primary[500]}>
              {correct} / {TOTAL_ROUNDS}
            </SafeText>
            <SafeText variant="body" center color={colors.text.secondary}>
              Average time: {avgTime} ms
            </SafeText>
            <SafeText variant="h3" center color={colors.feedback.celebrated} bold>
              {getFeedback(correct, TOTAL_ROUNDS)}
            </SafeText>
          </View>
          <BigButton
            title="Play Again"
            onPress={() => {
              setRound(0);
              setCorrect(0);
              setAnswered(false);
              setLastCorrect(null);
              setShowResults(false);
              setResponseTimes([]);
              roundStartRef.current = Date.now();
            }}
            variant="secondary"
          />
          <BigButton title="Back to Games" onPress={() => router.back()} variant="primary" />
        </View>
        <HomeButton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ProgressIndicator completed={round} total={TOTAL_ROUNDS} currentIndex={round} />

        <SafeText variant="h2" bold center color={colors.text.primary} style={styles.prompt}>
          Are these the same?
        </SafeText>

        <View style={styles.patternsRow}>
          <View style={styles.patternGroup}>
            {currentPattern.left.map((color, i) => (
              <View key={`l-${i}`} style={[styles.square, { backgroundColor: color }]} />
            ))}
          </View>
          <SafeText variant="h2" color={colors.text.muted}>
            ?
          </SafeText>
          <View style={styles.patternGroup}>
            {currentPattern.right.map((color, i) => (
              <View key={`r-${i}`} style={[styles.square, { backgroundColor: color }]} />
            ))}
          </View>
        </View>

        {answered && lastCorrect !== null && (
          <View style={styles.feedbackArea}>
            <SafeText
              variant="h3"
              bold
              center
              color={lastCorrect ? colors.feedback.celebrated : colors.primary[500]}
            >
              {lastCorrect ? 'Correct!' : 'Not quite, but good try!'}
            </SafeText>
          </View>
        )}

        {!answered ? (
          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.answerBtn, { backgroundColor: colors.feedback.celebrated }]}
              onPress={() => handleAnswer(true)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Same - the patterns are the same"
            >
              <SafeText variant="h3" bold center color={colors.white}>
                Same
              </SafeText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.answerBtn, { backgroundColor: colors.primary[500] }]}
              onPress={() => handleAnswer(false)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Different - the patterns are different"
            >
              <SafeText variant="h3" bold center color={colors.white}>
                Different
              </SafeText>
            </TouchableOpacity>
          </View>
        ) : (
          <BigButton
            title={round + 1 >= TOTAL_ROUNDS ? 'See Results' : 'Next'}
            onPress={handleNext}
            variant="primary"
            style={styles.nextButton}
          />
        )}
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
  },
  prompt: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  patternsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
    marginBottom: spacing.xl,
  },
  patternGroup: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  square: {
    width: SQUARE_SIZE,
    height: SQUARE_SIZE,
    borderRadius: 8,
    ...shadows.card,
  },
  feedbackArea: {
    marginBottom: spacing.lg,
  },
  buttons: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.lg,
  },
  answerBtn: {
    flex: 1,
    minHeight: 80,
    borderRadius: layout.buttonBorderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.button,
  },
  nextButton: {
    marginTop: spacing.lg,
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
