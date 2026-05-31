<script lang="ts">
	import HomeDesktop from '$lib/components/views/home/HomeDesktop.svelte';
	import HomeMobile from '$lib/components/views/home/HomeMobile.svelte';
	import { client } from '$lib/stores/isClient.svelte';
	import { screen } from '$lib/stores/isMobile.svelte';
</script>

{#if client.current}
	{#if screen.isMobile}
		<HomeMobile />
	{:else}
		<HomeDesktop />
	{/if}
{/if}
