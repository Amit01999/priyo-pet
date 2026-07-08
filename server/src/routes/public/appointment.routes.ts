import { Router } from 'express';
import { resolveCampaign } from '../../middlewares/resolveCampaign.js';
import { publicSubmitLimiter } from '../../middlewares/rateLimiters.js';
import { submitAppointment } from '../../controllers/publicAppointment.controller.js';

const router = Router({ mergeParams: true });

router.post('/:slug/appointments', publicSubmitLimiter, resolveCampaign, submitAppointment);

export default router;
