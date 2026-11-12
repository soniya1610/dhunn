
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { resetPassword } = useAuth();
  const { colors } = useTheme();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email.trim()) {
      Alert.alert('Missing email', 'Please enter your registered email.');
      return;
    }

    try {
      setLoading(true);

      const error = await resetPassword(email.trim());

      if (error) {
        Alert.alert('Reset failed', error);
        return;
      }

      Alert.alert(
        'Reset link sent',
        'Check your email inbox for the password reset link. Follow the instructions to create a new password.',
        [
          {
            text: 'Go to Login',
            onPress: () => router.replace('/login'),
          },
        ]
      );
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = [
    styles.inputContainer,
    {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
  ];

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: insets.top + 15,
            paddingBottom: insets.bottom + 30,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <Pressable
          style={[styles.backButton, { backgroundColor: colors.surface }]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>

        <View style={styles.content}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: 'rgba(173,130,255,0.15)' },
            ]}
          >
            <Ionicons
              name="lock-open-outline"
              size={37}
              color={colors.accent}
            />
          </View>

          <Text style={[styles.eyebrow, { color: colors.accent }]}>
            ACCOUNT RECOVERY
          </Text>

          <Text style={[styles.title, { color: colors.text }]}>
            Reset Password
          </Text>

          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Enter your registered email address. We'll send you a link to
            securely reset your password.
          </Text>

          <Text style={[styles.label, { color: colors.text }]}>
            EMAIL ADDRESS
          </Text>

          <View style={inputStyle}>
            <Ionicons name="mail-outline" size={20} color={colors.muted} />

            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Enter your registered email"
              placeholderTextColor={colors.muted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleReset}
            />
          </View>

          <Pressable
            style={[
              styles.resetButton,
              { backgroundColor: colors.accent },
              loading && styles.disabledButton,
            ]}
            onPress={handleReset}
            disabled={loading}
          >
            <Text style={styles.resetButtonText}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </Text>

            {!loading && (
              <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
            )}
          </Pressable>

          <Pressable
            style={styles.loginButton}
            onPress={() => router.replace('/login')}
          >
            <Text style={[styles.loginText, { color: colors.accent }]}>
              Back to Login
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 35,
  },
  iconContainer: {
    width: 75,
    height: 75,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  title: {
    fontSize: 29,
    fontWeight: '900',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 25,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 9,
    marginTop: 16,
  },
  inputContainer: {
    minHeight: 54,
    borderRadius: 15,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 12,
  },
  input: {
    flex: 1,
    fontSize: 13,
    height: 54,
  },
  resetButton: {
    minHeight: 55,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 28,
  },
  disabledButton: {
    opacity: 0.6,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  loginButton: {
    alignItems: 'center',
    padding: 18,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '800',
  },
});
