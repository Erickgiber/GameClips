import { browser } from '$app/environment';

const getInitialTheme = (): boolean => {
	if (!browser) return false;

	const saved = localStorage.getItem('theme');
	if (saved) return saved === 'dark';

	return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

export const theme = $state({
	isDark: getInitialTheme()
});

if (browser) {
	// aplicar estado inicial al HTML una sola vez
	document.documentElement.classList.toggle('dark', theme.isDark);
	localStorage.setItem('theme', theme.isDark ? 'dark' : 'light');

	$effect.root(() => {
		$effect(() => {
			document.documentElement.classList.toggle('dark', theme.isDark);
			localStorage.setItem('theme', theme.isDark ? 'dark' : 'light');
		});
	});
}