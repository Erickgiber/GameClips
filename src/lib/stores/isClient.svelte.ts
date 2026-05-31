import { browser } from '$app/environment';

export const client = $state({
	current: browser,
	showLoader: true // Controlará la visibilidad real en el DOM
});

// Cuando el archivo se ejecute en el navegador, dejamos que se inicialice
// y luego apagamos el loader en el siguiente tick del event loop
if (browser) {
	setTimeout(() => {
		client.showLoader = false;
	}, 100); // 100ms son suficientes para que Svelte registre el componente y su transición 'out:'
}
