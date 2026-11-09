
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { usePlayer } from '../context/PlayerContext';
import Artwork from './Artwork';

export default function MiniPlayer({ bottom }: { bottom: number }) {
  const router = useRouter();
  const { current, isPlaying, toggle, next } = usePlayer();
  const { colors } = useTheme();

  if (!current) return null;

  return (
    <Pressable
      onPress={() => router.push('/now-playing')}
      style={[
        styles.bar,
        {
          bottom,
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel="Open now playing"
    >
      <Artwork
        uri={current.artwork}
        size={44}
        radius={10}
        seed={current.title}
      />

      <View style={styles.info}>
        <Text
          numberOfLines={1}
          style={[styles.title, { color: colors.text }]}
        >
          {current.title}
        </Text>

        <Text
          numberOfLines={1}
          style={[styles.artist, { color: colors.muted }]}
        >
          {current.artist}
        </Text>
      </View>

      <Pressable
        onPress={toggle}
        hitSlop={10}
        accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
        style={styles.control}
      >
        <Ionicons
          name={isPlaying ? 'pause' : 'play'}
          size={25}
          color={colors.text}
        />
      </Pressable>

      <Pressable
        onPress={next}
        hitSlop={10}
        accessibilityLabel="Next song"
        style={styles.control}
      >
        <Ionicons
          name="play-forward"
          size={23}
          color={colors.text}
        />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 10,
    right: 10,
    height: 68,
    borderWidth: 1,
    borderRadius: 17,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    elevation: 8,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
  },
  artist: {
    fontSize: 11,
    marginTop: 3,
  },
  control: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
