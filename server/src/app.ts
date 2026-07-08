import express, { type Express } from 'express';
import * as helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import { env, isProduction, isTest } from './config/env.js';
import { sanitizeBody } from './middlewares/sanitizeBody.js';
import { notFound } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';

export function createApp(): Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(helmet.default());
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
