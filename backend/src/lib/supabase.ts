import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
	throw new Error(
		'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in backend .env'
	);
}

/**
 * Server-side Supabase client using the Service Role Key.
 * This client bypasses Row Level Security (RLS) — use with caution.
 * Always validate the authenticated user before performing operations.
 */
export const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
	auth: {
		autoRefreshToken: false,
		persistSession: false
	}
});
