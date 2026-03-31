import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../components/SafeText';
import { BigButton } from '../../components/BigButton';
import { RecordingButton } from '../../components/RecordingButton';
import { useVoice } from '../../hooks/useVoice';
import { colors, spacing, layout, shadows } from '../../constants/theme';

interface DemoStory {
  id: string;
  title: string;
  description: string;
  date: string;
  duration: string;
  transcription?: string;
  tags: string[];
}

const DEMO_STORIES: DemoStory[] = [
  {
    id: '1',
    title: 'Our Wedding Day',
    description: 'The happiest day of our lives, June 1975',
    date: 'March 20, 2026',
    duration: '3:24',
    transcription: 'Robert and I got married on a beautiful June morning in 1975. The church was filled with flowers, and my mother had sewn my dress by hand. I remember Robert waiting at the altar, looking so nervous but so handsome...',
    tags: ['wedding', 'robert', 'family'],
  },
  {
    id: '2',
    title: 'First Day Teaching',
    description: 'My first class at Westfield Primary',
    date: 'March 22, 2026',
    duration: '2:15',
    transcription: 'I was so nervous walking into that classroom for the first time. Twenty-three little faces all looking up at me. I had prepared my lesson plan for weeks, but nothing could have prepared me for that feeling...',
    tags: ['career', 'teaching'],
  },
  {
    id: '3',
    title: 'Christmas 1985',
    description: 'The year Lisa got her first bicycle',
    date: 'March 25, 2026',
    duration: '4:02',
    transcription: 'That Christmas was special. Lisa had been asking for a bicycle all year long. Robert and I found the perfect one - bright red with a little bell. The look on her face when she came downstairs...',
    tags: ['christmas', 'lisa', 'family'],
  },
  {
    id: '4',
    title: 'My Garden',
    description: 'The roses I planted when we moved to Portland',
    date: 'March 28, 2026',
    duration: '1:48',
    tags: ['garden', 'portland', 'home'],
  },
];

export default function StoriesScreen() {
  const { speak, isSpeaking } = useVoice();
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [selectedStory, setSelectedStory] = useState<DemoStory | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleToggleRecording = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingDuration(0);
      speak('Recording saved! Your story has been captured.');
    } else {
      setIsRecording(true);
      setRecordingDuration(0);
      timerRef.current = setInterval(() => {
        setRecordingDuration((d) => d + 1);
      }, 1000);
      speak('Recording started. Tell us your story.');
    }
  }, [isRecording, speak]);

  const handlePlayStory = useCallback((story: DemoStory) => {
    setPlayingId(story.id);
    speak(`${story.title}. ${story.transcription || story.description}`);
    setTimeout(() => setPlayingId(null), 5000);
  }, [speak]);

  const handleOpenStory = useCallback((story: DemoStory) => {
    setSelectedStory(story);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SafeText variant="h1" bold style={styles.title}>
          My Stories
        </SafeText>

        {/* Record new story */}
        <View style={styles.recordSection}>
          <SafeText variant="bodyLarge" center color={colors.text.secondary}>
            {isRecording ? 'Recording your story...' : 'Tell us a story or memory'}
          </SafeText>
          {isRecording && (
            <SafeText variant="h2" center bold color={colors.feedback.supported}>
              {Math.floor(recordingDuration / 60)}:{(recordingDuration % 60).toString().padStart(2, '0')}
            </SafeText>
          )}
          <RecordingButton
            isRecording={isRecording}
            onPress={handleToggleRecording}
            durationSeconds={recordingDuration}
          />
          {isRecording && (
            <SafeText variant="body" center color={colors.text.muted}>
              Tap again to stop recording
            </SafeText>
          )}
        </View>

        {/* Stories list */}
        <SafeText variant="h3" bold style={styles.sectionHeader}>
          {DEMO_STORIES.length} Stories Saved
        </SafeText>

        <View style={styles.storiesList}>
          {DEMO_STORIES.map((story) => (
            <TouchableOpacity
              key={story.id}
              style={[styles.storyCard, playingId === story.id && styles.storyCardPlaying]}
              onPress={() => handleOpenStory(story)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Story: ${story.title}`}
            >
              <View style={styles.storyIcon}>
                <SafeText variant="h3">
                  {playingId === story.id ? '🔊' : '📖'}
                </SafeText>
              </View>
              <View style={styles.storyInfo}>
                <SafeText variant="bodyLarge" bold numberOfLines={1}>
                  {story.title}
                </SafeText>
                <SafeText variant="body" color={colors.text.secondary} numberOfLines={1}>
                  {story.description}
                </SafeText>
                <View style={styles.storyMeta}>
                  <SafeText variant="body" color={colors.text.muted}>
                    {story.date}
                  </SafeText>
                  <SafeText variant="body" color={colors.text.muted}>
                    {story.duration}
                  </SafeText>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Story Detail Modal */}
      <Modal
        visible={!!selectedStory}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedStory(null)}
      >
        {selectedStory && (
          <SafeAreaView style={styles.modalSafeArea}>
            <ScrollView contentContainerStyle={styles.modalContent}>
              <SafeText variant="h1" bold color={colors.primary[500]}>
                {selectedStory.title}
              </SafeText>
              <SafeText variant="bodyLarge" color={colors.text.secondary}>
                {selectedStory.description}
              </SafeText>
              <SafeText variant="body" color={colors.text.muted}>
                Recorded {selectedStory.date} · {selectedStory.duration}
              </SafeText>

              {/* Play button */}
              <BigButton
                title={playingId === selectedStory.id ? '🔊 Playing...' : '▶️ Play Story'}
                onPress={() => handlePlayStory(selectedStory)}
                variant="primary"
                style={styles.playButton}
              />

              {/* Transcription */}
              {selectedStory.transcription && (
                <View style={styles.transcriptionCard}>
                  <SafeText variant="h3" bold style={styles.transcriptionHeader}>
                    Transcription
                  </SafeText>
                  <SafeText variant="body" color={colors.text.secondary}>
                    {selectedStory.transcription}
                  </SafeText>
                </View>
              )}

              {/* Tags */}
              {selectedStory.tags.length > 0 && (
                <View style={styles.tagsContainer}>
                  {selectedStory.tags.map((tag) => (
                    <View key={tag} style={styles.tag}>
                      <SafeText variant="body" color={colors.primary[500]}>
                        {tag}
                      </SafeText>
                    </View>
                  ))}
                </View>
              )}

              <BigButton
                title="Close"
                onPress={() => setSelectedStory(null)}
                variant="accent"
                style={styles.closeButton}
              />
            </ScrollView>
          </SafeAreaView>
        )}
      </Modal>
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
    gap: spacing.md,
    marginBottom: spacing.xxl,
    ...shadows.card,
  },
  sectionHeader: {
    marginBottom: spacing.lg,
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
    minHeight: 100,
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
  storyMeta: {
    flexDirection: 'row',
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  modalSafeArea: {
    flex: 1,
    backgroundColor: colors.background.warm,
  },
  modalContent: {
    padding: layout.screenPadding,
    gap: spacing.lg,
  },
  playButton: {
    marginTop: spacing.md,
  },
  transcriptionCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.xl,
    ...shadows.card,
  },
  transcriptionHeader: {
    marginBottom: spacing.md,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  tag: {
    backgroundColor: colors.primary[50],
    borderRadius: 20,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primary[200],
  },
  closeButton: {
    marginTop: spacing.lg,
    marginBottom: spacing.xxxl,
  },
});
