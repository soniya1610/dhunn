
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import { Track } from '../types';
import Artwork from './Artwork';

type Props = {
  track: Track;
  queue: Track[];
};

export default function TrackCard({ track, queue }: Props) {
  const { play } = usePlayer();
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => play(track, queue)}
      style={[
        styles.card,
        { backgroundColor: colors.surface },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Play ${track.title} by ${track.artist}`}
    >
      <View style={styles.artworkContainer}>
        <Artwork
          uri={track.artwork}
          size={130}
          radius={14}
          seed={track.title}
        />
      </View>

      <Text
        numberOfLines={1}
        style={[styles.title, { color: colors.text }]}
      >
        {track.title}
      </Text>

      <Text
        numberOfLines={1}
        style={[styles.artist, { color: colors.muted }]}
      >
        {track.artist}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 142,
    padding: 7,
    borderRadius: 16,
  },
  artworkContainer: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 9,
    marginHorizontal: 2,
  },
  artist: {
    fontSize: 12,
    marginTop: 3,
    marginHorizontal: 2,
    marginBottom: 4,
  },
});
