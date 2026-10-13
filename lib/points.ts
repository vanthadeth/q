// Points are earned on every paid order. The earn rule is business configuration,
// stored in the `earn_rule` table, so it can change without an app release.
export type EarnRule = {
  // Points awarded for each `unitKhr` riel spent. Placeholder until the business sets it.
  pointsPerUnit: number;
  unitKhr: number;
};

// Placeholder rule used only when no rule row can be loaded.
export const FALLBACK_EARN_RULE: EarnRule = { pointsPerUnit: 1, unitKhr: 4000 };

export function pointsForAmount(amountKhr: number, rule: EarnRule = FALLBACK_EARN_RULE): number {
  if (amountKhr <= 0 || rule.unitKhr <= 0) return 0;
  return Math.floor((amountKhr / rule.unitKhr) * rule.pointsPerUnit);
}
