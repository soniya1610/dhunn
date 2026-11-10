
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
    if (!name.trim()) {
      Alert.alert('Playlist name required', 'Enter a name for your playlist.');
      return;
    }

    createPlaylist(name.trim());
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 18,
          paddingHorizontal: 20,
          paddingBottom: 170,
        }}
      >
        <View style={styles.header}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.accent }]}>
              YOUR COLLECTION
            </Text>
            <Text style={[styles.title, { color: colors.text }]}>
              Library
            </Text>
          </View>

          <Pressable
            onPress={() => setShowNew(true)}
            style={[styles.addButton, { backgroundColor: colors.surface }]}
            accessibilityRole="button"
            accessibilityLabel="Create playlist"
          >
            <Ionicons name="add" size={27} color={colors.accent} />
          </Pressable>
        </View>

        <Pressable
          onPress={() => router.push('/playlist/liked')}
          style={[
            styles.likedCard,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
          ]}
          accessibilityRole="button"
        >
          <View style={styles.likedArt}>
            <Ionicons name="heart" size={28} color="#FFFFFF" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={[styles.name, { color: colors.text }]}>
              Liked Songs
            </Text>
            <Text style={[styles.count, { color: colors.muted }]}>
              {liked.length} songs
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={21} color={colors.muted} />
        </Pressable>

        <View style={styles.sectionHeader}>
          <Text style={[styles.section, { color: colors.text }]}>
            Your Playlists
          </Text>
          <Text style={[styles.total, { color: colors.muted }]}>
            {playlists.length} playlists
          </Text>
        </View>

        {playlists.length === 0 ? (
          <View
            style={[
              styles.emptyCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Ionicons name="albums-outline" size={38} color={colors.accent} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              Your playlists live here
            </Text>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Create your first playlist and collect your favourite songs.
            </Text>
            <Pressable
              onPress={() => setShowNew(true)}
              style={[styles.createEmpty, { backgroundColor: colors.accent }]}
            >
              <Text style={styles.createEmptyText}>Create playlist</Text>
            </Pressable>
          </View>
        ) : (
          playlists.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => router.push(`/playlist/${p.id}`)}
              style={[
                styles.playlistRow,
                { borderBottomColor: colors.border },
              ]}
              accessibilityRole="button"
            >
              <Artwork
                uri={p.tracks[0]?.artwork}
                size={60}
                radius={14}
                seed={p.name}
              />

              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={[styles.name, { color: colors.text }]}>
                  {p.name}
                </Text>
                <Text style={[styles.count, { color: colors.muted }]}>
                  {p.tracks.length} songs
                </Text>
              </View>

              <Pressable
                onPress={() => confirmDelete(p.id, p.name)}
                hitSlop={12}
                accessibilityLabel={`Delete ${p.name}`}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={20} color={colors.muted} />
              </Pressable>

              <Ionicons name="chevron-forward" size={19} color={colors.muted} />
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
            style={[
              styles.modalBox,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <View style={styles.modalIcon}>
              <Ionicons name="albums-outline" size={25} color={colors.accent} />
            </View>

            <Text style={[styles.modalTitle, { color: colors.text }]}>
              New playlist
            </Text>
            <Text style={[styles.modalSubtitle, { color: colors.muted }]}>
              Give your collection a name.
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
              maxLength={40}
              onSubmitEditing={create}
            />

            <View style={styles.modalActions}>
              <Pressable onPress={() => setShowNew(false)}>
                <Text style={[styles.cancel, { color: colors.muted }]}>
                  Cancel
                </Text>
              </Pressable>

              <Pressable
                onPress={create}
                style={[styles.createBtn, { backgroundColor: colors.accent }]}
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
    marginBottom: 25,
  },
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
  addButton: {
    width: 46,
    height: 46,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(173,130,255,0.2)',
  },
  likedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
  },
  likedArt: {
    width: 60,
    height: 60,
    borderRadius: 15,
    backgroundColor: '#8552D8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '800',
  },
  count: {
    fontSize: 12,
    marginTop: 5,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 12,
  },
  section: {
    fontSize: 19,
    fontWeight: '800',
  },
  total: {
    fontSize: 12,
  },
  emptyCard: {
    alignItems: 'center',
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 5,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '800',
    marginTop: 13,
  },
  emptyText: {
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 7,
  },
  createEmpty: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 13,
    marginTop: 18,
  },
  createEmptyText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  playlistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  deleteButton: {
    padding: 5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(5,3,12,0.78)',
    justifyContent: 'center',
    padding: 25,
  },
  modalBox: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 22,
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: 'rgba(173,130,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 21,
    fontWeight: '900',
  },
  modalSubtitle: {
    fontSize: 13,
    marginTop: 5,
    marginBottom: 20,
  },
  modalInput: {
    height: 50,
    borderRadius: 13,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 22,
    marginTop: 22,
  },
  cancel: {
    fontSize: 14,
    fontWeight: '700',
  },
  createBtn: {
    borderRadius: 12,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  createText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
});
