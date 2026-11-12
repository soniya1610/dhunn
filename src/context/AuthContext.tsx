
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile,
} from 'firebase/auth';

import { auth } from '../services/firebase';

export type User = {
  name: string;
  email: string;
  photo?: string;
};

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
    _newPassword?: string
  ) => Promise<string | null>;
  signOut: () => Promise<void>;
  updatePhoto: (uri: string) => Promise<void>;
};

const Ctx = createContext<AuthCtx | null>(null);

const PHOTO_KEY_PREFIX = 'dhun:profile-photo:';

function getErrorMessage(error: unknown): string {
  const code =
    typeof error === 'object' &&
    error !== null &&
    'code' in error
      ? String(error.code)
      : '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';

    case 'auth/invalid-email':
      return 'Please enter a valid email.';

    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';

    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Wrong email or password.';

    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';

    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection.';

    case 'auth/operation-not-allowed':
      return 'Email/Password sign-in is not enabled in Firebase.';

    case 'auth/user-disabled':
      return 'This account has been disabled.';

    default:
      return error instanceof Error
        ? error.message
        : 'Something went wrong. Please try again.';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen to Firebase authentication state.
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        try {
          if (!firebaseUser) {
            setUser(null);
            return;
          }

          const savedPhoto = await AsyncStorage.getItem(
            `${PHOTO_KEY_PREFIX}${firebaseUser.uid}`
          );

          setUser({
            name:
              firebaseUser.displayName ||
              firebaseUser.email?.split('@')[0] ||
              'Dhunn User',
            email: firebaseUser.email || '',
            photo: savedPhoto || firebaseUser.photoURL || undefined,
          });
        } catch {
          if (firebaseUser) {
            setUser({
              name: firebaseUser.displayName || 'Dhunn User',
              email: firebaseUser.email || '',
              photo: firebaseUser.photoURL || undefined,
            });
          }
        } finally {
          setLoading(false);
        }
      }
    );

    return unsubscribe;
  }, []);

  // Create a new Firebase account.
  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<string | null> => {
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) return 'Please enter your name.';

    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return 'Please enter a valid email.';
    }

    if (password.length < 6) {
      return 'Password must be at least 6 characters.';
    }

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        cleanEmail,
        password
      );

      await updateProfile(credential.user, {
        displayName: cleanName,
      });

      return null;
    } catch (error) {
      return getErrorMessage(error);
    }
  };

  // Sign in with Firebase.
  const signIn = async (
    email: string,
    password: string
  ): Promise<string | null> => {
    const cleanEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return 'Please enter a valid email.';
    }

    try {
      await signInWithEmailAndPassword(auth, cleanEmail, password);
      return null;
    } catch (error) {
      return getErrorMessage(error);
    }
  };

  // Firebase sends a password reset email.
  const resetPassword = async (
    email: string,
    _newPassword?: string
  ): Promise<string | null> => {
    const cleanEmail = email.trim().toLowerCase();

    if (!/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      return 'Please enter a valid email.';
    }

    try {
      await sendPasswordResetEmail(auth, cleanEmail);
      return null;
    } catch (error) {
      return getErrorMessage(error);
    }
  };

  // Sign out from Firebase.
  const signOut = async (): Promise<void> => {
    await firebaseSignOut(auth);
  };

  // Save profile photo locally for now.
  const updatePhoto = async (uri: string): Promise<void> => {
    const currentUser = auth.currentUser;

    if (!currentUser) return;

    await AsyncStorage.setItem(
      `${PHOTO_KEY_PREFIX}${currentUser.uid}`,
      uri
    );

    setUser((current) =>
      current ? { ...current, photo: uri } : current
    );
  };

  // Memoize context value.
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
    [user, loading]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const context = useContext(Ctx);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
