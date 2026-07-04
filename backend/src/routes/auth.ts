import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import {
	login,
	register,
	refresh,
	logout,
	updatePassword,
	getMfaStatus,
	enrollMfa,
	verifyMfa,
	unenrollMfa,
	getLinkedIdentities,
	unlinkIdentity,
	getPasskeys,
	deletePasskey
} from '../controllers/auth.controller.js';

const router = Router();

// Public auth routes
router.post('/login', login);
router.post('/register', register);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Protected auth routes
router.post('/update-password', requireAuth, updatePassword);
router.get('/mfa/status', requireAuth, getMfaStatus);
router.post('/mfa/enroll', requireAuth, enrollMfa);
router.post('/mfa/verify', requireAuth, verifyMfa);
router.post('/mfa/unenroll', requireAuth, unenrollMfa);
router.get('/identities', requireAuth, getLinkedIdentities);
router.post('/identities/unlink', requireAuth, unlinkIdentity);
router.get('/passkeys', requireAuth, getPasskeys);
router.post('/passkeys/delete', requireAuth, deletePasskey);

export default router;
