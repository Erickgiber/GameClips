<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { user } from '$lib/stores/user.svelte';
	import { ArrowLeft, Settings } from 'lucide-svelte';

	let { customGoBack = '/', customTitle = user.username } = $props();

	// eslint-disable-next-line
	//@ts-ignore
	const goBack = $derived(resolve(customGoBack));
	const title = $derived(customTitle ?? user.username ?? 'Profile');
</script>

<div class="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg lg:hidden">
	<div class="flex items-center justify-between px-4 py-3">
		<a href={goBack} class="-ml-2 rounded-lg p-2 transition-colors hover:bg-muted">
			<ArrowLeft class="h-6 w-6" />
		</a>
		<h2 class="text-lg font-black">{title}</h2>
		{#if page.url.pathname !== '/settings'}
			<a href={resolve('/settings')} class="-mr-2 rounded-lg p-2 transition-colors hover:bg-muted">
				<Settings class="h-6 w-6" />
			</a>
		{:else}
			<div class="h-6 w-6"></div>
		{/if}
	</div>
</div>
