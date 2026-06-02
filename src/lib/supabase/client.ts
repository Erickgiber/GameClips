import { createClient } from '@supabase/supabase-js';
import { env } from '$env/dynamic/public';
import { capacitorAuthStorage } from '$lib/supabase/capacitor-storage';
import type { Database } from '$lib/types/supabase';

const supabaseUrl = env.PUBLIC_SUPABASE_URL;
const supabaseAnonKey = env.PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
	console.warn('Supabase env vars are missing. Check PUBLIC_SUPABASE_URL and PUBLIC_SUPABASE_ANON_KEY.');
}

export const supabase = createClient<Database>(
	supabaseUrl || 'https://placeholder.supabase.co',
	supabaseAnonKey || 'placeholder-anon-key',
	{
		auth: {
			storage: capacitorAuthStorage,
			autoRefreshToken: true,
			persistSession: true,
			detectSessionInUrl: true,
			flowType: 'pkce'
		}
	}
);
