import adapter from '@sveltejs/adapter-static';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: 'index.html'
		}),

		prerender: {
			entries: ['*'],
			handleUnseenRoutes: 'ignore'
		}
	}
};

export default config;
