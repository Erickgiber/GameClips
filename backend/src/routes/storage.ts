import { Router, raw } from 'express';
import type { RequestHandler } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { uploadFile } from '../controllers/storage.controller.js';

const router = Router();

// Route for file uploads, accepts raw binary body up to 100mb
router.post(
	'/upload/:bucket',
	requireAuth,
	raw({ type: '*/*', limit: '100mb' }),
	uploadFile as unknown as RequestHandler
);

export default router;
