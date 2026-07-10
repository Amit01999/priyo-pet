import { Router } from 'express';
import { publicReadLimiter } from '../../middlewares/rateLimiters.js';
import {
  listProducts,
  getProductBySlug,
  listCategories,
  getPaymentInfo,
} from '../../controllers/publicShop.controller.js';

const router = Router();

router.use(publicReadLimiter);
router.get('/products', listProducts);
router.get('/products/:slug', getProductBySlug);
router.get('/categories', listCategories);
router.get('/payment-info', getPaymentInfo);

export default router;
