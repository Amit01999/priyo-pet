// These must be set before any test file imports src/config/env.ts (which validates
// process.env at module-load time) — vitest fully executes this setup file before loading
// test files, so this ordering is safe. MONGODB_URI is a placeholder: tests connect mongoose
// directly to the in-memory server's real URI in beforeAll below, never through env.MONGODB_URI.
process.env.NODE_ENV = 'test';
process.env.FRONTEND_URL = 'http://localhost:8080';
process.env.JWT_ACCESS_SECRET = 'test-secret-test-secret-test-secret-not-for-prod';
process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/placeholder-not-used';
process.env.COOKIE_DOMAIN = 'localhost';

import { beforeAll, afterAll, afterEach } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Admin, Campaign, Appointment, SlotBlock, RefreshToken } from '../src/models/index.js';

let mongod: MongoMemoryServer;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());
  // See config/db.ts — index creation is async by default and must be awaited explicitly,
  // otherwise concurrency tests race against index creation instead of against each other.
  await Promise.all([Admin.init(), Campaign.init(), Appointment.init(), SlotBlock.init(), RefreshToken.init()]);
}, 60000);

afterEach(async () => {
  const { collections } = mongoose.connection;
  await Promise.all(Object.values(collections).map((collection) => collection.deleteMany({})));
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});
