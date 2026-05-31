<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';
	import { user } from '$lib/stores/user.svelte';
	import {
		Heart,
		MessageCircle,
		Share2,
		Bookmark,
		Search,
		Home,
		Compass,
		Bell,
		User,
		SquarePlus
	} from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	const mockVideos = [
		{
			id: 1,
			title: 'Insane 1v5 Clutch - Valorant Radiant Gameplay',
			creator: 'ProGamer_TTV',
			avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
			thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=900&fit=crop',
			likes: 245000,
			comments: 3420,
			shares: 892,
			game: 'Valorant',
			tags: ['#clutch', '#valorant', '#fps']
		},
		{
			id: 2,
			title: 'Perfect Pentakill in Ranked - League of Legends',
			creator: 'MidLaneKing',
			avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&h=100&fit=crop',
			thumbnail:
				'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400&h=900&fit=crop',
			likes: 189000,
			comments: 2105,
			shares: 654,
			game: 'League of Legends',
			tags: ['#pentakill', '#lol', '#moba']
		},
		{
			id: 3,
			title: 'Last Squad Standing - Apex Legends',
			creator: 'ApexPredator',
			avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
			thumbnail:
				'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=400&h=900&fit=crop',
			likes: 312000,
			comments: 4890,
			shares: 1203,
			game: 'Apex Legends',
			tags: ['#battleroyale', '#apex']
		}
	];

	let currentVideoIndex = $state(0);
	let isLiked = $state(false);
	let isSaved = $state(false);
	let touchStart = $state(0);
	let touchEnd = $state(0);

	let currentVideo = $derived(mockVideos[currentVideoIndex]);

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

		if (isSwipeUp && currentVideoIndex < mockVideos.length - 1) {
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

<div class="relative mx-auto h-dvh w-full">
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
						class="mb-3 text-white inline-block rounded-full bg-primary/90 px-3 py-1 text-xs font-bold backdrop-blur-md"
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

	<div class="absolute right-0 bottom-0 left-0 z-50 border-t border-[#1e293b] bg-card-foreground/10 backdrop-blur-md">
		<div class="flex items-center justify-around py-2">
			<button
				class="flex flex-col items-center gap-1 px-4 py-2 transition-transform active:scale-90"
			>
				<Home class="h-6 w-6 text-white" />
				<span class="text-xs font-medium text-white">{m.nav_home()}</span>
			</button>
			<button
				class="flex flex-col items-center gap-1 px-4 py-2 transition-transform active:scale-90"
			>
				<Compass class="h-6 w-6" color="white" />
				<span class="text-xs font-medium text-white">{m.nav_discover()}</span>
			</button>
			<button class="-mt-3 flex flex-col items-center gap-1 transition-transform active:scale-90">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary shadow-lg shadow-primary/50"
				>
					<SquarePlus class="h-6 w-6 text-white" />
				</div>
			</button>
			<button
				class="relative flex flex-col items-center gap-1 px-4 py-2 transition-transform active:scale-90"
			>
				<Bell class="h-6 w-6 text-muted-foreground" />
				<span class="text-xs font-medium text-muted-foreground">{m.nav_inbox()}</span>
				<div class="absolute top-1.5 right-3 h-2 w-2 rounded-full bg-destructive"></div>
			</button>
			<a href={resolve(`/${user.username}`)}
				class="flex flex-col items-center gap-1 px-4 py-2 transition-transform active:scale-90"
			>
				<User class="h-6 w-6 text-muted-foreground" />
				<span class="text-xs font-medium text-muted-foreground">{m.nav_profile()}</span>
			</a>
		</div>
	</div>

	<div class="pointer-events-none absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
		<div class="animate-pulse text-center font-mono text-xs text-white/30">
			{m.swipe_indicator()}
		</div>
	</div>
</div>
