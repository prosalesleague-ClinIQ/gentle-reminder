import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TextInput, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { SafeText } from '../components/SafeText';
import { BigButton } from '../components/BigButton';
import { colors, fontSize, spacing, layout } from '../constants/theme';

/**
 * Patient Profile Edit Screen
 * Allows patients to view and edit their personal information.
 * Uses demo state (no API calls) with pre-filled values.
 * All inputs are large (80px height, 24pt text) for accessibility.
 */
export default function ProfileScreen() {
  const router = useRouter();
  const [name, setName] = useState('Maggie');
  const [city, setCity] = useState('Portland');
  const [emergencyContact, setEmergencyContact] = useState('Lisa Thompson');
  const [emergencyPhone, setEmergencyPhone] = useState('555-0123');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    if (Platform.OS === 'web') {
      // Web fallback: just show the saved state
    } else {
      Alert.alert('Saved!', 'Your profile has been updated.');
    }
    setTimeout(() => setSaved(false), 2000);
  };

  const initial = name.charAt(0).toUpperCase() || 'M';

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SafeText variant="display" bold center color={colors.primary[500]} style={styles.heading}>
          My Profile
        </SafeText>

        {/* Profile Photo Placeholder */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <SafeText variant="display" bold center color={colors.text.inverse}>
              {initial}
            </SafeText>
          </View>
        </View>

        {/* Preferred Name */}
        <View style={styles.fieldContainer}>
          <SafeText variant="bodyLarge" bold style={styles.label}>
            Preferred Name
          </SafeText>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Your preferred name"
            placeholderTextColor={colors.text.muted}
            accessibilityLabel="Preferred Name"
            accessibilityHint="Enter your preferred name"
          />
        </View>

        {/* City */}
        <View style={styles.fieldContainer}>
          <SafeText variant="bodyLarge" bold style={styles.label}>
            City
          </SafeText>
          <TextInput
            style={styles.input}
            value={city}
            onChangeText={setCity}
            placeholder="Your city"
            placeholderTextColor={colors.text.muted}
            accessibilityLabel="City"
            accessibilityHint="Enter your city"
          />
        </View>

        {/* Emergency Contact */}
        <View style={styles.fieldContainer}>
          <SafeText variant="bodyLarge" bold style={styles.label}>
            Emergency Contact
          </SafeText>
          <TextInput
            style={styles.input}
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            placeholder="Emergency contact name"
            placeholderTextColor={colors.text.muted}
            accessibilityLabel="Emergency Contact"
            accessibilityHint="Enter your emergency contact name"
          />
        </View>

        {/* Emergency Phone */}
        <View style={styles.fieldContainer}>
          <SafeText variant="bodyLarge" bold style={styles.label}>
            Emergency Phone
          </SafeText>
          <TextInput
            style={styles.input}
            value={emergencyPhone}
            onChangeText={setEmergencyPhone}
            placeholder="Emergency phone number"
            placeholderTextColor={colors.text.muted}
            keyboardType="phone-pad"
            accessibilityLabel="Emergency Phone"
            accessibilityHint="Enter your emergency contact phone number"
          />
        </View>

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <BigButton
            title={saved ? 'Saved!' : 'Save Changes'}
            onPress={handleSave}
            variant={saved ? 'secondary' : 'primary'}
            accessibilityLabel="Save Changes"
            accessibilityHint="Saves your profile information"
          />
        </View>

        {saved && (
          <SafeText variant="bodyLarge" bold center color={colors.secondary[500]} style={styles.savedMessage}>
            Your changes have been saved.
          </SafeText>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  scrollContent: {
    flexGrow: 1,
    padding: layout.screenPadding,
    paddingBottom: spacing.xxxl,
  },
  heading: {
    marginBottom: spacing.xl,
    marginTop: spacing.lg,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldContainer: {
    marginBottom: spacing.lg,
  },
  label: {
    marginBottom: spacing.sm,
  },
  input: {
    height: 80,
    fontSize: 24,
    backgroundColor: colors.white,
    borderRadius: layout.buttonBorderRadius,
    borderWidth: 1,
    borderColor: colors.border.light,
    paddingHorizontal: spacing.lg,
    color: colors.text.primary,
  },
  saveContainer: {
    marginTop: spacing.xl,
  },
  savedMessage: {
    marginTop: spacing.lg,
  },
});
