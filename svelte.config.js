import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html' // 👈 esto convierte todo en SPA
		}),

		prerender: {
			entries: ['*'], // importante para evitar errores de crawling
			handleUnseenRoutes: 'ignore'
		}
	}
};

export default config;