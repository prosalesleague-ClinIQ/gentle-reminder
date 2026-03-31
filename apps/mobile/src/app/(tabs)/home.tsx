import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
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
import { colors, spacing, layout } from '../../constants/theme';

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
  const { speak, isSpeaking } = useVoice();

  const preferredName = profile?.preferredName || user?.firstName || 'Friend';
  const profilePhotoUrl = profile?.user?.profilePhotoUrl;

  // Speak greeting on mount
  useEffect(() => {
    if (preferredName) {
      const greeting = getGreeting(preferredName);
      speak(greeting);
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
            onPress={() => router.push('/(tabs)/stories')}
            variant="accent"
            accessibilityHint="Listen to and record your stories"
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
});
