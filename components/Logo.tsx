import { StyleSheet, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useColors } from '../lib/theme';

// Brew Pass mark 06 (Dash): a solid cup moving right, with three speed lines.
// Cup uses the accent, lines use the text color, so it reads in light and dark.
export function LogoMark({ height = 28 }: { height?: number }) {
  const c = useColors();
  const width = (height * 62) / 34;
  return (
    <Svg width={width} height={height} viewBox="0 20 62 34" accessibilityLabel="Brew Pass">
      <Path d="M18 22H48V36a15 15 0 0 1-30 0Z" fill={c.accent} />
      <Path
        d="M48 28h4a6 6 0 0 1 0 12h-3"
        fill="none"
        stroke={c.accent}
        strokeWidth={4.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path d="M9 26h5M3 34h11M9 42h5" fill="none" stroke={c.fg} strokeWidth={4} strokeLinecap="round" />
    </Svg>
  );
}

export function Logo({ height = 28 }: { height?: number }) {
  const c = useColors();
  return (
    <View style={styles.row} accessibilityRole="header">
      <LogoMark height={height} />
      <Text style={[styles.word, { color: c.fg, fontSize: height * 0.8 }]}>
        Brew <Text style={{ color: c.accent }}>Pass</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  word: { fontWeight: '700', letterSpacing: -0.2 },
});
