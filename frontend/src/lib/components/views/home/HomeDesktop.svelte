<script lang="ts">
	import CategoryNav from '$lib/components/CategoryNav.svelte';
	import TrendingPanel from '$lib/components/TrendingPanel.svelte';
	import VideoGallery from '$lib/components/ui/card/VideoGallery.svelte';
	import { onMount } from 'svelte';
	import { loadVideos, videosState } from '$lib/stores/videos.svelte';

	onMount(() => {
		if (videosState.items.length === 0) {
			void loadVideos();
		}
	});
</script>

<CategoryNav />

<section id="home" class="flex h-full w-full justify-between gap-6">
	<div class="w-full p-4">
		<VideoGallery videos={videosState.items} />
	</div>

	<TrendingPanel videos={videosState.items} />
</section>

<style>
	#home {
		min-height: calc(100dvh - var(--spacing-nav-desktop) - var(--spacing-nav-category));
	}
</style>
