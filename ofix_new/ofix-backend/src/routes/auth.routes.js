import { Router } from 'express';
import authController from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/profile', protectRoute, authController.getProfile);
router.post('/invite-link', protectRoute, authController.generateInviteLink);
router.post('/guest-login', authController.guestLogin);

export default router;
