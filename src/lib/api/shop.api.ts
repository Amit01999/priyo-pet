import { api, type ApiSuccess } from './client';
import { customerApi } from './customerClient';
import type { Category, Product, CartView, Order, PageResult } from './types';

// --- Public browsing (no auth) ---

export interface ListProductsParams {
  page?: number;
  limit?: number;
  search?: string;
  categorySlug?: string;
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
}

export async function listProducts(params: ListProductsParams = {}): Promise<PageResult<Product>> {
  const res = await api.get<ApiSuccess<PageResult<Product>>>('/public/shop/products', { params });
  return res.data.data;
}

export async function fetchProductBySlug(slug: string): Promise<{ product: Product; related: Product[] }> {
  const res = await api.get<ApiSuccess<{ product: Product; related: Product[] }>>(`/public/shop/products/${slug}`);
  return res.data.data;
}

export async function listCategories(): Promise<Category[]> {
  const res = await api.get<ApiSuccess<Category[]>>('/public/shop/categories');
  return res.data.data;
}

export interface ShopPaymentInfo {
  method: 'bKash';
  bkashNumber: string;
  deliveryChargeBdt: number;
}

export async function fetchPaymentInfo(): Promise<ShopPaymentInfo> {
  const res = await api.get<ApiSuccess<ShopPaymentInfo>>('/public/shop/payment-info');
  return res.data.data;
}

// --- Cart (customer-authenticated) ---

export async function fetchCart(): Promise<CartView> {
  const res = await customerApi.get<ApiSuccess<CartView>>('/customer/cart');
  return res.data.data;
}

export async function addCartItem(productId: string, variantId: string | null, quantity = 1): Promise<CartView> {
  const res = await customerApi.post<ApiSuccess<CartView>>('/customer/cart/items', { productId, variantId, quantity });
  return res.data.data;
}

export async function updateCartItem(productId: string, variantId: string | null, quantity: number): Promise<CartView> {
  const res = await customerApi.patch<ApiSuccess<CartView>>('/customer/cart/items', { productId, variantId, quantity });
  return res.data.data;
}

export async function removeCartItem(productId: string, variantId: string | null): Promise<CartView> {
  const res = await customerApi.delete<ApiSuccess<CartView>>('/customer/cart/items', {
    data: { productId, variantId },
  });
  return res.data.data;
}

// --- Orders (customer-authenticated) ---

export interface CheckoutPayload {
  shippingName: string;
  shippingPhone: string;
  shippingAddress: string;
  shippingDistrict: string;
  notes?: string;
  paymentReference: string;
  paymentConfirmedByUser: true;
}

export async function checkout(payload: CheckoutPayload): Promise<Order> {
  const res = await customerApi.post<ApiSuccess<Order>>('/customer/orders', payload);
  return res.data.data;
}

export async function listMyOrders(params: { page?: number; limit?: number } = {}): Promise<PageResult<Order>> {
  const res = await customerApi.get<ApiSuccess<PageResult<Order>>>('/customer/orders', { params });
  return res.data.data;
}

export async function getMyOrder(id: string): Promise<Order> {
  const res = await customerApi.get<ApiSuccess<Order>>(`/customer/orders/${id}`);
  return res.data.data;
}

export async function cancelMyOrder(id: string): Promise<Order> {
  const res = await customerApi.patch<ApiSuccess<Order>>(`/customer/orders/${id}/cancel`);
  return res.data.data;
}

export async function fetchMyInvoicePdf(id: string): Promise<Blob> {
  const res = await customerApi.get(`/customer/orders/${id}/invoice.pdf`, { responseType: 'blob' });
  return res.data as Blob;
}
