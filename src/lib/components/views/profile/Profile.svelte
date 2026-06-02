<script lang="ts">
	import {
		ArrowLeft,
		Settings,
		Share2,
		EllipsisVertical,
		Grid3x3,
		Bookmark,
		Heart,
		Play,
		Eye,
		Users,
		Trophy,
		Calendar
	} from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';
	import {
		getLikedVideosByProfile,
		getSavedVideosByProfile,
		getVideosByProfile
	} from '$lib/services/profile-videos.service';
	import { user as currentUser } from '$lib/stores/user.svelte';
	import type { User } from '$lib/types/user.type';
	import type { Video as AppVideo } from '$lib/types/video.type';

	let { user }: { user: User } = $props();
	let profileVideos = $state<AppVideo[]>([]);
	let savedVideos = $state<AppVideo[]>([]);
	let likedVideos = $state<AppVideo[]>([]);
	let tabLoading = $state(false);
	let tabError = $state<string | null>(null);

	let activeTab = $state<'videos' | 'saved' | 'liked'>('videos');
	let isFollowing = $state(false);
	const isOwnProfile = $derived(Boolean(currentUser.id) && currentUser.id === user.id);

	let currentVideos = $derived(
		activeTab === 'videos' ? profileVideos : activeTab === 'saved' ? savedVideos : likedVideos
	);

	onMount(() => {
		void loadTabVideos();
	});

	function setActiveTab(tab: 'videos' | 'saved' | 'liked') {
		if (activeTab === tab) return;
		activeTab = tab;
		void loadTabVideos();
	}

	async function loadTabVideos() {
		if (!user.id) return;

		tabLoading = true;
		tabError = null;

		try {
			if (activeTab === 'videos') {
				profileVideos = await getVideosByProfile(user.id);
				return;
			}

			if (!isOwnProfile) {
				if (activeTab === 'saved') savedVideos = [];
				if (activeTab === 'liked') likedVideos = [];
				return;
			}

			if (activeTab === 'saved') {
				savedVideos = await getSavedVideosByProfile(user.id);
				return;
			}

			likedVideos = await getLikedVideosByProfile(user.id);
		} catch (error) {
			tabError = error instanceof Error ? error.message : 'Unable to load videos.';
		} finally {
			tabLoading = false;
		}
	}

	function formatNumber(num: number) {
		if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
		if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
		return num.toString();
	}
</script>

<div class="size-full overflow-y-auto bg-background text-foreground">
	<div class="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-lg lg:hidden">
		<div class="flex items-center justify-between px-4 py-3">
			<a href={resolve('/')} class="-ml-2 rounded-lg p-2 transition-colors hover:bg-muted">
				<ArrowLeft class="h-6 w-6" />
			</a>
			<h2 class="text-lg font-black">{user.username}</h2>
			<button class="-mr-2 rounded-lg p-2 transition-colors hover:bg-muted">
				<EllipsisVertical class="h-6 w-6" />
			</button>
		</div>
	</div>

	<div
		class="sticky top-0 z-50 hidden h-nav-category border-b border-border bg-card/30 backdrop-blur-sm lg:flex"
	>
		<div class="flex w-full items-center justify-between px-6">
			<a href={resolve('/')} class="flex items-center gap-2 transition-colors hover:text-primary">
				<ArrowLeft class="h-5 w-5" />
				<span class="font-semibold">{m.back_to_home()}</span>
			</a>
			<div class="flex items-center gap-3">
				<button class="rounded-lg p-2 transition-colors hover:bg-muted">
					<Share2 class="h-5 w-5" />
				</button>
				<button class="rounded-lg p-2 transition-colors hover:bg-muted">
					<Settings class="h-5 w-5" />
				</button>
			</div>
		</div>
	</div>

	<div class="mx-auto max-w-7xl px-4 pb-8 lg:px-6">
		<div class="pt-6 pb-8">
			<div class="flex flex-col gap-6 lg:flex-row lg:items-start">
				<div class="flex justify-center lg:justify-start">
					<div class="relative">
						<img
							src={user.avatar_url}
							alt={user.username}
							class="h-24 w-24 rounded-full border-4 border-primary/20 shadow-lg shadow-primary/20 lg:h-32 lg:w-32"
						/>
						<div
							class="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-linear-to-br from-primary to-secondary lg:-right-2 lg:-bottom-2 lg:h-10 lg:w-10"
						>
							<Trophy class="h-4 w-4 text-white lg:h-5 lg:w-5" />
						</div>
					</div>
				</div>

				<div class="flex-1 text-center lg:text-left">
					<div class="mb-3 flex flex-col lg:flex-row lg:items-center lg:justify-between">
						<div>
							<h1 class="mb-1 text-2xl font-black lg:text-3xl">{user.username}</h1>
							<p class="text-sm text-muted-foreground lg:text-base">
								{user.dedication}
							</p>
						</div>
						<div class="mt-4 flex items-center justify-center gap-3 lg:mt-0 lg:justify-start">
							<button
								onclick={() => (isFollowing = !isFollowing)}
								class="rounded-lg px-6 py-2 text-sm font-bold shadow-lg transition-all active:scale-95 {isFollowing
									? 'bg-muted text-foreground hover:bg-muted/80'
									: 'bg-primary text-white shadow-primary/30 hover:bg-primary/90'}"
							>
								{isFollowing ? m.following() : m.follow_btn()}
							</button>
							<button class="rounded-lg bg-muted p-2 transition-colors hover:bg-muted/80">
								<Share2 class="h-5 w-5" />
							</button>
							<button class="rounded-lg bg-muted p-2 transition-colors hover:bg-muted/80 lg:hidden">
								<Settings class="h-5 w-5" />
							</button>
						</div>
					</div>

					<p class="mb-4 max-w-2xl text-sm lg:text-base">
						{user.description}
						<br class="hidden lg:block" />
						<span class="text-accent">#MOBA</span> <span class="text-accent">#Competitive</span>
						<span class="text-accent">#Gaming</span>
					</p>

					<div class="mb-6 grid grid-cols-4 gap-4 lg:gap-8">
						<div class="text-center lg:text-left">
							<div class="font-mono text-xl font-black lg:text-2xl">
								{formatNumber(user.videos_count)}
							</div>
							<div class="text-xs text-muted-foreground lg:text-sm">{m.stat_videos()}</div>
						</div>
						<div class="text-center lg:text-left">
							<div class="font-mono text-xl font-black lg:text-2xl">
								{formatNumber(user.followers_count)}
							</div>
							<div class="text-xs text-muted-foreground lg:text-sm">{m.stat_followers()}</div>
						</div>
						<div class="text-center lg:text-left">
							<div class="font-mono text-xl font-black lg:text-2xl">
								{formatNumber(user.following_count)}
							</div>
							<div class="text-xs text-muted-foreground lg:text-sm">{m.stat_following()}</div>
						</div>
						<div class="text-center lg:text-left">
							<div class="font-mono text-xl font-black lg:text-2xl">
								{formatNumber(user.likes_count)}
							</div>
							<div class="text-xs text-muted-foreground lg:text-sm">{m.stat_likes()}</div>
						</div>
					</div>

					<div class="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
						<div class="flex items-center gap-2">
							<Calendar class="h-4 w-4" />
							<span>{m.joined_date({ date: 'March 2024' })}</span>
						</div>
						{#if user.sponsored_by?.length}
							<div class="flex items-center gap-2">
								<Users class="h-4 w-4" />
								<span>{m.sponsored_by({ brand: user.sponsored_by.join(', ') })}</span>
							</div>
						{/if}
					</div>
				</div>
			</div>
		</div>

		<div class="mb-6 border-b border-border">
			<div class="flex gap-8 lg:gap-12">
				<button
					onclick={() => setActiveTab('videos')}
					class="flex items-center gap-2 border-b-2 pb-3 transition-colors {activeTab === 'videos'
						? 'border-primary font-bold text-foreground'
						: 'border-transparent text-muted-foreground hover:text-foreground'}"
				>
					<Grid3x3 class="h-5 w-5" />
					<span class="hidden sm:inline">{m.tab_my_videos()}</span>
					<span class="rounded-full bg-muted px-2 py-0.5 font-mono text-xs">
						{formatNumber(user.videos_count)}
					</span>
				</button>
				<button
					onclick={() => setActiveTab('saved')}
					disabled={!isOwnProfile}
					class="flex items-center gap-2 border-b-2 pb-3 transition-colors {activeTab === 'saved'
						? 'border-primary font-bold text-foreground'
						: !isOwnProfile
							? 'border-transparent text-muted-foreground/40'
							: 'border-transparent text-muted-foreground hover:text-foreground'}"
				>
					<Bookmark class="h-5 w-5" />
					<span class="hidden sm:inline">{m.tab_saved()}</span>
					<span class="rounded-full bg-muted px-2 py-0.5 font-mono text-xs">
						{formatNumber(user.saved_videos_count)}
					</span>
				</button>
				<button
					onclick={() => setActiveTab('liked')}
					disabled={!isOwnProfile}
					class="flex items-center gap-2 border-b-2 pb-3 transition-colors {activeTab === 'liked'
						? 'border-primary font-bold text-foreground'
						: !isOwnProfile
							? 'border-transparent text-muted-foreground/40'
							: 'border-transparent text-muted-foreground hover:text-foreground'}"
				>
					<Heart class="h-5 w-5" />
					<span class="hidden sm:inline">{m.tab_liked()}</span>
					<span class="rounded-full bg-muted px-2 py-0.5 font-mono text-xs">
						{formatNumber(user.liked_videos_count)}
					</span>
				</button>
			</div>
		</div>

		{#if tabError}
			<p class="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
				{tabError}
			</p>
		{/if}

		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5">
			{#each currentVideos as video, index (video.id)}
				<div
					in:fly={{ y: 20, duration: 400, delay: index * 50 }}
					class="group cursor-pointer overflow-hidden rounded-lg border border-border bg-card shadow-lg transition-all hover:border-primary/50 hover:shadow-xl"
				>
					<div class="relative aspect-9/14">
						<img src={video.thumbnail} alt="Video thumbnail" class="h-full w-full object-cover" />
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
							class="absolute top-2 left-2 rounded bg-primary/90 px-2 py-0.5 text-xs font-bold text-white backdrop-blur-sm"
						>
							{video.game}
						</div>

						<div
							class="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 to-transparent p-2"
						>
							<div class="flex items-center justify-between font-mono text-xs text-white">
								<div class="flex items-center gap-1">
									<Eye class="h-3 w-3" />
									<span>{formatNumber(video.views)}</span>
								</div>
								<div class="flex items-center gap-1">
									<Heart class="h-3 w-3" />
									<span>{formatNumber(video.likes)}</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if tabLoading}
			<div class="py-16 text-center text-sm text-muted-foreground">Loading videos...</div>
		{:else if currentVideos.length === 0}
			<div class="py-16 text-center">
				<div class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
					{#if activeTab === 'videos'}
						<Grid3x3 class="h-8 w-8 text-muted-foreground" />
					{:else if activeTab === 'saved'}
						<Bookmark class="h-8 w-8 text-muted-foreground" />
					{:else if activeTab === 'liked'}
						<Heart class="h-8 w-8 text-muted-foreground" />
					{/if}
				</div>
				<h3 class="mb-2 text-lg font-black">{m.no_videos_yet()}</h3>
				<p class="text-sm text-muted-foreground">
					{#if activeTab === 'videos'}
						{m.empty_videos_msg()}
					{:else if activeTab === 'saved'}
						{m.empty_saved_msg()}
					{:else if activeTab === 'liked'}
						{m.empty_liked_msg()}
					{/if}
				</p>
			</div>
		{/if}

		{#if currentVideos.length > 0}
			<div class="mt-8 flex justify-center">
				<button
					class="rounded-lg bg-muted px-6 py-3 text-sm font-semibold transition-all hover:bg-muted/80 active:scale-95"
				>
					{m.load_more()}
				</button>
			</div>
		{/if}
	</div>
</div>
