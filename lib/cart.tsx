import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import type { MenuItem } from './menu';

export type CartLine = { item: MenuItem; qty: number; priceKhr: number };

type CartValue = {
  lines: CartLine[];
  totalKhr: number;
  count: number;
  add: (item: MenuItem) => void;
  clear: () => void;
};

const CartContext = createContext<CartValue | null>(null);

function unitPrice(item: MenuItem): number {
  return item.promoPriceKhr ?? item.priceKhr;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const value = useMemo<CartValue>(() => {
    const totalKhr = lines.reduce((sum, l) => sum + l.priceKhr * l.qty, 0);
    const count = lines.reduce((sum, l) => sum + l.qty, 0);
    return {
      lines,
      totalKhr,
      count,
      add: (item) =>
        setLines((prev) => {
          const existing = prev.find((l) => l.item.id === item.id);
          if (existing) {
            return prev.map((l) => (l.item.id === item.id ? { ...l, qty: l.qty + 1 } : l));
          }
          return [...prev, { item, qty: 1, priceKhr: unitPrice(item) }];
        }),
      clear: () => setLines([]),
    };
  }, [lines]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
