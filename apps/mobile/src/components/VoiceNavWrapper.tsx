import React from 'react';
import { View, StyleSheet } from 'react-native';
import { VoiceNavOverlay } from './VoiceNavOverlay';
import { useVoiceNavigation } from '../hooks/useVoiceNavigation';

interface VoiceNavWrapperProps {
  screenName: string;
  children: React.ReactNode;
}

/**
 * Wraps any screen to make it voice-navigable.
 *
 * Usage:
 *   <VoiceNavWrapper screenName="home">
 *     <YourScreenContent />
 *   </VoiceNavWrapper>
 *
 * Automatically announces the screen on mount when voice nav is on,
 * and shows the floating overlay with numbered option buttons.
 */
export function VoiceNavWrapper({ screenName, children }: VoiceNavWrapperProps) {
  const { isVoiceNavMode } = useVoiceNavigation(screenName);

  return (
    <View style={styles.container}>
      <View style={[styles.content, isVoiceNavMode && styles.contentWithOverlay]}>
        {children}
      </View>
      <VoiceNavOverlay />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  contentWithOverlay: {
    // Add padding at bottom so content isn't hidden behind overlay
    paddingBottom: 220,
  },
});
