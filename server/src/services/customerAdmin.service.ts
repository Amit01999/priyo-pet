import { Customer, type CustomerDoc } from '../models/Customer.model.js';
import { Order } from '../models/Order.model.js';
import { NotFound } from '../errors/httpErrors.js';
import { buildPageResult, type PageResult } from '../utils/pagination.js';

export async function listCustomersAdmin(query: {
  page: number;
  limit: number;
  search?: string;
}): Promise<PageResult<CustomerDoc>> {
  const filter: Record<string, unknown> = {};
  if (query.search) {
    const escaped = query.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [
      { name: { $regex: escaped, $options: 'i' } },
      { email: { $regex: escaped, $options: 'i' } },
      { phone: { $regex: escaped, $options: 'i' } },
    ];
  }
  const skip = (query.page - 1) * query.limit;
  const [data, total] = await Promise.all([
    Customer.find(filter).select('-passwordHash').sort({ createdAt: -1 }).skip(skip).limit(query.limit).lean<CustomerDoc[]>(),
    Customer.countDocuments(filter),
  ]);
  return buildPageResult(data, total, query.page, query.limit);
}

export async function getCustomerProfileWithStats(id: string) {
  const customer = await Customer.findById(id).select('-passwordHash').lean<CustomerDoc>();
  if (!customer) throw NotFound('Customer not found');

  const [orderCount, revenueAgg, recentOrders] = await Promise.all([
    Order.countDocuments({ customerId: id }),
    Order.aggregate([
      { $match: { customerId: customer._id, paymentStatus: 'Verified' } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]),
    Order.find({ customerId: id }).sort({ createdAt: -1 }).limit(10).lean(),
  ]);

  return {
    customer,
    stats: {
      totalOrders: orderCount,
      totalSpent: (revenueAgg[0] as { total: number } | undefined)?.total ?? 0,
    },
    recentOrders,
  };
}
