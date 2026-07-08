import { Router } from 'express';
import * as ctrl from '../../controllers/adminAppointment.controller.js';

// Mounted under /api/admin/campaigns/:slug/appointments, already behind requireAuth + resolveCampaign.
const router = Router({ mergeParams: true });

router.get('/export', ctrl.exportAppointments);
router.get('/', ctrl.list);
router.post('/', ctrl.create);
router.get('/:id', ctrl.getById);
router.patch('/:id/status', ctrl.updateStatus);
router.patch('/:id/notes', ctrl.updateNotes);
router.delete('/:id', ctrl.remove);

export default router;
