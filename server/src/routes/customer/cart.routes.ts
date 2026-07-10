import { Router } from 'express';
import { requireCustomerAuth } from '../../middlewares/requireCustomerAuth.js';
import { getCart, addItem, updateItem, removeItem } from '../../controllers/cart.controller.js';

const router = Router();

router.use(requireCustomerAuth);
router.get('/', getCart);
router.post('/items', addItem);
router.patch('/items', updateItem);
router.delete('/items', removeItem);

export default router;
