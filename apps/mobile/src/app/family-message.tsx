import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../components/SafeText';
import { BigButton } from '../components/BigButton';
import { useVoice } from '../hooks/useVoice';
import { colors, spacing, layout, shadows } from '../constants/theme';

const FAMILY_MEMBERS = [
  { id: 'lisa', name: 'Lisa', relationship: 'Daughter' },
  { id: 'robert', name: 'Robert', relationship: 'Son' },
  { id: 'james', name: 'James', relationship: 'Son' },
  { id: 'emma', name: 'Emma', relationship: 'Granddaughter' },
];

const PREVIOUS_MESSAGES = [
  {
    from: 'Lisa',
    text: 'I love you, Mom! See you this weekend. \u{1F495}',
    date: 'Mar 31',
  },
  {
    from: 'Robert',
    text: 'Good morning, dear. Having a wonderful day.',
    date: 'Mar 30',
  },
  {
    from: 'Emma',
    text: 'Hi Grandma! I drew you a picture!',
    date: 'Mar 29',
  },
];

type MessageType = 'voice' | 'written';

export default function FamilyMessageScreen() {
  const router = useRouter();
  const { speakWarmly } = useVoice();
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<MessageType>('written');
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    if (messageType === 'voice') {
      speakWarmly('Your voice message has been saved and sent.');
    } else if (messageText.trim()) {
      speakWarmly('Your message has been sent with love.');
    } else {
      speakWarmly('Please write a message first.');
      return;
    }
    setMessageText('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <SafeText variant="h1" bold center style={styles.heading}>
          Leave a Message
        </SafeText>
        <SafeText variant="body" center color={colors.text.secondary} style={styles.subtitle}>
          Record a message for your loved one
        </SafeText>

        {/* Family member selector */}
        <SafeText variant="h3" bold style={styles.sectionTitle}>
          Choose family member
        </SafeText>
        <View style={styles.memberRow}>
          {FAMILY_MEMBERS.map((member) => (
            <TouchableOpacity
              key={member.id}
              style={[
                styles.memberCard,
                selectedMember === member.id && styles.memberCardSelected,
              ]}
              onPress={() => setSelectedMember(member.id)}
              activeOpacity={0.7}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedMember === member.id }}
              accessibilityLabel={`${member.name}, ${member.relationship}`}
            >
              <View
                style={[
                  styles.memberAvatar,
                  selectedMember === member.id && styles.memberAvatarSelected,
                ]}
              >
                <SafeText variant="h2" bold color={selectedMember === member.id ? '#FFFFFF' : colors.primary[500]}>
                  {member.name[0]}
                </SafeText>
              </View>
              <SafeText variant="body" bold center>
                {member.name}
              </SafeText>
              <SafeText variant="body" center color={colors.text.secondary} style={{ fontSize: 14 }}>
                {member.relationship}
              </SafeText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Message type selector */}
        <SafeText variant="h3" bold style={styles.sectionTitle}>
          Message type
        </SafeText>
        <View style={styles.typeRow}>
          <TouchableOpacity
            style={[styles.typeButton, messageType === 'voice' && styles.typeButtonSelected]}
            onPress={() => setMessageType('voice')}
            activeOpacity={0.7}
            accessibilityRole="radio"
            accessibilityState={{ selected: messageType === 'voice' }}
          >
            <SafeText
              variant="h3"
              bold
              center
              color={messageType === 'voice' ? '#FFFFFF' : colors.text.primary}
            >
              Voice Message
            </SafeText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.typeButton, messageType === 'written' && styles.typeButtonSelected]}
            onPress={() => setMessageType('written')}
            activeOpacity={0.7}
            accessibilityRole="radio"
            accessibilityState={{ selected: messageType === 'written' }}
          >
            <SafeText
              variant="h3"
              bold
              center
              color={messageType === 'written' ? '#FFFFFF' : colors.text.primary}
            >
              Written Message
            </SafeText>
          </TouchableOpacity>
        </View>

        {/* Message input */}
        {messageType === 'voice' ? (
          <View style={styles.voiceArea}>
            <View style={styles.micCircle}>
              <SafeText variant="display" center>
                {'\uD83C\uDF99'}
              </SafeText>
            </View>
            <SafeText variant="body" center color={colors.text.secondary}>
              Tap the microphone to start recording
            </SafeText>
          </View>
        ) : (
          <TextInput
            style={styles.textInput}
            placeholder="Write your message here..."
            placeholderTextColor={colors.text.muted}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            textAlignVertical="top"
            accessibilityLabel="Message text input"
            accessibilityHint="Type your message for your family member"
          />
        )}

        {/* Send button */}
        <BigButton
          title="Send Message"
          onPress={handleSend}
          variant="primary"
          accessibilityHint="Send your message to the selected family member"
        />

        {/* Previous messages */}
        <SafeText variant="h3" bold style={[styles.sectionTitle, { marginTop: spacing.xxl }]}>
          Previous Messages
        </SafeText>
        <View style={styles.messagesList}>
          {PREVIOUS_MESSAGES.map((msg, idx) => (
            <View key={idx} style={styles.messageCard}>
              <View style={styles.messageHeader}>
                <View style={styles.messageAvatarSmall}>
                  <SafeText variant="body" bold color="#FFFFFF">
                    {msg.from[0]}
                  </SafeText>
                </View>
                <SafeText variant="body" bold>
                  {msg.from}
                </SafeText>
                <SafeText variant="body" color={colors.text.muted} style={{ marginLeft: 'auto' }}>
                  {msg.date}
                </SafeText>
              </View>
              <SafeText variant="body" color={colors.text.primary} style={{ marginTop: spacing.sm }}>
                {msg.text}
              </SafeText>
            </View>
          ))}
        </View>

        {/* Back button */}
        <BigButton
          title="Back to Home"
          onPress={() => router.back()}
          variant="secondary"
          accessibilityHint="Go back to the home screen"
        />
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
  heading: {
    marginTop: spacing.xl,
    marginBottom: spacing.xs,
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    marginTop: spacing.lg,
  },
  memberRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  memberCard: {
    flex: 1,
    minWidth: 70,
    alignItems: 'center',
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.md,
    gap: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    ...shadows.card,
  },
  memberCardSelected: {
    borderColor: colors.primary[500],
    backgroundColor: '#E3F2FD',
  },
  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E3F2FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  memberAvatarSelected: {
    backgroundColor: colors.primary[500],
  },
  typeRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  typeButton: {
    flex: 1,
    padding: spacing.lg,
    borderRadius: layout.borderRadius,
    backgroundColor: colors.background.card,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.border.light,
    minHeight: 60,
    justifyContent: 'center',
  },
  typeButtonSelected: {
    backgroundColor: colors.primary[500],
    borderColor: colors.primary[500],
  },
  voiceArea: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    marginBottom: spacing.xl,
    gap: spacing.lg,
    ...shadows.card,
  },
  micCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFEBEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    fontSize: 24,
    color: colors.text.primary,
    height: 200,
    marginBottom: spacing.xl,
    borderWidth: 2,
    borderColor: colors.border.light,
    ...shadows.card,
  },
  messagesList: {
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  messageCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    ...shadows.card,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  messageAvatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
});
