<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { user } from '$lib/stores/user.svelte';

	let { children } = $props();

	$effect(() => {
		if (user.authenticated) {
			goto(resolve('/'));
		}
	});
</script>

{#if !user.authenticated}
	{@render children()}
{/if}
