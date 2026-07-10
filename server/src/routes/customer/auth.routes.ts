import { Router } from 'express';
import { register, login, logout, me, refresh, updateProfile } from '../../controllers/customerAuth.controller.js';
import { loginLimiter } from '../../middlewares/rateLimiters.js';
import { requireCustomerAuth } from '../../middlewares/requireCustomerAuth.js';

const router = Router();

router.post('/register', loginLimiter, register);
router.post('/login', loginLimiter, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', requireCustomerAuth, me);
router.patch('/profile', requireCustomerAuth, updateProfile);

export default router;
