import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import {
  adminListOrdersQuerySchema,
  updateOrderStatusSchema,
  rejectOrderPaymentSchema,
} from '../validators/order.validators.js';
import * as orderService from '../services/order.service.js';
import { generateInvoicePdf } from '../services/pdf.service.js';
import { Customer, type CustomerDoc } from '../models/Customer.model.js';
import { NotFound } from '../errors/httpErrors.js';

export const list = asyncHandler(async (req: Request, res: Response) => {
  const query = adminListOrdersQuerySchema.parse(req.query);
  const result = await orderService.listOrdersAdmin(query);
  res.status(200).json({ success: true, data: result });
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(req.params.id);
  res.status(200).json({ success: true, data: order });
});

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const { orderStatus } = updateOrderStatusSchema.parse(req.body);
  const order = await orderService.updateOrderStatus(req.params.id, orderStatus, req.admin!.sub);
  res.status(200).json({ success: true, message: 'Order status updated', data: order });
});

export const verifyPayment = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.verifyOrderPayment(req.params.id, req.admin!.sub);
  res.status(200).json({ success: true, message: 'Payment verified, order approved', data: order });
});

export const rejectPayment = asyncHandler(async (req: Request, res: Response) => {
  const { reason } = rejectOrderPaymentSchema.parse(req.body);
  const order = await orderService.rejectOrderPayment(req.params.id, req.admin!.sub, reason);
  res.status(200).json({ success: true, message: 'Payment rejected, order cancelled', data: order });
});

export const getInvoicePdf = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(req.params.id);
  const customer = await Customer.findById(order.customerId).lean<CustomerDoc>();
  if (!customer) throw NotFound('Customer not found');

  const buffer = await generateInvoicePdf(order, customer);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="invoice-${order.orderNumber}.pdf"`);
  res.send(buffer);
});
