import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../components/SafeText';
import { VoicePrompt } from '../../components/VoicePrompt';
import { useAICompanion } from '../../hooks/useAICompanion';
import { voiceCloneService } from '../../services/VoiceCloneService';
import { colors, spacing, layout, fontSize, fontWeight } from '../../constants/theme';

/**
 * Family Voices screen.
 *
 * Tapping a family member plays their greeting using their unique voice:
 * - If voice cloning is active, uses their real cloned voice
 * - Otherwise, uses a distinctive demo TTS with unique pitch/rate per person
 *
 * The AI companion introduces the screen and each person.
 */

interface VoiceAvatar {
  id: string;
  name: string;
  relationship: string;
  initials: string;
  color: string;
  greeting: string;
}

const DEMO_VOICES: VoiceAvatar[] = [
  {
    id: 'voice-lisa',
    name: 'Lisa',
    relationship: 'Daughter',
    initials: 'L',
    color: '#E8A0BF',
    greeting: 'Hi Mum! It\'s Lisa. I just wanted to say I love you. I\'ll come visit you this afternoon, okay?',
  },
  {
    id: 'voice-robert',
    name: 'Robert',
    relationship: 'Husband',
    initials: 'R',
    color: '#7FB5B5',
    greeting: 'Hello, my dear Margaret. It\'s Robert. Remember our garden? The roses are blooming beautifully today.',
  },
  {
    id: 'voice-emma',
    name: 'Emma',
    relationship: 'Grandchild',
    initials: 'E',
    color: '#FFD93D',
    greeting: 'Hi Grandma! It\'s Emma! I miss you so much. I drew you a picture of a rainbow today!',
  },
  {
    id: 'voice-james',
    name: 'James',
    relationship: 'Son',
    initials: 'J',
    color: '#6BCB77',
    greeting: 'Hey Mum, it\'s James. I\'m thinking of you today. I\'ll call you on Sunday like always. Love you!',
  },
];

export default function VoicesScreen() {
  const ai = useAICompanion('family');
  const [activeVoice, setActiveVoice] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleTalk = useCallback(
    async (voice: VoiceAvatar) => {
      if (isSpeaking) {
        voiceCloneService.stop();
        ai.stop();
        setActiveVoice(null);
        setIsSpeaking(false);
        return;
      }

      setActiveVoice(voice.id);
      setIsSpeaking(true);

      // AI companion introduces, then the person's voice speaks
      await ai.speak(`Here's ${voice.name}, your ${voice.relationship}.`);
      await new Promise((r) => setTimeout(r, 400));
      await voiceCloneService.speakAs(voice.name, voice.greeting);

      setActiveVoice(null);
      setIsSpeaking(false);
    },
    [ai, isSpeaking],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SafeText variant="h1" bold style={styles.title}>
          Family Voices
        </SafeText>
        <VoicePrompt isSpeaking={isSpeaking} label="Speaking..." />

        <SafeText variant="body" style={styles.subtitle}>
          Tap a family member to hear their voice message
        </SafeText>

        <View style={styles.grid}>
          {DEMO_VOICES.map((voice) => {
            const profile = voiceCloneService.getProfile(voice.name);
            const hasClone = profile?.isCloned || false;

            return (
              <View key={voice.id} style={styles.avatarCard}>
                {/* Photo circle with initials */}
                <View
                  style={[styles.avatarCircle, { backgroundColor: voice.color }]}
                  accessibilityLabel={`${voice.name}, ${voice.relationship}`}
                >
                  <Text style={styles.avatarInitials}>{voice.initials}</Text>
                </View>

                {/* Cloned voice badge */}
                {hasClone && (
                  <View style={styles.cloneBadge}>
                    <SafeText variant="caption" bold color="#FFFFFF">Real Voice</SafeText>
                  </View>
                )}

                {/* Name and relationship */}
                <SafeText variant="subheading" bold center>
                  {voice.name}
                </SafeText>
                <SafeText variant="body" center style={styles.relationship}>
                  {voice.relationship}
                </SafeText>

                {/* Talk button */}
                <TouchableOpacity
                  style={[
                    styles.talkButton,
                    activeVoice === voice.id && styles.talkButtonActive,
                  ]}
                  onPress={() => handleTalk(voice)}
                  accessibilityLabel={
                    activeVoice === voice.id
                      ? `Stop ${voice.name}'s message`
                      : `Hear a message from ${voice.name}, your ${voice.relationship}`
                  }
                  accessibilityRole="button"
                >
                  <Text style={styles.talkButtonText}>
                    {activeVoice === voice.id ? 'Stop' : 'Talk'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
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
    marginBottom: spacing.sm,
  },
  subtitle: {
    marginBottom: spacing.xl,
    color: colors.text.muted,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xl,
    justifyContent: 'center',
  },
  avatarCard: {
    width: 160,
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    gap: spacing.sm,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  avatarInitials: {
    fontSize: 32,
    fontWeight: fontWeight.bold as any,
    color: colors.white,
  },
  cloneBadge: {
    backgroundColor: '#7C3AED',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    position: 'absolute',
    top: 8,
    right: 8,
  },
  relationship: {
    color: colors.text.muted,
  },
  talkButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
  },
  talkButtonActive: {
    backgroundColor: colors.primary[700],
  },
  talkButtonText: {
    fontSize: 24,
    fontWeight: fontWeight.bold as any,
    color: colors.white,
  },
});
