import type { IncomingMessage, ServerResponse } from 'node:http';
import { connectDB } from '../src/config/db.js';
import { createApp } from '../src/app.js';

/**
 * Vercel serverless entry point. The Express app handles every route; vercel.json
 * rewrites all incoming paths to this function while preserving the original URL,
 * so the app's /api/... routes match unchanged.
 *
 * The DB connection (and unique-index build, which the booking guarantees depend on)
 * is created once per warm container and reused across invocations.
 */
const app = createApp();
let dbReady: Promise<void> | null = null;

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  dbReady ??= connectDB().catch((err) => {
    dbReady = null; // allow retry on the next invocation instead of caching a failure
    throw err;
  });
  await dbReady;
  app(req, res);
}
