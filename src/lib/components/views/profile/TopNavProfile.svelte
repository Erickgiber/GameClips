<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { user } from '$lib/stores/user.svelte';
	import { ArrowLeft, Settings } from 'lucide-svelte';

	let { customGoBack = '/', customTitle = user.username, showShare = false, onShare = () => {} } = $props();

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
		<div class="flex items-center gap-1 -mr-2">
			{#if showShare}
				<button title="share" onclick={onShare} class="rounded-lg p-2 transition-colors hover:bg-muted text-foreground">
					<svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
				</button>
			{/if}
			{#if !page.url.pathname.includes('/settings')}
				<a href={resolve('/settings')} class="rounded-lg p-2 transition-colors hover:bg-muted">
					<Settings class="h-6 w-6" />
				</a>
			{:else}
				<div class="h-6 w-6"></div>
			{/if}
		</div>
	</div>
</div>
