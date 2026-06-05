import type { User as SupabaseAuthUser } from '@supabase/supabase-js';
import { supabase } from '$lib/supabase/client';
import type { User } from '$lib/types/user.type';

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

function defaultUsernameFromEmail(email: string | null | undefined): string {
	if (!email) return 'player';
	return email.split('@')[0] || 'player';
}

function mapProfileToUser(profile: ProfileRow, authenticated: boolean): User {
	return {
		id: profile.id,
		authenticated,
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

function toAppUser(profile: ProfileRow | null, authUser: SupabaseAuthUser): User {
	const usernameFallback = defaultUsernameFromEmail(authUser.email);

	if (!profile) {
		return {
			id: authUser.id,
			authenticated: true,
			username: usernameFallback,
			email: authUser.email ?? '',
			name: usernameFallback,
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
		};
	}

	return mapProfileToUser(profile, true);
}

function toPublicAppUser(profile: ProfileRow): User {
	return mapProfileToUser(profile, false);
}

export async function ensureProfileForUser(payload: {
	id: string;
	username: string;
}) {
	const { error } = await supabase.from('profiles').upsert(payload, { onConflict: 'id' });
	if (error) throw new Error(error.message);
}

export async function getCurrentProfile() {
	const {
		data: { user },
		error: authError
	} = await supabase.auth.getUser();

	if (authError) throw new Error(authError.message);
	if (!user) return null;

	const { data, error } = await supabase
		.from('profiles')
		.select(
			'id, username, email, name, description, title, role, role_id, dedication, avatar_url, followers_count, following_count, videos_count, likes_count, saved_videos_count, liked_videos_count, sponsored_by'
		)
		.eq('id', user.id)
		.maybeSingle();

	if (error) throw new Error(error.message);

	return toAppUser(data as ProfileRow | null, user);
}

export async function getProfileByUsername(username: string): Promise<User | null> {
	const { data, error } = await supabase
		.from('profiles')
		.select(
			'id, username, email, name, description, title, role, role_id, dedication, avatar_url, followers_count, following_count, videos_count, likes_count, saved_videos_count, liked_videos_count, sponsored_by'
		)
		.eq('username', username)
		.maybeSingle();

	if (error) throw new Error(error.message);
	if (!data) return null;

	return toPublicAppUser(data as ProfileRow);
}

export async function buildAppUserFromAuth(authUser: SupabaseAuthUser): Promise<User> {
	const { data, error } = await supabase
		.from('profiles')
		.select(
			'id, username, email, name, description, title, role, role_id, dedication, avatar_url, followers_count, following_count, videos_count, likes_count, saved_videos_count, liked_videos_count, sponsored_by'
		)
		.eq('id', authUser.id)
		.maybeSingle();

	if (error) throw new Error(error.message);
	return toAppUser(data as ProfileRow | null, authUser);
}
