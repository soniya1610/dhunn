
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import {
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
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { signIn } = useAuth();
  const { isDark, colors } = useTheme();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const background = isDark ? '#100B20' : '#F7EEFF';
  const card = isDark ? '#211832' : '#FFFFFF';
  const inputBackground = isDark ? '#191329' : '#F8F3FC';
  const textColor = isDark ? '#FFFFFF' : '#241735';
  const mutedColor = isDark ? '#B8AFC9' : '#81758F';

  const submit = async () => {
    if (busy) return;

    setBusy(true);
    setError('');

    try {
      const err = await signIn(email.trim(), password);
      if (err) setError(err);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={[
          styles.orb,
          styles.orbTop,
          { backgroundColor: isDark ? '#7138A8' : '#D9B5FF' },
        ]}
      />
      <View
        style={[
          styles.orb,
          styles.orbBottom,
          { backgroundColor: isDark ? '#43266F' : '#FFC9E8' },
        ]}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + 30,
            paddingBottom: insets.bottom + 30,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topLabel}>
          <Ionicons name="sparkles" size={13} color="#DDA4FF" />
          <Text style={styles.topLabelText}>YOUR SOUND. YOUR MOOD.</Text>
        </View>

        <View style={styles.logoWrap}>
          <View style={styles.logo}>
            <Ionicons name="musical-notes" size={34} color="#FFFFFF" />
          </View>
          <View style={styles.logoSparkle}>
            <Ionicons name="sparkles" size={18} color="#FFD1F1" />
          </View>
        </View>

        <Text style={[styles.brand, { color: textColor }]}>Dhunn</Text>

        <Text style={[styles.heading, { color: textColor }]}>
          Welcome{'\n'}back.
        </Text>

        <Text style={[styles.subtitle, { color: mutedColor }]}>
          Your music, your mood, your little escape.
        </Text>

        <View
          style={[
            styles.formCard,
            { backgroundColor: card, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.formTitle, { color: textColor }]}>
            Sign in to your world
          </Text>
          <Text style={[styles.formSubtitle, { color: mutedColor }]}>
            Pick up right where the music left off.
          </Text>

          <Text style={[styles.fieldLabel, { color: textColor }]}>
            EMAIL ADDRESS
          </Text>
          <View
            style={[
              styles.inputWrap,
              { backgroundColor: inputBackground, borderColor: colors.border },
            ]}
          >
            <Ionicons name="mail-outline" size={19} color={mutedColor} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={mutedColor}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              returnKeyType="next"
              style={[styles.input, { color: textColor }]}
            />
          </View>

          <Text style={[styles.fieldLabel, { color: textColor }]}>
            PASSWORD
          </Text>
          <View
            style={[
              styles.inputWrap,
              { backgroundColor: inputBackground, borderColor: colors.border },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={19}
              color={mutedColor}
            />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={mutedColor}
              secureTextEntry={!showPassword}
              returnKeyType="done"
              onSubmitEditing={submit}
              style={[styles.input, { color: textColor }]}
            />
            <Pressable onPress={() => setShowPassword((v) => !v)} hitSlop={10}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={mutedColor}
              />
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.push('/forgot-password')}
            style={styles.forgotButton}
          >
            <Text style={styles.forgotText}>Forgot password?</Text>
          </Pressable>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={submit}
            disabled={busy}
            accessibilityRole="button"
            style={({ pressed }) => [
              styles.button,
              { opacity: busy ? 0.6 : pressed ? 0.85 : 1 },
            ]}
          >
            <Text style={styles.buttonText}>
              {busy ? 'Signing in...' : 'Let me in'}
            </Text>
            {!busy && (
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            )}
          </Pressable>

          <Text style={[styles.switchText, { color: mutedColor }]}>
            New to Dhunn?{' '}
            <Link href="/signup" style={styles.link}>
              Create an account
            </Link>
          </Text>
        </View>

        <View style={styles.footer}>
          <Ionicons name="headset-outline" size={15} color={mutedColor} />
          <Text style={[styles.footerText, { color: mutedColor }]}>
            Made for the moments that matter.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 25,
    alignItems: 'center',
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.2,
  },
  orbTop: {
    width: 230,
    height: 230,
    top: -100,
    right: -90,
  },
  orbBottom: {
    width: 260,
    height: 260,
    bottom: -100,
    left: -130,
  },
  topLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 30,
    backgroundColor: 'rgba(173,103,225,0.16)',
  },
  topLabelText: {
    color: '#DDA4FF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  logoWrap: {
    marginTop: 30,
    position: 'relative',
  },
  logo: {
    width: 76,
    height: 76,
    borderRadius: 27,
    backgroundColor: '#914CE0',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '-8deg' }],
    shadowColor: '#A855F7',
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 7 },
    elevation: 10,
  },
  logoSparkle: {
    position: 'absolute',
    right: -15,
    top: -10,
  },
  brand: {
    fontSize: 22,
    fontWeight: '900',
    marginTop: 17,
    letterSpacing: 1,
  },
  heading: {
    fontSize: 43,
    lineHeight: 49,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 12,
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 9,
    marginBottom: 25,
  },
  formCard: {
    width: '100%',
    borderRadius: 27,
    borderWidth: 1,
    padding: 22,
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '900',
  },
  formSubtitle: {
    fontSize: 12,
    marginTop: 6,
    marginBottom: 23,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 9,
  },
  inputWrap: {
    minHeight: 54,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 14,
    paddingLeft: 11,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: -8,
    marginBottom: 16,
    paddingVertical: 5,
  },
  forgotText: {
    color: '#B875F5',
    fontSize: 12,
    fontWeight: '800',
  },
  error: {
    color: '#FF6B83',
    fontSize: 13,
    marginBottom: 12,
  },
  button: {
    minHeight: 55,
    borderRadius: 17,
    backgroundColor: '#914CE0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 4,
    shadowColor: '#914CE0',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
  switchText: {
    textAlign: 'center',
    fontSize: 13,
    marginTop: 22,
  },
  link: {
    color: '#B875F5',
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 25,
  },
  footerText: {
    fontSize: 11,
  },
});
