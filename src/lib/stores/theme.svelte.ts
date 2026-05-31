import { browser } from '$app/environment';

const getInitialTheme = (): boolean => {
	if (!browser) return false;

	const savedTheme = localStorage.getItem('theme');
	if (savedTheme) return savedTheme === 'dark';

	return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const theme = $state({
	isDark: getInitialTheme()
});

if (browser) {
	$effect.root(() => {
		$effect(() => {
			const dark = theme.isDark;

			if (dark) {
				document.documentElement.classList.add('dark');
				localStorage.setItem('theme', 'dark');
			} else {
				document.documentElement.classList.remove('dark');
				localStorage.setItem('theme', 'light');
			}
		});
	});
}
