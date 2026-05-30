<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';
	import CategoryNav from '$lib/components/CategoryNav.svelte';

	let { children } = $props();
	let activeCategory = $state('for_you');
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Header />

<CategoryNav {activeCategory} onCategoryChange={(category) => (activeCategory = category)} />

{@render children()}
