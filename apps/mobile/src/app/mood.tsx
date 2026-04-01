import React, { useState, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SafeText } from '../components/SafeText';
import { useVoice } from '../hooks/useVoice';
import { colors, spacing, layout } from '../constants/theme';

type MoodChoice = 'happy' | 'okay' | 'notgreat' | null;

const MOOD_OPTIONS: { key: MoodChoice & string; emoji: string; label: string; color: string }[] = [
  { key: 'happy', emoji: '\u{1F60A}', label: 'Happy', color: colors.feedback.celebrated },
  { key: 'okay', emoji: '\u{1F610}', label: 'Okay', color: colors.feedback.guided },
  { key: 'notgreat', emoji: '\u{1F614}', label: 'Not great', color: colors.primary[500] },
];

const RESPONSES: Record<string, { message: string; voice: string }> = {
  happy: {
    message: 'Wonderful! That makes us happy too! \u{1F31F}',
    voice: 'Wonderful! That makes us happy too!',
  },
  okay: {
    message: 'Thank you for sharing. Every day is a new day! \u{1F499}',
    voice: 'Thank you for sharing. Every day is a new day!',
  },
  notgreat: {
    message: "We're here for you. You're not alone. \u{1F495}",
    voice: "We're here for you. You're not alone.",
  },
};

export default function MoodScreen() {
  const router = useRouter();
  const { speak } = useVoice();
  const [selected, setSelected] = useState<MoodChoice>(null);
  const lastPressRef = useRef(0);

  const handleSelect = useCallback(
    (mood: MoodChoice & string) => {
      const now = Date.now();
      if (now - lastPressRef.current < 800) return;
      lastPressRef.current = now;

      if (Platform.OS !== 'web') {
        import('expo-haptics')
          .then((Haptics) => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          })
          .catch(() => {});
      }

      setSelected(mood);
      const response = RESPONSES[mood];
      if (response) {
        speak(response.voice);
      }
    },
    [speak]
  );

  const handleContinue = useCallback(() => {
    router.replace('/(tabs)/home');
  }, [router]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <SafeText variant="h1" bold center color={colors.text.primary}>
          How are you feeling?
        </SafeText>

        {!selected ? (
          <View style={styles.moodGrid}>
            {MOOD_OPTIONS.map((mood) => (
              <TouchableOpacity
                key={mood.key}
                style={[styles.moodButton, { borderColor: mood.color }]}
                onPress={() => handleSelect(mood.key)}
                activeOpacity={0.7}
                accessibilityRole="button"
                accessibilityLabel={`I'm feeling ${mood.label}`}
              >
                <SafeText style={styles.emoji}>{mood.emoji}</SafeText>
                <SafeText variant="h2" bold center color={mood.color}>
                  {mood.label}
                </SafeText>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <View style={styles.responseContainer}>
            {/* Show selected mood */}
            <SafeText style={styles.selectedEmoji}>
              {MOOD_OPTIONS.find((m) => m.key === selected)?.emoji}
            </SafeText>

            {/* Response message */}
            <View style={styles.responseCard}>
              <SafeText variant="h2" center color={colors.text.primary}>
                {RESPONSES[selected]?.message}
              </SafeText>
            </View>

            {/* Continue button */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleContinue}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Continue to home screen"
            >
              <SafeText variant="h2" bold center color={colors.text.inverse}>
                Continue
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
    backgroundColor: colors.background.warm,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: layout.screenPadding,
  },
  moodGrid: {
    marginTop: spacing.xxxl,
    gap: spacing.xl,
  },
  moodButton: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    borderWidth: 3,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
    elevation: 2,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  emoji: {
    fontSize: 64,
    textAlign: 'center',
  },
  responseContainer: {
    marginTop: spacing.xxxl,
    alignItems: 'center',
    gap: spacing.xl,
  },
  selectedEmoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  responseCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  continueButton: {
    marginTop: spacing.xl,
    height: 100,
    width: '100%',
    borderRadius: layout.borderRadius,
    backgroundColor: colors.primary[500],
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
