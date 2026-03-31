import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../components/SafeText';
import { RecordingButton } from '../../components/RecordingButton';
import { VoicePrompt } from '../../components/VoicePrompt';
import { useVoice } from '../../hooks/useVoice';
import { colors, spacing, layout, shadows } from '../../constants/theme';

/**
 * Story Vault screen.
 * List of recorded stories, ability to record new ones and play back.
 */
interface DemoStory {
  id: string;
  title: string;
  description?: string;
}

const DEMO_STORIES: DemoStory[] = [
  { id: '1', title: 'Our Wedding Day', description: 'The happiest day of our lives, June 1975' },
  { id: '2', title: 'First Day Teaching', description: 'My first class at Westfield Primary' },
];

export default function StoriesScreen() {
  const { speak, isSpeaking } = useVoice();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);

  useEffect(() => {
    speak('Your stories and memories. Tap to listen, or record a new one.');
  }, []);

  const handleToggleRecording = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      setRecordingDuration(0);
      speak('Recording saved in demo mode.');
    } else {
      setIsRecording(true);
      setRecordingDuration(0);
    }
  }, [isRecording, speak]);

  const handlePlayStory = useCallback((story: DemoStory) => {
    speak(`Playing story: ${story.title}. ${story.description || ''}`);
  }, [speak]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SafeText variant="h1" bold style={styles.title}>
          My Stories
        </SafeText>
        <VoicePrompt isSpeaking={isSpeaking} label="Speaking..." />

        {/* Record new story */}
        <View style={styles.recordSection}>
          <SafeText variant="bodyLarge" center color={colors.text.secondary}>
            Tell us a story or memory
          </SafeText>
          <RecordingButton
            isRecording={isRecording}
            onPress={handleToggleRecording}
            durationSeconds={recordingDuration}
          />
        </View>

        {/* Stories list */}
        <View style={styles.storiesList}>
          {DEMO_STORIES.map((story) => (
            <TouchableOpacity
              key={story.id}
              style={styles.storyCard}
              onPress={() => handlePlayStory(story)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Play story: ${story.title}`}
            >
              <View style={styles.storyIcon}>
                <SafeText variant="h2">
                  {'▶️'}
                </SafeText>
              </View>
              <View style={styles.storyInfo}>
                <SafeText variant="bodyLarge" bold numberOfLines={1}>
                  {story.title}
                </SafeText>
                {story.description && (
                  <SafeText variant="body" color={colors.text.secondary} numberOfLines={1}>
                    {story.description}
                  </SafeText>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.warm,
  },
  scrollContent: {
    padding: layout.screenPadding,
    paddingBottom: 120,
  },
  title: {
    marginBottom: spacing.lg,
  },
  recordSection: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.lg,
    marginBottom: spacing.xxl,
    ...shadows.card,
  },
  emptyContainer: {
    paddingVertical: spacing.xxxl,
  },
  storiesList: {
    gap: spacing.md,
  },
  storyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    gap: spacing.lg,
    minHeight: 80,
    ...shadows.card,
  },
  storyCardPlaying: {
    borderWidth: 2,
    borderColor: colors.primary[500],
  },
  storyIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyInfo: {
    flex: 1,
    gap: spacing.xs,
  },
});
