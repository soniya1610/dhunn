
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';
import { useTheme } from '../../context/ThemeContext';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();
  const { user, signOut, updatePhoto } = useAuth();
  const { liked, playlists, playedCount } = useLibrary();

  const fromCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();

    if (!perm.granted) {
      Alert.alert(
        'Camera permission needed',
        'Allow camera access in your phone settings to take a photo.',
      );
      return;
    }

    const res = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!res.canceled) await updatePhoto(res.assets[0].uri);
  };

  const fromGallery = async () => {
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.6,
    });

    if (!res.canceled) await updatePhoto(res.assets[0].uri);
  };

  const changePhoto = () => {
    Alert.alert('Change photo', 'Choose where to get your photo from', [
      { text: 'Camera', onPress: fromCamera },
      { text: 'Gallery', onPress: fromGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const confirmSignOut = () => {
    Alert.alert('Sign out?', 'You can sign back in anytime.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => signOut() },
    ]);
  };

  const stats = [
    { label: 'Liked songs', value: String(liked.length), icon: 'heart' as const },
    { label: 'Playlists', value: String(playlists.length), icon: 'albums' as const },
    { label: 'Played', value: String(playedCount), icon: 'headset' as const },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: insets.top + 18,
        paddingHorizontal: 20,
        paddingBottom: 170,
      }}
    >
      <Text style={[styles.eyebrow, { color: colors.accent }]}>
        YOUR SPACE
      </Text>
      <Text style={[styles.title, { color: colors.text }]}>Profile</Text>

      <View
        style={[
          styles.profileCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Pressable onPress={changePhoto} style={styles.avatarWrap}>
          {user?.photo ? (
            <Image source={{ uri: user.photo }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.avatarFallback]}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </Text>
            </View>
          )}
          <View style={[styles.cameraBadge, { backgroundColor: colors.accent }]}>
            <Ionicons name="camera" size={14} color="#FFFFFF" />
          </View>
        </Pressable>

        <View style={{ flex: 1 }}>
          <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
            {user?.name || 'Music lover'}
          </Text>
          <Text numberOfLines={1} style={[styles.email, { color: colors.muted }]}>
            {user?.email}
          </Text>
          <Text style={[styles.memberLabel, { color: colors.accent }]}>
            DHUN MEMBER
          </Text>
        </View>
      </View>

      <View
        style={[
          styles.statsCard,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        {stats.map((s, i) => (
          <View
            key={s.label}
            style={[
              styles.stat,
              i !== 0 && {
                borderLeftWidth: StyleSheet.hairlineWidth,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name={s.icon} size={19} color={colors.accent} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {s.value}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      <Text style={[styles.section, { color: colors.text }]}>
        Account settings
      </Text>

      <Pressable
        onPress={changePhoto}
        style={[
          styles.settingRow,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.settingIcon}>
          <Ionicons name="camera-outline" size={21} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>
            Change profile photo
          </Text>
          <Text style={[styles.settingSubtitle, { color: colors.muted }]}>
            Camera or gallery
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={19} color={colors.muted} />
      </Pressable>

      <Pressable
        onPress={() => router.push('/(tabs)/library')}
        style={[
          styles.settingRow,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.settingIcon}>
          <Ionicons name="musical-notes-outline" size={21} color={colors.accent} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.settingTitle, { color: colors.text }]}>
            Your library
          </Text>
          <Text style={[styles.settingSubtitle, { color: colors.muted }]}>
            Songs and playlists
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={19} color={colors.muted} />
      </Pressable>

      <Pressable
        onPress={confirmSignOut}
        style={[
          styles.signOutRow,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View style={styles.settingIcon}>
          <Ionicons name="log-out-outline" size={21} color="#F16D86" />
        </View>
        <Text style={styles.signOutText}>Sign out</Text>
        <Ionicons name="chevron-forward" size={19} color={colors.muted} />
      </Pressable>

      <Text style={[styles.footer, { color: colors.muted }]}>
        Made for the moments that matter.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 5,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 24,
    padding: 18,
    borderRadius: 22,
    borderWidth: 1,
  },
  avatarWrap: {
    position: 'relative',
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 25,
  },
  avatarFallback: {
    backgroundColor: '#7546BD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
  },
  cameraBadge: {
    position: 'absolute',
    right: -5,
    bottom: -4,
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#211832',
  },
  name: {
    fontSize: 19,
    fontWeight: '900',
  },
  email: {
    fontSize: 12,
    marginTop: 5,
  },
  memberLabel: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginTop: 9,
  },
  statsCard: {
    flexDirection: 'row',
    paddingVertical: 19,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 18,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  statLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  section: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 30,
    marginBottom: 13,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 14,
    borderRadius: 17,
    borderWidth: 1,
    marginBottom: 10,
  },
  settingIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: 'rgba(173,130,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  settingSubtitle: {
    fontSize: 11,
    marginTop: 4,
  },
  signOutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    padding: 14,
    borderRadius: 17,
    borderWidth: 1,
    marginTop: 5,
  },
  signOutText: {
    flex: 1,
    color: '#F16D86',
    fontSize: 14,
    fontWeight: '800',
  },
  footer: {
    fontSize: 11,
    textAlign: 'center',
    marginTop: 30,
  },
});
