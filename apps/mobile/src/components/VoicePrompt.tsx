import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { SafeText } from './SafeText';
import { colors, spacing, layout } from '../constants/theme';

interface VoicePromptProps {
  /** Whether TTS is currently speaking */
  isSpeaking: boolean;
  /** Optional label to display */
  label?: string;
}

/**
 * Voice prompt indicator.
 * Shows a pulsing indicator when text-to-speech is actively speaking.
 */
export function VoicePrompt({ isSpeaking, label = 'Listening...' }: VoicePromptProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isSpeaking) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.3,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isSpeaking, pulseAnim]);

  if (!isSpeaking) return null;

  return (
    <View style={styles.container} accessibilityRole="alert" accessibilityLabel="Voice is speaking">
      <Animated.View
        style={[
          styles.dot,
          { transform: [{ scale: pulseAnim }] },
        ]}
      />
      <SafeText variant="body" color={colors.primary[500]}>
        {label}
      </SafeText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.primary[500],
  },
});
