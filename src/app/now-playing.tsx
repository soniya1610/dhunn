
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
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
  const { width } = useWindowDimensions();

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

  const artSize = Math.min(width - 64, 320);

  if (!current) {
    return (
      <View
        style={[
          styles.emptyContainer,
          {
            backgroundColor: colors.background,
            paddingTop: insets.top + 20,
          },
        ]}
      >
        <Ionicons name="musical-notes-outline" size={64} color={colors.accent} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          Nothing playing
        </Text>
        <Text style={[styles.emptyText, { color: colors.muted }]}>
          Choose a song and start listening.
        </Text>
        <Pressable
          onPress={() => router.back()}
          style={[styles.backButton, { backgroundColor: colors.accent }]}
        >
          <Text style={styles.backText}>Go back</Text>
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
          paddingBottom: insets.bottom + 20,
        },
      ]}
    >
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} hitSlop={15}>
          <Ionicons name="chevron-down" size={28} color={colors.text} />
        </Pressable>
        <Text style={[styles.topLabel, { color: colors.muted }]}>
          NOW PLAYING
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.artWrap,
            {
              shadowColor: colors.accent,
              width: artSize,
              height: artSize,
            },
          ]}
        >
          <Artwork
            uri={current.artwork}
            size={artSize}
            radius={22}
            seed={current.title}
          />
        </View>

        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={2}
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
            hitSlop={12}
            style={styles.likeButton}
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
          <View
            style={[
              styles.progressDot,
              {
                left: `${ratio * 100}%`,
                backgroundColor: colors.accent,
              },
            ]}
          />
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
          <Pressable onPress={prev} hitSlop={15}>
            <Ionicons name="play-skip-back" size={30} color={colors.text} />
          </Pressable>

          <Pressable
            onPress={toggle}
            style={[
              styles.playButton,
              {
                backgroundColor: colors.accent,
                shadowColor: colors.accent,
              },
            ]}
            accessibilityLabel={isPlaying ? 'Pause' : 'Play'}
          >
            <Ionicons
              name={isPlaying ? 'pause' : 'play'}
              size={34}
              color="#FFFFFF"
            />
          </Pressable>

          <Pressable onPress={next} hitSlop={15}>
            <Ionicons name="play-skip-forward" size={30} color={colors.text} />
          </Pressable>
        </View>

        <View style={[styles.extras, { borderTopColor: colors.border }]}>
          <Pressable onPress={toggleShuffle} style={styles.extra}>
            <Ionicons
              name="shuffle"
              size={23}
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

          <Pressable onPress={() => setShowAdd(true)} style={styles.extra}>
            <Ionicons name="list" size={23} color={colors.muted} />
            <Text style={[styles.extraText, { color: colors.muted }]}>
              Playlist
            </Text>
          </Pressable>

          <Pressable onPress={toggleRepeat} style={styles.extra}>
            <Ionicons
              name="repeat"
              size={23}
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
      </ScrollView>

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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },
  emptyTitle: {
    fontSize: 23,
    fontWeight: '800',
    marginTop: 18,
  },
  emptyText: {
    fontSize: 14,
    marginTop: 8,
  },
  backButton: {
    marginTop: 22,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 15,
  },
  backText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 42,
  },
  topLabel: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2,
  },
  content: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  artWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    borderRadius: 22,
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  titleRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 30,
  },
  title: {
    fontSize: 23,
    fontWeight: '900',
  },
  artist: {
    fontSize: 15,
    marginTop: 6,
    fontWeight: '600',
  },
  likeButton: {
    padding: 8,
  },
  barHit: {
    width: '100%',
    height: 28,
    justifyContent: 'center',
    marginTop: 22,
  },
  barTrack: {
    height: 5,
    borderRadius: 5,
    overflow: 'hidden',
  },
  barFill: {
    height: 5,
    borderRadius: 5,
  },
  progressDot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: -6,
  },
  times: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 12,
    fontWeight: '600',
  },
  controls: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 42,
    marginTop: 28,
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
  },
  extras: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: StyleSheet.hairlineWidth,
    marginTop: 32,
    paddingTop: 20,
  },
  extra: {
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
  },
  extraText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
