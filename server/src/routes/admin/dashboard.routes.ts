import { Router } from 'express';
import { getStats } from '../../controllers/adminDashboard.controller.js';

// Mounted under /api/admin/campaigns/:slug/dashboard, already behind requireAuth + resolveCampaign.
const router = Router({ mergeParams: true });

router.get('/stats', getStats);

export default router;
