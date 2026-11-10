
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
      style={[
        styles.row,
        {
          backgroundColor: active
            ? 'rgba(173,130,255,0.07)'
            : 'transparent',
          borderBottomColor: colors.border,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Play ${track.title} by ${track.artist}`}
    >
      <View style={styles.artworkWrap}>
        <Artwork uri={track.artwork} size={54} radius={13} seed={track.title} />
        {active && (
          <View style={styles.activeIndicator}>
            <Ionicons
              name="volume-high"
              size={15}
              color="#FFFFFF"
            />
          </View>
        )}
      </View>

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
          style={styles.action}
        >
          <Ionicons
            name="close-circle-outline"
            size={22}
            color={colors.muted}
          />
        </Pressable>
      ) : null}

      <Pressable
        onPress={() => toggleLike(track)}
        hitSlop={10}
        accessibilityLabel={liked ? 'Unlike song' : 'Like song'}
        style={styles.action}
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
    gap: 13,
    paddingVertical: 11,
    paddingHorizontal: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderRadius: 10,
  },
  artworkWrap: {
    position: 'relative',
  },
  activeIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 13,
    backgroundColor: 'rgba(75,42,120,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '800',
  },
  artist: {
    fontSize: 12,
    marginTop: 4,
  },
  action: {
    paddingHorizontal: 3,
    paddingVertical: 5,
  },
});
