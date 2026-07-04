import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import type { Request } from 'express';
import { supabase } from '../lib/supabase.js';

const PROFILE_SELECT =
	'id, username, email, name, description, title, role, role_id, dedication, avatar_url, followers_count, following_count, videos_count, likes_count, saved_videos_count, liked_videos_count, sponsored_by';

type ProfileRow = {
	id: string;
	username: string;
	email: string;
	name: string | null;
	description: string | null;
	title: string | null;
	role: string | null;
	role_id: number;
	dedication: string | null;
	avatar_url: string | null;
	followers_count: number;
	following_count: number;
	videos_count: number;
	likes_count: number;
	saved_videos_count: number;
	liked_videos_count: number;
	sponsored_by: string[];
};

function mapProfile(profile: ProfileRow) {
	return {
		id: profile.id,
		username: profile.username,
		email: profile.email,
		name: profile.name ?? profile.username,
		description: profile.description,
		title: profile.title ?? 'Creator',
		role: profile.role ?? 'normal',
		dedication: profile.dedication,
		avatar_url: profile.avatar_url ?? '/user.png',
		followers_count: profile.followers_count ?? 0,
		following_count: profile.following_count ?? 0,
		videos_count: profile.videos_count ?? 0,
		likes_count: profile.likes_count ?? 0,
		saved_videos_count: profile.saved_videos_count ?? 0,
		liked_videos_count: profile.liked_videos_count ?? 0,
		sponsored_by: profile.sponsored_by ?? []
	};
}

/**
 * GET /api/profiles/me — Get the authenticated user's profile
 */
export async function getMyProfile(req: Request, res: Response): Promise<void> {
	const { user } = req as AuthenticatedRequest;

	const { data, error } = await supabase
		.from('profiles')
		.select(PROFILE_SELECT)
		.eq('id', user.id)
		.maybeSingle();

	if (error) {
		console.error('[getMyProfile] Supabase error:', error);
		res.status(500).json({ error: 'Failed to fetch profile' });
		return;
	}

	if (!data) {
		// Return a fallback profile for new users who don't have a profile row yet
		res.json({
			id: user.id,
			username: user.email?.split('@')[0] ?? 'player',
			email: user.email ?? '',
			name: user.email?.split('@')[0] ?? 'player',
			description: '',
			title: 'Creator',
			role: 'normal',
			dedication: '',
			avatar_url: '/user.png',
			followers_count: 0,
			following_count: 0,
			videos_count: 0,
			likes_count: 0,
			saved_videos_count: 0,
			liked_videos_count: 0,
			sponsored_by: []
		});
		return;
	}

	res.json(mapProfile(data as ProfileRow));
}

/**
 * GET /api/profiles/:username — Get a public profile by username
 */
export async function getProfileByUsername(req: Request, res: Response): Promise<void> {
	const { username } = req.params;

	if (!username) {
		res.status(400).json({ error: 'Username parameter is required' });
		return;
	}

	const { data, error } = await supabase
		.from('profiles')
		.select(PROFILE_SELECT)
		.eq('username', username)
		.maybeSingle();

	if (error) {
		console.error('[getProfileByUsername] Supabase error:', error);
		res.status(500).json({ error: 'Failed to fetch profile' });
		return;
	}

	if (!data) {
		res.status(404).json({ error: 'Profile not found' });
		return;
	}

	res.json(mapProfile(data as ProfileRow));
}

/**
 * PATCH /api/profiles/me — Update the authenticated user's profile
 */
export async function updateMyProfile(req: Request, res: Response): Promise<void> {
	const { user } = req as AuthenticatedRequest;
	const updates = req.body;

	if (!updates || Object.keys(updates).length === 0) {
		res.status(400).json({ error: 'No update data provided' });
		return;
	}

	// Whitelist allowed fields to prevent mass assignment
	const allowedFields = [
		'username', 'name', 'description', 'title', 'dedication',
		'avatar_url', 'sponsored_by'
	];

	const sanitized: Record<string, unknown> = {};
	for (const key of allowedFields) {
		if (key in updates) {
			sanitized[key] = updates[key];
		}
	}

	if (Object.keys(sanitized).length === 0) {
		res.status(400).json({ error: 'No valid fields to update' });
		return;
	}

	const { error } = await supabase
		.from('profiles')
		.update(sanitized)
		.eq('id', user.id);

	if (error) {
		console.error('[updateMyProfile] Supabase error:', error);

		if (error.code === '23505') {
			res.status(409).json({ error: 'Username already taken' });
			return;
		}

		res.status(500).json({ error: 'Failed to update profile' });
		return;
	}

	res.json({ success: true });
}

/**
 * POST /api/profiles — Ensure a profile exists (upsert)
 */
export async function ensureProfile(req: Request, res: Response): Promise<void> {
	const { user } = req as AuthenticatedRequest;
	const { username } = req.body;

	if (!username) {
		res.status(400).json({ error: 'Username is required' });
		return;
	}

	const { error } = await supabase
		.from('profiles')
		.upsert({ id: user.id, username }, { onConflict: 'id' });

	if (error) {
		console.error('[ensureProfile] Supabase error:', error);
		res.status(500).json({ error: 'Failed to create profile' });
		return;
	}

	res.status(201).json({ success: true });
}
