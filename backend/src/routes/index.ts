import { Router } from 'express';
import healthRouter from './health.js';
import profilesRouter from './profiles.js';
import videosRouter from './videos.js';
import profileVideosRouter from './profile-videos.js';
import notificationsRouter from './notifications.js';
import storageRouter from './storage.js';
import authRouter from './auth.js';

const router = Router();

// Mount route modules
router.use(healthRouter);
router.use('/profiles', profilesRouter);
router.use('/videos', videosRouter);
router.use('/users', profileVideosRouter);
router.use('/notifications', notificationsRouter);
router.use('/storage', storageRouter);
router.use('/auth', authRouter);

export default router;
