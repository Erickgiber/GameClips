import { createClient } from '@supabase/supabase-js';

/**
 * Creates a user-specific Supabase client using the user's JWT access token.
 * This client respects Row Level Security (RLS) policies and operates
 * in the context of the authenticated user.
 */
export function getSupabaseUserClient(accessToken: string) {
	const supabaseUrl = process.env.SUPABASE_URL;
	const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

	if (!supabaseUrl || !supabaseAnonKey) {
		throw new Error('Missing SUPABASE_URL or SUPABASE_ANON_KEY in backend .env');
	}

	return createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			persistSession: false,
			autoRefreshToken: false
		},
		global: {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		}
	});
}
