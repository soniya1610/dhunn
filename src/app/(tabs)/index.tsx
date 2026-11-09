
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
  { name: 'Chill', icon: 'cloudy-night-outline' as const, query: 'lofi chill' },
  { name: 'Romantic', icon: 'heart-outline' as const, query: 'romantic hindi songs' },
  { name: 'Focus', icon: 'headset-outline' as const, query: 'focus music' },
  { name: 'Energy', icon: 'flash-outline' as const, query: 'energetic hindi songs' },
];

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
      <View style={styles.sectionHeader}>
        <View>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
              {subtitle}
            </Text>
          ) : null}
        </View>
      </View>

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

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: insets.top + 14,
        paddingBottom: 160,
      }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerInfo}>
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
              size={21}
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
              <Image source={{ uri: user.photo }} style={styles.avatar} />
            ) : (
              <View
                style={[
                  styles.avatarFallback,
                  { backgroundColor: colors.surface },
                ]}
              >
                <Text style={[styles.avatarText, { color: colors.accent }]}>
                  {firstName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>

      {/* FEATURED MIX */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <View>
            <Text style={[styles.eyebrow, { color: colors.accent }]}>
              YOUR DAILY SOUNDTRACK
            </Text>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Made for this moment
            </Text>
          </View>

          <Ionicons name="sparkles" size={22} color={colors.accent} />
        </View>

        <Pressable
          onPress={() => picks[0] && play(picks[0], picks)}
          disabled={picks.length === 0}
          style={[
            styles.featured,
            { backgroundColor: isDark ? '#8F392C' : '#F3C9B8' },
          ]}
          accessibilityRole="button"
          accessibilityLabel="Play Evening Drive"
        >
          <View
            style={[
              styles.featuredGlow,
              { backgroundColor: isDark ? '#C65B43' : '#E8A48B' },
            ]}
          />

          <View style={styles.featuredTop}>
            <View style={styles.tag}>
              <Ionicons name="radio" size={12} color="#FFFFFF" />
              <Text style={styles.tagText}>DHUN MIX</Text>
            </View>

            <Ionicons
              name="musical-notes"
              size={25}
              color={isDark ? '#FFE0D3' : '#713B2C'}
            />
          </View>

          <View>
            <Text
              style={[
                styles.featuredSmall,
                { color: isDark ? '#FFE0D3' : '#713B2C' },
              ]}
            >
              A LITTLE MUSIC, A LOT OF FEELING
            </Text>

            <Text
              style={[
                styles.featuredTitle,
                { color: isDark ? '#FFFFFF' : '#38231E' },
              ]}
            >
              Evening{'\n'}Drive.
            </Text>

            <Text
              style={[
                styles.featuredSub,
                { color: isDark ? '#FFE0D3' : '#713B2C' },
              ]}
            >
              {picks.length
                ? `${picks.length} songs picked for you`
                : 'Your mix is getting ready...'}
            </Text>

            <View style={styles.playButton}>
              <Ionicons name="play" size={18} color="#171719" />
              <Text style={styles.playButtonText}>Play mix</Text>
            </View>
          </View>
        </Pressable>
      </View>

      {/* MOOD SECTION */}
      <View style={styles.sectionContainer}>
        <View style={styles.moodHeading}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            What's your mood?
          </Text>

          <Text style={[styles.sectionSubtitle, { color: colors.muted }]}>
            Find the sound that matches you.
          </Text>
        </View>

        <View style={styles.moodGrid}>
          {moods.map((mood) => (
            <Pressable
              key={mood.name}
              style={[
                styles.moodCard,
                { backgroundColor: colors.surface },
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
                    backgroundColor: isDark ? '#30221F' : '#FCE9E1',
                  },
                ]}
              >
                <Ionicons
                  name={mood.icon}
                  size={21}
                  color={colors.accent}
                />
              </View>

              <Text style={[styles.moodName, { color: colors.text }]}>
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

      {/* LOADING AND ERROR */}
      {loading ? (
        <StateMessage loading text="Finding your music..." />
      ) : null}

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
  greeting: {
    fontSize: 13,
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
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileButton: {
    borderWidth: 2,
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
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    marginBottom: 15,
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
    minHeight: 245,
    marginHorizontal: 22,
    marginTop: 4,
    borderRadius: 25,
    padding: 21,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  featuredGlow: {
    position: 'absolute',
    width: 210,
    height: 210,
    borderRadius: 110,
    right: -65,
    top: 35,
    opacity: 0.65,
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
    backgroundColor: 'rgba(255,255,255,0.17)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  featuredSmall: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
  },
  featuredTitle: {
    fontSize: 37,
    fontWeight: '900',
    lineHeight: 40,
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
    paddingVertical: 10,
    marginTop: 15,
  },
  playButtonText: {
    color: '#171719',
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
    borderRadius: 16,
    flexGrow: 1,
  },
  moodIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
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
