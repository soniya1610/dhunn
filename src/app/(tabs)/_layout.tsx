
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import MiniPlayer from '../../components/MiniPlayer';
import { useTheme } from '../../context/ThemeContext';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const tabHeight = 58 + insets.bottom;
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.accent,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            height: tabHeight,
            paddingBottom: insets.bottom + 4,
            paddingTop: 6,
            borderTopColor: colors.border,
            backgroundColor: colors.background,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
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
                color={typeof color === 'number' ? '#6B6B70' : color ?? '#6B6B70'} />
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
                color={typeof color === 'number' ? '#6B6B70' : color ?? '#6B6B70'} />
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
                color={typeof color === 'number' ? '#6B6B70' : color ?? '#6B6B70'} />
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
                color={typeof color === 'number' ? '#6B6B70' : color ?? '#6B6B70'} />
            ),
          }}
        />
      </Tabs>

      <MiniPlayer bottom={tabHeight} />
    </View>
  );
}
