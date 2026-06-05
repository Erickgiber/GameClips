import { page } from '$app/state';
import { goto } from '$app/navigation';
import { authStatus, user } from '$lib/stores/user.svelte';
import { resolve } from '$app/paths';

// Rutas a las que SOLO pueden acceder usuarios NO autenticados
const authRoutes = ['/login', '/register', '/verify-email', '/forgot-password'];

export function useAuthGuard() {
	$effect(() => {
		if (!authStatus.initialized) return;

		const currentPath = page.url.pathname;
		const isAuthenticated = user.authenticated;

		// Caso 1: Usuario autenticado intenta entrar a /login o /register -> Va al Home
		if (isAuthenticated && authRoutes.includes(currentPath)) {
			goto(resolve('/'), { replaceState: true });
		}
		// Caso 2: Usuario NO autenticado intenta entrar a cualquier ruta privada (que no sea login o register) -> Va al Login
		else if (!isAuthenticated && !authRoutes.includes(currentPath)) {
			goto(resolve('/login'), { replaceState: true });
		}
	});
}
