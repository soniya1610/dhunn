
import * as ImagePicker from 'expo-image-picker';
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
    { label: 'Liked', value: String(liked.length) },
    { label: 'Playlists', value: String(playlists.length) },
    { label: 'Songs played', value: String(playedCount) },
  ];

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{
        paddingTop: insets.top + 16,
        paddingHorizontal: 20,
        paddingBottom: 160,
      }}
    >
      <Text style={[styles.title, { color: colors.text }]}>Profile</Text>

      <View style={[styles.card, { borderBottomColor: colors.border }]}>
        {user?.photo ? (
          <Image source={{ uri: user.photo }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarFallback]}>
            <Text style={styles.avatarText}>
              {user?.name?.charAt(0).toUpperCase() || 'U'}
            </Text>
          </View>
        )}

        <View style={{ flex: 1 }}>
          <Text style={[styles.name, { color: colors.text }]}>
            {user?.name}
          </Text>
          <Text style={[styles.email, { color: colors.muted }]}>
            {user?.email}
          </Text>
        </View>
      </View>

      <View style={styles.stats}>
        {stats.map((s, i) => (
          <View
            key={s.label}
            style={[
              styles.stat,
              i === 1 && {
                borderLeftWidth: StyleSheet.hairlineWidth,
                borderRightWidth: StyleSheet.hairlineWidth,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.statValue, { color: colors.text }]}>
              {s.value}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              {s.label}
            </Text>
          </View>
        ))}
      </View>

      <Pressable
        onPress={changePhoto}
        style={[styles.row, { borderBottomColor: colors.border }]}
        accessibilityRole="button"
      >
        <Text style={[styles.rowAccent, { color: colors.accent }]}>
          Change photo (camera / gallery)
        </Text>
      </Pressable>

      <Pressable
        onPress={confirmSignOut}
        style={[styles.row, { borderBottomColor: colors.border }]}
        accessibilityRole="button"
      >
        <Text style={[styles.rowAccent, { color: colors.accent, fontWeight: '700' }]}>
          Sign out
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 34,
    fontWeight: '800',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 24,
    paddingBottom: 22,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  avatarFallback: {
    backgroundColor: '#5C6BC0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: '700',
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
  },
  email: {
    fontSize: 14,
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    marginVertical: 22,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: 13,
    marginTop: 2,
  },
  row: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowAccent: {
    fontSize: 16,
    fontWeight: '500',
  },
});
