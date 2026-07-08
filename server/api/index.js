/**
 * Vercel serverless entry point.
 *
 * Deliberately plain JavaScript importing from the tsc build output (dist/):
 * Vercel's function builder re-type-checks any TypeScript entry with its own
 * compiler settings, which mishandle helmet's dual CJS/ESM types (TS2349).
 * Precompiling via `npm run build` (the project's buildCommand) and bundling
 * the emitted JS sidesteps that entirely.
 *
 * vercel.json rewrites every path to this function while preserving the
 * original URL, so the Express app's /api/... routes match unchanged.
 */

// Ensure production mode is set for all downstream env checks.
process.env.NODE_ENV = process.env.NODE_ENV ?? 'production';

import { connectDB } from '../dist/config/db.js';
import { createApp } from '../dist/app.js';

// Create the Express app once per warm container — safe because createApp()
// is pure (no I/O, no DB calls). This is reused across all invocations in
// the same Vercel sandbox.
const app = createApp();

// One DB connection (+ unique-index sync) per warm container.
// Reset on failure so the next invocation retries instead of perpetually
// serving from a broken connection.
let dbReady = null;

export default async function handler(req, res) {
  dbReady ??= connectDB().catch((err) => {
    dbReady = null;
    throw err;
  });
  await dbReady;
  app(req, res);
}
