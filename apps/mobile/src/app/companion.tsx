import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../components/SafeText';
import { VoicePrompt } from '../components/VoicePrompt';
import { VoiceNavWrapper } from '../components/VoiceNavWrapper';
import { conversationBridge } from '../services/ConversationBridge';
import { aiCompanion } from '../services/AICompanion';
import { colors, spacing, layout, shadows } from '../constants/theme';

/**
 * AI Companion Chat Screen.
 *
 * A warm, conversational interface where the patient can talk to their
 * AI companion. The companion responds with empathy, remembers family
 * context, provides orientation cues, and detects confusion/fatigue.
 *
 * All responses are spoken aloud. The patient can type or (in future)
 * speak their messages.
 */

interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: string;
  emotion?: string;
}

export default function CompanionScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Start conversation on mount
  useEffect(() => {
    (async () => {
      setIsSpeaking(true);
      const greeting = await conversationBridge.startConversation();
      setMessages([{
        id: '0',
        role: 'agent',
        content: greeting,
        timestamp: new Date().toISOString(),
      }]);
      setIsSpeaking(false);
    })();

    return () => {
      aiCompanion.stop();
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || isLoading) return;

    setInputText('');
    setIsLoading(true);

    // Add user message
    const userMsg: ChatMessage = {
      id: String(messages.length),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Get AI response
    setIsSpeaking(true);
    const turn = await conversationBridge.sendMessage(text);

    const agentMsg: ChatMessage = {
      id: String(messages.length + 1),
      role: 'agent',
      content: turn.agentResponse,
      timestamp: new Date().toISOString(),
      emotion: turn.emotionDetected,
    };
    setMessages((prev) => [...prev, agentMsg]);
    setIsSpeaking(false);
    setIsLoading(false);
  }, [inputText, isLoading, messages.length]);

  const handleQuickReply = useCallback(async (text: string) => {
    setInputText('');
    setIsLoading(true);

    const userMsg: ChatMessage = {
      id: String(messages.length),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    setIsSpeaking(true);
    const turn = await conversationBridge.sendMessage(text);

    const agentMsg: ChatMessage = {
      id: String(messages.length + 1),
      role: 'agent',
      content: turn.agentResponse,
      timestamp: new Date().toISOString(),
      emotion: turn.emotionDetected,
    };
    setMessages((prev) => [...prev, agentMsg]);
    setIsSpeaking(false);
    setIsLoading(false);
  }, [messages.length]);

  const handleEnd = useCallback(async () => {
    setIsSpeaking(true);
    const farewell = await conversationBridge.endConversation();
    setMessages((prev) => [...prev, {
      id: String(prev.length),
      role: 'agent',
      content: farewell,
      timestamp: new Date().toISOString(),
    }]);
    setIsSpeaking(false);
    setTimeout(() => router.back(), 3000);
  }, [router]);

  return (
    <VoiceNavWrapper screenName="companion">
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={100}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
              accessibilityLabel="Go back"
            >
              <SafeText variant="h3" color={colors.primary[500]}>Back</SafeText>
            </TouchableOpacity>
            <SafeText variant="h2" bold>AI Companion</SafeText>
            <VoicePrompt isSpeaking={isSpeaking} label="" />
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollRef}
            style={styles.messageList}
            contentContainerStyle={styles.messageContent}
            showsVerticalScrollIndicator={false}
          >
            {messages.map((msg) => (
              <View
                key={msg.id}
                style={[
                  styles.messageBubble,
                  msg.role === 'user' ? styles.userBubble : styles.agentBubble,
                ]}
              >
                {msg.role === 'agent' && (
                  <SafeText variant="caption" color={colors.text.muted} style={styles.senderLabel}>
                    Companion
                  </SafeText>
                )}
                <SafeText
                  variant="body"
                  color={msg.role === 'user' ? '#FFFFFF' : colors.text.primary}
                >
                  {msg.content}
                </SafeText>
              </View>
            ))}

            {isLoading && (
              <View style={[styles.messageBubble, styles.agentBubble]}>
                <SafeText variant="body" color={colors.text.muted}>
                  Thinking...
                </SafeText>
              </View>
            )}
          </ScrollView>

          {/* Quick Replies */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.quickReplies}
            contentContainerStyle={styles.quickRepliesContent}
          >
            {['Tell me about my family', 'What day is it?', 'I feel confused', 'Tell me a story', 'I need help'].map((text) => (
              <TouchableOpacity
                key={text}
                style={styles.quickReply}
                onPress={() => handleQuickReply(text)}
                accessibilityLabel={text}
              >
                <SafeText variant="caption" bold color={colors.primary[500]}>{text}</SafeText>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Input Area */}
          <View style={styles.inputRow}>
            <TextInput
              style={styles.textInput}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor={colors.text.muted}
              onSubmitEditing={handleSend}
              returnKeyType="send"
              editable={!isLoading}
              accessibilityLabel="Type your message"
            />
            <TouchableOpacity
              style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
              onPress={handleSend}
              disabled={!inputText.trim() || isLoading}
              accessibilityLabel="Send message"
            >
              <SafeText variant="h3" bold color="#FFFFFF">Send</SafeText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.endButton}
              onPress={handleEnd}
              accessibilityLabel="End conversation"
            >
              <SafeText variant="caption" bold color="#DC2626">End</SafeText>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </VoiceNavWrapper>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#FFF8E1' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
  },
  backButton: { padding: spacing.sm },
  messageList: { flex: 1 },
  messageContent: { padding: spacing.lg, paddingBottom: spacing.xxl },
  messageBubble: {
    maxWidth: '85%',
    borderRadius: 20,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  userBubble: {
    backgroundColor: colors.primary[500],
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  agentBubble: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
    ...shadows.card,
  },
  senderLabel: { marginBottom: 4 },
  quickReplies: { maxHeight: 50, flexGrow: 0 },
  quickRepliesContent: { paddingHorizontal: spacing.lg, gap: spacing.sm },
  quickReply: {
    backgroundColor: '#EDE9FE',
    borderRadius: 20,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    height: 40,
    justifyContent: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
    backgroundColor: '#FFFFFF',
    gap: spacing.sm,
  },
  textInput: {
    flex: 1,
    height: 56,
    backgroundColor: '#F9FAFB',
    borderRadius: 28,
    paddingHorizontal: spacing.lg,
    fontSize: 18,
    color: colors.text.primary,
  },
  sendButton: {
    height: 56,
    paddingHorizontal: spacing.xl,
    backgroundColor: colors.primary[500],
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendButtonDisabled: { opacity: 0.5 },
  endButton: {
    height: 56,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
