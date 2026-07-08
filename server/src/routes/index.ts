import { Router } from 'express';
import publicCampaignRoutes from './public/campaign.routes.js';
import publicAppointmentRoutes from './public/appointment.routes.js';
import adminAuthRoutes from './admin/auth.routes.js';
import adminCampaignRoutes from './admin/campaign.routes.js';

const router = Router();

router.get('/health', (_req, res) => res.status(200).json({ success: true, message: 'ok' }));

// Both public routers key off /campaigns/:slug — mounting them side by side keeps each
// controller focused (campaign info + slots vs. appointment submission) without duplicating
// the :slug param handling.
router.use('/public/campaigns', publicCampaignRoutes);
router.use('/public/campaigns', publicAppointmentRoutes);

router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/campaigns', adminCampaignRoutes);

export default router;
