<script lang="ts">
	import AuthGuard from '$lib/components/auth/AuthGuard.svelte';
	import HomeDesktop from '$lib/components/views/home/HomeDesktop.svelte';
	import HomeMobile from '$lib/components/views/home/HomeMobile.svelte';
	import { screen } from '$lib/stores/isMobile.svelte';
</script>

<AuthGuard>
	{#if screen.isMobile}
		<HomeMobile />
	{:else}
		<HomeDesktop />
	{/if}
</AuthGuard>
