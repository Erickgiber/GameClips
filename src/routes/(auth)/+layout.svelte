<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authStatus, user } from '$lib/stores/user.svelte';

	let { children } = $props();

	$effect(() => {
		if (!authStatus.initialized) return;

		if (user.authenticated) {
			goto(resolve('/'));
		}
	});
</script>

{#if authStatus.initialized && !user.authenticated}
	{@render children()}
{/if}
