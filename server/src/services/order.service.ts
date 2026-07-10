import { Types } from 'mongoose';
import { Order, type OrderDoc } from '../models/Order.model.js';
import { Product, type ProductDoc } from '../models/Product.model.js';
import { Customer, type CustomerDoc } from '../models/Customer.model.js';
import { NotFound, Conflict, BadRequest } from '../errors/httpErrors.js';
import { ERROR_CODES, type OrderStatus } from '../config/constants.js';
import { buildPageResult, type PageResult } from '../utils/pagination.js';
import { getCartView, clearCart } from './cart.service.js';
import { decrementStock, restoreStock } from './product.service.js';
import * as shopNotifications from '../notifications/shopNotifications.js';

export interface CheckoutInput {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingDistrict: string;
  notes?: string;
  paymentReference: string;
  paymentConfirmedByUser: true;
}

const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  Pending: ['Approved', 'Cancelled'],
  Approved: ['Processing', 'Cancelled'],
  Processing: ['Shipped', 'Cancelled'],
  Shipped: ['Delivered'],
  Delivered: [],
  Cancelled: [],
};

function generateOrderNumber(): string {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `PP-${datePart}-${randomPart}`;
}

function mapDuplicateKeyError(err: unknown): Error {
  const mongoErr = err as { code?: number; keyPattern?: Record<string, number> };
  if (mongoErr?.code === 11000 && mongoErr.keyPattern && 'paymentReference' in mongoErr.keyPattern) {
    return Conflict(
      'This bKash reference number has already been used on another active order.',
      ERROR_CODES.DUPLICATE_PAYMENT_REFERENCE
    );
  }
  return err as Error;
}

export async function checkout(customerId: string, input: CheckoutInput): Promise<OrderDoc> {
  const cartView = await getCartView(customerId);
  if (cartView.items.length === 0) throw Conflict('Your cart is empty', ERROR_CODES.CART_EMPTY);

  const unavailable = cartView.items.filter((i) => !i.isAvailable);
  if (unavailable.length > 0) {
    throw Conflict(
      `${unavailable.map((i) => i.name).join(', ')} ${unavailable.length > 1 ? 'are' : 'is'} no longer available in the requested quantity`,
      ERROR_CODES.OUT_OF_STOCK
    );
  }

  // Decrement stock for every line item, atomically per-item (see product.service.ts). This
  // codebase has no multi-document transactions anywhere (single-node-friendly, matches the
  // existing slot-booking design), so on a partial failure we manually compensate by restoring
  // whatever already succeeded rather than leaving stock permanently short.
  const decremented: { productId: Types.ObjectId; variantId: Types.ObjectId | null; quantity: number }[] = [];
  try {
    for (const item of cartView.items) {
      const productId = new Types.ObjectId(item.productId);
      const variantId = item.variantId ? new Types.ObjectId(item.variantId) : null;
      await decrementStock(productId, variantId, item.quantity);
      decremented.push({ productId, variantId, quantity: item.quantity });
    }
  } catch (err) {
    for (const d of decremented) {
      await restoreStock(d.productId, d.variantId, d.quantity);
    }
    throw err;
  }

  let order;
  try {
    order = await Order.create({
      orderNumber: generateOrderNumber(),
      customerId,
      items: cartView.items.map((i) => ({
        productId: i.productId,
        name: i.name,
        image: i.image,
        variantLabel: i.variantLabel,
        unitPriceRegular: i.priceRegular,
        unitPriceDiscounted: i.priceDiscounted,
        quantity: i.quantity,
        lineTotal: i.lineTotal,
      })),
      shippingName: input.shippingName,
      shippingPhone: input.shippingPhone,
      shippingAddress: input.shippingAddress,
      shippingDistrict: input.shippingDistrict,
      notes: input.notes ?? '',
      subtotal: cartView.subtotal,
      deliveryCharge: cartView.deliveryCharge,
      total: cartView.total,
      orderStatus: 'Pending',
      paymentMethod: 'bKash',
      paymentAmount: cartView.total,
      paymentReference: input.paymentReference,
      paymentConfirmedByUser: input.paymentConfirmedByUser,
      paymentStatus: 'Pending Verification',
      statusHistory: [{ status: 'Pending', at: new Date(), changedBy: 'customer' }],
      isActive: true,
    });
  } catch (err) {
    for (const d of decremented) {
      await restoreStock(d.productId, d.variantId, d.quantity);
    }
    throw mapDuplicateKeyError(err);
  }

  await clearCart(customerId);

  const customer = await Customer.findById(customerId).lean<CustomerDoc>();
  if (customer) {
    await shopNotifications.sendOrderReceived(order.toObject() as unknown as OrderDoc, customer);
  }

  return order.toObject() as unknown as OrderDoc;
}

export async function listOrdersForCustomer(
  customerId: string,
  query: { page: number; limit: number }
): Promise<PageResult<OrderDoc>> {
  const filter = { customerId };
  const skip = (query.page - 1) * query.limit;
  const [data, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean<OrderDoc[]>(),
    Order.countDocuments(filter),
  ]);
  return buildPageResult(data, total, query.page, query.limit);
}

export async function getOrderById(id: string, ownerCustomerId?: string): Promise<OrderDoc> {
  const filter: Record<string, unknown> = { _id: id };
  if (ownerCustomerId) filter.customerId = ownerCustomerId;
  const order = await Order.findOne(filter).lean<OrderDoc>();
  if (!order) throw NotFound('Order not found');
  return order;
}

async function restoreStockForOrder(order: OrderDoc): Promise<void> {
  for (const item of order.items) {
    const variant = item.variantLabel
      ? (await Product.findById(item.productId).lean<ProductDoc>())?.variants.find((v) => v.label === item.variantLabel)
      : undefined;
    await restoreStock(item.productId, variant?._id ?? null, item.quantity);
  }
}

export async function updateOrderStatus(id: string, nextStatus: OrderStatus, changedBy: string): Promise<OrderDoc> {
  const current = await Order.findById(id);
  if (!current) throw NotFound('Order not found');

  const currentStatus = current.orderStatus as OrderStatus;
  const allowed = ORDER_STATUS_TRANSITIONS[currentStatus] ?? [];
  if (!allowed.includes(nextStatus)) {
    throw BadRequest(`Cannot move an order from ${currentStatus} to ${nextStatus}`, {
      orderStatus: [`Illegal transition: ${currentStatus} -> ${nextStatus}`],
    });
  }

  if (nextStatus === 'Cancelled') {
    await restoreStockForOrder(current.toObject() as unknown as OrderDoc);
  }

  current.orderStatus = nextStatus;
  current.isActive = nextStatus !== 'Cancelled';
  current.statusHistory.push({ status: nextStatus, at: new Date(), changedBy });
  await current.save();

  return current.toObject() as unknown as OrderDoc;
}

export async function cancelOrderByCustomer(customerId: string, orderId: string): Promise<OrderDoc> {
  const order = await Order.findOne({ _id: orderId, customerId });
  if (!order) throw NotFound('Order not found');
  if (order.orderStatus !== 'Pending') {
    throw Conflict('This order can no longer be cancelled — it has already been approved', ERROR_CODES.PAYMENT_ALREADY_RESOLVED);
  }
  return updateOrderStatus(orderId, 'Cancelled', 'customer');
}

function assertPendingVerification(order: Pick<OrderDoc, 'paymentStatus'>): void {
  if (order.paymentStatus !== 'Pending Verification') {
    throw Conflict(
      `Payment has already been marked "${order.paymentStatus}" for this order.`,
      ERROR_CODES.PAYMENT_ALREADY_RESOLVED
    );
  }
}

export async function verifyOrderPayment(orderId: string, adminId: string): Promise<OrderDoc> {
  const current = await Order.findById(orderId).lean<OrderDoc>();
  if (!current) throw NotFound('Order not found');
  assertPendingVerification(current);

  await updateOrderStatus(orderId, 'Approved', adminId);

  const updated = await Order.findByIdAndUpdate(
    orderId,
    { $set: { paymentStatus: 'Verified', verifiedBy: adminId, verifiedAt: new Date() } },
    { new: true }
  ).lean<OrderDoc>();
  if (!updated) throw NotFound('Order not found');

  const customer = await Customer.findById(updated.customerId).lean<CustomerDoc>();
  if (customer) await shopNotifications.sendOrderPaymentVerified(updated, customer);

  return updated;
}

export async function rejectOrderPayment(orderId: string, adminId: string, reason?: string): Promise<OrderDoc> {
  const current = await Order.findById(orderId).lean<OrderDoc>();
  if (!current) throw NotFound('Order not found');
  assertPendingVerification(current);

  await updateOrderStatus(orderId, 'Cancelled', adminId); // restores stock

  const updated = await Order.findByIdAndUpdate(
    orderId,
    {
      $set: {
        paymentStatus: 'Rejected',
        paymentRejectionReason: reason ?? '',
        verifiedBy: adminId,
        verifiedAt: new Date(),
      },
    },
    { new: true }
  ).lean<OrderDoc>();
  if (!updated) throw NotFound('Order not found');

  const customer = await Customer.findById(updated.customerId).lean<CustomerDoc>();
  if (customer) await shopNotifications.sendOrderPaymentRejected(updated, customer, reason);

  return updated;
}

// --- Admin listing/dashboard ---

export async function listOrdersAdmin(query: {
  page: number;
  limit: number;
  search?: string;
  orderStatus?: OrderStatus;
  paymentStatus?: string;
}): Promise<PageResult<OrderDoc>> {
  const filter: Record<string, unknown> = {};
  if (query.orderStatus) filter.orderStatus = query.orderStatus;
  if (query.paymentStatus) filter.paymentStatus = query.paymentStatus;
  if (query.search) {
    const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { orderNumber: { $regex: escaped, $options: 'i' } },
      { shippingName: { $regex: escaped, $options: 'i' } },
      { shippingPhone: { $regex: escaped, $options: 'i' } },
      { paymentReference: { $regex: escaped, $options: 'i' } },
    ];
  }

  const skip = (query.page - 1) * query.limit;
  const [data, total] = await Promise.all([
    Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean<OrderDoc[]>(),
    Order.countDocuments(filter),
  ]);
  return buildPageResult(data, total, query.page, query.limit);
}

export async function getShopDashboardStats() {
  const [totalProducts, totalOrders, statusCounts, paymentStatusCounts, revenueAgg, lowStockProducts, newCustomers] =
    await Promise.all([
      Product.countDocuments({}),
      Order.countDocuments({}),
      Order.aggregate([{ $group: { _id: '$orderStatus', count: { $sum: 1 } } }]),
      Order.aggregate([{ $group: { _id: '$paymentStatus', count: { $sum: 1 } } }]),
      Order.aggregate([
        { $match: { paymentStatus: 'Verified' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
      Product.countDocuments({
        isEnabled: true,
        $or: [
          { hasVariants: false, stock: { $lte: 5 } },
          { hasVariants: true, variants: { $elemMatch: { stock: { $lte: 5 } } } },
        ],
      }),
      Customer.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
      }),
    ]);

  const byOrderStatus: Record<string, number> = {
    Pending: 0,
    Approved: 0,
    Processing: 0,
    Shipped: 0,
    Delivered: 0,
    Cancelled: 0,
  };
  for (const row of statusCounts as { _id: string; count: number }[]) byOrderStatus[row._id] = row.count;

  const byPaymentStatus: Record<string, number> = { 'Pending Verification': 0, Verified: 0, Rejected: 0 };
  for (const row of paymentStatusCounts as { _id: string; count: number }[]) byPaymentStatus[row._id] = row.count;

  return {
    totalProducts,
    totalOrders,
    byOrderStatus,
    byPaymentStatus,
    revenue: (revenueAgg[0] as { total: number } | undefined)?.total ?? 0,
    lowStockProducts,
    newCustomers,
  };
}
