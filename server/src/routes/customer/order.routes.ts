import { Router } from 'express';
import { requireCustomerAuth } from '../../middlewares/requireCustomerAuth.js';
import { publicSubmitLimiter } from '../../middlewares/rateLimiters.js';
import {
  checkout,
  listMyOrders,
  getMyOrder,
  cancelMyOrder,
  getMyInvoicePdf,
} from '../../controllers/order.controller.js';

const router = Router();

router.use(requireCustomerAuth);
router.post('/', publicSubmitLimiter, checkout);
router.get('/', listMyOrders);
router.get('/:id', getMyOrder);
router.patch('/:id/cancel', cancelMyOrder);
router.get('/:id/invoice.pdf', getMyInvoicePdf);

export default router;
