
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import MiniPlayer from '../../components/MiniPlayer';
import { useTheme } from '../../context/ThemeContext';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  const tabHeight = 62 + insets.bottom;

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: colors.background,
      }}
    >
      <Tabs
        screenOptions={{
          headerShown: false,

          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.muted,

          tabBarStyle: {
            height: tabHeight,
            paddingBottom: insets.bottom + 5,
            paddingTop: 8,

            backgroundColor: isDark
              ? '#171020'
              : '#FFFFFF',

            borderTopColor: colors.border,
            borderTopWidth: 1,

            elevation: 0,
          },

          tabBarLabelStyle: {
            fontSize: 10,
            fontWeight: '700',
            marginTop: 2,
          },

          tabBarIconStyle: {
            marginBottom: 1,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Listen',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="musical-notes"
                size={size}
                color={typeof color === 'string' ? color : '#A69BB8'}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="search"
                size={size}
                color={typeof color === 'string' ? color : '#A69BB8'}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="albums"
                size={size}
                color={typeof color === 'string' ? color : '#A69BB8'}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => (
              <Ionicons
                name="person"
                size={size}
                color={typeof color === 'string' ? color : '#A69BB8'}
              />
            ),
          }}
        />
      </Tabs>

      <MiniPlayer bottom={tabHeight} />
    </View>
  );
}
