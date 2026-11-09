import { Track } from '../types';

type ItunesResult = {
  trackId?: number;
  trackName?: string;
  artistName?: string;
  collectionName?: string;
  artworkUrl100?: string;
  previewUrl?: string;
};

// Free iTunes Search API: no key needed, gives 30-second previews.
export async function searchTracks(term: string, limit = 25): Promise<Track[]> {
  const url =
    'https://itunes.apple.com/search?media=music&entity=song&country=IN' +
    `&limit=${limit}&term=${encodeURIComponent(term)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Network error');
  const data = (await res.json()) as { results: ItunesResult[] };
  return data.results
    .filter((r) => r.trackId && r.previewUrl)
    .map((r) => ({
      id: String(r.trackId),
      title: r.trackName ?? 'Unknown',
      artist: r.artistName ?? 'Unknown',
      album: r.collectionName ?? '',
      artwork: (r.artworkUrl100 ?? '').replace('100x100bb', '400x400bb'),
      previewUrl: r.previewUrl as string,
    }));
}

export function formatTime(seconds: number): string {
  const s = Math.max(0, Math.floor(seconds || 0));
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}