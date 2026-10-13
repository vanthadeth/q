import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useColors, radius, space } from '../../lib/theme';
import { FALLBACK_EARN_RULE } from '../../lib/points';

// Home shows only what matters now: points, order ahead, today's deal.
// EXAMPLE values until the points ledger and deals tables are wired up.
const EXAMPLE_POINTS = 1240;
const POINTS_TO_NEXT_REWARD = 2000;

export default function HomeScreen() {
  const c = useColors();
  const pct = Math.min(100, Math.round((EXAMPLE_POINTS / POINTS_TO_NEXT_REWARD) * 100));

  return (
    <ScrollView style={{ backgroundColor: c.bg }} contentContainerStyle={styles.wrap}>
      <View style={styles.topbar}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          onPress={() => router.push('/menu')}
          style={[styles.iconBtn, { backgroundColor: c.surface, borderColor: c.line }]}
        >
          <Text style={{ color: c.fg, fontSize: 18 }}>≡</Text>
        </Pressable>
        <View style={styles.store}>
          <Text style={[styles.strong, { color: c.fg }]}>Central Station</Text>
          <Text style={[styles.note, { color: c.muted }]}>Pickup in about 6 min</Text>
        </View>
      </View>

      <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.line }]}>
        <Text style={[styles.label, { color: c.muted }]}>Your points</Text>
        <Text style={[styles.big, { color: c.fg }]}>{EXAMPLE_POINTS.toLocaleString('en-US')}</Text>
        <View style={[styles.progress, { backgroundColor: c.soft }]}>
          <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: c.accentFill }]} />
        </View>
        <Text style={[styles.note, { color: c.muted }]}>
          {POINTS_TO_NEXT_REWARD - EXAMPLE_POINTS} points to your next reward
        </Text>
      </View>

      <View style={[styles.card, { backgroundColor: c.soft, borderColor: c.soft }]}>
        <Text style={[styles.chip, { color: c.accent }]}>Today only</Text>
        <Text style={[styles.big, { color: c.accent, marginTop: space.sm }]}>4,000 KHR</Text>
        <Text style={{ color: c.fg, marginTop: space.xs }}>Flat white, all day</Text>
      </View>

      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push('/(tabs)/order')}
          style={[styles.btn, { backgroundColor: c.accentFill, borderColor: c.accentFill, flex: 1 }]}
        >
          <Text style={[styles.btnText, { color: c.accentInk }]}>Order ahead</Text>
        </Pressable>
      </View>

      <Text style={[styles.note, { color: c.muted, textAlign: 'center' }]}>
        Earn {FALLBACK_EARN_RULE.pointsPerUnit} point per {FALLBACK_EARN_RULE.unitKhr.toLocaleString('en-US')} KHR
        (placeholder rule)
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingVertical: space.lg, gap: space.lg },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.md },
  iconBtn: { width: 40, height: 40, borderRadius: radius.sm, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  store: { flexShrink: 1, alignItems: 'flex-end' },
  strong: { fontSize: 14, fontWeight: '600' },
  note: { fontSize: 13 },
  card: { borderWidth: 1, borderRadius: radius.md, padding: space.lg, gap: space.sm },
  label: { fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase' },
  big: { fontSize: 32, fontWeight: '700', fontVariant: ['tabular-nums'] },
  progress: { height: 6, borderRadius: 999, overflow: 'hidden' },
  progressFill: { height: 6, borderRadius: 999 },
  chip: { alignSelf: 'flex-start', fontSize: 12, fontWeight: '600' },
  row: { flexDirection: 'row', gap: space.md },
  btn: { borderWidth: 1, borderRadius: radius.sm, paddingVertical: space.md, alignItems: 'center' },
  btnText: { fontSize: 15, fontWeight: '600' },
});
