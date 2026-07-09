import type { NotificationProvider } from './NotificationProvider.js';
import { NoopNotificationProvider } from './NoopNotificationProvider.js';
import { EmailNotificationProvider, buildMailConfigFromEnv } from './EmailNotificationProvider.js';
import { isTest } from '../config/env.js';
import { logger } from '../utils/logger.js';

/** Composition root: picks the real Nodemailer provider only when fully configured and never
 *  in tests (the `isTest` check is unconditional — tests must never touch real SMTP regardless
 *  of what a local .env happens to contain). Falls back to the console-only Noop provider
 *  otherwise, so a dev environment without mail credentials still boots and books normally. */
function buildNotificationProvider(): NotificationProvider {
  if (isTest) return new NoopNotificationProvider();

  const mailConfig = buildMailConfigFromEnv();
  if (!mailConfig) {
    logger.warn('MAIL_HOST/MAIL_USER/MAIL_PASS not fully configured — using console-only notifications');
    return new NoopNotificationProvider();
  }

  return new EmailNotificationProvider(mailConfig);
}

export const notificationProvider: NotificationProvider = buildNotificationProvider();
