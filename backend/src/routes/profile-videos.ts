import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
	getVideosByProfile,
	getSavedVideosByProfile,
	getLikedVideosByProfile
} from '../controllers/profile-videos.controller.js';

const router = Router();

// User profile videos routes
router.get('/:userId/videos', getVideosByProfile);
router.get('/:userId/saved', requireAuth, getSavedVideosByProfile);
router.get('/:userId/liked', requireAuth, getLikedVideosByProfile);

export default router;
