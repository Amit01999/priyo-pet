import express, { type Express } from 'express';
import { createRequire } from 'module';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env, isProduction, isTest } from './config/env.js';
import { sanitizeBody } from './middlewares/sanitizeBody.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';

// Use createRequire to load helmet as CJS — avoids TS2349 caused by Vercel's
// TypeScript compiler not resolving helmet's exports map correctly under NodeNext ESM.
const _require = createRequire(import.meta.url);
const helmet = _require('helmet') as typeof import('helmet').default;

export function createApp(): Express {
  const app = express();

  // Trust the first hop in the X-Forwarded-For header (Vercel's edge proxy).
  // Required so express-rate-limit, req.ip, etc. see the real client IP, not
  // Vercel's internal IP (which would key every request to the same bucket).
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(
    cors({
      origin: env.FRONTEND_URL,
      credentials: true,
    })
  );
  app.use(compression());
  if (!isTest) app.use(morgan(isProduction ? 'combined' : 'dev'));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(sanitizeBody);

  app.use('/api', routes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
