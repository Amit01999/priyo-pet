import { api, type ApiSuccess } from './client';
import type { Category, Product, Order, OrderStatus, PageResult, ShopSettings, ShopDashboardStats, CustomerUser } from './types';

// --- Products ---

export interface AdminListProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
}

export async function listProductsAdmin(params: AdminListProductsParams = {}): Promise<PageResult<Product>> {
  const res = await api.get<ApiSuccess<PageResult<Product>>>('/admin/shop/products', { params });
  return res.data.data;
}

export async function getProductAdmin(id: string): Promise<Product> {
  const res = await api.get<ApiSuccess<Product>>(`/admin/shop/products/${id}`);
  return res.data.data;
}

export interface ProductFormInput {
  name: string;
  slug?: string;
  description?: string;
  categoryId?: string;
  images: string[];
  hasVariants: boolean;
  priceRegular?: number;
  priceDiscounted?: number;
  stock?: number;
  variants: { label: string; priceRegular: number; priceDiscounted: number; stock: number }[];
  isEnabled: boolean;
}

export async function createProduct(input: ProductFormInput): Promise<Product> {
  const res = await api.post<ApiSuccess<Product>>('/admin/shop/products', input);
  return res.data.data;
}

export async function updateProduct(id: string, input: Partial<ProductFormInput>): Promise<Product> {
  const res = await api.patch<ApiSuccess<Product>>(`/admin/shop/products/${id}`, input);
  return res.data.data;
}

export async function deleteProduct(id: string): Promise<void> {
  await api.delete(`/admin/shop/products/${id}`);
}

// --- Categories ---

export async function listCategoriesAdmin(): Promise<Category[]> {
  const res = await api.get<ApiSuccess<Category[]>>('/admin/shop/categories');
  return res.data.data;
}

export async function createCategory(input: { name: string; slug?: string; isActive?: boolean }): Promise<Category> {
  const res = await api.post<ApiSuccess<Category>>('/admin/shop/categories', input);
  return res.data.data;
}

export async function updateCategory(
  id: string,
  input: { name?: string; slug?: string; isActive?: boolean }
): Promise<Category> {
  const res = await api.patch<ApiSuccess<Category>>(`/admin/shop/categories/${id}`, input);
  return res.data.data;
}

export async function deleteCategory(id: string): Promise<void> {
  await api.delete(`/admin/shop/categories/${id}`);
}

// --- Orders ---

export interface AdminListOrdersParams {
  page?: number;
  limit?: number;
  search?: string;
  orderStatus?: OrderStatus;
  paymentStatus?: string;
}

export async function listOrdersAdmin(params: AdminListOrdersParams = {}): Promise<PageResult<Order>> {
  const res = await api.get<ApiSuccess<PageResult<Order>>>('/admin/shop/orders', { params });
  return res.data.data;
}

export async function getOrderAdmin(id: string): Promise<Order> {
  const res = await api.get<ApiSuccess<Order>>(`/admin/shop/orders/${id}`);
  return res.data.data;
}

export async function updateOrderStatus(id: string, orderStatus: OrderStatus): Promise<Order> {
  const res = await api.patch<ApiSuccess<Order>>(`/admin/shop/orders/${id}/status`, { orderStatus });
  return res.data.data;
}

export async function verifyOrderPayment(id: string): Promise<Order> {
  const res = await api.patch<ApiSuccess<Order>>(`/admin/shop/orders/${id}/verify-payment`);
  return res.data.data;
}

export async function rejectOrderPayment(id: string, reason?: string): Promise<Order> {
  const res = await api.patch<ApiSuccess<Order>>(`/admin/shop/orders/${id}/reject-payment`, { reason });
  return res.data.data;
}

export async function fetchOrderInvoicePdf(id: string): Promise<Blob> {
  const res = await api.get(`/admin/shop/orders/${id}/invoice.pdf`, { responseType: 'blob' });
  return res.data as Blob;
}

// --- Customers ---

export async function listCustomersAdmin(params: { page?: number; limit?: number; search?: string } = {}): Promise<
  PageResult<CustomerUser>
> {
  const res = await api.get<ApiSuccess<PageResult<CustomerUser>>>('/admin/shop/customers', { params });
  return res.data.data;
}

export interface CustomerProfileWithStats {
  customer: CustomerUser;
  stats: { totalOrders: number; totalSpent: number };
  recentOrders: Order[];
}

export async function getCustomerAdmin(id: string): Promise<CustomerProfileWithStats> {
  const res = await api.get<ApiSuccess<CustomerProfileWithStats>>(`/admin/shop/customers/${id}`);
  return res.data.data;
}

// --- Settings ---

export async function getShopSettings(): Promise<ShopSettings> {
  const res = await api.get<ApiSuccess<ShopSettings>>('/admin/shop/settings');
  return res.data.data;
}

export async function updateShopSettings(deliveryChargeBdt: number): Promise<ShopSettings> {
  const res = await api.patch<ApiSuccess<ShopSettings>>('/admin/shop/settings', { deliveryChargeBdt });
  return res.data.data;
}

// --- Dashboard ---

export async function fetchShopDashboardStats(): Promise<ShopDashboardStats> {
  const res = await api.get<ApiSuccess<ShopDashboardStats>>('/admin/shop/dashboard/stats');
  return res.data.data;
}
