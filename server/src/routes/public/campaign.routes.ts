import { Router } from 'express';
import { resolveCampaign } from '../../middlewares/resolveCampaign.js';
import { publicReadLimiter } from '../../middlewares/rateLimiters.js';
import { getCampaign, getSlots } from '../../controllers/publicCampaign.controller.js';

const router = Router({ mergeParams: true });

router.use(publicReadLimiter);
router.get('/:slug', resolveCampaign, getCampaign);
router.get('/:slug/slots', resolveCampaign, getSlots);

export default router;
