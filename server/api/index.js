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
import { connectDB } from '../dist/config/db.js';
import { createApp } from '../dist/app.js';

const app = createApp();

// One connection (+ unique-index build, which the booking guarantees depend on)
// per warm container, reused across invocations.
let dbReady = null;

export default async function handler(req, res) {
  dbReady ??= connectDB().catch((err) => {
    dbReady = null; // allow retry on the next invocation instead of caching a failure
    throw err;
  });
  await dbReady;
  app(req, res);
}
