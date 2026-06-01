<script>
	import CategoryNav from '$lib/components/CategoryNav.svelte';
	import TrendingPanel from '$lib/components/TrendingPanel.svelte';
	import VideoGallery from '$lib/components/ui/card/VideoGallery.svelte';
	import { mockVideos } from '$lib/mocks/videos';
</script>

<CategoryNav />

<section id="home" class="flex h-full w-full justify-between gap-6">
	<div class="w-full p-4">
		<VideoGallery {mockVideos} />
	</div>

	<TrendingPanel />
</section>

<style>
	#home {
		min-height: calc(100dvh - var(--spacing-header) - var(--spacing-category-nav));
	}
</style>
