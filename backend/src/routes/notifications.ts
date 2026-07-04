import { Router } from 'express';
import type { RequestHandler } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getNotifications } from '../controllers/notifications.controller.js';

const router = Router();

// Authenticated route for notifications
router.get('/', requireAuth, getNotifications as unknown as RequestHandler);

export default router;
