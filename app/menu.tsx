import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { radius, space, useColors } from '../lib/theme';

// Secondary items live here so the main screens stay clean.
const ITEMS = [
  'Points history',
  'Order history',
  'Stores and hours',
  'Notifications',
  'Sign-in methods',
  'Help and feedback',
];

export default function MenuScreen() {
  const c = useColors();
  return (
    <ScrollView style={{ backgroundColor: c.bg }} contentContainerStyle={styles.wrap}>
      <View style={styles.topbar}>
        <Text style={[styles.title, { color: c.fg }]}>Menu</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Close menu"
          onPress={() => router.back()}
          style={[styles.close, { borderColor: c.line, backgroundColor: c.surface }]}
        >
          <Text style={{ color: c.fg, fontSize: 18 }}>×</Text>
        </Pressable>
      </View>
      <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.line }]}>
        {ITEMS.map((label, i) => (
          <View
            key={label}
            style={[styles.row, i < ITEMS.length - 1 && { borderBottomColor: c.line, borderBottomWidth: 1 }]}
          >
            <Text style={{ color: c.fg, flex: 1 }}>{label}</Text>
            <Text style={{ color: c.muted }}>›</Text>
          </View>
        ))}
      </View>
      <Pressable accessibilityRole="button" style={styles.logout}>
        <Text style={{ color: c.muted }}>Log out</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingVertical: space.lg, gap: space.lg },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 26, fontWeight: '700' },
  close: { width: 40, height: 40, borderRadius: radius.sm, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  card: { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: space.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
  logout: { alignSelf: 'center', padding: space.md },
});
