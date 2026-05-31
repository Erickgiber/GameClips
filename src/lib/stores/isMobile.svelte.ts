import { browser } from '$app/environment';
import { theme } from './theme.svelte';

export const screen = $state({
	isMobile: false
});

// Función centralizada para manejar el cambio de tema según el dispositivo
function handleThemeSync(isMobileDevice: boolean) {
	if (isMobileDevice) {
		// Guardamos el tema actual de escritorio antes de forzar el modo oscuro en móvil
		localStorage.setItem('latest-theme', theme.isDark ? 'dark' : 'light');
		theme.isDark = true;
	} else {
		// Al volver a escritorio, restauramos la preferencia guardada
		const savedDesktopTheme = localStorage.getItem('latest-theme');
		theme.isDark = savedDesktopTheme === 'dark';
	}
}

if (browser) {
	const mediaQuery = window.matchMedia('(max-width: 768px)');

	// 1. Inicializamos el valor de la Rune
	screen.isMobile = mediaQuery.matches;

	// 2. EJECUCIÓN INICIAL: Ajustamos el tema inmediatamente al cargar la ruta
	handleThemeSync(screen.isMobile);

	// 3. ESCUCHA DE CAMBIOS: Reacciona si el usuario cambia el tamaño de la ventana
	mediaQuery.addEventListener('change', (event) => {
		screen.isMobile = event.matches;
		handleThemeSync(screen.isMobile);
	});
}
