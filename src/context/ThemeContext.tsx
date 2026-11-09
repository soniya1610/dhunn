
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState } from 'react';

const THEME_KEY = 'dhun:theme';

const lightColors = {
  background: '#F7F5F2',
  surface: '#FFFFFF',
  accent: '#E66A43',
  text: '#202124',
  muted: '#77777F',
  border: '#E7E3DF',
};

const darkColors = {
  background: '#101114',
  surface: '#1B1D22',
  accent: '#FF784F',
  text: '#FFFFFF',
  muted: '#A2A3AA',
  border: '#292B31',
};

type ThemeContextType = {
  isDark: boolean;
  colors: typeof darkColors;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((saved) => {
      if (saved === 'light') setIsDark(false);
      if (saved === 'dark') setIsDark(true);
    });
  }, []);

  const toggleTheme = () => {
    setIsDark((previous) => {
      const next = !previous;
      AsyncStorage.setItem(THEME_KEY, next ? 'dark' : 'light');
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
    throw new Error('useTheme must be used inside ThemeProvider');
  }

  return context;
}
