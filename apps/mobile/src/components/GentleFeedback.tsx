import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { FeedbackType } from '@gentle-reminder/shared-types';
import { SafeText } from './SafeText';
import { useVoice } from '../hooks/useVoice';
import { getFeedbackMessage } from '../utils/scoring';
import { colors, spacing, layout, shadows } from '../constants/theme';
import { ANIMATION_DURATION_MS } from '../constants/accessibility';

interface GentleFeedbackProps {
  /** The feedback type to display */
  feedbackType: FeedbackType;
  /** Patient's preferred name for personalized messages */
  preferredName?: string;
  /** Custom message override */
  message?: string;
  /** Whether to speak the feedback aloud */
  speakFeedback?: boolean;
  /** Callback when feedback animation completes */
  onComplete?: () => void;
}

/**
 * Shows celebrated/guided/supported feedback with animations.
 * Never shows "wrong" - only positive, encouraging states.
 */
export function GentleFeedback({
  feedbackType,
  preferredName,
  message,
  speakFeedback = true,
  onComplete,
}: GentleFeedbackProps) {
  const { speak } = useVoice();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  const feedbackMessage = message || getFeedbackMessage(feedbackType, preferredName);
  const feedbackColor = getFeedbackColor(feedbackType);
  const feedbackIcon = getFeedbackDisplayIcon(feedbackType);

  useEffect(() => {
    // Animate in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: ANIMATION_DURATION_MS,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onComplete?.();
    });

    // Speak the feedback
    if (speakFeedback) {
      speak(feedbackMessage);
    }
  }, [feedbackType, feedbackMessage, speakFeedback]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: feedbackColor,
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
      accessibilityRole="alert"
      accessibilityLabel={feedbackMessage}
    >
      <SafeText variant="h1" center color={colors.white}>
        {feedbackIcon}
      </SafeText>
      <SafeText variant="h3" center color={colors.white} bold style={styles.message}>
        {feedbackMessage}
      </SafeText>
    </Animated.View>
  );
}

function getFeedbackColor(type: FeedbackType): string {
  switch (type) {
    case FeedbackType.CELEBRATED:
      return colors.feedback.celebrated;
    case FeedbackType.GUIDED:
      return colors.feedback.guided;
    case FeedbackType.SUPPORTED:
      return colors.feedback.supported;
  }
}

function getFeedbackDisplayIcon(type: FeedbackType): string {
  switch (type) {
    case FeedbackType.CELEBRATED:
      return '⭐';
    case FeedbackType.GUIDED:
      return '🧭';
    case FeedbackType.SUPPORTED:
      return '💙';
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    ...shadows.card,
  },
  message: {
    marginTop: spacing.md,
  },
});
