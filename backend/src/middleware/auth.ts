import type { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase.js';

export type AuthenticatedRequest = Request & {
	user: {
		id: string;
		email?: string;
	};
};

/**
 * Middleware that validates the JWT access token from the Authorization header.
 * On success, attaches `req.user` with the authenticated user's id and email.
 * On failure, responds with 401 Unauthorized.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction): Promise<void> {
	const authHeader = req.headers.authorization;

	if (!authHeader?.startsWith('Bearer ')) {
		res.status(401).json({ error: 'Missing or invalid Authorization header' });
		return;
	}

	const token = authHeader.slice(7);

	try {
		const { data, error } = await supabase.auth.getUser(token);

		if (error || !data.user) {
			res.status(401).json({ error: 'Invalid or expired token' });
			return;
		}

		(req as AuthenticatedRequest).user = {
			id: data.user.id,
			email: data.user.email
		};

		next();
	} catch {
		res.status(401).json({ error: 'Token validation failed' });
	}
}

/**
 * Optional auth middleware — attaches user if token is present but doesn't
 * reject requests without a token. Useful for endpoints that behave differently
 * for authenticated vs anonymous users.
 */
export async function optionalAuth(
	req: Request,
	_res: Response,
	next: NextFunction
): Promise<void> {
	const authHeader = req.headers.authorization;

	if (authHeader?.startsWith('Bearer ')) {
		const token = authHeader.slice(7);
		try {
			const { data, error } = await supabase.auth.getUser(token);
			if (!error && data.user) {
				(req as AuthenticatedRequest).user = {
					id: data.user.id,
					email: data.user.email
				};
			}
		} catch {
			// Silently continue without auth
		}
	}

	next();
}
