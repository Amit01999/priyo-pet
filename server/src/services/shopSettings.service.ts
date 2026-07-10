import { ShopSettings, type ShopSettingsDoc } from '../models/ShopSettings.model.js';

/** Singleton settings document — upserted so it always exists after the first read. */
export async function getShopSettings(): Promise<ShopSettingsDoc> {
  const settings = await ShopSettings.findOneAndUpdate(
    {},
    { $setOnInsert: { deliveryChargeBdt: 60 } },
    { upsert: true, new: true }
  ).lean<ShopSettingsDoc>();
  return settings!;
}

export async function updateShopSettings(updates: { deliveryChargeBdt?: number }): Promise<ShopSettingsDoc> {
  const settings = await ShopSettings.findOneAndUpdate(
    {},
    { $set: updates, $setOnInsert: { deliveryChargeBdt: 60 } },
    { upsert: true, new: true }
  ).lean<ShopSettingsDoc>();
  return settings!;
}
