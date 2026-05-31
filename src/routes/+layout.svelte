<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import CategoryNav from '$lib/components/CategoryNav.svelte';
	import { user } from '$lib/stores/user.svelte';
	import { useAuthGuard } from '$lib/stores/authGuard.svelte';

	let { children } = $props();

	useAuthGuard();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

{#if user.authenticated}
	<Header />
	<CategoryNav />
{/if}

{@render children()}
