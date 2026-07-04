import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import type { User } from '$lib/types/user.type';
import { m } from '$lib/paraglide/messages';
import { api } from './api.js';
import { mapSupabaseError } from '$lib/utils/supabaseMapCode';

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

export async function ensureProfileForUser(payload: { id: string; username: string }): Promise<void> {
	await api.post('/profiles', payload);
}

export async function getCurrentProfile(): Promise<User | null> {
	try {
		const profile = await api.get('/profiles/me');
		return profile;
	} catch (error) {
		console.error('[getCurrentProfile] failed:', error);
		return null;
	}
}

export async function getProfileByUsername(username: string): Promise<User | null> {
	try {
		const profile = await api.get(`/profiles/${username}`);
		return profile;
	} catch (error) {
		console.error(`[getProfileByUsername] failed for ${username}:`, error);
		return null;
	}
}

export async function buildAppUserFromAuth(_authUser: SupabaseAuthUser): Promise<User> {
	// The auth token is retrieved from getSession() in the api request.
	// Since we are authenticated, we just fetch /profiles/me.
	const profile = await api.get('/profiles/me');
	return profile;
}

export type UpdateProfileResult = {
	success: boolean;
	message?: string;
};

export async function updateProfile(
	_userId: string, // Kept for signature compatibility
	updates: Partial<Omit<ProfileRow, 'id'>>
): Promise<UpdateProfileResult> {
	try {
		await api.patch('/profiles/me', updates);
		return {
			success: true,
			message: m.profile_update_success()
		};
	} catch (err: any) {
		console.error('[updateProfile] failed:', err);
		return {
			success: false,
			message: mapSupabaseError(err.message)
		};
	}
}
