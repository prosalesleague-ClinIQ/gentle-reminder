import React, { useState, useRef, useCallback, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SafeText } from '../../components/SafeText';
import { BigButton } from '../../components/BigButton';
import { ProgressIndicator } from '../../components/ProgressIndicator';
import { HomeButton } from '../../components/HomeButton';
import { colors, spacing, layout, shadows } from '../../constants/theme';

const TOTAL_ROUNDS = 5;
const MIN_DELAY_MS = 1000;
const MAX_DELAY_MS = 4000;
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CIRCLE_SIZE = SCREEN_WIDTH * 0.6;

type Phase = 'waiting' | 'ready' | 'shown' | 'tapped' | 'results';

function getRandomDelay(): number {
  return MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS);
}

function getFeedback(avgMs: number): string {
  if (avgMs < 400) return 'Great reflexes!';
  if (avgMs < 600) return 'Good effort!';
  if (avgMs < 900) return 'Nice work! Keep practicing!';
  return 'Well done for trying!';
}

/**
 * Reaction Time Test.
 * Shows a colored circle after a random delay.
 * Patient taps as fast as possible. 5 rounds, shows average.
 */
export default function ReactionTimeScreen() {
  const router = useRouter();
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<Phase>('waiting');
  const [times, setTimes] = useState<number[]>([]);
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const showTimestamp = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startRound = useCallback(() => {
    setPhase('ready');
    setCurrentTime(null);
    const delay = getRandomDelay();
    timerRef.current = setTimeout(() => {
      showTimestamp.current = Date.now();
      setPhase('shown');
    }, delay);
  }, []);

  const handleTap = useCallback(() => {
    if (phase === 'ready') {
      // Tapped too early
      if (timerRef.current) clearTimeout(timerRef.current);
      setCurrentTime(-1); // sentinel for "too early"
      setPhase('tapped');
      return;
    }
    if (phase !== 'shown') return;

    const elapsed = Date.now() - showTimestamp.current;
    setCurrentTime(elapsed);
    setTimes((prev) => [...prev, elapsed]);
    setPhase('tapped');

    if (Platform.OS !== 'web') {
      import('expo-haptics')
        .then((H) => H.notificationAsync(H.NotificationFeedbackType.Success))
        .catch(() => {});
    }
  }, [phase]);

  const handleNext = useCallback(() => {
    const nextRound = round + 1;
    if (nextRound >= TOTAL_ROUNDS) {
      setPhase('results');
    } else {
      setRound(nextRound);
      startRound();
    }
  }, [round, startRound]);

  // Start first round on mount
  useEffect(() => {
    startRound();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const avgTime = times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;

  if (phase === 'results') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.resultsContainer}>
          <SafeText variant="h1" bold center color={colors.text.primary}>
            All Done!
          </SafeText>
          <View style={styles.resultCard}>
            <SafeText variant="body" center color={colors.text.secondary}>
              Your average reaction time
            </SafeText>
            <SafeText variant="display" bold center color={colors.primary[500]}>
              {avgTime} ms
            </SafeText>
            <SafeText variant="h3" center color={colors.feedback.celebrated} bold>
              {getFeedback(avgTime)}
            </SafeText>
          </View>
          <BigButton
            title="Play Again"
            onPress={() => {
              setRound(0);
              setTimes([]);
              startRound();
            }}
            variant="secondary"
          />
          <BigButton
            title="Back to Games"
            onPress={() => router.back()}
            variant="primary"
          />
        </View>
        <HomeButton />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <ProgressIndicator completed={times.length} total={TOTAL_ROUNDS} currentIndex={round} />

        {phase === 'ready' && (
          <View style={styles.centerArea}>
            <SafeText variant="h2" bold center color={colors.text.primary}>
              Wait for the circle...
            </SafeText>
            <TouchableOpacity
              style={[styles.circle, styles.circleHidden]}
              onPress={handleTap}
              activeOpacity={1}
              accessibilityLabel="Wait for the circle to turn green, then tap"
            >
              <SafeText variant="h3" center color={colors.text.muted}>
                Wait...
              </SafeText>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'shown' && (
          <View style={styles.centerArea}>
            <SafeText variant="h2" bold center color={colors.feedback.celebrated}>
              TAP NOW!
            </SafeText>
            <TouchableOpacity
              style={[styles.circle, styles.circleActive]}
              onPress={handleTap}
              activeOpacity={0.8}
              accessibilityLabel="Tap now! The circle is green"
              accessibilityRole="button"
            >
              <SafeText variant="h2" center color={colors.white} bold>
                TAP!
              </SafeText>
            </TouchableOpacity>
          </View>
        )}

        {phase === 'tapped' && (
          <View style={styles.centerArea}>
            {currentTime === -1 ? (
              <>
                <SafeText variant="h2" bold center color={colors.text.primary}>
                  Too early!
                </SafeText>
                <SafeText variant="body" center color={colors.text.secondary}>
                  Wait for the green circle next time.
                </SafeText>
              </>
            ) : (
              <>
                <SafeText variant="h2" bold center color={colors.feedback.celebrated}>
                  {currentTime! < 400 ? 'Great reflexes!' : 'Good effort!'}
                </SafeText>
                <SafeText variant="display" bold center color={colors.primary[500]}>
                  {currentTime} ms
                </SafeText>
              </>
            )}
            <BigButton
              title={round + 1 >= TOTAL_ROUNDS ? 'See Results' : 'Next Round'}
              onPress={handleNext}
              variant="primary"
              style={styles.nextButton}
            />
          </View>
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
  centerArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.card,
  },
  circleHidden: {
    backgroundColor: colors.border.light,
  },
  circleActive: {
    backgroundColor: colors.feedback.celebrated,
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
  nextButton: {
    alignSelf: 'stretch',
  },
});
