import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createAppServer } from '../src/server.js';

test('health and quote HTTP endpoints work', async (t) => {
  const server = createAppServer().listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}`;
  const health = await fetch(`${base}/health`);
  assert.equal(health.status, 200);
  assert.deepEqual(await health.json(), { status: 'ok' });
  const quote = await fetch(`${base}/api/quote`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ unitPriceCents: 3_000, quantity: 2, coupon: 'SAVE10' })
  });
  assert.equal(quote.status, 200);
  assert.deepEqual(await quote.json(), {
    subtotalCents: 6_000, discountCents: 600, shippingCents: 0, totalCents: 5_400
  });
});

test('invalid quote returns 400', async (t) => {
  const server = createAppServer().listen(0, '127.0.0.1');
  await once(server, 'listening');
  t.after(() => server.close());
  const base = `http://127.0.0.1:${server.address().port}`;
  const response = await fetch(`${base}/api/quote`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ unitPriceCents: 3_000, quantity: -1 })
  });
  assert.equal(response.status, 400);
});
