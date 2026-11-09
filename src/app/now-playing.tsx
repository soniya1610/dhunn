
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AddToPlaylistModal from '../components/AddToPlaylistModal';
import Artwork from '../components/Artwork';
import { useLibrary } from '../context/LibraryContext';
import { usePlayer } from '../context/PlayerContext';
import { useTheme } from '../context/ThemeContext';
import { formatTime } from '../services/api';

export default function NowPlayingScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { colors } = useTheme();

  const {
    current,
    isPlaying,
    isBuffering,
    position,
    duration,
    shuffle,
    repeat,
    toggle,
    next,
    prev,
    seekToRatio,
    toggleShuffle,
    toggleRepeat,
  } = usePlayer();

  const { isLiked, toggleLike } = useLibrary();

  const [barWidth, setBarWidth] = useState(1);
  const [showAdd, setShowAdd] = useState(false);

  if (!current) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + 16,
            alignItems: 'center',
            justifyContent: 'center',
          },
        ]}
      >
        <Text style={[styles.empty, { color: colors.muted }]}>
          Nothing is playing yet.
        </Text>

        <Pressable
          onPress={() => router.back()}
          style={[styles.closeBtn, { backgroundColor: colors.accent }]}
          accessibilityRole="button"
        >
          <Text style={styles.closeText}>Go back</Text>
        </Pressable>
      </View>
    );
  }

  const liked = isLiked(current.id);
  const ratio = duration > 0 ? Math.min(position / duration, 1) : 0;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 8,
          paddingBottom: insets.bottom + 24,
        },
      ]}
    >
      <Pressable
        onPress={() => router.back()}
        style={styles.handle}
        hitSlop={20}
        accessibilityLabel="Close player"
      >
        <Ionicons name="chevron-down" size={30} color={colors.muted} />
      </Pressable>

      <View
        style={[
          styles.artWrap,
          {
            shadowColor: colors.accent,
          },
        ]}
      >
        <Artwork
          uri={current.artwork}
          size={320}
          radius={14}
          seed={current.title}
        />
      </View>

      <View style={styles.titleRow}>
        <View style={{ flex: 1 }}>
          <Text
            numberOfLines={1}
            style={[styles.title, { color: colors.text }]}
          >
            {current.title}
          </Text>

          <Text
            numberOfLines={1}
            style={[styles.artist, { color: colors.accent }]}
          >
            {current.artist}
          </Text>
        </View>

        <Pressable
          onPress={() => toggleLike(current)}
          hitSlop={10}
          accessibilityLabel={liked ? 'Unlike song' : 'Like song'}
        >
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={28}
            color={liked ? colors.accent : colors.muted}
          />
        </Pressable>
      </View>

      <Pressable
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width || 1)}
        onPress={(e) => seekToRatio(e.nativeEvent.locationX / barWidth)}
        style={styles.barHit}
        accessibilityLabel="Seek bar"
      >
        <View style={[styles.barTrack, { backgroundColor: colors.border }]}>
          <View
            style={[
              styles.barFill,
              {
                width: `${ratio * 100}%`,
                backgroundColor: colors.accent,
              },
            ]}
          />
        </View>
      </Pressable>

      <View style={styles.times}>
        <Text style={[styles.time, { color: colors.muted }]}>
          {formatTime(position)}
        </Text>

        <Text style={[styles.time, { color: colors.muted }]}>
          {isBuffering
            ? 'Loading...'
            : `-${formatTime(Math.max(duration - position, 0))}`}
        </Text>
      </View>

      <View style={styles.controls}>
        <Pressable onPress={prev} hitSlop={12} accessibilityLabel="Previous song">
          <Ionicons name="play-back" size={34} color={colors.text} />
        </Pressable>

        <Pressable
          onPress={toggle}
          style={[styles.playBtn, { backgroundColor: colors.accent }]}
          accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
        >
          <Ionicons
            name={isPlaying ? 'pause' : 'play'}
            size={34}
            color="#fff"
          />
        </Pressable>

        <Pressable onPress={next} hitSlop={12} accessibilityLabel="Next song">
          <Ionicons name="play-forward" size={34} color={colors.text} />
        </Pressable>
      </View>

      <View style={styles.extras}>
        <Pressable
          onPress={toggleShuffle}
          hitSlop={12}
          accessibilityLabel="Shuffle"
          style={styles.extra}
        >
          <Ionicons
            name="shuffle"
            size={24}
            color={shuffle ? colors.accent : colors.muted}
          />
          <Text
            style={[
              styles.extraText,
              { color: shuffle ? colors.accent : colors.muted },
            ]}
          >
            Shuffle
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setShowAdd(true)}
          hitSlop={12}
          accessibilityLabel="Add to playlist"
          style={styles.extra}
        >
          <Ionicons name="list" size={24} color={colors.muted} />
          <Text style={[styles.extraText, { color: colors.muted }]}>
            Playlist
          </Text>
        </Pressable>

        <Pressable
          onPress={toggleRepeat}
          hitSlop={12}
          accessibilityLabel="Repeat"
          style={styles.extra}
        >
          <Ionicons
            name="repeat"
            size={24}
            color={repeat ? colors.accent : colors.muted}
          />
          <Text
            style={[
              styles.extraText,
              { color: repeat ? colors.accent : colors.muted },
            ]}
          >
            Repeat
          </Text>
        </Pressable>
      </View>

      <AddToPlaylistModal
        visible={showAdd}
        track={current}
        onClose={() => setShowAdd(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
  },
  handle: {
    alignItems: 'center',
  },
  artWrap: {
    alignItems: 'center',
    marginTop: 18,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
  },
  artist: {
    fontSize: 16,
    marginTop: 2,
  },
  barHit: {
    height: 28,
    justifyContent: 'center',
    marginTop: 20,
  },
  barTrack: {
    height: 5,
    borderRadius: 3,
  },
  barFill: {
    height: 5,
    borderRadius: 3,
  },
  times: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 13,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 44,
    marginTop: 24,
  },
  playBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  extras: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingHorizontal: 12,
  },
  extra: {
    alignItems: 'center',
    gap: 4,
  },
  extraText: {
    fontSize: 12,
  },
  empty: {
    fontSize: 16,
  },
  closeBtn: {
    marginTop: 16,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 20,
  },
  closeText: {
    color: '#fff',
    fontWeight: '700',
  },
});
