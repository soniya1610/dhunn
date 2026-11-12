
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import StateMessage from '../../components/StateMessage';
import TrackCard from '../../components/TrackCard';
import { useAuth } from '../../context/AuthContext';
import { useLibrary } from '../../context/LibraryContext';
import { usePlayer } from '../../context/PlayerContext';
import { useTheme } from '../../context/ThemeContext';
import {
  searchTracks,
  getTrendingTracks,
  getLatestTracks,
  getArtistTracks,
  getGenreTracks,
} from '../../services/api';
import { Track } from '../../types';

const PAGE_SIZE = 20;

// Mood categories
const moods = [
  {
    name: 'Chill',
    icon: 'cloudy-night-outline' as const,
    query: 'lofi chill',
  },
  {
    name: 'Romantic',
    icon: 'heart-outline' as const,
    query: 'romantic hindi songs',
  },
  {
    name: 'Focus',
    icon: 'headset-outline' as const,
    query: 'focus music',
  },
  {
    name: 'Energy',
    icon: 'flash-outline' as const,
    query: 'energetic hindi songs',
  },
];

// Curated playlists: fixed names and search themes
const curatedPlaylistConfig = [
  {
    id: 'romantic',
    name: 'Romantic Hits',
    subtitle: 'Songs for every love story',
    query: 'romantic hindi songs',
  },
  {
    id: 'chill',
    name: 'Chill Vibes',
    subtitle: 'Relax and enjoy the moment',
    query: 'lofi chill music',
  },
  {
    id: 'workout',
    name: 'Workout Energy',
    subtitle: 'Music that keeps you moving',
    query: 'energetic workout music',
  },
  {
    id: 'late-night',
    name: 'Late Night Melodies',
    subtitle: 'Perfect for quiet nights',
    query: 'soft hindi songs',
  },
  {
    id: 'classics',
    name: 'Bollywood Classics',
    subtitle: 'Timeless Bollywood favourites',
    query: 'bollywood classic songs',
  },
  {
    id: 'feel-good',
    name: 'Feel Good Hits',
    subtitle: 'A little happiness in every song',
    query: 'feel good hindi songs',
  },
];

type CuratedPlaylist = {
  id: string;
  name: string;
  subtitle: string;
  query: string;
  tracks: Track[];
};

function SectionHeading({
  title,
  subtitle,
  colors,
}: {
  title: string;
  subtitle?: string;
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  return (
    <View style={styles.sectionHeading}>
      <View style={{ flex: 1 }}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          {title}
        </Text>

        {subtitle ? (
          <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <View
        style={[
          styles.headingDecoration,
          { backgroundColor: colors.surface },
        ]}
      >
        <Ionicons
          name="sparkles"
          size={17}
          color={colors.accent}
        />
      </View>
    </View>
  );
}

function Row({
  title,
  subtitle,
  tracks,
  colors,
}: {
  title: string;
  subtitle?: string;
  tracks: Track[];
  colors: ReturnType<typeof useTheme>['colors'];
}) {
  if (tracks.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <SectionHeading
        title={title}
        subtitle={subtitle}
        colors={colors}
      />

      <FlatList
        data={tracks}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.trackList}
        renderItem={({ item }) => (
          <TrackCard track={item} queue={tracks} />
        )}
      />
    </View>
  );
}

function uniqueTracks(tracks: Track[]): Track[] {
  const unique = new Map<string, Track>();

  tracks.forEach((track) => {
    if (!unique.has(track.id)) {
      unique.set(track.id, track);
    }
  });

  return Array.from(unique.values());
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { user } = useAuth();
  const { recent } = useLibrary();
  const { play } = usePlayer();
  const { isDark, colors, toggleTheme } = useTheme();

  // Home feed data
  const [picks, setPicks] = useState<Track[]>([]);
  const [trending, setTrending] = useState<Track[]>([]);
  const [latest, setLatest] = useState<Track[]>([]);

  // Curated playlists
  const [curatedPlaylists, setCuratedPlaylists] =
    useState<CuratedPlaylist[]>(() =>
      curatedPlaylistConfig.map((playlist) => ({
        ...playlist,
        tracks: [],
      }))
    );

  // Personalized data
  const [artistRecommendations, setArtistRecommendations] =
    useState<Track[]>([]);
  const [genreRecommendations, setGenreRecommendations] =
    useState<Track[]>([]);

  // Loading states
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(false);

  const loadingMoreRef = useRef(false);
  const trendingLengthRef = useRef(0);

  // Initial Home feed
  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    setHasMore(true);

    try {
      const results = await Promise.allSettled([
        searchTracks('arijit singh', PAGE_SIZE),
        getTrendingTracks(PAGE_SIZE, 0),
        getLatestTracks(PAGE_SIZE, 0),
      ]);

      const [picksResult, trendingResult, latestResult] = results;

      const arijitTracks =
        picksResult.status === 'fulfilled'
          ? picksResult.value
          : [];

      const trendingTracks =
        trendingResult.status === 'fulfilled'
          ? trendingResult.value
          : [];

      const latestTracks =
        latestResult.status === 'fulfilled'
          ? latestResult.value
          : [];

      setPicks(arijitTracks);
      setTrending(trendingTracks);
      setLatest(latestTracks);

      trendingLengthRef.current = trendingTracks.length;
      setHasMore(trendingTracks.length === PAGE_SIZE);

      if (
        arijitTracks.length === 0 &&
        trendingTracks.length === 0 &&
        latestTracks.length === 0
      ) {
        setError(true);
      }
    } catch (err) {
      console.log('Home feed error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Load curated playlists from Audius
  useEffect(() => {
    let cancelled = false;

    const loadCuratedPlaylists = async () => {
      const results = await Promise.all(
        curatedPlaylistConfig.map(async (playlist) => {
          try {
            const tracks = await searchTracks(
              playlist.query,
              12
            );

            return {
              ...playlist,
              tracks,
            };
          } catch (err) {
            console.log(
              `Playlist error (${playlist.name}):`,
              err
            );

            return {
              ...playlist,
              tracks: [],
            };
          }
        })
      );

      if (!cancelled) {
        setCuratedPlaylists(results);
      }
    };

    loadCuratedPlaylists();

    return () => {
      cancelled = true;
    };
  }, []);

  // Recommendations based on recently played tracks
  useEffect(() => {
    let cancelled = false;

    const loadRecommendations = async () => {
      if (recent.length === 0) {
        setArtistRecommendations([]);
        setGenreRecommendations([]);
        return;
      }

      try {
        const recentTrackIds = new Set(
          recent.map((track) => track.id)
        );

        const artists = Array.from(
          new Set(
            recent
              .slice(0, 5)
              .map((track) => track.artist)
              .filter(Boolean)
          )
        ).slice(0, 3);

        const genre = recent.find(
          (track) => track.genre?.trim()
        )?.genre;

        const [artistResults, genreResults] = await Promise.all([
          Promise.all(
            artists.map((artist) =>
              getArtistTracks(artist, 10).catch(() => [])
            )
          ),
          genre
            ? getGenreTracks(genre, PAGE_SIZE).catch(() => [])
            : Promise.resolve([]),
        ]);

        if (cancelled) return;

        const artistTracks = uniqueTracks(
          artistResults.flat()
        ).filter(
          (track) => !recentTrackIds.has(track.id)
        );

        const genreTracks = uniqueTracks(
          genreResults
        ).filter(
          (track) => !recentTrackIds.has(track.id)
        );

        setArtistRecommendations(artistTracks);
        setGenreRecommendations(genreTracks);
      } catch (err) {
        console.log('Recommendation error:', err);
      }
    };

    loadRecommendations();

    return () => {
      cancelled = true;
    };
  }, [recent]);

  // Made for You combines artist and genre recommendations
  const madeForYou = uniqueTracks([
    ...genreRecommendations,
    ...artistRecommendations,
  ]);

  // Load more trending songs when the user scrolls down
  const loadMore = useCallback(async () => {
    if (
      loading ||
      loadingMoreRef.current ||
      !hasMore
    ) {
      return;
    }

    loadingMoreRef.current = true;
    setLoadingMore(true);

    try {
      const offset = trendingLengthRef.current;

      const moreTracks = await getTrendingTracks(
        PAGE_SIZE,
        offset
      );

      if (moreTracks.length === 0) {
        setHasMore(false);
        return;
      }

      setTrending((previous) => {
        const combined = uniqueTracks([
          ...previous,
          ...moreTracks,
        ]);

        trendingLengthRef.current = combined.length;
        return combined;
      });

      if (moreTracks.length < PAGE_SIZE) {
        setHasMore(false);
      }
    } catch (err) {
      console.log('Load more error:', err);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [loading, hasMore]);

  const hour = new Date().getHours();

  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
        ? 'Good afternoon'
        : 'Good evening';

  const firstName = user?.name.split(' ')[0] ?? '';

  const featuredBackground = isDark
    ? '#302044'
    : '#E8D9FF';

  const featuredText = isDark
    ? '#FFFFFF'
    : '#28183D';

  const featuredMuted = isDark
    ? '#D6C4EF'
    : '#665080';

  const featuredTracks = picks.length > 0 ? picks : trending;

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      showsVerticalScrollIndicator={false}
      onScroll={({ nativeEvent }) => {
        const {
          layoutMeasurement,
          contentOffset,
          contentSize,
        } = nativeEvent;

        const distanceFromBottom =
          contentSize.height -
          (layoutMeasurement.height + contentOffset.y);

        if (distanceFromBottom < 500) {
          loadMore();
        }
      }}
      scrollEventThrottle={400}
      contentContainerStyle={{
        paddingTop: insets.top + 14,
        paddingBottom: 155,
      }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
          <View style={styles.brandRow}>
            <View
              style={[
                styles.brandIcon,
                { backgroundColor: colors.surface },
              ]}
            >
              <Ionicons
                name="musical-note"
                size={16}
                color={colors.accent}
              />
            </View>

            <Text style={[styles.brandName, { color: colors.text }]}>
              dhunn
            </Text>
          </View>

          <Text style={[styles.greeting, { color: colors.accent }]}>
            {greeting} ✨
          </Text>

          <Text style={[styles.title, { color: colors.text }]}>
            Hello, {firstName}
          </Text>

          <Text style={[styles.headerSub, { color: colors.muted }]}>
            Your music, your moment.
          </Text>
        </View>

        <View style={styles.headerActions}>
          <Pressable
            onPress={toggleTheme}
            style={[
              styles.themeButton,
              { backgroundColor: colors.surface },
            ]}
            accessibilityLabel={
              isDark ? 'Switch to light mode' : 'Switch to dark mode'
            }
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={20}
              color={colors.accent}
            />
          </Pressable>

          <Pressable
            onPress={() => router.push('/profile')}
            accessibilityLabel="Open profile"
            style={[
              styles.profileButton,
              { borderColor: colors.accent },
            ]}
          >
            {user?.photo ? (
              <Image
                source={{ uri: user.photo }}
                style={styles.avatar}
              />
            ) : (
              <View
                style={[
                  styles.avatarFallback,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text
                  style={[
                    styles.avatarText,
                    { color: colors.accent },
                  ]}
                >
                  {firstName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* FEATURED MIX */}
      <View style={styles.sectionContainer}>
        <View style={styles.featuredHeading}>
          <View>
            <Text
              style={[
                styles.eyebrow,
                { color: colors.accent },
              ]}
            >
              YOUR DAILY SOUNDTRACK
            </Text>

            <Text
              style={[
                styles.sectionTitle,
                { color: colors.text },
              ]}
            >
              Made for this moment
            </Text>
          </View>

          <Ionicons
            name="sparkles"
            size={22}
            color={colors.accent}
          />
        </View>

        <Pressable
          onPress={() => {
            if (featuredTracks.length > 0) {
              play(featuredTracks[0], featuredTracks);
            }
          }}
          disabled={featuredTracks.length === 0}
          style={[
            styles.featured,
            { backgroundColor: featuredBackground },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Play Evening Drive"
        >
          <View
            style={[
              styles.featuredGlow,
              {
                backgroundColor: isDark
                  ? '#7551A9'
                  : '#C2A2F2',
              },
            ]}
          />

          <View
            style={[
              styles.featuredGlowSmall,
              {
                backgroundColor: isDark
                  ? '#A17ACF'
                  : '#D4BDF5',
              },
            ]}
          />

          <View style={styles.featuredTop}>
            <View style={styles.tag}>
              <Ionicons
                name="radio"
                size={12}
                color="#FFFFFF"
              />

              <Text style={styles.tagText}>
                DHUN EXCLUSIVE
              </Text>
            </View>

            <View style={styles.musicIconCircle}>
              <Ionicons
                name="musical-notes"
                size={23}
                color={featuredText}
              />
            </View>
          </View>

          <View style={styles.featuredContent}>
            <Text
              style={[
                styles.featuredSmall,
                { color: featuredMuted },
              ]}
            >
              A LITTLE MUSIC, A LOT OF FEELING
            </Text>

            <Text
              style={[
                styles.featuredTitle,
                { color: featuredText },
              ]}
            >
              Evening{'\n'}Drive.
            </Text>

            <Text
              style={[
                styles.featuredSub,
                { color: featuredMuted },
              ]}
            >
              {featuredTracks.length
                ? `${featuredTracks.length} songs picked for you`
                : 'Your mix is getting ready...'}
            </Text>

            <View style={styles.playButton}>
              <Ionicons
                name="play"
                size={17}
                color="#211832"
              />

              <Text style={styles.playButtonText}>
                Play mix
              </Text>
            </View>
          </View>
        </Pressable>
      </View>

      {/* MOOD SECTION */}
      <View style={styles.sectionContainer}>
        <View style={styles.moodHeading}>
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.text },
            ]}
          >
            What's your mood?
          </Text>

          <Text
            style={[
              styles.sectionSubtitle,
              { color: colors.muted },
            ]}
          >
            Find the sound that matches you.
          </Text>
        </View>

        <View style={styles.moodGrid}>
          {moods.map((mood, index) => (
            <Pressable
              key={mood.name}
              style={[
                styles.moodCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
              onPress={() =>
                router.push({
                  pathname: '/search',
                  params: { q: mood.query },
                })
              }
            >
              <View
                style={[
                  styles.moodIcon,
                  {
                    backgroundColor: isDark
                      ? '#342548'
                      : '#EDE4FF',
                  },
                ]}
              >
                <Ionicons
                  name={mood.icon}
                  size={21}
                  color={
                    index % 2 === 0
                      ? colors.accent
                      : '#A98BE8'
                  }
                />
              </View>

              <Text
                style={[
                  styles.moodName,
                  { color: colors.text },
                ]}
              >
                {mood.name}
              </Text>

              <Ionicons
                name="arrow-up-right-box"
                size={17}
                color={colors.muted}
              />
            </Pressable>
          ))}
        </View>
      </View>

      {/* LOADING */}
      {loading ? (
        <StateMessage
          loading
          text="Finding your music..."
        />
      ) : null}

      {/* ERROR */}
      {error ? (
        <StateMessage
          text="Could not load songs. Check your internet and try again."
          actionLabel="Try again"
          onAction={load}
        />
      ) : null}

      {/* SONG SECTIONS */}
      {!loading && !error ? (
        <>
          {/* CURATED PLAYLISTS */}
          {curatedPlaylists.map((playlist) => (
            <Row
              key={playlist.id}
              title={playlist.name}
              subtitle={playlist.subtitle}
              tracks={playlist.tracks}
              colors={colors}
            />
          ))}

          <Row
            title="Recently played"
            subtitle="Pick up where you left off"
            tracks={recent}
            colors={colors}
          />

          <Row
            title="For Arijit fans"
            subtitle="Handpicked Hindi favourites"
            tracks={picks}
            colors={colors}
          />

          <Row
            title="Trending now"
            subtitle="Popular tracks this week"
            tracks={trending}
            colors={colors}
          />

          <Row
            title="New releases"
            subtitle="Fresh music from creators"
            tracks={latest}
            colors={colors}
          />

          <Row
            title="Made for you"
            subtitle="Based on your listening history"
            tracks={madeForYou}
            colors={colors}
          />

          <Row
            title="Your favourite artists"
            subtitle="More music from artists you play"
            tracks={artistRecommendations}
            colors={colors}
          />

          <Row
            title="Explore similar genres"
            subtitle="Discover music matching your taste"
            tracks={genreRecommendations}
            colors={colors}
          />

          {loadingMore ? (
            <StateMessage
              loading
              text="Loading more music..."
            />
          ) : null}

          {!hasMore && trending.length > 0 ? (
            <Text
              style={[
                styles.endMessage,
                { color: colors.muted },
              ]}
            >
              You're all caught up!
            </Text>
          ) : null}
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 22,
  },

  headerInfo: {
    flex: 1,
  },

  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
  },

  brandIcon: {
    width: 27,
    height: 27,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandName: {
    fontSize: 19,
    fontWeight: '900',
    letterSpacing: 1.2,
  },

  greeting: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  title: {
    fontSize: 27,
    fontWeight: '800',
    marginTop: 5,
  },

  headerSub: {
    fontSize: 13,
    marginTop: 4,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  themeButton: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileButton: {
    borderWidth: 1.5,
    borderRadius: 25,
    padding: 3,
  },

  avatar: {
    width: 39,
    height: 39,
    borderRadius: 22,
  },

  avatarFallback: {
    width: 39,
    height: 39,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    fontSize: 18,
    fontWeight: '800',
  },

  sectionContainer: {
    marginTop: 30,
  },

  sectionHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    marginBottom: 15,
  },

  featuredHeading: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    marginBottom: 15,
  },

  headingDecoration: {
    width: 34,
    height: 34,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 7,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
  },

  sectionSubtitle: {
    fontSize: 12,
    marginTop: 5,
  },

  featured: {
    minHeight: 255,
    marginHorizontal: 22,
    marginTop: 4,
    borderRadius: 26,
    padding: 21,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },

  featuredGlow: {
    position: 'absolute',
    width: 230,
    height: 230,
    borderRadius: 120,
    right: -65,
    top: 35,
    opacity: 0.55,
  },

  featuredGlowSmall: {
    position: 'absolute',
    width: 125,
    height: 125,
    borderRadius: 70,
    right: 35,
    top: 65,
    opacity: 0.35,
  },

  featuredTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.16)',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
  },

  tagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  musicIconCircle: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  featuredContent: {
    marginTop: 25,
  },

  featuredSmall: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
  },

  featuredTitle: {
    fontSize: 38,
    fontWeight: '900',
    lineHeight: 41,
    marginTop: 7,
  },

  featuredSub: {
    fontSize: 12,
    marginTop: 8,
  },

  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    paddingHorizontal: 17,
    paddingVertical: 11,
    marginTop: 15,
  },

  playButtonText: {
    color: '#211832',
    fontWeight: '800',
    fontSize: 12,
  },

  moodHeading: {
    paddingHorizontal: 22,
  },

  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 22,
    gap: 10,
    marginTop: 15,
  },

  moodCard: {
    width: '48%',
    minHeight: 78,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    padding: 12,
    borderRadius: 17,
    borderWidth: 1,
    flexGrow: 1,
  },

  moodIcon: {
    width: 37,
    height: 37,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  moodName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
  },

  trackList: {
    paddingHorizontal: 22,
    gap: 14,
  },

  endMessage: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
  },
});
