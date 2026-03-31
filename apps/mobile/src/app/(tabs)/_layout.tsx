import React from 'react';
import { Tabs } from 'expo-router';
import { Text, StyleSheet } from 'react-native';
import { colors, fontSize, fontWeight, spacing } from '../../constants/theme';

/**
 * Tab navigator with Home, Family, and Stories tabs.
 * Uses large icons and text for elderly users.
 */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.primary[500],
        tabBarInactiveTintColor: colors.text.muted,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIconStyle: styles.tabIcon,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.icon, focused && styles.iconActive]}>{'🏠'}</Text>
          ),
          tabBarAccessibilityLabel: 'Home tab',
        }}
      />
      <Tabs.Screen
        name="family"
        options={{
          title: 'Family',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.icon, focused && styles.iconActive]}>{'👨‍👩‍👧‍👦'}</Text>
          ),
          tabBarAccessibilityLabel: 'Family connections tab',
        }}
      />
      <Tabs.Screen
        name="stories"
        options={{
          title: 'Stories',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.icon, focused && styles.iconActive]}>{'📖'}</Text>
          ),
          tabBarAccessibilityLabel: 'Stories and memories tab',
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.icon, focused && styles.iconActive]}>{'📊'}</Text>
          ),
          tabBarAccessibilityLabel: 'Session history tab',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <Text style={[styles.icon, focused && styles.iconActive]}>{'⚙️'}</Text>
          ),
          tabBarAccessibilityLabel: 'Settings and accessibility',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 100,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border.light,
  },
  tabLabel: {
    fontSize: 20,
    fontWeight: fontWeight.semibold,
  },
  tabIcon: {
    marginBottom: 2,
  },
  icon: {
    fontSize: 32,
    opacity: 0.6,
  },
  iconActive: {
    opacity: 1,
  },
});
