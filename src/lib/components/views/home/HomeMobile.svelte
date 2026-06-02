<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { Heart, MessageCircle, Share2, Bookmark, Search } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import { loadVideos, videosState } from '$lib/stores/videos.svelte';

	let currentVideoIndex = $state(0);
	let isLiked = $state(false);
	let isSaved = $state(false);
	let touchStart = $state(0);
	let touchEnd = $state(0);

	onMount(() => {
		if (videosState.items.length === 0) {
			void loadVideos();
		}

		if (typeof document === 'undefined') {
			return;
		}

		document.documentElement.classList.add('mobile-scroll-lock');
		document.body.classList.add('mobile-scroll-lock');

		return () => {
			document.documentElement.classList.remove('mobile-scroll-lock');
			document.body.classList.remove('mobile-scroll-lock');
		};
	});

	let currentVideo = $derived(videosState.items[currentVideoIndex]);

	function formatNumber(num: number): string {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
		return num.toString();
	}

	function handleTouchStart(e: TouchEvent) {
		touchStart = e.targetTouches[0].clientY;
	}

	function handleTouchMove(e: TouchEvent) {
		touchEnd = e.targetTouches[0].clientY;
	}

	function handleTouchEnd() {
		if (!touchStart || !touchEnd) return;

		const distance = touchStart - touchEnd;
		const isSwipeUp = distance > 50;
		const isSwipeDown = distance < -50;

		if (isSwipeUp && currentVideoIndex < videosState.items.length - 1) {
			currentVideoIndex += 1;
			isLiked = false;
			isSaved = false;
		}
		if (isSwipeDown && currentVideoIndex > 0) {
			currentVideoIndex -= 1;
			isLiked = false;
			isSaved = false;
		}

		touchStart = 0;
		touchEnd = 0;
	}
</script>

<div
	style="
		padding-top: env(safe-area-inset-top);
		padding-bottom: env(safe-area-inset-bottom);
		height: 100dvh;
		min-height: 100svh;
	"
	class="relative mx-auto w-full touch-none overflow-hidden overscroll-none"
>
	<div
		class="absolute top-0 right-0 left-0 z-50 flex items-center justify-between bg-linear-to-b from-black/60 to-transparent px-4 py-3"
	>
		<div class="flex items-center gap-2">
			<div
				class="flex h-7 w-7 items-center justify-center rounded-lg bg-linear-to-br from-primary to-secondary"
			>
				<div class="h-3 w-3 rounded-sm bg-accent"></div>
			</div>
			<span class="text-lg font-black tracking-tight text-white">GAMECLIP</span>
		</div>
		<Search class="h-6 w-6" color="white" />
	</div>

	{#if currentVideo}
		{#key currentVideo.id}
		<div
			tabindex="0"
			role="button"
			in:fade={{ duration: 300 }}
			out:fade={{ duration: 300 }}
			class="absolute inset-0"
			ontouchstart={handleTouchStart}
			ontouchmove={handleTouchMove}
			ontouchend={handleTouchEnd}
		>
			<img
				src={currentVideo.thumbnail}
				alt={currentVideo.title}
				class="h-full w-full object-cover"
			/>
			<div
				class="absolute inset-0 bg-linear-to-b from-transparent via-transparent to-black/80"
			></div>

			<div class="absolute right-3 bottom-32 z-30 flex flex-col gap-5">
				<button
					onclick={() => (isLiked = !isLiked)}
					class="flex flex-col items-center gap-1 transition-transform active:scale-90"
				>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md transition-all {isLiked
							? 'bg-destructive/90'
							: 'bg-black/20'}"
					>
						<Heart class="h-6 w-6 {isLiked ? 'fill-white' : ''}" color="white" />
					</div>
					<span class="font-mono text-xs font-medium text-white">
						{formatNumber(currentVideo.likes + (isLiked ? 1 : 0))}
					</span>
				</button>

				<button class="flex flex-col items-center gap-1 transition-transform active:scale-90">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full bg-black/20 backdrop-blur-md"
					>
						<MessageCircle class="h-6 w-6" color="white" />
					</div>
					<span class="font-mono text-xs font-medium text-white">
						{formatNumber(currentVideo.comments)}
					</span>
				</button>

				<button class="flex flex-col items-center gap-1 transition-transform active:scale-90">
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full bg-black/20 backdrop-blur-md"
					>
						<Share2 class="h-6 w-6" color="white" />
					</div>
					<span class="font-mono text-xs font-medium text-white">
						{formatNumber(currentVideo.shares)}
					</span>
				</button>

				<button
					onclick={() => (isSaved = !isSaved)}
					class="flex flex-col items-center gap-1 transition-transform active:scale-90"
				>
					<div
						class="flex h-12 w-12 items-center justify-center rounded-full backdrop-blur-md transition-all {isSaved
							? 'bg-accent/90'
							: 'bg-black/20'}"
					>
						<Bookmark class="h-6 w-6 {isSaved ? 'fill-white' : ''}" color="white" />
					</div>
				</button>
			</div>

			<div class="absolute right-0 bottom-20 left-0 z-20 px-4">
				<div class="mb-2">
					<span
						class="mb-3 inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md"
					>
						{currentVideo.game}
					</span>
				</div>

				<div class="mb-3 flex items-center gap-3">
					<img
						src={currentVideo.avatar}
						alt={currentVideo.creator}
						class="h-10 w-10 rounded-full border-2 border-white/20"
					/>
					<div>
						<p class="text-sm font-bold text-white">{currentVideo.creator}</p>
					</div>
					<button
						class="rounded-full bg-white px-4 py-1.5 text-xs font-bold text-black transition-transform active:scale-95"
					>
						{m.follow()}
					</button>
				</div>

				<p class="mb-2 line-clamp-2 text-sm font-bold text-white">
					{currentVideo?.title ?? ''}
				</p>

				<div class="flex flex-wrap gap-2">
					{#each currentVideo?.tags as tag, i (i)}
						<span class="text-xs font-medium text-accent">
							{tag}
						</span>
					{/each}
				</div>
			</div>
		</div>
		{/key}
	{:else}
		<div class="absolute inset-0 flex items-center justify-center text-sm text-white/70">
			Loading videos...
		</div>
	{/if}

	<div class="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
		<div class="animate-pulse text-center font-mono text-xs text-white/30">
			{m.swipe_indicator()}
		</div>
	</div>
</div>
