<script lang="ts">
	import { page } from '$app/state';
	import { buildSeoMetadata } from '$lib/helpers/seo';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import { useAuthGuard } from '$lib/stores/authGuard.svelte';
	import AuthGuard from '$lib/components/auth/AuthGuard.svelte';
	import NavMobile from '$lib/components/NavMobile.svelte';

	let { children } = $props();

	const seo = $derived(
		buildSeoMetadata({
			pathname: page.url.pathname,
			routeId: page.route.id,
			params: page.params,
			origin: page.url.origin || 'http://localhost:5173'
		})
	);

	useAuthGuard();
</script>

<svelte:head>
	<title>{seo.title}</title>
	<link rel="icon" href={favicon} />
	<link rel="canonical" href={seo.canonical} />
	<meta name="application-name" content="GameClips" />
	<meta name="description" content={seo.description} />
	<meta name="keywords" content={seo.keywords.join(', ')} />
	<meta name="robots" content={seo.robots} />
	<meta property="og:site_name" content="GameClips" />
	<meta property="og:type" content={seo.ogType} />
	<meta property="og:title" content={seo.title} />
	<meta property="og:description" content={seo.description} />
	<meta property="og:url" content={seo.canonical} />
	<meta name="twitter:card" content={seo.twitterCard} />
	<meta name="twitter:title" content={seo.title} />
	<meta name="twitter:description" content={seo.description} />
	{#if seo.profileUsername}
		<meta property="profile:username" content={seo.profileUsername} />
	{/if}
</svelte:head>

<AuthGuard onlyDesktop>
	<Header />
</AuthGuard>

{@render children()}

<AuthGuard onlyMobile>
	<NavMobile />
</AuthGuard>
