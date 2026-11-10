
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

export type User = {
  name: string;
  email: string;
  photo?: string;
};

type StoredUser = User & { password: string };

const USERS_KEY = 'dhun:users';
const SESSION_KEY = 'dhun:session';

type AuthCtx = {
  user: User | null;
  loading: boolean;
  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  resetPassword: (
    email: string,
    newPassword: string
  ) => Promise<string | null>;
  signOut: () => Promise<void>;
  updatePhoto: (uri: string) => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

async function readUsers(): Promise<StoredUser[]> {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

const strip = (u: StoredUser): User => ({
  name: u.name,
  email: u.email,
  photo: u.photo,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const email = await AsyncStorage.getItem(SESSION_KEY);

        if (email) {
          const found = (await readUsers()).find(
            (u) => u.email === email
          );

          if (found) setUser(strip(found));
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const cleanEmail = email.trim().toLowerCase();

      if (!name.trim()) return 'Please enter your name.';

      if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
        return 'Please enter a valid email.';
      }

      if (password.length < 6) {
        return 'Password must be at least 6 characters.';
      }

      const users = await readUsers();

      if (users.some((u) => u.email === cleanEmail)) {
        return 'An account with this email already exists.';
      }

      const created: StoredUser = {
        name: name.trim(),
        email: cleanEmail,
        password,
      };

      await AsyncStorage.setItem(
        USERS_KEY,
        JSON.stringify([...users, created])
      );

      await AsyncStorage.setItem(SESSION_KEY, cleanEmail);

      setUser(strip(created));

      return null;
    },
    []
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const cleanEmail = email.trim().toLowerCase();

      const found = (await readUsers()).find(
        (u) => u.email === cleanEmail && u.password === password
      );

      if (!found) return 'Wrong email or password.';

      await AsyncStorage.setItem(SESSION_KEY, cleanEmail);

      setUser(strip(found));

      return null;
    },
    []
  );

  const resetPassword = useCallback(
    async (email: string, newPassword: string) => {
      const cleanEmail = email.trim().toLowerCase();

      if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
        return 'Please enter a valid email.';
      }

      if (newPassword.length < 6) {
        return 'Password must be at least 6 characters.';
      }

      const users = await readUsers();

      const userIndex = users.findIndex(
        (u) => u.email === cleanEmail
      );

      if (userIndex === -1) {
        return 'No account found with this email.';
      }

      const updatedUsers = [...users];

      updatedUsers[userIndex] = {
        ...updatedUsers[userIndex],
        password: newPassword,
      };

      await AsyncStorage.setItem(
        USERS_KEY,
        JSON.stringify(updatedUsers)
      );

      return null;
    },
    []
  );

  const signOut = useCallback(async () => {
    await AsyncStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const updatePhoto = useCallback(
    async (uri: string) => {
      if (!user) return;

      const users = await readUsers();

      await AsyncStorage.setItem(
        USERS_KEY,
        JSON.stringify(
          users.map((u) =>
            u.email === user.email ? { ...u, photo: uri } : u
          )
        )
      );

      setUser({ ...user, photo: uri });
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      signUp,
      signIn,
      resetPassword,
      signOut,
      updatePhoto,
    }),
    [
      user,
      loading,
      signUp,
      signIn,
      resetPassword,
      signOut,
      updatePhoto,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const v = useContext(Ctx);

  if (!v) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return v;
}
