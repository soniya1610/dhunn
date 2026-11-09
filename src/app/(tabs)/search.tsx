
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
import { palette } from '../../constants/dhunTheme';
import { useTheme } from '../../context/ThemeContext';
import { searchTracks } from '../../services/api';
import { Track } from '../../types';

const CATEGORIES = [
  { name: 'Bollywood', term: 'bollywood hits', text: '#fff' },
  { name: 'Pop', term: 'pop hits', text: '#fff' },
  { name: 'Romantic', term: 'romantic hindi songs', text: '#fff' },
  { name: 'Hip-hop', term: 'hip hop', text: '#111' },
  { name: 'Lo-fi', term: 'lofi chill', text: '#fff' },
  { name: 'Devotional', term: 'bhajan', text: '#fff' },
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
        if (!cancelled) setError(true);
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
          paddingTop: insets.top + 16,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        Search
      </Text>

      <View
        style={[
          styles.inputBox,
          { backgroundColor: colors.surface, borderColor: colors.border },
        ]}
      >
        <Ionicons name="search" size={20} color={colors.muted} />

        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Songs, artists, albums"
          placeholderTextColor={colors.muted}
          style={[styles.input, { color: colors.text }]}
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
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
          <Text style={[styles.section, { color: colors.text }]}>
            Browse categories
          </Text>

          <View style={styles.grid}>
            {CATEGORIES.map((c, i) => (
              <Pressable
                key={c.name}
                onPress={() => setQuery(c.term)}
                style={[
                  styles.tile,
                  { backgroundColor: palette[i % palette.length] },
                ]}
                accessibilityRole="button"
                accessibilityLabel={`Search ${c.name}`}
              >
                <Text style={[styles.tileText, { color: c.text }]}>
                  {c.name}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(t) => t.id}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 160 }}
          renderItem={({ item }) => (
            <TrackRow track={item} queue={results} />
          )}
          ListEmptyComponent={
            loading ? (
              <StateMessage loading text="Searching..." />
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
  title: {
    fontSize: 34,
    fontWeight: '800',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    height: 48,
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    marginTop: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  section: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  tile: {
    width: '47.5%',
    height: 92,
    borderRadius: 14,
    padding: 12,
    justifyContent: 'flex-end',
  },
  tileText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
