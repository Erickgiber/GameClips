<script lang="ts">
	import { user } from '$lib/stores/user.svelte';
	import TopNavProfile from '$lib/components/views/profile/TopNavProfile.svelte';
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';

	let { children } = $props();

	let customBack = $derived(() => {
		const pathname = page.url.pathname;

		// si está dentro de settings (incluye subrutas)
		if (pathname.startsWith('/settings') && pathname !== '/settings') {
			return '/settings';
		}

		return `/${user.username}`;
	});

	let customTitle = $derived(() => {
		const pathname = page.url.pathname;

		if (pathname === '/settings/profile') {
			return m.edit_profile();
		}

		return m.settings_title();
	});
</script>

<TopNavProfile customGoBack={customBack()} customTitle={customTitle()} />

<div class="h-[calc(100dvh - var(--spacing-nav-category))] bg-background px-4 py-6 text-foreground">
	{@render children()}
</div>
