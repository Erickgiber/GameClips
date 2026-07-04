import { m } from '$lib/paraglide/messages';

export function mapSupabaseError(code: string): string {
	switch (code) {
		case '23505':
		case 'unique_violation':
		case 'Username already taken':
			return m.error_unique_violation();
		case '42501':
		case 'unauthorized':
		case 'Forbidden':
			return m.error_unauthorized();
		case 'Invalid login credentials':
		case 'invalid_credentials':
			return m.error_invalid_credentials();
		case '23503':
		case 'fk_violation':
			return m.error_fk_violation();
		case '23502':
		case 'missing_field':
		case 'Email and password are required':
		case 'Email, password, and username are required':
		case 'Password is required':
		case 'factorId and code are required':
		case 'factorId is required':
		case 'identity object is required':
		case 'passkeyId is required':
			return m.error_missing_field();
		case 'PGRST116':
		case 'profile_not_found':
			return m.error_profile_not_found();
		case 'generic':
			return m.error_generic();
		case 'database':
			return m.error_database();
		default:
			// If it's a generic message, return it directly or fallback to generic error
			if (code?.includes('Invalid login credentials')) {
				return m.error_invalid_credentials();
			}
			return code || m.error_generic();
	}
}
