import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SafeText } from '../components/SafeText';
import { useVoice } from '../hooks/useVoice';
import { colors, spacing, layout } from '../constants/theme';

const CAREGIVERS = [
  { name: 'Sarah Mitchell', role: 'Primary Caregiver', phone: '(555) 123-4567' },
  { name: 'Dr. David Chen', role: 'Doctor', phone: '(555) 987-6543' },
];

type SOSState = 'idle' | 'confirming' | 'sent';

export default function SOSScreen() {
  const router = useRouter();
  const { speakWarmly } = useVoice();
  const [state, setState] = useState<SOSState>('idle');
  const lastPressRef = useRef(0);

  const handleSOS = useCallback(() => {
    const now = Date.now();
    if (now - lastPressRef.current < 1000) return;
    lastPressRef.current = now;

    if (Platform.OS !== 'web') {
      import('expo-haptics').then((Haptics) => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      }).catch(() => {});
    }

    setState('confirming');

    setTimeout(() => {
      setState('sent');
      speakWarmly("Everything is okay, dear. Don't worry. Sarah has been notified and help is on the way. You are safe.");
    }, 1500);
  }, [speakWarmly]);

  const handleDismiss = useCallback(() => {
    if (Platform.OS !== 'web') {
      import('expo-haptics').then((Haptics) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }).catch(() => {});
    }

    setState('idle');
    router.back();
  }, [router]);

  if (state === 'confirming') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <SafeText variant="display" bold center color={colors.feedback.guided}>
            Calling for help...
          </SafeText>
          <SafeText variant="h2" center color={colors.text.secondary} style={styles.subMessage}>
            Please wait a moment
          </SafeText>
        </View>
      </SafeAreaView>
    );
  }

  if (state === 'sent') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.sentContainer}>
          <SafeText variant="display" bold center color={colors.feedback.celebrated}>
            Help is on the way
          </SafeText>

          <SafeText variant="h2" center color={colors.text.secondary} style={styles.subMessage}>
            Don't worry, you are safe.
          </SafeText>

          <View style={styles.caregiverList}>
            {CAREGIVERS.map((c) => (
              <View key={c.name} style={styles.caregiverCard}>
                <SafeText variant="h3" bold color={colors.text.primary}>
                  {c.name}
                </SafeText>
                <SafeText variant="body" color={colors.text.secondary}>
                  {c.role}
                </SafeText>
                <SafeText variant="body" color={colors.primary[500]}>
                  {c.phone}
                </SafeText>
              </View>
            ))}
          </View>

          <TouchableOpacity
            style={styles.okButton}
            onPress={handleDismiss}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="I'm okay, dismiss alert"
          >
            <SafeText variant="h2" bold center color={colors.text.inverse}>
              I'm OK
            </SafeText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Idle state - main SOS button
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.idleContainer}>
        <SafeText variant="h1" bold center color={colors.text.primary} style={styles.topLabel}>
          Emergency Help
        </SafeText>

        <TouchableOpacity
          style={styles.sosButton}
          onPress={handleSOS}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="I need help - tap to alert caregivers"
          accessibilityHint="Sends an alert to your caregivers"
        >
          <SafeText variant="display" bold center color={colors.text.inverse}>
            I Need Help
          </SafeText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel="Go back to home"
        >
          <SafeText variant="bodyLarge" center color={colors.text.secondary}>
            Go Back
          </SafeText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.warm,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.screenPadding,
  },
  idleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.screenPadding,
  },
  sentContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: layout.screenPadding,
  },
  topLabel: {
    marginBottom: spacing.xxxl,
  },
  sosButton: {
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: '#C0392B',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#C0392B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  subMessage: {
    marginTop: spacing.xl,
  },
  caregiverList: {
    marginTop: spacing.xxxl,
    gap: spacing.lg,
  },
  caregiverCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border.light,
    gap: spacing.xs,
  },
  okButton: {
    marginTop: spacing.xxxl,
    height: 100,
    borderRadius: layout.borderRadius,
    backgroundColor: colors.feedback.celebrated,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: colors.feedback.celebrated,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  backButton: {
    marginTop: spacing.xxxl,
    padding: spacing.lg,
  },
});
