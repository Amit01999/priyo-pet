import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler.js';
import { addCartItemSchema, updateCartItemSchema, removeCartItemSchema } from '../validators/cart.validators.js';
import * as cartService from '../services/cart.service.js';

export const getCart = asyncHandler(async (req: Request, res: Response) => {
  const cart = await cartService.getCartView(req.customer!.sub);
  res.status(200).json({ success: true, data: cart });
});

export const addItem = asyncHandler(async (req: Request, res: Response) => {
  const input = addCartItemSchema.parse(req.body);
  const cart = await cartService.addItemToCart(req.customer!.sub, input.productId, input.variantId ?? null, input.quantity);
  res.status(200).json({ success: true, message: 'Added to cart', data: cart });
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const input = updateCartItemSchema.parse(req.body);
  const cart = await cartService.updateCartItemQuantity(req.customer!.sub, input.productId, input.variantId ?? null, input.quantity);
  res.status(200).json({ success: true, message: 'Cart updated', data: cart });
});

export const removeItem = asyncHandler(async (req: Request, res: Response) => {
  const input = removeCartItemSchema.parse(req.body);
  const cart = await cartService.removeCartItem(req.customer!.sub, input.productId, input.variantId ?? null);
  res.status(200).json({ success: true, message: 'Item removed', data: cart });
});
