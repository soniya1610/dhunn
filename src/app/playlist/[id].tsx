
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StateMessage from '../../components/StateMessage';
import TrackRow from '../../components/TrackRow';
import { useLibrary } from '../../context/LibraryContext';
import { usePlayer } from '../../context/PlayerContext';
import { useTheme } from '../../context/ThemeContext';

export default function PlaylistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();

  const { liked, playlists, removeFromPlaylist } = useLibrary();
  const { play } = usePlayer();

  const isLikedList = id === 'liked';
  const playlist = playlists.find((p) => p.id === id);

  const title = isLikedList ? 'Liked Songs' : playlist?.name ?? 'Playlist';
  const tracks = isLikedList ? liked : playlist?.tracks ?? [];

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 8,
        },
      ]}
    >
      <Pressable
        onPress={() => router.back()}
        style={styles.back}
        hitSlop={12}
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={28} color={colors.accent} />
        <Text style={[styles.backText, { color: colors.accent }]}>
          Library
        </Text>
      </Pressable>

      <Text style={[styles.title, { color: colors.text }]}>
        {title}
      </Text>

      <Text style={[styles.count, { color: colors.muted }]}>
        {tracks.length} songs
      </Text>

      <Pressable
        onPress={() => tracks[0] && play(tracks[0], tracks)}
        disabled={tracks.length === 0}
        style={[
          styles.playAll,
          { backgroundColor: colors.accent },
          tracks.length === 0 && { opacity: 0.4 },
        ]}
        accessibilityRole="button"
      >
        <Ionicons name="play" size={20} color="#fff" />
        <Text style={styles.playAllText}>Play all</Text>
      </Pressable>

      <FlatList
        data={tracks}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ paddingBottom: 60 }}
        renderItem={({ item }) => (
          <TrackRow
            track={item}
            queue={tracks}
            onRemove={
              isLikedList
                ? undefined
                : () => removeFromPlaylist(id, item.id)
            }
          />
        )}
        ListEmptyComponent={
          <StateMessage
            text={
              isLikedList
                ? 'No liked songs yet. Tap the heart on any song.'
                : 'This playlist is empty. Open a song and tap Playlist to add it here.'
            }
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  back: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  backText: {
    fontSize: 17,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: 12,
  },
  count: {
    fontSize: 14,
    marginTop: 2,
  },
  playAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 46,
    borderRadius: 12,
    marginVertical: 16,
  },
  playAllText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
