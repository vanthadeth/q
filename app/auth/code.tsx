import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';
import { supabase } from '../../lib/supabase';
import { radius, space, useColors } from '../../lib/theme';

export default function CodeScreen() {
  const c = useColors();
  const { phone, channel } = useLocalSearchParams<{ phone: string; channel: string }>();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function verify() {
    setError(null);
    setBusy(true);
    const { error: fnError } = await supabase.functions.invoke('verify-otp', {
      body: { phone, channel, code },
    });
    setBusy(false);
    if (fnError) {
      setError('That code is not right or has expired. Request a new one.');
      return;
    }
    router.replace('/(tabs)');
  }

  return (
    <ScrollView style={{ backgroundColor: c.bg }} contentContainerStyle={styles.wrap}>
      <Text style={[styles.title, { color: c.fg }]}>Enter the code</Text>
      <Text style={{ color: c.muted }}>We sent a 6-digit code to {phone} via {channel}.</Text>
      <TextInput
        accessibilityLabel="Verification code"
        keyboardType="number-pad"
        maxLength={6}
        value={code}
        onChangeText={setCode}
        style={[styles.input, { color: c.fg, borderColor: c.line, backgroundColor: c.surface }]}
      />
      <Pressable
        accessibilityRole="button"
        disabled={busy || code.length !== 6}
        onPress={verify}
        style={[styles.btn, { backgroundColor: c.accentFill, opacity: busy || code.length !== 6 ? 0.6 : 1 }]}
      >
        <Text style={{ color: c.accentInk, fontWeight: '600' }}>{busy ? 'Checking…' : 'Confirm'}</Text>
      </Pressable>
      {error ? <Text style={{ color: c.accent }}>{error}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingVertical: space.xl, gap: space.md },
  title: { fontSize: 26, fontWeight: '700' },
  input: {
    borderWidth: 1,
    borderRadius: radius.sm,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    fontSize: 22,
    letterSpacing: 6,
    textAlign: 'center',
  },
  btn: { borderRadius: radius.sm, paddingVertical: space.md, alignItems: 'center' },
});
