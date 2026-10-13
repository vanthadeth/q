import { useColorScheme } from 'react-native';

// Design tokens from the approved interface proposal. Light and dark share one shape.
const light = {
  bg: '#F6F3EE',
  surface: '#FFFFFF',
  fg: '#231A14',
  muted: '#7A6D62',
  line: '#E7E0D7',
  accent: '#B8642A',
  accentInk: '#FFFFFF',
  soft: '#F1E6DA',
};

const dark: typeof light = {
  bg: '#14100C',
  surface: '#1E1812',
  fg: '#F4EDE4',
  muted: '#A39588',
  line: '#322920',
  accent: '#D9854A',
  accentInk: '#14100C',
  soft: '#2A211A',
};

export type Colors = typeof light;

export function useColors(): Colors {
  return useColorScheme() === 'dark' ? dark : light;
}

export const space = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24 } as const;
export const radius = { sm: 12, md: 16, lg: 22 } as const;
