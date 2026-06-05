<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import type { Video } from '$lib/types/video.type';
	import { TrendingUp, Play } from 'lucide-svelte';

	type Clip = {
		id: string;
		title: string;
		creator: string;
		game: string;
		views: number;
		thumbnail: string;
	};

	let { videos = [] }: { videos?: Video[] } = $props();

	const trendingClips = $derived.by(() => {
		const ranked = [...videos]
			.sort((a, b) => {
				if (b.views !== a.views) return b.views - a.views;
				if (b.likes !== a.likes) return b.likes - a.likes;
				return Date.parse(b.created_at) - Date.parse(a.created_at);
			})
			.slice(0, 4);

		return ranked.map(
			(video) =>
				({
					id: video.id,
					title: video.title,
					creator: video.creator,
					game: video.game,
					views: video.views,
					thumbnail: video.thumbnail
				}) satisfies Clip
		);
	});

	function formatViews(num: number) {
		if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
		if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
		return String(num);
	}
</script>

<div
	id="trending-panel"
	class="scrollbar-hide hidden w-80 overflow-y-auto border-l border-border bg-card/30 p-4 backdrop-blur-sm xl:block"
>
	<!-- Header -->
	<div class="mb-4 flex items-center gap-2">
		<TrendingUp class="h-5 w-5 text-primary" />
		<h2 class="text-lg font-black">
			{m.account('trending_title')}
		</h2>
	</div>

	<!-- Clips -->
	<div class="space-y-3">
		{#each trendingClips as clip, index (clip.id)}
			<div class="group cursor-pointer overflow-hidden rounded-lg transition-all hover:bg-muted/50">
				<div class="relative">
					<img
						src={clip.thumbnail}
						alt={clip.title}
						class="h-40 w-full object-cover"
						loading="lazy"
					/>

					<div
						class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
					>
						<div
							class="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"
						>
							<Play class="ml-0.5 h-6 w-6 text-white" />
						</div>
					</div>

					<div
						class="absolute top-2 left-2 rounded bg-black/60 px-2 py-0.5 font-mono text-xs text-white backdrop-blur-sm"
					>
						#{index + 1}
					</div>

					<div
						class="absolute right-2 bottom-2 rounded bg-black/60 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm"
					>
						{clip.game}
					</div>
				</div>

				<div class="p-2">
					<p class="mb-1 line-clamp-2 text-sm font-bold">
						{clip.title}
					</p>

					<div class="flex items-center justify-between text-xs text-muted-foreground">
						<span>{clip.creator}</span>
						<span class="font-mono">
							{formatViews(clip.views)}
							{m.account('trending_views')}
						</span>
					</div>
				</div>
			</div>
		{/each}

		{#if trendingClips.length === 0}
			<div class="rounded-lg border border-border bg-card/60 p-3 text-xs text-muted-foreground">
				No trending clips yet.
			</div>
		{/if}
	</div>

	<!-- CTA -->
	<div
		class="mt-6 rounded-lg border border-primary/20 bg-linear-to-br from-primary/20 to-secondary/20 p-4"
	>
		<h3 class="mb-2 text-sm font-black">
			{m.account('trending_cta_title')}
		</h3>

		<p class="mb-3 text-xs text-muted-foreground">
			{m.account('trending_cta_description')}
		</p>

		<button
			class="w-full rounded-lg bg-primary py-2 font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90"
		>
			{m.account('trending_cta_button')}
		</button>
	</div>
</div>

<style>
	#trending-panel {
		height: calc(100dvh - var(--spacing-nav-desktop) - var(--spacing-nav-category));
		max-height: calc(100dvh - var(--spacing-nav-desktop) - var(--spacing-nav-category));
	}
</style>
