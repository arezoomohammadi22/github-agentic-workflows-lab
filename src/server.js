import http from 'node:http';
import { pathToFileURL } from 'node:url';
import { calculateQuote } from './quote.js';

function sendJson(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' });
  res.end(JSON.stringify(body));
}

export function createAppServer() {
  return http.createServer(async (req, res) => {
    const pathname = new URL(req.url ?? '/', 'http://localhost').pathname;
    if (req.method === 'GET' && pathname === '/health') {
      sendJson(res, 200, { status: 'ok' });
      return;
    }
    if (req.method !== 'POST' || pathname !== '/api/quote') {
      sendJson(res, 404, { error: 'Not Found' });
      return;
    }
    try {
      let raw = '';
      for await (const chunk of req) {
        raw += chunk;
        if (raw.length > 10_000) {
          sendJson(res, 413, { error: 'Payload too large' });
          return;
        }
      }
      const input = JSON.parse(raw);
      if (!input || typeof input !== 'object' || Array.isArray(input)) {
        throw new RangeError('JSON object required');
      }
      const quote = calculateQuote(input);
      sendJson(res, 200, quote);
    } catch (error) {
      if (error instanceof SyntaxError || error instanceof RangeError || error instanceof TypeError) {
        sendJson(res, 400, { error: error.message });
      } else {
        sendJson(res, 500, { error: 'Internal error' });
      }
    }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const port = Number(process.env.PORT ?? 3000);
  createAppServer().listen(port, '0.0.0.0', () => console.log(`Quote API listening on ${port}`));
}
