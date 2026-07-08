import { connectDB, disconnectDB } from '../config/db.js';
import { env } from '../config/env.js';
import { Admin } from '../models/Admin.model.js';
import { hashPassword } from '../utils/password.js';
import { logger } from '../utils/logger.js';

async function run() {
  if (!env.SEED_ADMIN_EMAIL || !env.SEED_ADMIN_PASSWORD) {
    logger.error('SEED_ADMIN_EMAIL and SEED_ADMIN_PASSWORD must be set in .env to seed an admin');
    process.exit(1);
  }

  await connectDB();

  const existing = await Admin.findOne({ email: env.SEED_ADMIN_EMAIL.toLowerCase() });
  if (existing) {
    logger.info(`Admin ${env.SEED_ADMIN_EMAIL} already exists — skipping`);
  } else {
    const passwordHash = await hashPassword(env.SEED_ADMIN_PASSWORD);
    await Admin.create({
      name: env.SEED_ADMIN_NAME ?? 'Admin',
      email: env.SEED_ADMIN_EMAIL.toLowerCase(),
      passwordHash,
      role: 'superadmin',
    });
    logger.info(`Created admin account: ${env.SEED_ADMIN_EMAIL}`);
  }

  await disconnectDB();
}

run().catch((err) => {
  logger.error('Seeding admin failed', { message: err instanceof Error ? err.message : String(err) });
  process.exit(1);
});
