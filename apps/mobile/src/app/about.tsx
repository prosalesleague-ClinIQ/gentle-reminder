import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SafeText } from '../components/SafeText';
import { BigButton } from '../components/BigButton';
import { colors, fontSize, spacing, layout } from '../constants/theme';

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SafeText variant="display" bold center color={colors.primary[500]} style={styles.heading}>
          About Gentle Reminder
        </SafeText>

        {/* App Icon Placeholder */}
        <View style={styles.iconContainer}>
          <View style={styles.appIcon}>
            <SafeText variant="display" bold center color="#FFFFFF">
              GR
            </SafeText>
          </View>
        </View>

        {/* Version */}
        <SafeText variant="bodyLarge" bold center style={styles.version}>
          Version 1.0.0 (Build 21)
        </SafeText>

        {/* Description */}
        <View style={styles.descriptionCard}>
          <SafeText variant="body" center color={colors.text.secondary} style={styles.description}>
            A clinical-grade cognitive support platform for dementia patients and their care teams.
          </SafeText>
        </View>

        {/* Credits */}
        <View style={styles.section}>
          <SafeText variant="bodyLarge" bold style={styles.sectionTitle}>
            Credits
          </SafeText>
          <SafeText variant="body" color={colors.text.secondary}>
            Built with love for patients, families, and caregivers
          </SafeText>
        </View>

        {/* Links */}
        <View style={styles.section}>
          <SafeText variant="bodyLarge" bold style={styles.sectionTitle}>
            Links
          </SafeText>
          <View style={styles.linkItem}>
            <SafeText variant="body" color={colors.primary[500]}>
              Privacy Policy
            </SafeText>
          </View>
          <View style={styles.linkItem}>
            <SafeText variant="body" color={colors.primary[500]}>
              Terms of Service
            </SafeText>
          </View>
          <View style={styles.linkItem}>
            <SafeText variant="body" color={colors.primary[500]}>
              Contact Support
            </SafeText>
          </View>
        </View>

        {/* Back Button */}
        <View style={styles.backButtonContainer}>
          <BigButton
            title="Back to Settings"
            onPress={() => router.push('/(tabs)/settings')}
            variant="secondary"
            accessibilityLabel="Back to Settings"
            accessibilityHint="Returns to the settings screen"
          />
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
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  appIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  version: {
    marginBottom: spacing.xl,
  },
  descriptionCard: {
    backgroundColor: colors.white,
    borderRadius: layout.buttonBorderRadius,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.xl,
  },
  description: {
    lineHeight: 24,
  },
  section: {
    backgroundColor: colors.white,
    borderRadius: layout.buttonBorderRadius,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
  },
  linkItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButtonContainer: {
    marginTop: spacing.xl,
  },
});
