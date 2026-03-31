import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../components/SafeText';
import { BigButton } from '../../components/BigButton';
import { useVoice } from '../../hooks/useVoice';
import { colors, spacing, layout, shadows } from '../../constants/theme';

/**
 * Session completion screen.
 * Shows encouraging feedback and session summary.
 * NEVER shows negative results - only celebration and encouragement.
 */
export default function SessionCompleteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ score?: string; celebrated?: string; total?: string }>();
  const { speak } = useVoice();

  const celebrated = parseInt(params.celebrated || '0', 10);
  const total = parseInt(params.total || '6', 10);
  const score = parseFloat(params.score || '0.75');

  // Choose message based on performance - always positive
  const getMessage = () => {
    if (score >= 0.8) return "What a wonderful session! You did a fantastic job today!";
    if (score >= 0.5) return "Great work today! You showed real effort and that matters!";
    return "Thank you for spending time exercising your mind today. You're doing great!";
  };

  const getEmoji = () => {
    if (score >= 0.8) return '🌟';
    if (score >= 0.5) return '👏';
    return '💙';
  };

  const message = getMessage();

  useEffect(() => {
    speak(message);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <SafeText variant="display" center>
            {getEmoji()}
          </SafeText>

          <SafeText variant="h1" center bold color={colors.primary[500]} style={styles.title}>
            Session Complete!
          </SafeText>

          <View style={styles.messageCard}>
            <SafeText variant="h3" center color={colors.text.primary} style={styles.message}>
              {message}
            </SafeText>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <SafeText variant="display" center bold color={colors.feedback.celebrated}>
                {celebrated}
              </SafeText>
              <SafeText variant="body" center color={colors.text.secondary}>
                Correct
              </SafeText>
            </View>

            <View style={styles.statCard}>
              <SafeText variant="display" center bold color={colors.primary[500]}>
                {total}
              </SafeText>
              <SafeText variant="body" center color={colors.text.secondary}>
                Exercises
              </SafeText>
            </View>
          </View>
        </View>

        <BigButton
          title="Go Home"
          onPress={() => router.replace('/(tabs)/home')}
          variant="primary"
          style={styles.homeButton}
        />
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
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.xl,
  },
  title: {
    marginTop: spacing.lg,
  },
  messageCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xxl,
    width: '100%',
    ...shadows.card,
  },
  message: {
    lineHeight: 40,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.xl,
    marginTop: spacing.lg,
  },
  statCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    alignItems: 'center',
    minWidth: 140,
    ...shadows.card,
  },
  homeButton: {
    marginBottom: spacing.xl,
  },
});
