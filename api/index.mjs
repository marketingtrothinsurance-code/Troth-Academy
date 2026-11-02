/**
 * TROTH ACADEMY — PREVIEW-ONLY API ADAPTER
 *
 * Runs the existing Express routes inside a Vercel Function. Data is in memory
 * and may disappear or diverge between function invocations. Do not use it for
 * actual employees, certificates, assessments, or customer information.
 *
 * Vercel rewrites /api/v1/:path* -> /api/index?route=:path*.
 */
import { createApp } from '../server/dist/app.js';
import { createStore } from '../server/dist/store.js';

const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
  throw new Error('Set a unique JWT_SECRET of at least 32 characters in Vercel Environment Variables.');
}
const clientOrigin = process.env.CLIENT_ORIGIN ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:4200');

// Seed once for each warm serverless instance; NOT persistent storage.
const app = createApp(await createStore(), { secret, clientOrigin });

export default function handler(req, res) {
  // Explicit query-parameter rewrite avoids depending on how Vercel represents
  // the internal function URL to the Express router.
  const url = new URL(req.url ?? '/', 'https://preview.internal');
  const routed = url.searchParams.get('route');
  if (routed === null) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    return res.end(JSON.stringify({ success: false, message: 'API endpoint not found' }));
  }
  url.searchParams.delete('route');
  // Retain the original API query parameters after removing our route variable.
  const safePath = routed.replace(/^\/+/, '');
  req.url = `/api/v1/${safePath}${url.search}`;
  return app(req, res);
}
