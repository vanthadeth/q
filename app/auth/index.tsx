import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Logo } from '../../components/Logo';
import { Mascot } from '../../components/Mascot';
import { isSupabaseConfigured, supabase } from '../../lib/supabase';
import { radius, space, useColors } from '../../lib/theme';

type Channel = 'sms' | 'telegram' | 'whatsapp';
const CHANNELS: { id: Channel; label: string }[] = [
  { id: 'sms', label: 'SMS' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'whatsapp', label: 'WhatsApp' },
];

// Sign up or sign in: phone code (SMS, Telegram or WhatsApp) or Google.
export default function AuthScreen() {
  const c = useColors();
  const [phone, setPhone] = useState('');
  const [channel, setChannel] = useState<Channel>('sms');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function sendCode() {
    setError(null);
    if (!isSupabaseConfigured) {
      setError('Sign-in is not connected yet. Add Supabase keys to start testing.');
      return;
    }
    setBusy(true);
    const { error: fnError } = await supabase.functions.invoke('send-otp', { body: { phone, channel } });
    setBusy(false);
    if (fnError) {
      setError('We could not send the code. Check the number and try again.');
      return;
    }
    router.push({ pathname: '/auth/code', params: { phone, channel } });
  }

  async function signInWithGoogle() {
    setError(null);
    if (!isSupabaseConfigured) {
      setError('Google sign-in is not connected yet.');
      return;
    }
    const { error: oauthError } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (oauthError) setError('Google sign-in failed. Try again.');
  }

  return (
    <ScrollView style={{ backgroundColor: c.bg }} contentContainerStyle={styles.wrap}>
      <Logo height={40} />
      <Mascot pose="hello" size={148} label="Muggo waving hello" />
      <Text style={[styles.title, { color: c.fg }]}>Sign up or sign in</Text>
      <Text style={{ color: c.muted }}>Enter your phone number. We send a code to confirm it.</Text>

      <TextInput
        accessibilityLabel="Phone number"
        keyboardType="phone-pad"
        placeholder="+855 12 345 678"
        placeholderTextColor={c.muted}
        value={phone}
        onChangeText={setPhone}
        style={[styles.input, { color: c.fg, borderColor: c.line, backgroundColor: c.surface }]}
      />

      <Text style={[styles.label, { color: c.muted }]}>Send the code by</Text>
      <View style={styles.segRow}>
        {CHANNELS.map((ch) => {
          const on = ch.id === channel;
          return (
            <Pressable
              key={ch.id}
              accessibilityRole="button"
              accessibilityState={{ selected: on }}
              onPress={() => setChannel(ch.id)}
              style={[styles.seg, { borderColor: on ? c.accent : c.line, backgroundColor: on ? c.soft : c.surface }]}
            >
              <Text style={{ color: on ? c.accent : c.fg, fontWeight: on ? '600' : '400' }}>{ch.label}</Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={busy || phone.trim().length < 8}
        onPress={sendCode}
        style={[styles.btn, { backgroundColor: c.accentFill, opacity: busy || phone.trim().length < 8 ? 0.6 : 1 }]}
      >
        <Text style={{ color: c.accentInk, fontWeight: '600' }}>{busy ? 'Sending…' : 'Send code'}</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        onPress={signInWithGoogle}
        style={[styles.btn, { backgroundColor: c.surface, borderColor: c.line, borderWidth: 1 }]}
      >
        <Text style={{ color: c.fg, fontWeight: '600' }}>Continue with Google</Text>
      </Pressable>

      {error ? <Text style={{ color: c.accent }}>{error}</Text> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: space.lg, paddingVertical: space.xl, gap: space.md },
  title: { fontSize: 26, fontWeight: '700' },
  label: { fontSize: 12, letterSpacing: 0.5, textTransform: 'uppercase' },
  input: { borderWidth: 1, borderRadius: radius.sm, paddingHorizontal: space.md, paddingVertical: space.md, fontSize: 16 },
  segRow: { flexDirection: 'row', gap: space.sm },
  seg: { flex: 1, borderWidth: 1, borderRadius: radius.sm, paddingVertical: space.md, alignItems: 'center' },
  btn: { borderRadius: radius.sm, paddingVertical: space.md, alignItems: 'center' },
});
