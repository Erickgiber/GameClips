import { supabase } from '$lib/supabase/client';
import { ensureProfileForUser } from '$lib/services/profile.service';

export type AuthCredentials = {
	email: string;
	password: string;
};

export type RegisterPayload = AuthCredentials & {
	username: string;
};

function usernameFromEmail(email: string): string {
	return email.split('@')[0] || 'player';
}

export async function signInWithEmail(credentials: AuthCredentials) {
	const { email, password } = credentials;
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) throw new Error(error.message);
	return data;
}

export async function registerWithEmail(payload: RegisterPayload) {
	const username = payload.username?.trim() || usernameFromEmail(payload.email);
	const { data, error } = await supabase.auth.signUp({
		email: payload.email,
		password: payload.password,
		options: {
			data: {
				username
			}
		}
	});

	if (error) throw new Error(error.message);

	if (data.user) {
		await ensureProfileForUser({
			id: data.user.id,
			username,
			avatar_url: null
		});
	}

	return data;
}

export async function signOut() {
	const { error } = await supabase.auth.signOut();
	if (error) throw new Error(error.message);
}
