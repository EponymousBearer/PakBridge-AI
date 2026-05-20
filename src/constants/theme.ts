/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#000000',
    background: '#ffffff',
    backgroundElement: '#F0F0F3',
    backgroundSelected: '#E0E1E6',
    textSecondary: '#60646C',
  },
  dark: {
    text: '#ffffff',
    background: '#000000',
    backgroundElement: '#212225',
    backgroundSelected: '#2E3135',
    textSecondary: '#B0B4BA',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;

export const COLORS = {
  primary: '#b8c3ff',
  primaryContainer: '#2d5bff', // Electric Blue
  secondary: '#ddfcff',
  secondaryContainer: '#00f1fe', // Neon Cyan
  tertiary: '#ffb4aa',
  tertiaryContainer: '#d71a18',
  error: '#ffb4ab',
  errorContainer: '#93000a',
  
  // Neutral Surfaces & Boundaries
  background: '#0f131f', // Deep Navy
  surface: '#0f131f',
  surfaceContainer: '#1b1f2c',
  surfaceContainerLow: '#171b28',
  surfaceContainerHigh: '#262a37',
  onSurface: '#dfe2f3',
  onSurfaceVariant: '#c4c5d9',
  outline: '#8e90a2',
  outlineVariant: '#434656',

  // Dark mode (Explicitly mapped to match design guidelines)
  dark: {
    background: '#0f131f',
    surface: '#1b1f2c',
    textPrimary: '#dfe2f3',
    textSecondary: '#c4c5d9',
    border: '#434656'
  },
  
  // Agent Colors
  agentRetrieval: '#2d5bff',
  agentDetection: '#ffb4aa',
  agentReasoning: '#00f1fe',
  agentSimplification: '#ddfcff',
  agentExecution: '#b8c3ff'
};

export const SIZES = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  radius: 12
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
};

