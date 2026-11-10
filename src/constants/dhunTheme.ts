
// Dhunn – Premium Purple Theme

export const colors = {
  accent: '#B99AFF',
  accentLight: '#D7C5FF',
  accentDark: '#9270D5',

  text: '#F7F3FF',
  muted: '#A69BB8',
  border: '#302842',

  background: '#100C19',
  surface: '#1B1428',
  surfaceLight: '#251C35',
  selected: '#33264A',

  white: '#FFFFFF',
  black: '#100C19',
};

export const palette = [
  '#B99AFF',
  '#8D75D6',
  '#C49BFF',
  '#E5A8D7',
  '#8174D8',
  '#A78BFA',
];

export const Colors = {
  light: {
    background: '#F7F3FF',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#EDE4FF',
    text: '#211832',
    textSecondary: '#786B8D',
    accent: '#8560C9',
    border: '#E5DDF0',
  },

  dark: {
    background: '#100C19',
    backgroundElement: '#1B1428',
    backgroundSelected: '#33264A',
    text: '#F7F3FF',
    textSecondary: '#A69BB8',
    accent: '#B99AFF',
    border: '#302842',
  },
};

export type ThemeColor = keyof typeof Colors.light;

export const Fonts = {
  mono: 'monospace',
};

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
  six: 24,
  seven: 28,
  eight: 32,
};

export const MaxContentWidth = 1200;
