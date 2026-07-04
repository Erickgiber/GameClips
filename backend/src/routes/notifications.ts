import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getNotifications } from '../controllers/notifications.controller.js';

const router = Router();

// Authenticated route for notifications
router.get('/', requireAuth, getNotifications as any);

export default router;
