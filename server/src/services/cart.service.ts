import { Types } from 'mongoose';
import { Cart, type CartDoc } from '../models/Cart.model.js';
import { Product, type ProductDoc } from '../models/Product.model.js';
import { NotFound, BadRequest } from '../errors/httpErrors.js';
import { resolvePricing } from './product.service.js';
import { getShopSettings } from './shopSettings.service.js';

export interface CartLineView {
  productId: string;
  productSlug: string;
  name: string;
  image: string;
  variantId: string | null;
  variantLabel: string | null;
  priceRegular: number;
  priceDiscounted: number;
  quantity: number;
  lineTotal: number;
  availableStock: number;
  isAvailable: boolean;
}

export interface CartView {
  items: CartLineView[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
}

async function getOrCreateCart(customerId: string): Promise<CartDoc> {
  const cart = await Cart.findOneAndUpdate(
    { customerId },
    { $setOnInsert: { customerId, items: [] } },
    { upsert: true, new: true }
  ).lean<CartDoc>();
  return cart!;
}

function sameItem(a: { productId: Types.ObjectId | string; variantId: Types.ObjectId | string | null }, productId: string, variantId: string | null) {
  return String(a.productId) === String(productId) && String(a.variantId ?? '') === String(variantId ?? '');
}

export async function addItemToCart(
  customerId: string,
  productId: string,
  variantId: string | null,
  quantity: number
): Promise<CartView> {
  const product = await Product.findOne({ _id: productId, isEnabled: true }).lean<ProductDoc>();
  if (!product) throw NotFound('Product not found');
  resolvePricing(product, variantId); // validates the variant exists if applicable

  const cart = await getOrCreateCart(customerId);
  const existing = cart.items.find((item) => sameItem(item, productId, variantId));

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.items.push({ productId: new Types.ObjectId(productId), variantId: variantId ? new Types.ObjectId(variantId) : null, quantity });
  }

  await Cart.updateOne({ customerId }, { $set: { items: cart.items } });
  return getCartView(customerId);
}

export async function updateCartItemQuantity(
  customerId: string,
  productId: string,
  variantId: string | null,
  quantity: number
): Promise<CartView> {
  if (quantity < 1) throw BadRequest('Quantity must be at least 1');
  const cart = await getOrCreateCart(customerId);
  const item = cart.items.find((i) => sameItem(i, productId, variantId));
  if (!item) throw NotFound('Item not found in cart');
  item.quantity = quantity;
  await Cart.updateOne({ customerId }, { $set: { items: cart.items } });
  return getCartView(customerId);
}

export async function removeCartItem(customerId: string, productId: string, variantId: string | null): Promise<CartView> {
  const cart = await getOrCreateCart(customerId);
  cart.items = cart.items.filter((i) => !sameItem(i, productId, variantId));
  await Cart.updateOne({ customerId }, { $set: { items: cart.items } });
  return getCartView(customerId);
}

export async function clearCart(customerId: string): Promise<void> {
  await Cart.updateOne({ customerId }, { $set: { items: [] } });
}

export async function getCartView(customerId: string): Promise<CartView> {
  const cart = await getOrCreateCart(customerId);
  const settings = await getShopSettings();

  const productIds = cart.items.map((i) => i.productId);
  const products = await Product.find({ _id: { $in: productIds } }).lean<ProductDoc[]>();
  const productMap = new Map(products.map((p) => [String(p._id), p]));

  const items: CartLineView[] = [];
  for (const cartItem of cart.items) {
    const product = productMap.get(String(cartItem.productId));
    if (!product) continue; // product deleted since being added — silently drop from view

    const isEnabled = product.isEnabled;
    let pricing;
    try {
      pricing = resolvePricing(product, cartItem.variantId ? String(cartItem.variantId) : null);
    } catch {
      continue; // variant no longer exists — drop from view
    }

    items.push({
      productId: String(product._id),
      productSlug: product.slug,
      name: product.name + (pricing.label ? ` (${pricing.label})` : ''),
      image: product.images[0] ?? '',
      variantId: cartItem.variantId ? String(cartItem.variantId) : null,
      variantLabel: pricing.label,
      priceRegular: pricing.priceRegular,
      priceDiscounted: pricing.priceDiscounted,
      quantity: cartItem.quantity,
      lineTotal: pricing.priceDiscounted * cartItem.quantity,
      availableStock: pricing.stock,
      isAvailable: isEnabled && pricing.stock >= cartItem.quantity,
    });
  }

  const subtotal = items.reduce((sum, i) => sum + i.lineTotal, 0);
  const deliveryCharge = items.length > 0 ? settings.deliveryChargeBdt : 0;
  return { items, subtotal, deliveryCharge, total: subtotal + deliveryCharge };
}
