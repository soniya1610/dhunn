
import { Track } from '../types';

const AUDIUS_API = 'https://api.audius.co/v1';

type AudiusTrack = {
  track_id?: number;
  title?: string;
  genre?: string;
  is_streamable?: boolean;
  is_available?: boolean;
  is_unlisted?: boolean;
  artwork?: {
    '150x150'?: string;
    '480x480'?: string;
    '1000x1000'?: string;
  };
  stream?: {
    url?: string;
  };
  user?: {
    name?: string;
    handle?: string;
  };
  album_backlink?: {
    title?: string;
  } | null;
};

type AudiusResponse = {
  data?: AudiusTrack[];
};

function mapTracks(data: AudiusTrack[] = []): Track[] {
  return data
    .filter(
      (track) =>
        track.track_id &&
        track.is_streamable === true &&
        track.is_available === true &&
        !track.is_unlisted &&
        track.stream?.url
    )
    .map((track) => ({
      id: String(track.track_id),
      title: track.title ?? 'Unknown Track',
      artist:
        track.user?.name ??
        track.user?.handle ??
        'Unknown Artist',
      album: track.album_backlink?.title ?? '',
      artwork:
        track.artwork?.['480x480'] ??
        track.artwork?.['1000x1000'] ??
        track.artwork?.['150x150'] ??
        '',
      previewUrl: track.stream!.url!,
      genre: track.genre ?? '',
    }));
}

async function fetchTracks(endpoint: string): Promise<Track[]> {
  const response = await fetch(`${AUDIUS_API}${endpoint}`);

  if (!response.ok) {
    throw new Error(`Audius API error: ${response.status}`);
  }

  const result = (await response.json()) as AudiusResponse;
  return mapTracks(result.data);
}

// Normalize text before comparing search results.
function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Calculate similarity using Levenshtein distance.
function similarity(a: string, b: string): number {
  const first = normalize(a);
  const second = normalize(b);

  if (!first || !second) return 0;
  if (first === second) return 1;

  const matrix: number[][] = Array.from(
    { length: first.length + 1 },
    () => Array(second.length + 1).fill(0)
  );

  for (let i = 0; i <= first.length; i++) {
    matrix[i][0] = i;
  }

  for (let j = 0; j <= second.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= first.length; i++) {
    for (let j = 1; j <= second.length; j++) {
      const cost =
        first[i - 1] === second[j - 1] ? 0 : 1;

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[first.length][second.length];

  return 1 - distance / Math.max(first.length, second.length);
}

// Give higher priority to matching artist and song names.
function getMatchScore(track: Track, query: string): number {
  const artistScore = similarity(query, track.artist);
  const titleScore = similarity(query, track.title);
  const albumScore = similarity(query, track.album);

  const combined = `${track.artist} ${track.title}`;
  const combinedScore = similarity(query, combined);

  const queryWords = normalize(query).split(' ');
  const artistWords = normalize(track.artist).split(' ');
  const titleWords = normalize(track.title).split(' ');

  const wordScore = Math.max(
    ...queryWords.map((word) =>
      Math.max(
        ...[...artistWords, ...titleWords].map((candidate) =>
          similarity(word, candidate)
        )
      )
    )
  );

  return Math.max(
    artistScore,
    titleScore,
    albumScore,
    combinedScore,
    wordScore * 0.9
  );
}

// Search with partial matching and typo-tolerant ranking.
export async function searchTracks(
  term: string,
  limit = 25
): Promise<Track[]> {
  const query = term.trim();

  if (!query) return [];

  const safeLimit = Math.min(Math.max(limit, 1), 100);

  const directResults = await fetchTracks(
    `/tracks/search?query=${encodeURIComponent(query)}&limit=${safeLimit}`
  );

  let combined = [...directResults];

  // Search using the first word when direct results are insufficient.
  if (directResults.length < 3) {
    const firstWord = query.split(/\s+/)[0];

    if (firstWord.length >= 2) {
      try {
        const fallbackResults = await fetchTracks(
          `/tracks/search?query=${encodeURIComponent(firstWord)}&limit=${safeLimit}`
        );

        combined = [...combined, ...fallbackResults];
      } catch {
        // Keep direct results if fallback search fails.
      }
    }
  }

  // Remove duplicate tracks.
  const uniqueTracks = Array.from(
    new Map(combined.map((track) => [track.id, track])).values()
  );

  // Rank the most relevant matches first.
  return uniqueTracks
    .map((track) => ({
      track,
      score: getMatchScore(track, query),
    }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.track)
    .slice(0, safeLimit);
}

// Trending tracks
export async function getTrendingTracks(
  limit = 20,
  offset = 0
): Promise<Track[]> {
  return fetchTracks(
    `/tracks/trending?time=week&limit=${limit}&offset=${offset}`
  );
}

// Latest releases
export async function getLatestTracks(
  limit = 20,
  offset = 0
): Promise<Track[]> {
  return fetchTracks(
    `/tracks/latest?limit=${limit}&offset=${offset}`
  );
}

// Tracks by genre
export async function getGenreTracks(
  genre: string,
  limit = 20
): Promise<Track[]> {
  if (!genre.trim()) return [];

  return fetchTracks(
    `/tracks/trending?genre=${encodeURIComponent(genre)}&time=week&limit=${limit}`
  );
}

// Tracks by artist
export async function getArtistTracks(
  artist: string,
  limit = 20
): Promise<Track[]> {
  if (!artist.trim()) return [];

  return searchTracks(artist, limit);
}

export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds || 0));
  const m = Math.floor(s / 60);

  return `${m}:${String(s % 60).padStart(2, '0')}`;
}
