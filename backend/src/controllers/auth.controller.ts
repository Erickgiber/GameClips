import type { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';
import { getSupabaseUserClient } from '../lib/supabase-user.js';

/**
 * POST /api/auth/login
 */
export async function login(req: Request, res: Response): Promise<void> {
	const { email, password } = req.body;

	if (!email || !password) {
		res.status(400).json({ error: 'Email and password are required' });
		return;
	}

	try {
		const { data, error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {
			res.status(400).json({ error: error.message });
			return;
		}

		res.json(data);
	} catch (err: unknown) {
		res.status(500).json({ error: (err as Error).message || 'Login failed' });
	}
}

/**
 * POST /api/auth/register
 */
export async function register(req: Request, res: Response): Promise<void> {
	const { email, password, username } = req.body;

	if (!email || !password || !username) {
		res.status(400).json({ error: 'Email, password, and username are required' });
		return;
	}

	try {
		const { data, error } = await supabase.auth.signUp({
			email,
			password,
			options: {
				data: { username }
			}
		});

		if (error) {
			res.status(400).json({ error: error.message });
			return;
		}

		res.json(data);
	} catch (err: unknown) {
		res.status(500).json({ error: (err as Error).message || 'Registration failed' });
	}
}

/**
 * POST /api/auth/refresh
 */
export async function refresh(req: Request, res: Response): Promise<void> {
	const { refresh_token } = req.body;

	if (!refresh_token) {
		res.status(400).json({ error: 'Refresh token is required' });
		return;
	}

	try {
		const { data, error } = await supabase.auth.refreshSession({ refresh_token });

		if (error) {
			res.status(400).json({ error: error.message });
			return;
		}

		res.json(data);
	} catch (err: unknown) {
		res.status(500).json({ error: (err as Error).message || 'Token refresh failed' });
	}
}

/**
 * POST /api/auth/logout
 */
export async function logout(req: Request, res: Response): Promise<void> {
	const authHeader = req.headers.authorization;
	if (authHeader?.startsWith('Bearer ')) {
		const token = authHeader.slice(7);
		try {
			// Sign out the user globally using their token
			const userClient = getSupabaseUserClient(token);
			await userClient.auth.signOut();
		} catch {
			// Ignore sign out errors on server, client will discard token anyway
		}
	}
	res.json({ success: true });
}

/**
 * POST /api/auth/update-password
 */
export async function updatePassword(req: Request, res: Response): Promise<void> {
	const { password } = req.body;
	const token = req.headers.authorization!.slice(7);

	if (!password) {
		res.status(400).json({ error: 'Password is required' });
		return;
	}

	try {
		const userClient = getSupabaseUserClient(token);
		const { error } = await userClient.auth.updateUser({ password });

		if (error) {
			res.status(400).json({ error: error.message });
			return;
		}

		res.json({ success: true });
	} catch (err: unknown) {
		res.status(500).json({ error: (err as Error).message || 'Failed to update password' });
	}
}

/**
 * GET /api/auth/mfa/status
 */
export async function getMfaStatus(req: Request, res: Response): Promise<void> {
	const token = req.headers.authorization!.slice(7);

	try {
		const userClient = getSupabaseUserClient(token);
		const [aalResult, factorsResult] = await Promise.all([
			userClient.auth.mfa.getAuthenticatorAssuranceLevel(),
			userClient.auth.mfa.listFactors()
		]);

		if (aalResult.error) throw new Error(aalResult.error.message);
		if (factorsResult.error) throw new Error(factorsResult.error.message);

		const totpFactor = factorsResult.data.totp.find((f) => f.status === 'verified');

		res.json({
			aal: aalResult.data,
			isEnrolled: !!totpFactor,
			factorId: totpFactor?.id
		});
	} catch (err: unknown) {
		res.status(500).json({ error: (err as Error).message || 'Failed to get MFA status' });
	}
}

/**
 * POST /api/auth/mfa/enroll
 */
export async function enrollMfa(req: Request, res: Response): Promise<void> {
	const token = req.headers.authorization!.slice(7);

	try {
		const userClient = getSupabaseUserClient(token);
		const { data, error } = await userClient.auth.mfa.enroll({ factorType: 'totp' });

		if (error) {
			res.status(400).json({ error: error.message });
			return;
		}

		res.json(data);
	} catch (err: unknown) {
		res.status(500).json({ error: (err as Error).message || 'Failed to enroll MFA' });
	}
}

/**
 * POST /api/auth/mfa/verify
 */
export async function verifyMfa(req: Request, res: Response): Promise<void> {
	const token = req.headers.authorization!.slice(7);
	const { factorId, code } = req.body;

	if (!factorId || !code) {
		res.status(400).json({ error: 'factorId and code are required' });
		return;
	}

	try {
		const userClient = getSupabaseUserClient(token);
		const challenge = await userClient.auth.mfa.challenge({ factorId });

		if (challenge.error) {
			res.status(400).json({ error: challenge.error.message });
			return;
		}

		const verify = await userClient.auth.mfa.verify({
			factorId,
			challengeId: challenge.data.id,
			code
		});

		if (verify.error) {
			res.status(400).json({ error: verify.error.message });
			return;
		}

		res.json(verify.data);
	} catch (err: unknown) {
		res.status(500).json({ error: (err as Error).message || 'Failed to verify MFA' });
	}
}

/**
 * POST /api/auth/mfa/unenroll
 */
export async function unenrollMfa(req: Request, res: Response): Promise<void> {
	const token = req.headers.authorization!.slice(7);
	const { factorId } = req.body;

	if (!factorId) {
		res.status(400).json({ error: 'factorId is required' });
		return;
	}

	try {
		const userClient = getSupabaseUserClient(token);
		const { error } = await userClient.auth.mfa.unenroll({ factorId });

		if (error) {
			res.status(400).json({ error: error.message });
			return;
		}

		res.json({ success: true });
	} catch (err: unknown) {
		res.status(500).json({ error: (err as Error).message || 'Failed to unenroll MFA' });
	}
}

/**
 * GET /api/auth/identities
 */
export async function getLinkedIdentities(req: Request, res: Response): Promise<void> {
	const token = req.headers.authorization!.slice(7);

	try {
		const userClient = getSupabaseUserClient(token);
		const { data, error } = await userClient.auth.getUserIdentities();

		if (error) {
			res.status(400).json({ error: error.message });
			return;
		}

		const identities = Array.isArray(data) ? data : data?.identities || [];
		res.json(identities);
	} catch (err: unknown) {
		res.status(500).json({ error: (err as Error).message || 'Failed to fetch identities' });
	}
}

/**
 * POST /api/auth/identities/unlink
 */
export async function unlinkIdentity(req: Request, res: Response): Promise<void> {
	const token = req.headers.authorization!.slice(7);
	const { identity } = req.body;

	if (!identity) {
		res.status(400).json({ error: 'identity object is required' });
		return;
	}

	try {
		const userClient = getSupabaseUserClient(token);
		const { error } = await userClient.auth.unlinkIdentity(identity);

		if (error) {
			res.status(400).json({ error: error.message });
			return;
		}

		res.json({ success: true });
	} catch (err: unknown) {
		res.status(500).json({ error: (err as Error).message || 'Failed to unlink identity' });
	}
}

/**
 * GET /api/auth/passkeys
 */
export async function getPasskeys(req: Request, res: Response): Promise<void> {
	const token = req.headers.authorization!.slice(7);

	try {
		const userClient = getSupabaseUserClient(token);
		const { data, error } = await userClient.auth.passkey.list();

		if (error) {
			res.status(400).json({ error: error.message });
			return;
		}

		res.json(data || []);
	} catch (err: unknown) {
		res.status(500).json({ error: (err as Error).message || 'Failed to list passkeys' });
	}
}

/**
 * POST /api/auth/passkeys/delete
 */
export async function deletePasskey(req: Request, res: Response): Promise<void> {
	const token = req.headers.authorization!.slice(7);
	const { passkeyId } = req.body;

	if (!passkeyId) {
		res.status(400).json({ error: 'passkeyId is required' });
		return;
	}

	try {
		const userClient = getSupabaseUserClient(token);
		const { error } = await userClient.auth.passkey.delete({ passkeyId });

		if (error) {
			res.status(400).json({ error: error.message });
			return;
		}

		res.json({ success: true });
	} catch (err: unknown) {
		res.status(500).json({ error: (err as Error).message || 'Failed to delete passkey' });
	}
}
