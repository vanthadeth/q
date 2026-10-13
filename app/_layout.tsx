import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { CartProvider } from '../lib/cart';
import { useColors } from '../lib/theme';

export default function RootLayout() {
  const c = useColors();
  return (
    <CartProvider>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: c.bg },
        }}
      />
    </CartProvider>
  );
}
