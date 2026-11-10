
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import {
  AuthProvider,
  useAuth,
} from '../context/AuthContext';
import { LibraryProvider } from '../context/LibraryContext';
import { PlayerProvider } from '../context/PlayerContext';
import {
  ThemeProvider,
  useTheme,
} from '../context/ThemeContext';

function Routes() {
  const { user, loading } = useAuth();
  const { colors, isDark } = useTheme();

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: colors.background,
        }}
      >
        <ActivityIndicator
          color={colors.accent}
          size="large"
        />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        style={isDark ? 'light' : 'dark'}
      />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
          animation: 'fade',
        }}
      >
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" />

          <Stack.Screen
            name="now-playing"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
            }}
          />

          <Stack.Screen name="playlist/[id]" />
        </Stack.Protected>

        <Stack.Protected guard={!user}>
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="forgot-password" />
        </Stack.Protected>
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <LibraryProvider>
            <PlayerProvider>
              <Routes />
            </PlayerProvider>
          </LibraryProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
