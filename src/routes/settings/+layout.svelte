<script lang="ts">
	import { user } from '$lib/stores/user.svelte';
	import TopNavProfile from '$lib/components/views/profile/TopNavProfile.svelte';
	import { m } from '$lib/paraglide/messages';
	import { page } from '$app/state';
	import AuthGuard from '$lib/components/auth/AuthGuard.svelte';
	import { fly } from 'svelte/transition';

	let { children } = $props();

	let customBack = $derived.by(() => {
		const pathname = page.url.pathname;

		// si está dentro de settings (incluye subrutas)
		if (pathname.startsWith('/settings') && pathname !== '/settings') {
			return '/settings';
		}

		return `/${user.username}`;
	});

	let customTitle = $derived.by(() => {
		const pathname = page.url.pathname;

		if (pathname === '/settings/profile') {
			return m.settings_profile_title?.() ?? 'Settings / Profile';
		}
		if (pathname === '/settings/security') {
			return m.settings_security_title?.() ?? 'Settings / Security';
		}
		if (pathname === '/settings/language') {
			return m.settings_language_title?.() ?? 'Settings / Language';
		}

		return m.settings_title?.() ?? 'Settings';
	});
</script>

<TopNavProfile customGoBack={customBack} customTitle={customTitle} />

<AuthGuard>
	<div
		class="grid h-[calc(100dvh - var(--spacing-nav-category))] bg-background px-4 py-6 text-foreground overflow-hidden"
	>
		{#key page.url.pathname}
			<div 
				in:fly|global={{ y: 16, duration: 300, delay: 150 }} 
				out:fly|global={{ y: -16, duration: 150 }}
				class="col-start-1 row-start-1 h-full w-full"
			>
				{@render children()}
			</div>
		{/key}
	</div>
</AuthGuard>
