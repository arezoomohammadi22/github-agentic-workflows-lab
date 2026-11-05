import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateQuote } from '../src/quote.js';

test('basic quote charges shipping below $50', () => {
  assert.deepEqual(calculateQuote({ unitPriceCents: 2_000, quantity: 2 }), {
    subtotalCents: 4_000, discountCents: 0, shippingCents: 500, totalCents: 4_500
  });
});

test('free shipping includes the exact $50 threshold', () => {
  assert.equal(calculateQuote({ unitPriceCents: 5_000, quantity: 1 }).shippingCents, 0);
});

test('SAVE10 is applied before shipping threshold', () => {
  assert.deepEqual(calculateQuote({ unitPriceCents: 5_000, quantity: 1, coupon: 'SAVE10' }), {
    subtotalCents: 5_000, discountCents: 500, shippingCents: 500, totalCents: 5_000
  });
});

test('rejects invalid quantities and prices', () => {
  assert.throws(() => calculateQuote({ unitPriceCents: 100, quantity: 0 }), RangeError);
  assert.throws(() => calculateQuote({ unitPriceCents: -100, quantity: 1 }), RangeError);
  assert.throws(() => calculateQuote({ unitPriceCents: 100, quantity: 1.5 }), RangeError);
});

test('rejects unsupported coupon instead of silently applying it', () => {
  assert.throws(() => calculateQuote({ unitPriceCents: 5_000, quantity: 1, coupon: 'FREE' }), RangeError);
});
