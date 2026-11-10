
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
          paddingTop: insets.top + 10,
        },
      ]}
    >
      <Pressable
        onPress={() => router.back()}
        style={styles.back}
        hitSlop={12}
        accessibilityLabel="Go back"
      >
        <Ionicons name="chevron-back" size={25} color={colors.accent} />
        <Text style={[styles.backText, { color: colors.accent }]}>
          Library
        </Text>
      </Pressable>

      <View
        style={[
          styles.hero,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <View
          style={[
            styles.heroIcon,
            { backgroundColor: isLikedList ? '#8552D8' : '#573A8A' },
          ]}
        >
          <Ionicons
            name={isLikedList ? 'heart' : 'musical-notes'}
            size={38}
            color="#FFFFFF"
          />
        </View>

        <Text numberOfLines={2} style={[styles.title, { color: colors.text }]}>
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
          <Ionicons name="play" size={19} color="#FFFFFF" />
          <Text style={styles.playAllText}>Play all</Text>
        </Pressable>
      </View>

      <View style={styles.listHeader}>
        <Text style={[styles.listTitle, { color: colors.text }]}>
          All tracks
        </Text>
        <Text style={[styles.count, { color: colors.muted }]}>
          {tracks.length} songs
        </Text>
      </View>

      <FlatList
        data={tracks}
        keyExtractor={(t) => t.id}
        showsVerticalScrollIndicator={false}
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
    marginLeft: -7,
    height: 40,
  },
  backText: {
    fontSize: 15,
    fontWeight: '700',
  },
  hero: {
    alignItems: 'center',
    padding: 20,
    borderRadius: 22,
    borderWidth: 1,
    marginTop: 12,
  },
  heroIcon: {
    width: 84,
    height: 84,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 25,
    fontWeight: '900',
    textAlign: 'center',
  },
  count: {
    fontSize: 12,
    marginTop: 6,
  },
  playAll: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    height: 47,
    width: '100%',
    borderRadius: 14,
    marginTop: 20,
  },
  playAllText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 7,
  },
  listTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
});
