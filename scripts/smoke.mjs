import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createAppServer } from '../dist/server.js';
const server = createAppServer().listen(0, '127.0.0.1');
try {
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  const health = await fetch(`${base}/health`);
  assert.equal(health.status, 200);
  const response = await fetch(`${base}/api/quote`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ unitPriceCents: 5_000, quantity: 1 })
  });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).shippingCents, 0);
  console.log('Smoke passed: built artifact serves real HTTP requests');
} finally {
  server.close();
}
