<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import { useAuthGuard } from '$lib/stores/authGuard.svelte';
	import AuthGuard from '$lib/components/auth/AuthGuard.svelte';

	let { children } = $props();

	useAuthGuard();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<AuthGuard onlyDesktop>
	<Header />
</AuthGuard>

{@render children()}
