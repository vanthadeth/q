import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useCart } from '../../lib/cart';
import { pickupSlots } from '../../lib/pickup';
import { SAMPLE_MENU } from '../../lib/menu';
import { radius, space, useColors } from '../../lib/theme';

export default function OrderScreen() {
  const c = useColors();
  const { lines, totalKhr, count, add } = useCart();
  const slots = useMemo(() => pickupSlots(new Date(), 7, 19), []);
  const [slotIso, setSlotIso] = useState<string | null>(null);
  const selectedSlot = slotIso ?? slots[0]?.iso ?? null;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <ScrollView contentContainerStyle={styles.wrap}>
        <Text style={[styles.label, { color: c.muted }]}>Pickup at</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slots}>
          {slots.slice(0, 12).map((s) => {
            const on = s.iso === selectedSlot;
            return (
              <Pressable
                key={s.iso}
                accessibilityRole="button"
                accessibilityState={{ selected: on }}
                onPress={() => setSlotIso(s.iso)}
                style={[
                  styles.slot,
                  { borderColor: on ? c.accent : c.line, backgroundColor: on ? c.soft : c.surface },
                ]}
              >
                <Text style={{ color: on ? c.accent : c.fg, fontWeight: on ? '600' : '400' }}>{s.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.line }]}>
          {SAMPLE_MENU.map((item, i) => (
            <View
              key={item.id}
              style={[styles.item, i < SAMPLE_MENU.length - 1 && { borderBottomColor: c.line, borderBottomWidth: 1 }]}
            >
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ color: c.fg, fontWeight: '600' }}>{item.name}</Text>
                <Text style={{ color: c.muted, fontSize: 13 }}>{item.detail}</Text>
              </View>
              <Text style={{ color: c.fg, fontVariant: ['tabular-nums'], fontWeight: '600' }}>
                {(item.promoPriceKhr ?? item.priceKhr).toLocaleString('en-US')} KHR
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Add ${item.name}`}
                onPress={() => add(item)}
                style={[styles.addBtn, { backgroundColor: c.accentFill }]}
              >
                <Text style={{ color: c.accentInk, fontWeight: '700' }}>+</Text>
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>

      <Pressable
        accessibilityRole="button"
        disabled={count === 0}
        onPress={() => router.push({ pathname: '/checkout', params: { slot: selectedSlot ?? '' } })}
        style={[styles.cartBar, { backgroundColor: count === 0 ? c.soft : c.accentFill }]}
      >
        <Text style={{ color: count === 0 ? c.muted : c.accentInk, fontWeight: '600' }}>
          {count === 0 ? 'Add items to start' : `${count} item${count > 1 ? 's' : ''} · ${totalKhr.toLocaleString('en-US')} KHR`}
        </Text>
        {count > 0 ? <Text style={{ color: c.accentInk, fontWeight: '600' }}>Pay →</Text> : null}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingVertical: space.lg, gap: space.md, paddingBottom: 96 },
  label: { fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase' },
  slots: { gap: space.sm, paddingVertical: space.xs },
  slot: { borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: space.md, paddingVertical: space.sm },
  card: { borderWidth: 1, borderRadius: radius.md, paddingHorizontal: space.lg },
  item: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.md },
  addBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  cartBar: {
    position: 'absolute',
    left: space.lg,
    right: space.lg,
    bottom: space.lg,
    borderRadius: radius.md,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
