import { browser } from '$app/environment';

export const screen = $state({
	isMobile: false
});

if (browser) {
	const mediaQuery = window.matchMedia('(max-width: 768px)');

	// estado inicial
	screen.isMobile = mediaQuery.matches;

	// escucha de cambios de tamaño
	mediaQuery.addEventListener('change', (event) => {
		screen.isMobile = event.matches;
	});
}