// All prices are integers in cents to avoid floating-point money errors.
export function calculateQuote({ unitPriceCents, quantity, coupon = '' }) {
  if (!Number.isSafeInteger(unitPriceCents) || unitPriceCents < 1 || unitPriceCents > 1_000_000) {
    throw new RangeError('unitPriceCents must be an integer from 1 to 1000000');
  }
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 100) {
    throw new RangeError('quantity must be an integer from 1 to 100');
  }
  if (typeof coupon !== 'string' || !['', 'SAVE10'].includes(coupon)) {
    throw new RangeError('coupon must be empty or SAVE10');
  }
  const subtotalCents = unitPriceCents * quantity;
  const discountCents = coupon === 'SAVE10' ? Math.floor(subtotalCents * 0.1) : 0;
  const discountedCents = subtotalCents - discountCents;
  // Free shipping starts at $50 after discount (inclusive).
  const shippingCents = discountedCents >= 5_000 ? 0 : 500;
  const totalCents = discountedCents + shippingCents;
  return { subtotalCents, discountCents, shippingCents, totalCents };
}
