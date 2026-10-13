import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pointsForAmount } from '../points.ts';
import { canTransition, nextStaffStatus } from '../order-state.ts';

test('points are floored per full unit spent', () => {
  const rule = { pointsPerUnit: 1, unitKhr: 4000 };
  assert.equal(pointsForAmount(3999, rule), 0);
  assert.equal(pointsForAmount(4000, rule), 1);
  assert.equal(pointsForAmount(12500, rule), 3);
});

test('no points for zero or invalid rule', () => {
  assert.equal(pointsForAmount(0), 0);
  assert.equal(pointsForAmount(5000, { pointsPerUnit: 1, unitKhr: 0 }), 0);
});

test('order must be paid before the store can prepare it', () => {
  assert.equal(canTransition('pending_payment', 'preparing'), false);
  assert.equal(canTransition('pending_payment', 'paid'), true);
  assert.equal(canTransition('paid', 'preparing'), true);
});

test('staff advance paid → preparing → ready → picked_up', () => {
  assert.equal(nextStaffStatus('paid'), 'preparing');
  assert.equal(nextStaffStatus('preparing'), 'ready');
  assert.equal(nextStaffStatus('ready'), 'picked_up');
  assert.equal(nextStaffStatus('picked_up'), null);
});
