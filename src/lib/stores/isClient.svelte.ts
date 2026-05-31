import { browser } from '$app/environment';

export const client = $state({
	current: browser,
	showLoader: true
});

if (browser) {
	setTimeout(() => {
		client.showLoader = false;
	}, 100); 
}
