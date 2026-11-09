
import { useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLibrary } from '../context/LibraryContext';
import { useTheme } from '../context/ThemeContext';
import { Track } from '../types';

type Props = {
  visible: boolean;
  track: Track | null;
  onClose: () => void;
};

export default function AddToPlaylistModal({
  visible,
  track,
  onClose,
}: Props) {
  const { colors } = useTheme();
  const { playlists, addToPlaylist, createPlaylist } = useLibrary();

  const [name, setName] = useState('');

  const add = (playlistId: string) => {
    if (track) addToPlaylist(playlistId, track);
    onClose();
  };

  const createAndAdd = () => {
    const id = createPlaylist(name);

    setName('');
    add(id);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <View style={[styles.sheet, { backgroundColor: colors.surface }]}>
        <Text style={[styles.heading, { color: colors.text }]}>
          Add to playlist
        </Text>

        <View style={styles.newRow}>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="New playlist name"
            placeholderTextColor={colors.muted}
            style={[
              styles.input,
              {
                backgroundColor: colors.background,
                color: colors.text,
                borderColor: colors.border,
              },
            ]}
          />

          <Pressable
            onPress={createAndAdd}
            disabled={!name.trim()}
            style={[
              styles.createBtn,
              { backgroundColor: colors.accent },
              !name.trim() && { opacity: 0.5 },
            ]}
            accessibilityRole="button"
          >
            <Text style={styles.createText}>Create</Text>
          </Pressable>
        </View>

        <FlatList
          data={playlists}
          keyExtractor={(p) => p.id}
          style={{ maxHeight: 260 }}
          ListEmptyComponent={
            <Text style={[styles.empty, { color: colors.muted }]}>
              No playlists yet. Create your first one above.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              onPress={() => add(item.id)}
              style={[
                styles.item,
                { borderBottomColor: colors.border },
              ]}
              accessibilityRole="button"
            >
              <Text style={[styles.itemText, { color: colors.text }]}>
                {item.name}
              </Text>

              <Text style={[styles.count, { color: colors.muted }]}>
                {item.tracks.length} songs
              </Text>
            </Pressable>
          )}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheet: {
    padding: 20,
    paddingBottom: 36,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  heading: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 14,
  },
  newRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  createBtn: {
    borderRadius: 12,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  createText: {
    color: '#fff',
    fontWeight: '700',
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
  },
  count: {
    fontSize: 13,
  },
  empty: {
    paddingVertical: 14,
  },
});
