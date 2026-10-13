// EXAMPLE menu data for development. Replace with rows from the `menu_items` table.
// Prices are in riel (KHR).
export type MenuItem = {
  id: string;
  name: string;
  detail: string;
  priceKhr: number;
  promoPriceKhr?: number;
};

export const SAMPLE_MENU: MenuItem[] = [
  { id: 'flat-white', name: 'Flat white', detail: 'Oat milk, medium', priceKhr: 7600, promoPriceKhr: 4000 },
  { id: 'cold-brew', name: 'Cold brew', detail: 'Large', priceKhr: 9600 },
  { id: 'espresso', name: 'Espresso', detail: 'Double shot', priceKhr: 6000 },
  { id: 'croissant', name: 'Croissant', detail: 'Butter', priceKhr: 6400 },
];
