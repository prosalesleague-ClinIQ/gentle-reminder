import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Switch, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SafeText } from '../../components/SafeText';
import { BigButton } from '../../components/BigButton';
import { useSettingsStore } from '../../stores/settingsStore';
import { colors, fontSize, fontWeight, spacing, layout } from '../../constants/theme';
import { MIN_BUTTON_HEIGHT } from '../../constants/accessibility';

/**
 * Accessibility Settings screen.
 * Allows users to adjust font size, voice guidance, and high contrast mode.
 * All controls are large and clearly labeled for dementia patients.
 */
export default function SettingsScreen() {
  const router = useRouter();
  const {
    fontScale,
    voiceEnabled,
    highContrastMode,
    increaseFontScale,
    decreaseFontScale,
    toggleVoice,
    toggleHighContrast,
    resetSettings,
  } = useSettingsStore();

  const handleDecrease = () => {
    if (Platform.OS !== 'web') {
      import('expo-haptics')
        .then((Haptics) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        })
        .catch(() => {});
    }
    decreaseFontScale();
  };

  const handleIncrease = () => {
    if (Platform.OS !== 'web') {
      import('expo-haptics')
        .then((Haptics) => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        })
        .catch(() => {});
    }
    increaseFontScale();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SafeText variant="display" bold center color={colors.primary[500]} style={styles.heading}>
          Settings
        </SafeText>

        {/* Edit Profile */}
        <View style={styles.navButtonContainer}>
          <BigButton
            title="Edit Profile"
            onPress={() => router.push('/profile')}
            variant="primary"
            accessibilityLabel="Edit Profile"
            accessibilityHint="Opens your profile editing screen"
          />
        </View>

        {/* Export My Data */}
        <View style={styles.navButtonContainer}>
          <BigButton
            title="Export My Data"
            onPress={() => router.push('/export')}
            variant="accent"
            accessibilityLabel="Export My Data"
            accessibilityHint="Opens the data export and sharing screen"
          />
        </View>

        {/* Font Size Control */}
        <View style={styles.section}>
          <SafeText variant="bodyLarge" bold>
            Font Size
          </SafeText>
          <View style={styles.fontSizeRow}>
            <TouchableOpacity
              style={styles.fontButton}
              onPress={handleDecrease}
              accessibilityRole="button"
              accessibilityLabel="Decrease font size"
              accessibilityHint="Makes text smaller"
            >
              <SafeText variant="display" bold center>
                A-
              </SafeText>
            </TouchableOpacity>

            <View style={styles.scaleDisplay}>
              <SafeText variant="bodyLarge" bold center>
                {fontScale.toFixed(1)}x
              </SafeText>
            </View>

            <TouchableOpacity
              style={styles.fontButton}
              onPress={handleIncrease}
              accessibilityRole="button"
              accessibilityLabel="Increase font size"
              accessibilityHint="Makes text larger"
            >
              <SafeText variant="display" bold center>
                A+
              </SafeText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Voice Guidance Toggle */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <SafeText variant="bodyLarge" bold>
                Voice Guidance
              </SafeText>
              <SafeText variant="body" color={colors.text.secondary}>
                {voiceEnabled ? 'On' : 'Off'}
              </SafeText>
            </View>
            <Switch
              value={voiceEnabled}
              onValueChange={toggleVoice}
              trackColor={{ false: colors.border.medium, true: colors.primary[300] }}
              thumbColor={voiceEnabled ? colors.primary[500] : colors.text.muted}
              style={styles.switch}
              accessibilityRole="switch"
              accessibilityLabel="Voice guidance"
              accessibilityState={{ checked: voiceEnabled }}
            />
          </View>
        </View>

        {/* High Contrast Toggle */}
        <View style={styles.section}>
          <View style={styles.toggleRow}>
            <View style={styles.toggleLabel}>
              <SafeText variant="bodyLarge" bold>
                High Contrast
              </SafeText>
              <SafeText variant="body" color={colors.text.secondary}>
                {highContrastMode ? 'On' : 'Off'}
              </SafeText>
            </View>
            <Switch
              value={highContrastMode}
              onValueChange={toggleHighContrast}
              trackColor={{ false: colors.border.medium, true: colors.primary[300] }}
              thumbColor={highContrastMode ? colors.primary[500] : colors.text.muted}
              style={styles.switch}
              accessibilityRole="switch"
              accessibilityLabel="High contrast mode"
              accessibilityState={{ checked: highContrastMode }}
            />
          </View>
        </View>

        {/* Reset Button */}
        <View style={styles.resetContainer}>
          <BigButton
            title="Reset to Defaults"
            onPress={resetSettings}
            variant="secondary"
            accessibilityLabel="Reset all settings to defaults"
            accessibilityHint="Restores font size, voice guidance, and contrast to original values"
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
    marginBottom: spacing.xxxl,
    marginTop: spacing.lg,
  },
  section: {
    marginBottom: spacing.xl,
    backgroundColor: colors.white,
    borderRadius: layout.buttonBorderRadius,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.light,
  },
  fontSizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
    marginTop: spacing.md,
  },
  fontButton: {
    height: MIN_BUTTON_HEIGHT,
    width: MIN_BUTTON_HEIGHT,
    borderRadius: layout.buttonBorderRadius,
    backgroundColor: colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  scaleDisplay: {
    height: MIN_BUTTON_HEIGHT,
    minWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background.secondary,
    borderRadius: layout.buttonBorderRadius,
    paddingHorizontal: spacing.lg,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: MIN_BUTTON_HEIGHT,
  },
  toggleLabel: {
    flex: 1,
    gap: spacing.xs,
  },
  switch: {
    transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }],
    marginLeft: spacing.lg,
  },
  navButtonContainer: {
    marginBottom: spacing.lg,
  },
  resetContainer: {
    marginTop: spacing.xl,
  },
});
