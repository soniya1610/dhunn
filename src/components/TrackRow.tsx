
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useLibrary } from '../context/LibraryContext';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import { Track } from '../types';
import Artwork from './Artwork';

type Props = {
  track: Track;
  queue: Track[];
  onRemove?: () => void;
};

export default function TrackRow({ track, queue, onRemove }: Props) {
  const { current, play } = usePlayer();
  const { isLiked, toggleLike } = useLibrary();
  const { colors } = useTheme();

  const active = current?.id === track.id;
  const liked = isLiked(track.id);

  return (
    <Pressable
      onPress={() => play(track, queue)}
      style={[styles.row, { borderBottomColor: colors.border }]}
      accessibilityRole="button"
      accessibilityLabel={`Play ${track.title} by ${track.artist}`}
    >
      <Artwork uri={track.artwork} size={52} seed={track.title} />

      <View style={styles.info}>
        <Text
          numberOfLines={1}
          style={[
            styles.title,
            { color: active ? colors.accent : colors.text },
          ]}
        >
          {track.title}
        </Text>

        <Text
          numberOfLines={1}
          style={[styles.artist, { color: colors.muted }]}
        >
          {track.artist}
        </Text>
      </View>

      {onRemove ? (
        <Pressable
          onPress={onRemove}
          hitSlop={10}
          accessibilityLabel="Remove from playlist"
        >
          <Ionicons
            name="close-circle-outline"
            size={24}
            color={colors.muted}
          />
        </Pressable>
      ) : null}

      <Pressable
        onPress={() => toggleLike(track)}
        hitSlop={10}
        accessibilityLabel={liked ? 'Unlike song' : 'Like song'}
      >
        <Ionicons
          name={liked ? 'heart' : 'heart-outline'}
          size={22}
          color={liked ? colors.accent : colors.muted}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
  },
  artist: {
    fontSize: 13,
    marginTop: 2,
  },
});
