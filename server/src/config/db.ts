import mongoose from 'mongoose';
import { env } from './env.js';
import { logger } from '../utils/logger.js';
import {
  Admin,
  Campaign,
  Appointment,
  SlotBlock,
  RefreshToken,
  Customer,
  CustomerRefreshToken,
  Category,
  Product,
  Cart,
  Order,
  ShopSettings,
} from '../models/index.js';

export async function connectDB(): Promise<void> {
  mongoose.set('strictQuery', true);
  await mongoose.connect(env.MONGODB_URI);
  logger.info(`MongoDB connected: ${mongoose.connection.name}`);

  // Mongoose builds indexes in the background by default (fire-and-forget) — without
  // explicitly awaiting them, there's a window right after startup where the unique indexes
  // that prevent double-booking and duplicate submissions don't exist yet, and concurrent
  // writes in that window would NOT be rejected. Waiting here makes index creation a
  // precondition of "connected", not a race with the first incoming requests.
  await Promise.all([
    Admin.init(),
    Campaign.init(),
    Appointment.init(),
    SlotBlock.init(),
    RefreshToken.init(),
    Customer.init(),
    CustomerRefreshToken.init(),
    Category.init(),
    Product.init(),
    Cart.init(),
    Order.init(),
    ShopSettings.init(),
  ]);
  logger.info('MongoDB indexes ready');
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
}
