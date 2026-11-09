
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Artwork from '../../components/Artwork';
import StateMessage from '../../components/StateMessage';
import { useLibrary } from '../../context/LibraryContext';
import { useTheme } from '../../context/ThemeContext';

export default function LibraryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();

  const { liked, playlists, createPlaylist, deletePlaylist } = useLibrary();

  const [showNew, setShowNew] = useState(false);
  const [name, setName] = useState('');

  const create = () => {
    createPlaylist(name);
    setName('');
    setShowNew(false);
  };

  const confirmDelete = (id: string, title: string) => {
    Alert.alert('Delete playlist?', `"${title}" will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deletePlaylist(id),
      },
    ]);
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        contentContainerStyle={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 160,
        }}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Library
          </Text>

          <Pressable
            onPress={() => setShowNew(true)}
            hitSlop={10}
            accessibilityRole="button"
            accessibilityLabel="Create playlist"
          >
            <Ionicons name="add-circle" size={34} color={colors.accent} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push('/playlist/liked')}
          style={[styles.row, { borderBottomColor: colors.border }]}
          accessibilityRole="button"
        >
          <View style={[styles.likedArt, { backgroundColor: colors.accent }]}>
            <Ionicons name="heart" size={26} color="#fff" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: colors.text }]}>
              Liked Songs
            </Text>
            <Text style={[styles.count, { color: colors.muted }]}>
              {liked.length} songs
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color={colors.muted} />
        </Pressable>

        <Text style={[styles.section, { color: colors.text }]}>
          Playlists
        </Text>

        {playlists.length === 0 ? (
          <StateMessage text="No playlists yet. Tap + to create your first one." />
        ) : (
          playlists.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => router.push(`/playlist/${p.id}`)}
              style={[styles.row, { borderBottomColor: colors.border }]}
              accessibilityRole="button"
            >
              <Artwork
                uri={p.tracks[0]?.artwork}
                size={56}
                seed={p.name}
              />

              <View style={{ flex: 1 }}>
                <Text style={[styles.name, { color: colors.text }]}>
                  {p.name}
                </Text>
                <Text style={[styles.count, { color: colors.muted }]}>
                  {p.tracks.length} songs
                </Text>
              </View>

              <Pressable
                onPress={() => confirmDelete(p.id, p.name)}
                hitSlop={10}
                accessibilityLabel={`Delete ${p.name}`}
              >
                <Ionicons
                  name="trash-outline"
                  size={22}
                  color={colors.muted}
                />
              </Pressable>
            </Pressable>
          ))
        )}
      </ScrollView>

      <Modal
        visible={showNew}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNew(false)}
      >
        <View style={styles.modalBackdrop}>
          <View
            style={[styles.modalBox, { backgroundColor: colors.surface }]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              New playlist
            </Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Playlist name"
              placeholderTextColor={colors.muted}
              style={[
                styles.modalInput,
                {
                  backgroundColor: colors.background,
                  color: colors.text,
                  borderColor: colors.border,
                },
              ]}
              autoFocus
            />

            <View style={styles.modalActions}>
              <Pressable
                onPress={() => setShowNew(false)}
                accessibilityRole="button"
              >
                <Text style={[styles.cancel, { color: colors.muted }]}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={create}
                style={[styles.createBtn, { backgroundColor: colors.accent }]}
                accessibilityRole="button"
              >
                <Text style={styles.createText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
  },
  section: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  likedArt: {
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  count: {
    fontSize: 13,
    marginTop: 3,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: 28,
  },
  modalBox: {
    borderRadius: 18,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  modalInput: {
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 20,
    marginTop: 18,
  },
  cancel: {
    fontSize: 16,
    fontWeight: '600',
  },
  createBtn: {
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  createText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
