
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
        size={46}
        radius={12}
        seed={current.title}
      />

      <View style={styles.info}>
        <Text numberOfLines={1} style={[styles.title, { color: colors.text }]}>
          {current.title}
        </Text>
        <Text numberOfLines={1} style={[styles.artist, { color: colors.muted }]}>
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
          size={23}
          color={colors.accent}
        />
      </Pressable>

      <Pressable
        onPress={next}
        hitSlop={10}
        accessibilityLabel="Next song"
        style={styles.control}
      >
        <Ionicons name="play-forward" size={22} color={colors.text} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 12,
    right: 12,
    height: 70,
    borderWidth: 1,
    borderRadius: 19,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 12,
    elevation: 10,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 5 },
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '800',
  },
  artist: {
    fontSize: 11,
    marginTop: 4,
  },
  control: {
    width: 34,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
