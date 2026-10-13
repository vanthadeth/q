import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Mascot } from '../../components/Mascot';
import { radius, space, useColors } from '../../lib/theme';

// EXAMPLE deals until the `promotions` table is connected.
const DEALS = [
  { id: 'd1', title: 'Cold brew', detail: 'Thursday only · 2 for 1', tag: 'Thu' },
  { id: 'd2', title: 'Croissant', detail: 'Weekdays before 10:00', tag: 'Morning' },
];

export default function DealsScreen() {
  const c = useColors();
  return (
    <ScrollView style={{ backgroundColor: c.bg }} contentContainerStyle={styles.wrap}>
      <View style={styles.head}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={[styles.title, { color: c.fg }]}>Deals</Text>
          <Text style={{ color: c.muted, fontSize: 13 }}>Examples. New deals appear here.</Text>
        </View>
        <Mascot pose="specialOffer" size={124} label="Muggo holding a discount tag" />
      </View>
      <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.line }]}>
        {DEALS.map((d, i) => (
          <View
            key={d.id}
            style={[styles.row, i < DEALS.length - 1 && { borderBottomColor: c.line, borderBottomWidth: 1 }]}
          >
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: c.fg, fontWeight: '600' }}>{d.title}</Text>
              <Text style={{ color: c.muted, fontSize: 13 }}>{d.detail}</Text>
            </View>
            <View style={[styles.tag, { backgroundColor: c.soft }]}>
              <Text style={{ color: c.accent, fontSize: 12, fontWeight: '600' }}>{d.tag}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingVertical: space.lg, gap: space.md },
  head: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: space.md },
  title: { fontSize: 26, fontWeight: '700' },
  card: { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: space.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
  tag: { paddingHorizontal: space.sm, paddingVertical: space.xs, borderRadius: 999 },
});
