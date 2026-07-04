import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
	getMyProfile,
	getProfileByUsername,
	updateMyProfile,
	ensureProfile
} from '../controllers/profiles.controller.js';

const router = Router();

// Authenticated routes
router.get('/me', requireAuth, getMyProfile);
router.patch('/me', requireAuth, updateMyProfile);
router.post('/', requireAuth, ensureProfile);

// Public routes
router.get('/:username', getProfileByUsername);

export default router;
