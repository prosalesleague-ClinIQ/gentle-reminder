import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SafeText } from '../components/SafeText';
import { BigButton } from '../components/BigButton';
import { colors, spacing, layout, shadows } from '../constants/theme';

interface Contact {
  id: string;
  name: string;
  role: string;
  phone: string;
  badgeColor: string;
}

const DEMO_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Sarah Mitchell',
    role: 'Primary Caregiver',
    phone: '555-0100',
    badgeColor: '#4CAF50',
  },
  {
    id: '2',
    name: 'Lisa Thompson',
    role: 'Daughter',
    phone: '555-0123',
    badgeColor: '#2196F3',
  },
  {
    id: '3',
    name: 'Dr. David Chen',
    role: 'Neurologist',
    phone: '555-0200',
    badgeColor: '#9C27B0',
  },
];

export default function ContactsScreen() {
  const router = useRouter();
  const [callingId, setCallingId] = useState<string | null>(null);

  const handleCall = (contact: Contact) => {
    setCallingId(contact.id);
    // In demo mode, just show "Calling..." for 2 seconds
    setTimeout(() => setCallingId(null), 2000);
  };

  const handleAddContact = () => {
    if (Platform.OS === 'web') {
      alert('Demo Mode: Add Contact form would open here.');
    } else {
      Alert.alert('Demo Mode', 'Add Contact form would open here.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SafeText variant="display" bold center color={colors.primary[500]} style={styles.heading}>
          Emergency Contacts
        </SafeText>
        <SafeText variant="body" center color={colors.text.secondary} style={styles.subheading}>
          People who can help you anytime
        </SafeText>

        {DEMO_CONTACTS.map((contact) => (
          <View key={contact.id} style={styles.contactCard}>
            {/* Avatar */}
            <View style={[styles.avatar, { backgroundColor: contact.badgeColor }]}>
              <SafeText variant="h3" bold color="#FFFFFF">
                {contact.name.split(' ').map((n) => n[0]).join('')}
              </SafeText>
            </View>

            {/* Info */}
            <View style={styles.contactInfo}>
              <SafeText variant="h3" bold>
                {contact.name}
              </SafeText>
              <View style={[styles.roleBadge, { backgroundColor: contact.badgeColor + '20' }]}>
                <SafeText variant="body" bold color={contact.badgeColor}>
                  {contact.role}
                </SafeText>
              </View>
              <SafeText variant="body" color={colors.text.secondary} style={styles.phone}>
                {contact.phone}
              </SafeText>
            </View>

            {/* Call Button */}
            <View style={styles.callButtonContainer}>
              {callingId === contact.id ? (
                <View style={styles.callingBadge}>
                  <SafeText variant="body" bold color="#FFFFFF">
                    Calling...
                  </SafeText>
                </View>
              ) : (
                <BigButton
                  title="Call"
                  onPress={() => handleCall(contact)}
                  variant="primary"
                  style={styles.callButton}
                  accessibilityHint={`Call ${contact.name}`}
                />
              )}
            </View>
          </View>
        ))}

        {/* Add Contact */}
        <View style={styles.addContainer}>
          <BigButton
            title="Add Contact"
            onPress={handleAddContact}
            variant="accent"
            accessibilityHint="Add a new emergency contact"
          />
        </View>

        {/* Back */}
        <View style={styles.backContainer}>
          <BigButton
            title="Back to Settings"
            onPress={() => router.back()}
            variant="secondary"
            accessibilityHint="Go back to settings screen"
          />
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
  heading: {
    marginTop: spacing.lg,
  },
  subheading: {
    marginTop: spacing.sm,
    marginBottom: spacing.xl,
  },
  contactCard: {
    backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.card,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: 12,
  },
  phone: {
    marginTop: spacing.xs,
  },
  callButtonContainer: {
    minWidth: 90,
    alignItems: 'center',
  },
  callButton: {
    minHeight: 56,
    paddingHorizontal: spacing.lg,
  },
  callingBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: layout.borderRadius,
  },
  addContainer: {
    marginTop: spacing.lg,
  },
  backContainer: {
    marginTop: spacing.lg,
  },
});
