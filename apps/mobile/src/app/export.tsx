import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../components/SafeText';
import { BigButton } from '../components/BigButton';
import { colors, fontSize, spacing, layout, shadows } from '../constants/theme';

/**
 * Data Export / Sharing Screen
 * Lets patients share cognitive health data with their care team.
 * Demo mode: tapping buttons shows confirmation messages.
 */
export default function ExportScreen() {
  const [message, setMessage] = useState('');

  const showMessage = (text: string) => {
    setMessage(text);
    if (Platform.OS !== 'web') {
      Alert.alert('Success', text);
    }
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SafeText variant="display" bold center color={colors.primary[500]} style={styles.heading}>
          Share My Data
        </SafeText>

        <SafeText variant="bodyLarge" center color={colors.text.secondary} style={styles.subtitle}>
          Share your cognitive health data with your care team
        </SafeText>

        {/* Weekly Report Card */}
        <View style={[styles.card, { borderLeftColor: colors.primary[500] }]}>
          <SafeText variant="bodyLarge" bold color={colors.primary[500]}>
            Weekly Report
          </SafeText>
          <SafeText variant="body" color={colors.text.secondary} style={styles.cardDescription}>
            Summary of this week's sessions and scores
          </SafeText>
          <View style={styles.cardButton}>
            <BigButton
              title="Share Report"
              onPress={() => showMessage('Report shared!')}
              variant="primary"
              accessibilityLabel="Share Weekly Report"
              accessibilityHint="Shares a summary of this week's sessions and scores with your care team"
            />
          </View>
        </View>

        {/* Full History Card */}
        <View style={[styles.card, { borderLeftColor: colors.secondary[500] }]}>
          <SafeText variant="bodyLarge" bold color={colors.secondary[500]}>
            Full History
          </SafeText>
          <SafeText variant="body" color={colors.text.secondary} style={styles.cardDescription}>
            Complete session and score history
          </SafeText>
          <View style={styles.cardButton}>
            <BigButton
              title="Export Data"
              onPress={() => showMessage('Data exported!')}
              variant="secondary"
              accessibilityLabel="Export Full History"
              accessibilityHint="Exports your complete session and score history"
            />
          </View>
        </View>

        {/* Care Team Access Card */}
        <View style={[styles.card, { borderLeftColor: colors.accent[500] }]}>
          <SafeText variant="bodyLarge" bold color={colors.accent[500]}>
            Care Team Access
          </SafeText>
          <SafeText variant="body" color={colors.text.secondary} style={styles.cardDescription}>
            Let your doctor view your progress
          </SafeText>
          <View style={styles.cardButton}>
            <BigButton
              title="Grant Access"
              onPress={() => showMessage('Access granted!')}
              variant="accent"
              accessibilityLabel="Grant Care Team Access"
              accessibilityHint="Lets your doctor view your cognitive health progress"
            />
          </View>
        </View>

        {/* Status Message */}
        {message !== '' && (
          <SafeText variant="bodyLarge" bold center color={colors.secondary[500]} style={styles.statusMessage}>
            {message}
          </SafeText>
        )}

        {/* Privacy Note */}
        <View style={styles.privacyContainer}>
          <SafeText variant="body" center color={colors.text.muted} style={styles.privacyText}>
            Your data is encrypted and only shared with people you choose.
          </SafeText>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: layout.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  heading: {
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  subtitle: {
    marginBottom: spacing.xxl,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: layout.buttonBorderRadius,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    borderLeftWidth: 6,
    ...shadows.button,
  },
  cardDescription: {
    marginTop: spacing.sm,
    marginBottom: spacing.lg,
  },
  cardButton: {
    marginTop: spacing.xs,
  },
  statusMessage: {
    marginTop: spacing.lg,
  },
  privacyContainer: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  privacyText: {
    lineHeight: 24,
  },
});
