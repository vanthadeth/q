import { useColorScheme } from 'react-native';

// Brand palette: #ECF5FA and #5A6EE1 (light), #151A36 and #4556B3 (dark).
// Neutrals and tints are derived from these. Brand colors are the source of truth.
const light = {
  bg: '#ECF5FA',
  surface: '#FFFFFF',
  fg: '#151A36',
  muted: '#5C6385',
  line: '#D2E0EC',
  accent: '#5A6EE1', // text, icons, and fills on light surfaces
  accentFill: '#5A6EE1', // filled buttons
  accentInk: '#FFFFFF', // text on filled buttons
  soft: '#DDE4FA', // accent tint for chips and highlights
};

const dark: typeof light = {
  bg: '#151A36',
  surface: '#1C2347',
  fg: '#ECF5FA',
  muted: '#9AA3C7',
  line: '#2B3462',
  accent: '#8E9EF2', // lighter tint of #4556B3 so text stays readable on #151A36
  accentFill: '#4556B3',
  accentInk: '#FFFFFF',
  soft: '#262E5C',
};

export type Colors = typeof light;

export function useColors(): Colors {
  return useColorScheme() === 'dark' ? dark : light;
}

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
export const radius = { sm: 12, md: 16, lg: 22 } as const;
