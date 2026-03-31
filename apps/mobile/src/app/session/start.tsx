import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../components/SafeText';
import { BigButton } from '../../components/BigButton';
import { HomeButton } from '../../components/HomeButton';
import { VoicePrompt } from '../../components/VoicePrompt';
import { useVoice } from '../../hooks/useVoice';
import { formatDuration } from '../../utils/scoring';
import { DEFAULT_SESSION_DURATION_SECONDS } from '../../constants/exercises';
import { colors, spacing, layout, shadows } from '../../constants/theme';

/**
 * Session start screen.
 * Voice introduction, duration display, and start button.
 */
export default function SessionStartScreen() {
  const router = useRouter();
  const { speak, isSpeaking } = useVoice();

  const preferredName = 'Friend';
  const duration = formatDuration(DEFAULT_SESSION_DURATION_SECONDS);

  useEffect(() => {
    speak(
      `Hello ${preferredName}! Let's do some fun exercises together. This will take about ${duration}. Ready when you are!`,
    );
  }, []);

  const handleStart = () => {
    router.push('/session/orientation');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <SafeText variant="display" center bold color={colors.primary[500]}>
            Ready?
          </SafeText>

          <VoicePrompt isSpeaking={isSpeaking} label="Speaking..." />

          <View style={styles.infoCard}>
            <SafeText variant="h3" center bold>
              Today's Session
            </SafeText>
            <SafeText variant="bodyLarge" center color={colors.text.secondary} style={styles.durationText}>
              About {duration}
            </SafeText>
            <SafeText variant="body" center color={colors.text.secondary}>
              We'll practice together with some simple exercises.
            </SafeText>
          </View>
        </View>

        <View style={styles.actions}>
          <BigButton
            title="Let's Begin!"
            onPress={handleStart}
            variant="primary"
            accessibilityHint="Start the cognitive exercise session"
          />
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
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
  },
  infoCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xxl,
    width: '100%',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.card,
  },
  durationText: {
    marginTop: spacing.sm,
  },
  actions: {
    paddingBottom: spacing.xxxl,
  },
});
