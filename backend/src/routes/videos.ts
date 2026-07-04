import { Router } from 'express';
import { getVideosFeed } from '../controllers/videos.controller.js';

const router = Router();

// Public route for video feed
router.get('/feed', getVideosFeed);

export default router;
