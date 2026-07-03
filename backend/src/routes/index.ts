import { Router } from 'express';
import healthRouter from './health.js';

const router = Router();

// Mount route modules
router.use(healthRouter);

export default router;
