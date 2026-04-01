import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../components/SafeText';
import { useVoice } from '../hooks/useVoice';
import { colors, spacing, layout } from '../constants/theme';

type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'complete';

const INHALE_DURATION = 4000;
const HOLD_DURATION = 1000;
const EXHALE_DURATION = 6000;
const TOTAL_ROUNDS = 5;

const PHASE_LABELS: Record<BreathPhase, string> = {
  inhale: 'Breathe In...',
  hold: 'Hold...',
  exhale: 'Breathe Out...',
  complete: '',
};

export default function BreathingScreen() {
  const router = useRouter();
  const { speakWarmly } = useVoice();
  const scaleAnim = useRef(new Animated.Value(0.6)).current;
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [round, setRound] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const roundRef = useRef(1);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    speakWarmly("Let's breathe together. Follow the circle. Breathe in slowly... that's it.");
    startBreathingCycle();
  }, []);

  const startBreathingCycle = () => {
    runRound(1);
  };

  const runRound = (currentRound: number) => {
    if (!mountedRef.current) return;
    roundRef.current = currentRound;
    setRound(currentRound);

    // Inhale phase
    setPhase('inhale');
    Animated.timing(scaleAnim, {
      toValue: 1.2,
      duration: INHALE_DURATION,
      useNativeDriver: true,
    }).start(() => {
      if (!mountedRef.current) return;

      // Hold phase
      setPhase('hold');
      setTimeout(() => {
        if (!mountedRef.current) return;

        // Exhale phase
        setPhase('exhale');
        if (currentRound === 1 || currentRound === 3) {
          speakWarmly('Now breathe out gently... wonderful.');
        }

        Animated.timing(scaleAnim, {
          toValue: 0.6,
          duration: EXHALE_DURATION,
          useNativeDriver: true,
        }).start(() => {
          if (!mountedRef.current) return;

          if (currentRound < TOTAL_ROUNDS) {
            if (currentRound === 2) {
              speakWarmly("Breathe in slowly... that's it.");
            }
            runRound(currentRound + 1);
          } else {
            // Complete
            setPhase('complete');
            setIsComplete(true);
            speakWarmly('Beautiful. You did wonderfully. Take a moment.');
          }
        });
      }, HOLD_DURATION);
    });
  };

  const handleDone = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <SafeText variant="h1" bold center style={styles.heading}>
          Let's Breathe Together
        </SafeText>

        {!isComplete && (
          <SafeText variant="body" center color={colors.text.secondary} style={styles.roundText}>
            Round {round} of {TOTAL_ROUNDS}
          </SafeText>
        )}

        <View style={styles.circleContainer}>
          <Animated.View
            style={[
              styles.breathCircle,
              {
                transform: [{ scale: scaleAnim }],
              },
            ]}
          >
            <View style={styles.innerCircle} />
          </Animated.View>
        </View>

        {!isComplete ? (
          <SafeText variant="h2" bold center style={styles.phaseText}>
            {PHASE_LABELS[phase]}
          </SafeText>
        ) : (
          <View style={styles.completeContainer}>
            <SafeText variant="h2" bold center style={styles.completeText}>
              Beautiful. You did wonderfully.
            </SafeText>
            <SafeText variant="body" center color={colors.text.secondary} style={styles.takeAMoment}>
              Take a moment.
            </SafeText>

            <TouchableOpacity
              style={styles.doneButton}
              onPress={handleDone}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel="Done, return home"
            >
              <SafeText variant="h3" bold center color="#FFFFFF">
                Done
              </SafeText>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E8F5F0',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: layout.screenPadding,
  },
  heading: {
    color: '#2E7D9A',
    fontSize: 32,
    marginBottom: spacing.md,
  },
  roundText: {
    fontSize: 18,
    marginBottom: spacing.xl,
  },
  circleContainer: {
    width: 240,
    height: 240,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xxxl,
  },
  breathCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(46, 125, 154, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(46, 125, 154, 0.35)',
  },
  phaseText: {
    color: '#2E7D9A',
    fontSize: 28,
    marginTop: spacing.xl,
  },
  completeContainer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  completeText: {
    color: '#2E7D9A',
    fontSize: 26,
  },
  takeAMoment: {
    fontSize: 18,
    marginTop: spacing.md,
    marginBottom: spacing.xxxl,
  },
  doneButton: {
    backgroundColor: '#2E7D9A',
    paddingVertical: 18,
    paddingHorizontal: 64,
    borderRadius: 16,
    minWidth: 200,
    alignItems: 'center',
  },
});
