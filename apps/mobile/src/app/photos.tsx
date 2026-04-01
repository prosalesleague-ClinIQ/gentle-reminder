import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../components/SafeText';
import { BigButton } from '../components/BigButton';
import { HomeButton } from '../components/HomeButton';
import { colors, spacing, layout, shadows } from '../constants/theme';

const DEMO_PHOTOS = [
  { id: '1', label: 'Our Wedding', date: 'June 1975', color: '#E8D5B7' },
  { id: '2', label: 'Lisa as a Baby', date: '1978', color: '#B7D5E8' },
  { id: '3', label: 'Christmas 1985', date: 'December 1985', color: '#D5E8B7' },
  { id: '4', label: 'My Garden', date: 'Summer 2020', color: '#E8B7D5' },
  { id: '5', label: 'Family Reunion', date: 'July 2019', color: '#B7E8D5' },
  { id: '6', label: 'Robert and Me', date: '2010', color: '#D5B7E8' },
];

export default function PhotosScreen() {
  const [selected, setSelected] = useState<typeof DEMO_PHOTOS[0] | null>(null);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <SafeText variant="h1" bold style={styles.title}>Photo Album</SafeText>
        <SafeText variant="body" color={colors.text.secondary} style={styles.subtitle}>
          Your precious memories
        </SafeText>
        <View style={styles.grid}>
          {DEMO_PHOTOS.map((photo) => (
            <TouchableOpacity
              key={photo.id}
              style={styles.photoCard}
              onPress={() => setSelected(photo)}
              activeOpacity={0.7}
              accessibilityLabel={`Photo: ${photo.label}`}
            >
              <View style={[styles.photoPlaceholder, { backgroundColor: photo.color }]}>
                <SafeText variant="h1" center color={colors.white}>{photo.label[0]}</SafeText>
              </View>
              <SafeText variant="body" bold center numberOfLines={1}>{photo.label}</SafeText>
              <SafeText variant="body" center color={colors.text.muted}>{photo.date}</SafeText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <HomeButton />

      <Modal visible={!!selected} animationType="fade" transparent onRequestClose={() => setSelected(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selected && (
              <>
                <View style={[styles.photoLarge, { backgroundColor: selected.color }]}>
                  <SafeText variant="display" center color={colors.white}>{selected.label[0]}</SafeText>
                </View>
                <SafeText variant="h2" center bold>{selected.label}</SafeText>
                <SafeText variant="bodyLarge" center color={colors.text.secondary}>{selected.date}</SafeText>
                <BigButton title="Close" onPress={() => setSelected(null)} variant="accent" style={styles.closeBtn} />
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background.warm },
  scrollContent: { padding: layout.screenPadding, paddingBottom: 120 },
  title: { marginBottom: spacing.xs },
  subtitle: { marginBottom: spacing.xl },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.lg, justifyContent: 'space-between' },
  photoCard: {
    width: '47%', backgroundColor: colors.background.card,
    borderRadius: layout.borderRadius, padding: spacing.md,
    alignItems: 'center', gap: spacing.sm, ...shadows.card,
  },
  photoPlaceholder: {
    width: '100%', aspectRatio: 1, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  },
  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center', padding: layout.screenPadding,
  },
  modalContent: {
    backgroundColor: colors.background.card, borderRadius: layout.borderRadius,
    padding: spacing.xxl, alignItems: 'center', gap: spacing.lg,
  },
  photoLarge: {
    width: 250, height: 250, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
  },
  closeBtn: { marginTop: spacing.md, width: '100%' },
});
