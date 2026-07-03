import { m } from '$lib/paraglide/messages';

export function mapSupabaseError(code: string): string {
	switch (code) {
		case '23505':
			// Unique violation (ej: el nombre de usuario ya está en uso)
			return m.error_unique_violation();
		case '42501':
			// Row Level Security (RLS) policy violation
			return m.error_unauthorized();
		case '23503':
			// Foreign key violation
			return m.error_fk_violation();
		case '23502':
			// Not null violation (falta un campo obligatorio)
			return m.error_missing_field();
		case 'PGRST116':
			// No rows returned
			return m.error_profile_not_found();
		default:
			// Error genérico de base de datos
			return m.error_database();
	}
}
