// Order lifecycle. An order reaches the store queue only after payment is confirmed.
export type OrderStatus =
  | 'pending_payment'
  | 'paid'
  | 'preparing'
  | 'ready'
  | 'picked_up'
  | 'expired'
  | 'cancelled';

const transitions: Record<OrderStatus, OrderStatus[]> = {
  pending_payment: ['paid', 'expired', 'cancelled'],
  paid: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['picked_up'],
  picked_up: [],
  expired: [],
  cancelled: [],
};

export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  return transitions[from].includes(to);
}

export function nextStaffStatus(status: OrderStatus): OrderStatus | null {
  if (status === 'paid') return 'preparing';
  if (status === 'preparing') return 'ready';
  if (status === 'ready') return 'picked_up';
  return null;
}
