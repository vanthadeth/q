// Pickup slots: from `minLeadMinutes` after now, every `stepMinutes`, until closing.
export type PickupSlot = { iso: string; label: string };

export function pickupSlots(
  now: Date,
  opensHour: number,
  closesHour: number,
  minLeadMinutes = 10,
  stepMinutes = 15,
): PickupSlot[] {
  const earliest = new Date(now.getTime() + minLeadMinutes * 60_000);
  const start = new Date(now);
  start.setHours(opensHour, 0, 0, 0);
  const cursor = new Date(Math.max(earliest.getTime(), start.getTime()));
  // Round up to the next step boundary.
  const remainder = cursor.getMinutes() % stepMinutes;
  if (remainder !== 0 || cursor.getSeconds() !== 0) {
    cursor.setMinutes(cursor.getMinutes() + (stepMinutes - remainder), 0, 0);
  }
  const close = new Date(now);
  close.setHours(closesHour, 0, 0, 0);

  const slots: PickupSlot[] = [];
  while (cursor < close) {
    slots.push({
      iso: cursor.toISOString(),
      label: cursor.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    });
    cursor.setMinutes(cursor.getMinutes() + stepMinutes);
  }
  return slots;
}
