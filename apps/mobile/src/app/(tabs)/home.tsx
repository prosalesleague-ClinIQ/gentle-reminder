import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GreetingHeader } from '../../components/GreetingHeader';
import { BigButton } from '../../components/BigButton';
import { SafeText } from '../../components/SafeText';
import { VoicePrompt } from '../../components/VoicePrompt';
import { usePatient } from '../../hooks/usePatient';
import { useVoice } from '../../hooks/useVoice';
import { useAuth } from '../../hooks/useAuth';
import { getGreeting } from '../../utils/greeting';
import { colors, spacing, layout, shadows } from '../../constants/theme';

/**
 * Home Dashboard screen.
 * Shows profile photo, personalized greeting, and 3 big action buttons:
 * - Start Session
 * - See Family
 * - My Memories
 */
export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { profile, isLoadingProfile, refreshProfile } = usePatient();
  const { speak, speakWarmly, isSpeaking } = useVoice();

  const preferredName = profile?.preferredName || user?.firstName || 'Friend';
  const profilePhotoUrl = profile?.user?.profilePhotoUrl;

  // Speak greeting on mount
  useEffect(() => {
    if (preferredName) {
      const greeting = getGreeting(preferredName);
      speakWarmly(greeting);
    }
  }, [preferredName]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <GreetingHeader
          preferredName={preferredName}
          profilePhotoUrl={profilePhotoUrl}
        />

        <VoicePrompt isSpeaking={isSpeaking} label="Speaking..." />

        {/* Cognitive Health Score */}
        <TouchableOpacity
          style={styles.healthScoreCard}
          onPress={() => router.push('/scores')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Cognitive Health Score: 78. Tap to see your progress"
          accessibilityHint="Opens your detailed score history"
        >
          <View style={[styles.scoreCircle, { borderColor: colors.feedback.celebrated }]}>
            <SafeText variant="display" bold color={colors.feedback.celebrated}>78</SafeText>
          </View>
          <SafeText variant="h3" bold center>Cognitive Health Score</SafeText>
          <SafeText variant="body" center color={colors.text.secondary}>Stable - last 7 days</SafeText>
          <SafeText variant="body" center color={colors.primary[500]}>Tap to see your progress</SafeText>
        </TouchableOpacity>

        <View style={styles.lastSessionCard}>
          <SafeText variant="body" bold color={colors.text.primary}>
            {profile?.recentCognitiveScore
              ? 'Your last session was recently'
              : "You haven't had a session yet"}
          </SafeText>
          <SafeText variant="body" color={colors.text.secondary}>
            {profile?.recentCognitiveScore
              ? 'Keep it up - every session helps!'
              : 'Whenever you are ready, tap Start Session below.'}
          </SafeText>
        </View>

        <View style={styles.actions}>
          <BigButton
            title="Start Session"
            onPress={() => router.push('/session/start')}
            variant="primary"
            accessibilityHint="Begin a new cognitive exercise session"
          />

          <BigButton
            title="See Family"
            onPress={() => router.push('/(tabs)/family')}
            variant="secondary"
            accessibilityHint="View photos and messages from your family"
          />

          <BigButton
            title="My Memories"
            onPress={() => router.push('/photos')}
            variant="accent"
            accessibilityHint="Browse your photo album and memories"
          />

          <BigButton
            title="Brain Games"
            onPress={() => router.push('/tests')}
            variant="primary"
            style={{ backgroundColor: '#7C4DFF' }}
            accessibilityHint="Play fun brain training games"
          />

          <BigButton
            title="Memory Review"
            onPress={() => router.push('/review')}
            variant="primary"
            style={{ backgroundColor: '#4A148C' }}
            accessibilityHint="Practice remembering important people and places"
          />

          <BigButton
            title="Relax & Breathe"
            onPress={() => router.push('/breathing')}
            variant="primary"
            style={{ backgroundColor: '#00897B' }}
            accessibilityHint="Try a calming guided breathing exercise"
          />
        </View>

        {profile?.recentCognitiveScore && (
          <View style={styles.scoreCard}>
            <SafeText variant="body" color={colors.text.secondary}>
              Last session score
            </SafeText>
            <SafeText variant="h2" bold color={colors.feedback.celebrated}>
              {Math.round(profile.recentCognitiveScore.overallScore)}%
            </SafeText>
          </View>
        )}

        <TouchableOpacity
          style={styles.needHelpLink}
          onPress={() => router.push('/sos')}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Need help? Tap to go to emergency screen"
          accessibilityHint="Opens the emergency help screen"
        >
          <SafeText variant="body" center color={colors.text.muted}>
            Need Help?
          </SafeText>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.warm,
  },
  scrollContent: {
    padding: layout.screenPadding,
    paddingBottom: 120, // Space for tab bar
  },
  lastSessionCard: {
    marginTop: spacing.lg,
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  actions: {
    gap: spacing.lg,
    marginTop: spacing.xl,
  },
  scoreCard: {
    marginTop: spacing.xxxl,
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  healthScoreCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.card,
  },
  scoreCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  needHelpLink: {
    marginTop: spacing.xxxl,
    padding: spacing.lg,
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
});
