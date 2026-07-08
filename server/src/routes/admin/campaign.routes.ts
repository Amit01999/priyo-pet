import { Router } from 'express';
import { resolveCampaign } from '../../middlewares/resolveCampaign.js';
import { requireAuth } from '../../middlewares/requireAuth.js';
import { listCampaigns } from '../../controllers/adminDashboard.controller.js';
import { updateConfig, updateDayStatus } from '../../controllers/adminSlot.controller.js';
import appointmentRoutes from './appointment.routes.js';
import slotRoutes from './slot.routes.js';
import dashboardRoutes from './dashboard.routes.js';

const router = Router();

router.use(requireAuth);

router.get('/', listCampaigns);

router.use('/:slug', resolveCampaign);
router.patch('/:slug/config', updateConfig);
router.patch('/:slug/day-status', updateDayStatus);
router.use('/:slug/appointments', appointmentRoutes);
router.use('/:slug/slots', slotRoutes);
router.use('/:slug/dashboard', dashboardRoutes);

export default router;
