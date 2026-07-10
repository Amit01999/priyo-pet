import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { checkoutSchema, listMyOrdersQuerySchema } from '../validators/order.validators.js';
import * as orderService from '../services/order.service.js';
import { generateInvoicePdf } from '../services/pdf.service.js';
import { Customer, type CustomerDoc } from '../models/Customer.model.js';
import { Forbidden, NotFound } from '../errors/httpErrors.js';

export const checkout = asyncHandler(async (req: Request, res: Response) => {
  const input = checkoutSchema.parse(req.body);
  const order = await orderService.checkout(req.customer!.sub, input);
  res.status(201).json({ success: true, message: 'Order placed', data: order });
});

export const listMyOrders = asyncHandler(async (req: Request, res: Response) => {
  const query = listMyOrdersQuerySchema.parse(req.query);
  const result = await orderService.listOrdersForCustomer(req.customer!.sub, query);
  res.status(200).json({ success: true, data: result });
});

export const getMyOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(req.params.id, req.customer!.sub);
  res.status(200).json({ success: true, data: order });
});

export const cancelMyOrder = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.cancelOrderByCustomer(req.customer!.sub, req.params.id);
  res.status(200).json({ success: true, message: 'Order cancelled', data: order });
});

export const getMyInvoicePdf = asyncHandler(async (req: Request, res: Response) => {
  const order = await orderService.getOrderById(req.params.id, req.customer!.sub);
  if (order.paymentStatus !== 'Verified') {
    throw Forbidden('Invoice is only available once payment has been verified');
  }
  const customer = await Customer.findById(req.customer!.sub).lean<CustomerDoc>();
  if (!customer) throw NotFound('Account not found');

  const buffer = await generateInvoicePdf(order, customer);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="invoice-${order.orderNumber}.pdf"`);
  res.send(buffer);
});
