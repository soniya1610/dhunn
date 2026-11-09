import { setAudioModeAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Track } from '../types';
import { useLibrary } from './LibraryContext';

type PlayerCtx = {
  current: Track | null;
  isPlaying: boolean;
  isBuffering: boolean;
  position: number;
  duration: number;
  shuffle: boolean;
  repeat: boolean;
  play: (track: Track, queue?: Track[]) => void;
  toggle: () => void;
  next: () => void;
  prev: () => void;
  seekToRatio: (ratio: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
};

const Ctx = createContext<PlayerCtx | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const player = useAudioPlayer(null);
  const status = useAudioPlayerStatus(player);
  const { addRecent } = useLibrary();

  const [current, setCurrent] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);

  // Refs always hold the latest values so the "song finished" handler never goes stale.
  const currentRef = useRef(current);
  const queueRef = useRef(queue);
  const shuffleRef = useRef(shuffle);
  const repeatRef = useRef(repeat);
  currentRef.current = current;
  queueRef.current = queue;
  shuffleRef.current = shuffle;
  repeatRef.current = repeat;

  useEffect(() => {
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  const startTrack = (track: Track) => {
    setCurrent(track);
    player.replace(track.previewUrl);
    player.play();
    addRecent(track);
  };

  const play = (track: Track, q?: Track[]) => {
    if (q && q.length) setQueue(q);
    else if (!queueRef.current.some((t) => t.id === track.id)) setQueue([track]);
    startTrack(track);
  };

  const step = (direction: 1 | -1) => {
    const q = queueRef.current;
    const cur = currentRef.current;
    if (!cur || q.length === 0) return;
    if (q.length === 1) {
      player.seekTo(0);
      player.play();
      return;
    }
    const idx = Math.max(0, q.findIndex((t) => t.id === cur.id));
    const target = shuffleRef.current && direction === 1
      ? q[Math.floor(Math.random() * q.length)]
      : q[(idx + direction + q.length) % q.length];
    startTrack(target);
  };

  const next = () => step(1);
  const prev = () => {
    if (status.currentTime > 3) {
      player.seekTo(0);
    } else {
      step(-1);
    }
  };

  const toggle = () => {
    if (!currentRef.current) return;
    if (status.playing) player.pause();
    else player.play();
  };

  const seekToRatio = (ratio: number) => {
    if (!status.duration) return;
    player.seekTo(Math.min(Math.max(ratio, 0), 1) * status.duration);
  };

  // When a song ends: repeat it, or go to the next one.
  const nextRef = useRef(next);
  nextRef.current = next;
  useEffect(() => {
    if (!status.didJustFinish) return;
    if (repeatRef.current) {
      player.seekTo(0);
      player.play();
    } else {
      nextRef.current();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status.didJustFinish]);

  const value: PlayerCtx = {
    current,
    isPlaying: status.playing,
    isBuffering: status.isBuffering,
    position: status.currentTime,
    duration: status.duration,
    shuffle,
    repeat,
    play,
    toggle,
    next,
    prev,
    seekToRatio,
    toggleShuffle: () => setShuffle((v) => !v),
    toggleRepeat: () => setRepeat((v) => !v),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function usePlayer(): PlayerCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error('usePlayer must be used inside PlayerProvider');
  return v;
}