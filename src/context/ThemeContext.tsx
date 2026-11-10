
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const THEME_KEY = 'dhun:theme';

const lightColors = {
  background: '#F7F3FF',
  surface: '#FFFFFF',
  accent: '#8560C9',
  text: '#211832',
  muted: '#786B8D',
  border: '#E5DDF0',
};

const darkColors = {
  background: '#100C19',
  surface: '#1B1428',
  accent: '#B99AFF',
  text: '#F7F3FF',
  muted: '#A69BB8',
  border: '#302842',
};

type ThemeColors = typeof darkColors;

type ThemeContextType = {
  isDark: boolean;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    let mounted = true;

    AsyncStorage.getItem(THEME_KEY)
      .then((saved) => {
        if (!mounted) return;

        if (saved === 'light') {
          setIsDark(false);
        } else if (saved === 'dark') {
          setIsDark(true);
        }
      })
      .catch(() => {
        // Keep the default dark theme if storage is unavailable.
      });

    return () => {
      mounted = false;
    };
  }, []);

  const toggleTheme = () => {
    setIsDark((previous) => {
      const next = !previous;

      AsyncStorage.setItem(
        THEME_KEY,
        next ? 'dark' : 'light'
      ).catch(() => {
        // Theme remains usable even if persistence fails.
      });

      return next;
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        colors: isDark ? darkColors : lightColors,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      'useTheme must be used inside ThemeProvider'
    );
  }

  return context;
}
