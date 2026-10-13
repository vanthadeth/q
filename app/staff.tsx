import { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { canTransition, nextStaffStatus, type OrderStatus } from '../lib/order-state';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { radius, space, useColors } from '../lib/theme';

type QueueOrder = { id: string; status: OrderStatus; pickup_at: string | null; total_khr: number };

const ACTIVE: OrderStatus[] = ['paid', 'preparing', 'ready'];
const ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  paid: 'Start preparing',
  preparing: 'Mark ready',
  ready: 'Picked up',
};

// Staff queue for the store tablet (web). Shows only paid orders, live.
export default function StaffScreen() {
  const c = useColors();
  const [orders, setOrders] = useState<QueueOrder[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setError('Connect Supabase to see live orders.');
      return;
    }
    let active = true;
    const load = async () => {
      const { data, error: loadError } = await supabase
        .from('orders')
        .select('id, status, pickup_at, total_khr')
        .in('status', ACTIVE)
        .order('pickup_at', { ascending: true });
      if (!active) return;
      if (loadError) setError(loadError.message);
      else setOrders((data ?? []) as QueueOrder[]);
    };
    load();
    const channel = supabase
      .channel('staff-queue')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, load)
      .subscribe();
    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  async function advance(order: QueueOrder) {
    const next = nextStaffStatus(order.status);
    if (!next || !canTransition(order.status, next)) return;
    const { error: updateError } = await supabase.from('orders').update({ status: next }).eq('id', order.id);
    if (updateError) setError(updateError.message);
  }

  return (
    <ScrollView style={{ backgroundColor: c.bg }} contentContainerStyle={styles.wrap}>
      <Text style={[styles.title, { color: c.fg }]}>Queue</Text>
      {error ? <Text style={{ color: c.accent }}>{error}</Text> : null}
      {orders.length === 0 && !error ? (
        <Text style={{ color: c.muted }}>No paid orders waiting. New orders appear here after payment.</Text>
      ) : null}
      {orders.map((o) => (
        <View key={o.id} style={[styles.card, { backgroundColor: c.surface, borderColor: c.line }]}>
          <View style={styles.cardTop}>
            <Text style={{ color: c.fg, fontWeight: '700' }}>#{o.id.slice(0, 6).toUpperCase()}</Text>
            <View style={[styles.chip, { backgroundColor: c.soft }]}>
              <Text style={{ color: c.accent, fontSize: 12, fontWeight: '600' }}>{o.status}</Text>
            </View>
          </View>
          <Text style={{ color: c.muted, fontSize: 13 }}>
            {o.pickup_at
              ? `Pickup ${new Date(o.pickup_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
              : 'Pickup asap'}{' '}
            · {o.total_khr.toLocaleString('en-US')} KHR
          </Text>
          {ACTION_LABEL[o.status] ? (
            <Pressable
              accessibilityRole="button"
              onPress={() => advance(o)}
              style={[styles.btn, { backgroundColor: c.accent }]}
            >
              <Text style={{ color: c.accentInk, fontWeight: '600' }}>{ACTION_LABEL[o.status]}</Text>
            </Pressable>
          ) : null}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingVertical: space.lg, gap: space.md },
  title: { fontSize: 26, fontWeight: '700' },
  card: { borderWidth: 1, borderRadius: radius.md, padding: space.lg, gap: space.sm },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chip: { paddingHorizontal: space.sm, paddingVertical: space.xs, borderRadius: 999 },
  btn: { borderRadius: radius.sm, paddingVertical: space.md, alignItems: 'center' },
});
