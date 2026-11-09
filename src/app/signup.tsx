import { Link } from 'expo-router';
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
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();
  const { isDark, colors } = useTheme();

  const [name, setName] = useState('Soniya');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

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
      const err = await signUp(name.trim(), email.trim(), password);
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
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={[styles.orb, styles.orbTop, { backgroundColor: isDark ? '#7138A8' : '#D9B5FF' }]} />
      <View style={[styles.orb, styles.orbBottom, { backgroundColor: isDark ? '#43266F' : '#FFC9E8' }]} />

      <ScrollView
        contentContainerStyle={[
          styles.container,
          {
            paddingTop: insets.top + 25,
            paddingBottom: insets.bottom + 30,
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topLabel}>
          <Ionicons name="sparkles" size={13} color="#DDA4FF" />
          <Text style={styles.topLabelText}>YOUR SOUND. YOUR MOOD.</Text>
        </View>

        <View style={styles.logoWrap}>
          <View style={styles.logo}>
            <Ionicons name="musical-notes" size={32} color="#FFFFFF" />
          </View>
          <View style={styles.logoSparkle}>
            <Ionicons name="sparkles" size={18} color="#FFD1F1" />
          </View>
        </View>

        <Text style={[styles.brand, { color: textColor }]}>Dhun</Text>
        <Text style={[styles.heading, { color: textColor }]}>
          Find your{'\n'}music space.
        </Text>
        <Text style={[styles.subtitle, { color: mutedColor }]}>
          One account. All your favourite sounds.
        </Text>

        <View style={[styles.formCard, { backgroundColor: card, borderColor: colors.border }]}>
          <Text style={[styles.formTitle, { color: textColor }]}>Create your account</Text>
          <Text style={[styles.formSubtitle, { color: mutedColor }]}>
            Let's make your listening experience yours.
          </Text>

          <Text style={[styles.fieldLabel, { color: textColor }]}>YOUR NAME</Text>
          <View style={[styles.inputWrap, { backgroundColor: inputBackground, borderColor: colors.border }]}>
            <Ionicons name="person-outline" size={19} color={mutedColor} />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name"
              placeholderTextColor={mutedColor}
              autoCapitalize="words"
              style={[styles.input, { color: textColor }]}
            />
          </View>

          <Text style={[styles.fieldLabel, { color: textColor }]}>EMAIL ADDRESS</Text>
          <View style={[styles.inputWrap, { backgroundColor: inputBackground, borderColor: colors.border }]}>
            <Ionicons name="mail-outline" size={19} color={mutedColor} />
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor={mutedColor}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              style={[styles.input, { color: textColor }]}
            />
          </View>

          <Text style={[styles.fieldLabel, { color: textColor }]}>PASSWORD</Text>
          <View style={[styles.inputWrap, { backgroundColor: inputBackground, borderColor: colors.border }]}>
            <Ionicons name="lock-closed-outline" size={19} color={mutedColor} />
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              placeholderTextColor={mutedColor}
              secureTextEntry
              style={[styles.input, { color: textColor }]}
            />
          </View>

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}

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
              {busy ? 'Creating account...' : 'Create account'}
            </Text>
            {!busy && <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />}
          </Pressable>

          <Text style={[styles.switchText, { color: mutedColor }]}>
            Already part of Dhun?{' '}
            <Link href="/login" style={styles.link}>
              Sign in
            </Link>
          </Text>
        </View>

        <View style={styles.footer}>
          <Ionicons name="headset-outline" size={15} color={mutedColor} />
          <Text style={[styles.footerText, { color: mutedColor }]}>
            Your songs and playlists stay on this phone.
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
    backgroundColor: 'rgba(173, 103, 225, 0.16)',
  },
  topLabelText: {
    color: '#DDA4FF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  logoWrap: {
    marginTop: 25,
    position: 'relative',
  },
  logo: {
    width: 68,
    height: 68,
    borderRadius: 24,
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
    fontSize: 21,
    fontWeight: '800',
    marginTop: 15,
    letterSpacing: 1,
  },
  heading: {
    fontSize: 38,
    lineHeight: 44,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 10,
    letterSpacing: -1.2,
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginTop: 9,
    marginBottom: 22,
  },
  formCard: {
    width: '100%',
    borderRadius: 28,
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
    fontWeight: '800',
  },
  formSubtitle: {
    fontSize: 12,
    marginTop: 6,
    marginBottom: 22,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 9,
  },
  inputWrap: {
    minHeight: 52,
    borderRadius: 15,
    borderWidth: 1,
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 14,
    paddingVertical: 13,
    paddingLeft: 11,
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
    marginTop: 5,
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
    marginTop: 21,
  },
  link: {
    color: '#B875F5',
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    marginTop: 22,
  },
  footerText: {
    fontSize: 11,
  },
});