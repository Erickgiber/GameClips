<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { user } from '$lib/stores/user.svelte';
	import { ArrowLeft, EllipsisVertical } from 'lucide-svelte';

	// eslint-disable-next-line
	// @ts-ignore
	let { customGoBack = resolve(customGoBack || '/'), customTitle = user.username } = $props();
</script>

<div class="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg lg:hidden">
	<div class="flex items-center justify-between px-4 py-3">
		<a href={customGoBack} class="-ml-2 rounded-lg p-2 transition-colors hover:bg-muted">
			<ArrowLeft class="h-6 w-6" />
		</a>
		<h2 class="text-lg font-black">{customTitle}</h2>
		{#if page.url.pathname !== '/settings'}
			<a href={resolve('/settings')} class="-mr-2 rounded-lg p-2 transition-colors hover:bg-muted">
				<EllipsisVertical class="h-6 w-6" />
			</a>
		{:else}
			<div class="h-6 w-6"></div>
		{/if}
	</div>
</div>
