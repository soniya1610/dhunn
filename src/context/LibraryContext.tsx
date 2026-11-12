
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { Playlist, Track } from '../types';
import { auth, db } from '../services/firebase';
import { useAuth } from './AuthContext';

type LibState = {
  liked: Track[];
  playlists: Playlist[];
  recent: Track[];
  playedCount: number;
};

const EMPTY: LibState = {
  liked: [],
  playlists: [],
  recent: [],
  playedCount: 0,
};

type LibCtx = LibState & {
  isLiked: (id: string) => boolean;
  toggleLike: (track: Track) => void;
  createPlaylist: (name: string) => string;
  deletePlaylist: (id: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  addRecent: (track: Track) => void;
};

const Ctx = createContext<LibCtx | null>(null);

export function LibraryProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { user } = useAuth();
  const email = user?.email;
  const uid = auth.currentUser?.uid;

  const [state, setState] = useState<LibState>(EMPTY);
  const loadedFor = useRef<string | null>(null);

  // Load local and cloud library for the authenticated user.
  useEffect(() => {
    let active = true;
    loadedFor.current = null;

    if (!email || !uid) {
      setState(EMPTY);
      return;
    }

    const loadLibrary = async () => {
      let nextState: LibState = EMPTY;

      try {
        const raw = await AsyncStorage.getItem(`dhun:lib:${email}`);

        if (raw) {
          nextState = {
            ...EMPTY,
            ...(JSON.parse(raw) as Partial<LibState>),
          };
        }
      } catch (error) {
        console.warn('Local library load failed:', error);
      }

      try {
        const libraryRef = doc(db, 'users', uid, 'library', 'main');
        const snapshot = await getDoc(libraryRef);

        if (snapshot.exists()) {
          nextState = {
            ...EMPTY,
            ...(snapshot.data() as Partial<LibState>),
          };
        } else {
          // First cloud sync: upload existing local library.
          await setDoc(libraryRef, {
            ...nextState,
            updatedAt: serverTimestamp(),
          });
        }
      } catch (error) {
        // Keep local library available if cloud is offline.
        console.warn('Cloud library load failed:', error);
      }

      if (active) {
        loadedFor.current = uid;
        setState(nextState);
      }
    };

    loadLibrary();

    return () => {
      active = false;
    };
  }, [email, uid]);

  // Save locally and sync changes to Firestore.
  useEffect(() => {
    if (!email || !uid || loadedFor.current !== uid) {
      return;
    }

    const saveLibrary = async () => {
      try {
        await AsyncStorage.setItem(
          `dhun:lib:${email}`,
          JSON.stringify(state)
        );
      } catch (error) {
        console.warn('Local library save failed:', error);
      }
    };

    saveLibrary();

    const timer = setTimeout(async () => {
      try {
        const libraryRef = doc(db, 'users', uid, 'library', 'main');

        await setDoc(libraryRef, {
          ...state,
          updatedAt: serverTimestamp(),
        });
      } catch (error) {
        console.warn('Cloud library sync failed:', error);
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [state, email, uid]);

  const isLiked = useCallback(
    (id: string) => state.liked.some((t) => t.id === id),
    [state.liked]
  );

  const toggleLike = useCallback((track: Track) => {
    setState((s) => ({
      ...s,
      liked: s.liked.some((t) => t.id === track.id)
        ? s.liked.filter((t) => t.id !== track.id)
        : [track, ...s.liked],
    }));
  }, []);

  const createPlaylist = useCallback((name: string) => {
    const id = `p${Date.now()}`;

    setState((s) => ({
      ...s,
      playlists: [
        {
          id,
          name: name.trim() || 'New playlist',
          tracks: [],
        },
        ...s.playlists,
      ],
    }));

    return id;
  }, []);

  const deletePlaylist = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      playlists: s.playlists.filter((p) => p.id !== id),
    }));
  }, []);

  const addToPlaylist = useCallback(
    (playlistId: string, track: Track) => {
      setState((s) => ({
        ...s,
        playlists: s.playlists.map((p) =>
          p.id === playlistId &&
          !p.tracks.some((t) => t.id === track.id)
            ? { ...p, tracks: [...p.tracks, track] }
            : p
        ),
      }));
    },
    []
  );

  const removeFromPlaylist = useCallback(
    (playlistId: string, trackId: string) => {
      setState((s) => ({
        ...s,
        playlists: s.playlists.map((p) =>
          p.id === playlistId
            ? {
                ...p,
                tracks: p.tracks.filter((t) => t.id !== trackId),
              }
            : p
        ),
      }));
    },
    []
  );

  const addRecent = useCallback((track: Track) => {
    setState((s) => ({
      ...s,
      recent: [
        track,
        ...s.recent.filter((t) => t.id !== track.id),
      ].slice(0, 20),
      playedCount: s.playedCount + 1,
    }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      isLiked,
      toggleLike,
      createPlaylist,
      deletePlaylist,
      addToPlaylist,
      removeFromPlaylist,
      addRecent,
    }),
    [
      state,
      isLiked,
      toggleLike,
      createPlaylist,
      deletePlaylist,
      addToPlaylist,
      removeFromPlaylist,
      addRecent,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLibrary(): LibCtx {
  const v = useContext(Ctx);

  if (!v) {
    throw new Error('useLibrary must be used inside LibraryProvider');
  }

  return v;
}
