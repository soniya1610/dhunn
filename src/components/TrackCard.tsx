
import { Ionicons } from '@expo/vector-icons';
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
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Play ${track.title} by ${track.artist}`}
    >
      <View style={styles.artworkContainer}>
        <Artwork
          uri={track.artwork}
          size={130}
          radius={15}
          seed={track.title}
        />
        <View style={styles.playOverlay}>
          <Ionicons name="play" size={17} color="#FFFFFF" />
        </View>
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
    width: 148,
    padding: 8,
    borderRadius: 19,
    borderWidth: 1,
  },
  artworkContainer: {
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  playOverlay: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#914CE0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
    marginHorizontal: 2,
  },
  artist: {
    fontSize: 11,
    marginTop: 4,
    marginHorizontal: 2,
    marginBottom: 4,
  },
});
