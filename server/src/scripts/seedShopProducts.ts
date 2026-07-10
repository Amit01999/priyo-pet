import { connectDB, disconnectDB } from '../config/db.js';
import { Category } from '../models/Category.model.js';
import { Product } from '../models/Product.model.js';
import { slugify } from '../utils/slug.js';
import { logger } from '../utils/logger.js';

const PRODUCTS = [
  {
    name: 'নেক বেল্ট',
    description: 'আপনার পোষা প্রাণীর জন্য আরামদায়ক ও টেকসই নেক বেল্ট।',
    images: ['https://mikipetstore.com/cdn/shop/files/nailoncollar_533x.jpg?v=1741097048'],
    hasVariants: false,
    priceRegular: 40,
    priceDiscounted: 35,
    stock: 50,
  },
  {
    name: 'Cat Collar',
    description: 'Adjustable, comfortable collar for cats — available in two sizes.',
    images: [
      'https://media.mewmewshopbd.com/uploads/media-manager/2021/08/20240319071614E-Collar-for-Dogs-Cats-Elizabeth-Collar-2-1732701344.jpeg',
    ],
    hasVariants: true,
    variants: [
      { label: 'Size 6', priceRegular: 199, priceDiscounted: 190, stock: 30 },
      { label: 'Size 7', priceRegular: 199, priceDiscounted: 180, stock: 30 },
    ],
  },
  {
    name: 'চিরুনি',
    description: 'পোষা প্রাণীর লোম পরিষ্কার ও পরিপাটি রাখার জন্য চিরুনি।',
    images: ['https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_5aoWCYLTe3mLJldxd6rHEZoFLLCYUtOktVf-YCM8To4XvUduFCGUSzI&s=10'],
    hasVariants: false,
    priceRegular: 99,
    priceDiscounted: 80,
    stock: 100,
  },
];

async function run() {
  await connectDB();

  const category = await Category.findOneAndUpdate(
    { slug: 'pet-accessories' },
    { $set: { name: 'Pet Accessories', slug: 'pet-accessories', isActive: true } },
    { upsert: true, new: true }
  );

  for (const p of PRODUCTS) {
    const slug = slugify(p.name);
    const result = await Product.findOneAndUpdate(
      { slug },
      { $set: { ...p, slug, categoryId: category._id, isEnabled: true } },
      { upsert: true, new: true }
    );
    logger.info(`Product upserted: ${result.name} (${result._id})`);
  }

  await disconnectDB();
}

run().catch((err) => {
  logger.error('Seeding shop products failed', { message: err instanceof Error ? err.message : String(err) });
  process.exit(1);
});
