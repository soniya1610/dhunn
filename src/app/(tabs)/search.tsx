
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import StateMessage from '../../components/StateMessage';
import TrackRow from '../../components/TrackRow';
import { useTheme } from '../../context/ThemeContext';
import { searchTracks } from '../../services/api';
import { Track } from '../../types';

const CATEGORIES = [
  { name: 'Bollywood', term: 'bollywood hits', icon: 'film-outline' as const },
  { name: 'Pop', term: 'pop hits', icon: 'musical-notes-outline' as const },
  { name: 'Romantic', term: 'romantic hindi songs', icon: 'heart-outline' as const },
  { name: 'Hip-hop', term: 'hip hop', icon: 'mic-outline' as const },
  { name: 'Lo-fi', term: 'lofi chill', icon: 'moon-outline' as const },
  { name: 'Devotional', term: 'bhajan', icon: 'flower-outline' as const },
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    const q = query.trim();

    if (q.length < 2) {
      setResults([]);
      setError(false);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(false);

    const timer = setTimeout(async () => {
      try {
        const r = await searchTracks(q, 30);
        if (!cancelled) setResults(r);
      } catch {
        if (!cancelled) {
          setResults([]);
          setError(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 450);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query, retry]);

  const searching = query.trim().length >= 2;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          paddingTop: insets.top + 18,
        },
      ]}
    >
      <Text style={[styles.eyebrow, { color: colors.accent }]}>
        FIND YOUR SOUND
      </Text>
      <Text style={[styles.title, { color: colors.text }]}>Search</Text>

      <View
        style={[
          styles.inputBox,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Ionicons name="search" size={21} color={colors.accent} />

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Songs, artists, albums..."
          placeholderTextColor={colors.muted}
          style={[styles.input, { color: colors.text }]}
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
          autoCorrect={false}
        />

        {query ? (
          <Pressable
            onPress={() => setQuery('')}
            hitSlop={10}
            accessibilityLabel="Clear search"
          >
            <Ionicons name="close-circle" size={20} color={colors.muted} />
          </Pressable>
        ) : null}
      </View>

      {!searching ? (
        <View>
          <View style={styles.sectionHeader}>
            <Text style={[styles.section, { color: colors.text }]}>
              Browse categories
            </Text>
            <Text style={[styles.categoryHint, { color: colors.muted }]}>
              Explore your mood
            </Text>
          </View>

          <View style={styles.grid}>
            {CATEGORIES.map((category, index) => (
              <Pressable
                key={category.name}
                onPress={() => setQuery(category.term)}
                style={[
                  styles.tile,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Search ${category.name}`}
              >
                <View
                  style={[
                    styles.tileIcon,
                    {
                      backgroundColor:
                        index % 2 === 0
                          ? 'rgba(173,130,255,0.17)'
                          : 'rgba(215,38,61,0.12)',
                    },
                  ]}
                >
                  <Ionicons
                    name={category.icon}
                    size={24}
                    color={colors.accent}
                  />
                </View>

                <Text style={[styles.tileText, { color: colors.text }]}>
                  {category.name}
                </Text>
                <Ionicons
                  name="arrow-up-right-box"
                  size={18}
                  color={colors.muted}
                  style={styles.tileArrow}
                />
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(t) => t.id}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 160 }}
          renderItem={({ item }) => (
            <TrackRow track={item} queue={results} />
          )}
          ListHeaderComponent={
            <Text style={[styles.resultsTitle, { color: colors.text }]}>
              Search results
            </Text>
          }
          ListEmptyComponent={
            loading ? (
              <StateMessage loading text="Searching songs..." />
            ) : error ? (
              <StateMessage
                text="Search failed. Check your internet."
                actionLabel="Try again"
                onAction={() => setRetry((n) => n + 1)}
              />
            ) : (
              <StateMessage text="No songs found. Try a different name." />
            )
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 5,
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -1,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    height: 54,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 15,
    marginTop: 19,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    fontSize: 14,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  section: {
    fontSize: 18,
    fontWeight: '800',
  },
  categoryHint: {
    fontSize: 11,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    width: '48%',
    minHeight: 128,
    borderRadius: 19,
    borderWidth: 1,
    padding: 14,
    justifyContent: 'space-between',
  },
  tileIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileText: {
    fontSize: 15,
    fontWeight: '800',
    marginTop: 15,
  },
  tileArrow: {
    position: 'absolute',
    right: 13,
    bottom: 13,
  },
  resultsTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 8,
  },
});
