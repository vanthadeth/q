import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Mascot } from '../components/Mascot';
import { useCart } from '../lib/cart';
import { isSupabaseConfigured, supabase } from '../lib/supabase';
import { radius, space, useColors } from '../lib/theme';

// Creates the order as `pending_payment`, then asks the KHQR function for a QR.
// The store only sees the order after the Bakong callback marks it `paid`.
export default function CheckoutScreen() {
  const c = useColors();
  const { slot } = useLocalSearchParams<{ slot?: string }>();
  const { lines, totalKhr, clear } = useCart();
  const [status, setStatus] = useState<string | null>(null);
  const [qr, setQr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [offline, setOffline] = useState(false);

  async function pay() {
    setBusy(true);
    setStatus(null);
    setOffline(false);
    try {
      if (!isSupabaseConfigured) {
        setStatus('Payment is not connected yet. Add Supabase keys to start testing.');
        return;
      }
      const { data: session } = await supabase.auth.getSession();
      const customerId = session.session?.user.id;
      if (!customerId) {
        router.push('/auth');
        return;
      }
      const { data: order, error } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          status: 'pending_payment',
          pickup_at: slot || null,
          total_khr: totalKhr,
          items: lines.map((l) => ({ item_id: l.item.id, qty: l.qty, price_khr: l.priceKhr })),
        })
        .select('id')
        .single();
      if (error) throw error;

      const { data, error: fnError } = await supabase.functions.invoke('khqr-create', {
        body: { orderId: order.id },
      });
      if (fnError) throw fnError;
      setQr(data?.qr ?? null);
      clear();
    } catch (e) {
      const message = e instanceof Error ? e.message : '';
      const lost = /network|failed to fetch|offline|timed? ?out/i.test(message);
      setOffline(lost);
      setStatus(lost ? 'No connection. Check your internet and try again.' : message || 'Could not start payment. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <ScrollView style={{ backgroundColor: c.bg }} contentContainerStyle={styles.wrap}>
      <Pressable accessibilityRole="button" onPress={() => router.back()}>
        <Text style={{ color: c.accent, fontWeight: '600' }}>← Back</Text>
      </Pressable>
      <Text style={[styles.title, { color: c.fg }]}>Pay with KHQR</Text>

      <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.line }]}>
        {lines.map((l) => (
          <View key={l.item.id} style={styles.row}>
            <Text style={{ color: c.fg, flex: 1 }}>
              {l.qty} × {l.item.name}
            </Text>
            <Text style={{ color: c.fg, fontVariant: ['tabular-nums'] }}>
              {(l.priceKhr * l.qty).toLocaleString('en-US')} KHR
            </Text>
          </View>
        ))}
        <View style={[styles.row, { borderTopColor: c.line, borderTopWidth: 1 }]}>
          <Text style={{ color: c.fg, fontWeight: '700', flex: 1 }}>Total</Text>
          <Text style={{ color: c.fg, fontWeight: '700' }}>{totalKhr.toLocaleString('en-US')} KHR</Text>
        </View>
      </View>

      {qr ? (
        <>
          <Mascot pose="pleaseWait" size={132} label="Muggo waiting for your payment" />
        <View style={[styles.card, { backgroundColor: c.surface, borderColor: c.line }]}>
          <Text style={{ color: c.fg }}>Scan this QR in your Bakong or bank app.</Text>
          <Text selectable style={{ color: c.muted, fontSize: 12 }}>{qr}</Text>
        </View>
        </>
      ) : (
        <Pressable
          accessibilityRole="button"
          disabled={busy || lines.length === 0}
          onPress={pay}
          style={[styles.btn, { backgroundColor: c.accentFill, opacity: busy || lines.length === 0 ? 0.6 : 1 }]}
        >
          <Text style={{ color: c.accentInk, fontWeight: '600' }}>{busy ? 'Starting payment…' : 'Show KHQR'}</Text>
        </Pressable>
      )}

      {status ? (
        <View style={styles.errorBox}>
          <Mascot
            pose={offline ? 'connectionLost' : 'sorry'}
            size={132}
            label={offline ? 'Muggo with no connection' : 'Muggo looking sorry'}
          />
          <Text style={{ color: c.accent, textAlign: 'center' }}>{status}</Text>
        </View>
      ) : null}
      {slot ? <Text style={{ color: c.muted, fontSize: 13 }}>Pickup at {new Date(slot).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingVertical: space.lg, gap: space.md },
  title: { fontSize: 26, fontWeight: '700' },
  card: { borderWidth: 1, borderRadius: radius.md, padding: space.lg, gap: space.sm },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.xs },
  btn: { borderRadius: radius.sm, paddingVertical: space.md, alignItems: 'center' },
  errorBox: { alignItems: 'center', gap: space.sm },
});
