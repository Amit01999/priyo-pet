import { Router } from 'express';
import { login, logout, me, refresh } from '../../controllers/auth.controller.js';
import { loginLimiter } from '../../middlewares/rateLimiters.js';
import { requireAuth } from '../../middlewares/requireAuth.js';

const router = Router();

router.post('/login', loginLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
