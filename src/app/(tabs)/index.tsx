
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
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
import { searchTracks } from '../../services/api';
import { Track } from '../../types';

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

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const { user } = useAuth();
  const { recent } = useLibrary();
  const { play } = usePlayer();
  const { isDark, colors, toggleTheme } = useTheme();

  const [picks, setPicks] = useState<Track[]>([]);
  const [trending, setTrending] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);

    try {
      const [a, b] = await Promise.all([
        searchTracks('arijit singh', 20),
        searchTracks('top hindi songs', 20),
      ]);

      setPicks(a);
      setTrending(b);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      showsVerticalScrollIndicator={false}
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
          onPress={() => picks[0] && play(picks[0], picks)}
          disabled={picks.length === 0}
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

              <Text style={styles.tagText}>DHUN EXCLUSIVE</Text>
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
              {picks.length
                ? `${picks.length} songs picked for you`
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
          <Row
            title="Recently played"
            subtitle="Pick up where you left off"
            tracks={recent}
            colors={colors}
          />

          <Row
            title="For Arijit fans"
            subtitle="Songs you'll love"
            tracks={picks}
            colors={colors}
          />

          <Row
            title="Trending now"
            subtitle="What everyone's listening to"
            tracks={trending}
            colors={colors}
          />
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
});
