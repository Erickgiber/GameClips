import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
	getMyProfile,
	getProfileByUsername,
	updateMyProfile,
	ensureProfile
} from '../controllers/profiles.controller.js';

const router = Router();

// Authenticated profile actions
router.get('/', requireAuth, getMyProfile);
router.patch('/', requireAuth, updateMyProfile);
router.post('/', requireAuth, ensureProfile);

// Public profile retrieval by username
router.get('/:username', getProfileByUsername);

export default router;
