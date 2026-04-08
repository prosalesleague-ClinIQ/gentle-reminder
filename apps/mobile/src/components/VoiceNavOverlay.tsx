import React from 'react';
import { View, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeText } from './SafeText';
import { voiceNavigator } from '../services/VoiceNavigator';
import { useSettingsStore } from '../stores/settingsStore';

/**
 * Floating voice navigation control overlay.
 *
 * When voice nav mode is on, this appears at the bottom of every screen
 * showing large numbered buttons matching the current screen's options.
 * Includes Repeat, Back, and Home controls.
 */
export function VoiceNavOverlay() {
  const voiceNavMode = useSettingsStore((s) => s.voiceNavMode);

  if (!voiceNavMode) return null;

  const options = voiceNavigator.getCurrentOptions();

  return (
    <View style={styles.container}>
      {/* Option buttons */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.optionsRow}
      >
        {options.map((opt, i) => (
          <TouchableOpacity
            key={i}
            style={styles.optionButton}
            onPress={() => voiceNavigator.handleOptionSelect(i + 1)}
            accessibilityRole="button"
            accessibilityLabel={`Option ${i + 1}: ${opt.label}`}
          >
            <SafeText variant="h1" bold color="#FFFFFF">
              {i + 1}
            </SafeText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Control buttons */}
      <View style={styles.controlsRow}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => voiceNavigator.repeatAnnouncement()}
          accessibilityRole="button"
          accessibilityLabel="Repeat options"
        >
          <SafeText variant="h3" bold color="#FFFFFF">
            🔁 Repeat
          </SafeText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => voiceNavigator.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Go back"
        >
          <SafeText variant="h3" bold color="#FFFFFF">
            ← Back
          </SafeText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => voiceNavigator.goHome()}
          accessibilityRole="button"
          accessibilityLabel="Go to home screen"
        >
          <SafeText variant="h3" bold color="#FFFFFF">
            🏠 Home
          </SafeText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.stopButton]}
          onPress={() => voiceNavigator.stop()}
          accessibilityRole="button"
          accessibilityLabel="Stop speaking"
        >
          <SafeText variant="h3" bold color="#FFFFFF">
            ⏹ Stop
          </SafeText>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    paddingTop: 16,
    paddingBottom: 40,
    paddingHorizontal: 12,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 12,
    paddingHorizontal: 4,
  },
  optionButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
  },
  controlsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    paddingTop: 8,
  },
  controlButton: {
    flex: 1,
    height: 60,
    backgroundColor: '#374151',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopButton: {
    backgroundColor: '#DC2626',
  },
});
