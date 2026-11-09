export type Track = {
  id: string;
  title: string;
  artist: string;
  album: string;
  artwork: string;
  previewUrl: string;
};

export type Playlist = {
  id: string;
  name: string;
  tracks: Track[];
};