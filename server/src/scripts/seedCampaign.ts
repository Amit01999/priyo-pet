import { connectDB, disconnectDB } from '../config/db.js';
import { Campaign } from '../models/Campaign.model.js';
import { rabiesVaccination2026 } from './campaigns/rabies-2026.config.js';
import { logger } from '../utils/logger.js';

async function run() {
  await connectDB();

  const fixture = rabiesVaccination2026;
  const result = await Campaign.findOneAndUpdate(
    { slug: fixture.slug },
    { $set: fixture },
    { upsert: true, new: true }
  );

  logger.info(`Campaign upserted: ${result.slug} (${result._id})`);
  await disconnectDB();
}

run().catch((err) => {
  logger.error('Seeding campaign failed', { message: err instanceof Error ? err.message : String(err) });
  process.exit(1);
});
