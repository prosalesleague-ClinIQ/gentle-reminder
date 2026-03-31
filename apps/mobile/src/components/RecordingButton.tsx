import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';
import { SafeText } from './SafeText';
import { colors, spacing, shadows } from '../constants/theme';

interface RecordingButtonProps {
  /** Whether currently recording */
  isRecording: boolean;
  /** Callback to start/stop recording */
  onPress: () => void;
  /** Recording duration in seconds */
  durationSeconds?: number;
  /** Accessibility label */
  accessibilityLabel?: string;
}

/**
 * Audio recording button with pulsing animation when active.
 */
export function RecordingButton({
  isRecording,
  onPress,
  durationSeconds = 0,
  accessibilityLabel,
}: RecordingButtonProps) {
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRecording) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.15,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();
      return () => pulse.stop();
    } else {
      pulseAnim.setValue(1);
    }
  }, [isRecording, pulseAnim]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <TouchableOpacity
          style={[
            styles.button,
            isRecording && styles.buttonRecording,
          ]}
          onPress={onPress}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={
            accessibilityLabel ||
            (isRecording ? 'Stop recording' : 'Start recording')
          }
          accessibilityState={{ selected: isRecording }}
        >
          <View
            style={[
              styles.innerCircle,
              isRecording && styles.innerCircleRecording,
            ]}
          />
        </TouchableOpacity>
      </Animated.View>

      <SafeText
        variant="body"
        center
        color={isRecording ? colors.feedback.supported : colors.text.secondary}
        style={styles.label}
      >
        {isRecording ? `Recording ${formatTime(durationSeconds)}` : 'Tap to record'}
      </SafeText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: spacing.md,
  },
  button: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors.border.medium,
    ...shadows.button,
  },
  buttonRecording: {
    borderColor: colors.feedback.supported,
  },
  innerCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.feedback.supported,
  },
  innerCircleRecording: {
    borderRadius: 8,
    backgroundColor: colors.feedback.supported,
  },
  label: {
    marginTop: spacing.xs,
  },
});
