import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../components/SafeText';
import { useSettingsStore } from '../../stores/settingsStore';
import { useVoice } from '../../hooks/useVoice';
import { colors, spacing, layout, shadows } from '../../constants/theme';

/**
 * Voice Assist settings screen.
 *
 * Lets the user enable voice navigation mode, choose voice speed,
 * and test the voice. When voice nav is on, the app speaks every
 * screen's content and available actions as numbered choices.
 */
export default function VoiceAssistScreen() {
  const { speak } = useVoice();
  const voiceNavMode = useSettingsStore((s) => s.voiceNavMode);
  const voiceNavSpeed = useSettingsStore((s) => s.voiceNavSpeed);
  const toggleVoiceNav = useSettingsStore((s) => s.toggleVoiceNav);
  const setVoiceNavSpeed = useSettingsStore((s) => s.setVoiceNavSpeed);

  const handleToggle = () => {
    toggleVoiceNav();
    if (!voiceNavMode) {
      speak('Voice navigation is now on. I will guide you through every screen. Tap numbered buttons to choose an option.');
    } else {
      speak('Voice navigation is now off.');
    }
  };

  const handleSpeedChange = (speed: 'slow' | 'normal' | 'fast') => {
    setVoiceNavSpeed(speed);
    speak(`Voice speed set to ${speed}.`);
  };

  const handleTestVoice = () => {
    speak('Hello! I am your voice guide. I will help you navigate through the app. You can adjust my speed below.');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <SafeText variant="h1" bold style={styles.heading}>
          Voice Assist
        </SafeText>
        <SafeText variant="body" color={colors.text.secondary} style={styles.subtitle}>
          Navigate the entire app using voice guidance
        </SafeText>

        {/* Main Toggle */}
        <TouchableOpacity
          style={[styles.toggleCard, voiceNavMode && styles.toggleCardActive]}
          onPress={handleToggle}
          accessibilityRole="switch"
          accessibilityState={{ checked: voiceNavMode }}
          accessibilityLabel={`Voice navigation is ${voiceNavMode ? 'on' : 'off'}. Tap to ${voiceNavMode ? 'turn off' : 'turn on'}.`}
        >
          <SafeText variant="h1" bold style={styles.toggleIcon}>
            {voiceNavMode ? '🔊' : '🔇'}
          </SafeText>
          <SafeText variant="h2" bold color={voiceNavMode ? '#FFFFFF' : colors.text.primary}>
            Voice Navigation
          </SafeText>
          <SafeText variant="h2" bold color={voiceNavMode ? '#E9D5FF' : colors.primary[500]}>
            {voiceNavMode ? 'ON' : 'OFF'}
          </SafeText>
        </TouchableOpacity>

        {/* How It Works */}
        <View style={styles.infoCard}>
          <SafeText variant="h2" bold style={styles.sectionTitle}>
            How It Works
          </SafeText>
          <SafeText variant="body" style={styles.infoText}>
            When voice navigation is on:
          </SafeText>
          <SafeText variant="body" style={styles.bulletPoint}>
            • Every screen is read aloud to you
          </SafeText>
          <SafeText variant="body" style={styles.bulletPoint}>
            • Your options are read as numbered choices
          </SafeText>
          <SafeText variant="body" style={styles.bulletPoint}>
            • Tap the numbered buttons to choose
          </SafeText>
          <SafeText variant="body" style={styles.bulletPoint}>
            • Tap "Repeat" to hear options again
          </SafeText>
          <SafeText variant="body" style={styles.bulletPoint}>
            • Tap "Back" or "Home" anytime
          </SafeText>
        </View>

        {/* Voice Speed */}
        <SafeText variant="h2" bold style={styles.sectionTitle}>
          Voice Speed
        </SafeText>
        <View style={styles.speedRow}>
          {(['slow', 'normal', 'fast'] as const).map((speed) => (
            <TouchableOpacity
              key={speed}
              style={[
                styles.speedButton,
                voiceNavSpeed === speed && styles.speedButtonActive,
              ]}
              onPress={() => handleSpeedChange(speed)}
              accessibilityRole="radio"
              accessibilityState={{ selected: voiceNavSpeed === speed }}
              accessibilityLabel={`${speed} speed ${voiceNavSpeed === speed ? ', selected' : ''}`}
            >
              <SafeText
                variant="h3"
                bold
                color={voiceNavSpeed === speed ? '#FFFFFF' : colors.text.primary}
              >
                {speed.charAt(0).toUpperCase() + speed.slice(1)}
              </SafeText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Test Voice */}
        <TouchableOpacity
          style={styles.testButton}
          onPress={handleTestVoice}
          accessibilityRole="button"
          accessibilityLabel="Test voice. Tap to hear a sample."
        >
          <SafeText variant="h2" bold color="#FFFFFF">
            🎤 Test Voice
          </SafeText>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.main,
  },
  scrollContent: {
    padding: layout.screenPadding,
    paddingBottom: 120,
  },
  heading: {
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
  toggleCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xxl,
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.xl,
    ...shadows.card,
    borderWidth: 3,
    borderColor: colors.border.light,
  },
  toggleCardActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  toggleIcon: {
    fontSize: 64,
  },
  infoCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    marginBottom: spacing.xl,
    ...shadows.card,
    borderLeftWidth: 6,
    borderLeftColor: '#7C3AED',
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  infoText: {
    marginBottom: spacing.sm,
  },
  bulletPoint: {
    marginBottom: spacing.xs,
    paddingLeft: spacing.sm,
  },
  speedRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  speedButton: {
    flex: 1,
    height: 80,
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
    borderWidth: 2,
    borderColor: colors.border.light,
  },
  speedButtonActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  testButton: {
    backgroundColor: '#00897B',
    borderRadius: layout.buttonBorderRadius,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.button,
  },
});
