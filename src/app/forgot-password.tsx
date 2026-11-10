
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
import { useAuth } from '../context/AuthContext';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = async () => {
    if (!email.trim() || !password || !confirmPassword) {
      Alert.alert('Missing fields', 'Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Invalid password', 'Password must contain at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Both passwords must match.');
      return;
    }

    try {
      setLoading(true);

      const error = await resetPassword(email, password);

      if (error) {
        Alert.alert('Reset failed', error);
        return;
      }

      Alert.alert(
        'Password updated',
        'Your password has been changed successfully.',
        [{ text: 'Go to Login', onPress: () => router.replace('/login') }]
      );
    } catch {
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={23} color="#FFFFFF" />
        </Pressable>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            <Ionicons name="lock-open-outline" size={38} color="#B58CFF" />
          </View>

          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your registered email and create a new password.
          </Text>

          <Text style={styles.label}>Email Address</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#A9A0B8" />
            <TextInput
              style={styles.input}
              placeholder="Enter your registered email"
              placeholderTextColor="#817A90"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
            />
          </View>

          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#A9A0B8" />
            <TextInput
              style={styles.input}
              placeholder="Enter new password"
              placeholderTextColor="#817A90"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              returnKeyType="next"
            />
            <Pressable onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={21}
                color="#A9A0B8"
              />
            </Pressable>
          </View>

          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#A9A0B8" />
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              placeholderTextColor="#817A90"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={handleReset}
            />
          </View>

          <Pressable
            style={[styles.resetButton, loading && styles.disabledButton]}
            onPress={handleReset}
            disabled={loading}
          >
            <Text style={styles.resetButtonText}>
              {loading ? 'Updating...' : 'Reset Password'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.loginButton}
            onPress={() => router.replace('/login')}
          >
            <Text style={styles.loginText}>Back to Login</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#100C1B',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 55,
    paddingBottom: 35,
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#241B35',
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
    backgroundColor: '#2B2042',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '700',
    marginBottom: 10,
  },
  subtitle: {
    color: '#A9A0B8',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 30,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 9,
    marginTop: 17,
  },
  inputContainer: {
    height: 55,
    borderRadius: 14,
    backgroundColor: '#211A30',
    borderWidth: 1,
    borderColor: '#382C4D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    gap: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    height: '100%',
  },
  resetButton: {
    height: 55,
    borderRadius: 15,
    backgroundColor: '#9561E9',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  disabledButton: {
    opacity: 0.6,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  loginButton: {
    alignItems: 'center',
    padding: 18,
  },
  loginText: {
    color: '#B58CFF',
    fontSize: 14,
    fontWeight: '600',
  },
});
