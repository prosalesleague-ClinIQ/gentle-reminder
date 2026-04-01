import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeText } from '../../components/SafeText';
import { colors, spacing, layout, shadows } from '../../constants/theme';

const DEMO_ACTIVITIES = [
  { time: '8:15 AM', type: 'medication', label: 'Took Donepezil 10mg', icon: '💊', color: '#3D8158' },
  { time: '8:30 AM', type: 'orientation', label: 'Morning orientation completed', icon: '🌅', color: '#1A7BC4' },
  { time: '9:00 AM', type: 'session', label: 'Cognitive session - Score 82%', icon: '🧠', color: '#7C4DFF' },
  { time: '10:15 AM', type: 'story', label: 'Recorded a new story', icon: '📖', color: '#E5A300' },
  { time: '11:00 AM', type: 'family', label: 'Listened to message from Lisa', icon: '💕', color: '#E91E63' },
  { time: '12:00 PM', type: 'medication', label: 'Took Memantine 5mg', icon: '💊', color: '#3D8158' },
  { time: '12:30 PM', type: 'mood', label: 'Mood check-in: Happy 😊', icon: '😊', color: '#3D8158' },
  { time: '2:00 PM', type: 'game', label: 'Brain game - Reaction Time', icon: '🎮', color: '#1A7BC4' },
  { time: '3:00 PM', type: 'family', label: 'Lisa visited', icon: '👨‍👩‍👧', color: '#E91E63' },
  { time: '4:30 PM', type: 'walk', label: 'Afternoon walk - 1,200 steps', icon: '🚶', color: '#3D8158' },
];

export default function ActivityScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <SafeText variant="h1" bold>Today's Activity</SafeText>
        <SafeText variant="body" color={colors.text.secondary} style={{ marginBottom: spacing.xl }}>
          Tuesday, March 31, 2026
        </SafeText>

        <View style={styles.timeline}>
          {DEMO_ACTIVITIES.map((activity, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timeColumn}>
                <SafeText variant="body" color={colors.text.muted}>{activity.time}</SafeText>
              </View>
              <View style={styles.dotColumn}>
                <View style={[styles.dot, { backgroundColor: activity.color }]} />
                {index < DEMO_ACTIVITIES.length - 1 && <View style={styles.line} />}
              </View>
              <View style={styles.cardColumn}>
                <View style={styles.activityCard}>
                  <SafeText variant="body">{activity.icon} {activity.label}</SafeText>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background.warm },
  content: { padding: layout.screenPadding, paddingBottom: 120 },
  timeline: { gap: 0 },
  timelineItem: { flexDirection: 'row', minHeight: 70 },
  timeColumn: { width: 80, paddingTop: 4 },
  dotColumn: { width: 30, alignItems: 'center' },
  dot: { width: 14, height: 14, borderRadius: 7, marginTop: 6 },
  line: { width: 2, flex: 1, backgroundColor: colors.border.light, marginVertical: 4 },
  cardColumn: { flex: 1, paddingLeft: spacing.md, paddingBottom: spacing.md },
  activityCard: {
    backgroundColor: colors.background.card, borderRadius: 10,
    padding: spacing.lg, ...shadows.card,
  },
});
