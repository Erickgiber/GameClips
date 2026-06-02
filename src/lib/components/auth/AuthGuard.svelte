<script lang="ts">
	import { user } from '$lib/stores/user.svelte';
	import { authStatus } from '$lib/stores/user.svelte';
	import { client } from '$lib/stores/isClient.svelte';
	import { screen } from '$lib/stores/isMobile.svelte';

	let { children, onlyDesktop = false, onlyMobile = false } = $props();

	const canRender = $derived(
		authStatus.initialized &&
		user.authenticated &&
			client.current &&
			(!onlyDesktop || !screen.isMobile) &&
			(!onlyMobile || screen.isMobile)
	);
</script>

{#if canRender}
	{@render children()}
{/if}
