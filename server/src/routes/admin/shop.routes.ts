import { Router } from 'express';
import { requireAuth } from '../../middlewares/requireAuth.js';
import * as productCtrl from '../../controllers/adminProduct.controller.js';
import * as categoryCtrl from '../../controllers/adminCategory.controller.js';
import * as orderCtrl from '../../controllers/adminShopOrder.controller.js';
import * as customerCtrl from '../../controllers/adminCustomer.controller.js';
import * as settingsCtrl from '../../controllers/adminShopSettings.controller.js';
import * as dashboardCtrl from '../../controllers/adminShopDashboard.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/products', productCtrl.list);
router.post('/products', productCtrl.create);
router.get('/products/:id', productCtrl.getById);
router.patch('/products/:id', productCtrl.update);
router.delete('/products/:id', productCtrl.remove);

router.get('/categories', categoryCtrl.list);
router.post('/categories', categoryCtrl.create);
router.patch('/categories/:id', categoryCtrl.update);
router.delete('/categories/:id', categoryCtrl.remove);

router.get('/orders', orderCtrl.list);
router.get('/orders/:id', orderCtrl.getById);
router.patch('/orders/:id/status', orderCtrl.updateStatus);
router.patch('/orders/:id/verify-payment', orderCtrl.verifyPayment);
router.patch('/orders/:id/reject-payment', orderCtrl.rejectPayment);
router.get('/orders/:id/invoice.pdf', orderCtrl.getInvoicePdf);

router.get('/customers', customerCtrl.list);
router.get('/customers/:id', customerCtrl.getById);

router.get('/settings', settingsCtrl.getSettings);
router.patch('/settings', settingsCtrl.updateSettings);

router.get('/dashboard/stats', dashboardCtrl.getStats);

export default router;
