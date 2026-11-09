
// Dhunn app theme

// Existing Dhunn brand colors
export const colors = {
  accent: '#D7263D',
  text: '#111111',
  muted: '#6B6B70',
  border: '#E3E3E8',
  background: '#FFFFFF',
  surface: '#F0F0F3',
};

// Existing color palette
export const palette = [
  '#FF8A65',
  '#5C6BC0',
  '#26A69A',
  '#FFB300',
  '#8E24AA',
  '#455A64',
];

// Light and dark themes
export const Colors = {
  light: {
    background: colors.background,
    backgroundElement: colors.surface,
    backgroundSelected: '#FCE8EB',
    text: colors.text,
    textSecondary: colors.muted,
    accent: colors.accent,
    border: colors.border,
  },

  dark: {
    background: '#101014',
    backgroundElement: '#1C1C22',
    backgroundSelected: '#302027',
    text: '#FFFFFF',
    textSecondary: '#A6A6AE',
    accent: colors.accent,
    border: '#38383F',
  },
};

// Available theme color properties
export type ThemeColor = keyof typeof Colors.light;

// Font definitions
export const Fonts = {
  mono: 'monospace',
};

// Spacing scale (4-point system)
export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 12,
  four: 16,
  five: 20,
};
// Maximum content width for web layout
export const MaxContentWidth = 1200;
