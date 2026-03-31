import React, { useEffect, useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../components/SafeText';
import { PhotoCard } from '../../components/PhotoCard';
import { BigButton } from '../../components/BigButton';
import { VoicePrompt } from '../../components/VoicePrompt';
import { useVoice } from '../../hooks/useVoice';
import { colors, spacing, layout } from '../../constants/theme';

/**
 * Family Connections screen.
 * Grid of family photos - tap to see details and play voice messages.
 */
interface DemoFamilyMember {
  id: string;
  displayName: string;
  relationship: string;
  photoUrl?: string;
  voiceMessageUrl?: string;
  isActive: boolean;
  message: string;
}

const DEMO_FAMILY: DemoFamilyMember[] = [
  { id: '1', displayName: 'Lisa', relationship: 'Daughter', isActive: true, message: 'Lisa sends her love! \u{1F495}' },
  { id: '2', displayName: 'Robert', relationship: 'Spouse', isActive: true, message: 'Robert is thinking of you! \u{1F49B}' },
  { id: '3', displayName: 'Emma', relationship: 'Grandchild', isActive: true, message: 'Emma drew you a picture! \u{1F308}' },
  { id: '4', displayName: 'James', relationship: 'Son', isActive: true, message: 'James says hello from work! \u{1F44B}' },
];

export default function FamilyScreen() {
  const { speak, isSpeaking } = useVoice();
  const [selectedMember, setSelectedMember] = useState<DemoFamilyMember | null>(null);

  useEffect(() => {
    speak('Here are your family and friends.');
  }, []);

  const handleMemberPress = useCallback((member: DemoFamilyMember) => {
    setSelectedMember(member);
    speak(`This is ${member.displayName}, your ${member.relationship}.`);
  }, [speak]);

  const closeModal = useCallback(() => {
    setSelectedMember(null);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SafeText variant="h1" bold style={styles.title}>
          Your Family
        </SafeText>
        <VoicePrompt isSpeaking={isSpeaking} label="Speaking..." />

        <View style={styles.grid}>
          {DEMO_FAMILY.filter((m) => m.isActive).map((member) => (
            <PhotoCard
              key={member.id}
              photoUrl={member.photoUrl}
              name={member.displayName}
              subtitle={member.relationship}
              size={160}
              onPress={() => handleMemberPress(member)}
            />
          ))}
        </View>
      </ScrollView>

      {/* Family member detail modal */}
      <Modal
        visible={!!selectedMember}
        animationType="slide"
        transparent
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedMember && (
              <>
                <PhotoCard
                  photoUrl={selectedMember.photoUrl}
                  name={selectedMember.displayName}
                  subtitle={selectedMember.relationship}
                  size={200}
                />

                <SafeText variant="subheading" bold center>
                  {selectedMember.displayName} — {selectedMember.relationship}
                </SafeText>

                <SafeText variant="body" center style={styles.modalMessage}>
                  {selectedMember.message}
                </SafeText>

                <BigButton
                  title="Close"
                  onPress={closeModal}
                  variant="primary"
                  style={styles.modalButton}
                />
              </>
            )}
          </View>
        </View>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xxxl,
  },
  emptyContainer: {
    paddingVertical: spacing.xxxl,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xl,
    justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: layout.screenPadding,
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius,
    padding: spacing.xxl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    gap: spacing.xl,
  },
  modalMessage: {
    paddingHorizontal: spacing.lg,
  },
  modalButton: {
    width: '100%',
  },
});
