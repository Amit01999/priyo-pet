import { Router } from 'express';
import * as ctrl from '../../controllers/adminSlot.controller.js';

// Mounted under /api/admin/campaigns/:slug/slots, already behind requireAuth + resolveCampaign.
const router = Router({ mergeParams: true });

router.get('/', ctrl.getSlots);
router.patch('/block', ctrl.block);
router.patch('/unblock', ctrl.unblock);

export default router;
