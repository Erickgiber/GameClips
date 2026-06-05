<script lang="ts">
	import { theme } from '$lib/stores/theme.svelte';
	import { onMount } from 'svelte';

	let mounted = $state(false);

	const toggleTheme = () => {
		theme.isDark = !theme.isDark;
	};

	onMount(() => {
		mounted = true;
	});
</script>

<button
	class="group relative flex h-8 w-14 items-center rounded-full bg-gray-200 p-1 shadow-lg transition-colors duration-300 focus:outline-none md:cursor-pointer dark:bg-gray-700"
	aria-label="Toggle theme"
	onclick={toggleTheme}
	disabled={!mounted}
>
	<span
		class="absolute top-1 left-1 h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 dark:bg-gray-900"
		style="transform: translateX({theme.isDark ? '24px' : '0px'});"
	>
		<span class="absolute inset-0 flex items-center justify-center transition-opacity duration-300">
			{#if theme.isDark}
				<!-- Moon Icon -->
				<svg
					class="h-4 w-4 text-yellow-400"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z"
					/>
				</svg>
			{:else}
				<!-- Sun Icon -->
				<svg
					class="h-4 w-4 text-yellow-500"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					viewBox="0 0 24 24"
				>
					<circle cx="12" cy="12" r="5" />
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M12 1v2m0 18v2m11-11h-2M3 12H1m16.95 6.95l-1.41-1.41M6.34 6.34L4.93 4.93m12.02 0l-1.41 1.41M6.34 17.66l-1.41 1.41"
					/>
				</svg>
			{/if}
		</span>
	</span>
	<span class="flex-1"></span>
</button>

<style>
	button[disabled] {
		opacity: 0.5;
		pointer-events: none;
	}
</style>
