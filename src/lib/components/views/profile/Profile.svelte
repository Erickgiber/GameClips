<script lang="ts">
	import {
		ArrowLeft,
		Settings,
		Share2,
		Grid3x3,
		Bookmark,
		Heart,
		Play,
		Eye,
		Users,
		Trophy,
		Calendar,
		MessageCircle,
		Copy,
		X
	} from 'lucide-svelte';
	import { Share } from '@capacitor/share';
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
	import TopNavProfile from './TopNavProfile.svelte';

	let { user }: { user: User } = $props();
	let profileVideos = $state<AppVideo[]>([]);
	let savedVideos = $state<AppVideo[]>([]);
	let likedVideos = $state<AppVideo[]>([]);
	let tabLoading = $state(false);
	let tabError = $state<string | null>(null);

	let activeTab = $state<'videos' | 'saved' | 'liked'>('videos');
	let isShareModalOpen = $state(false);
	let copied = $state(false);

	async function handleShare() {
		const url = window.location.href;
		const title = m.share_profile?.() ?? 'Compartir Perfil';
		const text = m.share_profile_text?.({ username: user.username }) ?? `Echa un vistazo al perfil de ${user.username} en GameClips!`;

		let isNativeShareAvailable = false;
		try {
			const canShare = await Share.canShare();
			isNativeShareAvailable = canShare.value;
		} catch (e) {
			isNativeShareAvailable = false;
		}

		if (isNativeShareAvailable) {
			try {
				await Share.share({
					title,
					text,
					url,
					dialogTitle: title
				});
			} catch (e) {
				console.log('Native share canceled or failed', e);
			}
		} else {
			// Fallback to custom modal
			isShareModalOpen = true;
		}
	}

	function copyUrl() {
		navigator.clipboard.writeText(window.location.href);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function shareSocial(platform: string) {
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(m.share_profile_text?.({ username: user.username }) ?? `Echa un vistazo al perfil de ${user.username} en GameClips!`);
		let shareUrl = '';

		switch (platform) {
			case 'whatsapp':
				shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
				break;
			case 'twitter':
				shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
				break;
			case 'facebook':
				shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
				break;
			case 'linkedin':
				shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
				break;
			case 'instagram':
				copyUrl();
				alert(m.instagram_share_tip?.() ?? 'Link copiado. Pégalo en tu historia o biografía de Instagram.');
				shareUrl = `https://instagram.com`;
				break;
		}

		if (shareUrl) {
			window.open(shareUrl, '_blank', 'noopener,noreferrer');
		}
	}
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
	<TopNavProfile showShare={true} onShare={handleShare} />


	<div class="mx-auto max-w-7xl px-4 pb-8 lg:px-6" in:fly={{ y: 16, duration: 300, delay: 100 }}>
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
							{#if !isOwnProfile}
								<button
									onclick={() => (isFollowing = !isFollowing)}
									class="rounded-lg px-6 py-2 text-sm font-bold shadow-lg transition-all active:scale-95 md:cursor-pointer {isFollowing
										? 'bg-muted text-foreground hover:bg-muted/80'
										: 'bg-primary text-white shadow-primary/30 hover:bg-primary/90'}"
								>
									{isFollowing ? m.following() : m.follow_btn()}
								</button>
							{/if}
						</div>
					</div>

					<p class="mb-4 max-w-2xl text-sm lg:text-base">
						{user.description}
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
			<p
				class="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive"
			>
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

{#if isShareModalOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		onclick={() => (isShareModalOpen = false)}
		transition:fly={{ duration: 200, y: 10 }}
	>
		<div
			class="relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-card shadow-2xl"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="border-b border-border p-5 text-center relative">
				<h3 class="text-lg font-black text-foreground">{m.share_profile?.() ?? 'Compartir Perfil'}</h3>
				<button 
					class="absolute top-5 right-5 text-muted-foreground hover:text-foreground transition-colors md:cursor-pointer"
					onclick={() => (isShareModalOpen = false)}
				>
					<X class="h-5 w-5" />
				</button>
			</div>
			
			<div class="p-6 grid grid-cols-3 gap-y-6 gap-x-4">
				<button onclick={() => shareSocial('whatsapp')} class="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity md:cursor-pointer group">
					<div class="bg-green-500 rounded-full p-3.5 text-white shadow-md group-hover:scale-105 transition-transform">
						<MessageCircle class="h-6 w-6" />
					</div>
					<span class="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">WhatsApp</span>
				</button>
				<button onclick={() => shareSocial('twitter')} class="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity md:cursor-pointer group">
					<div class="bg-black dark:bg-white rounded-full p-3.5 text-white dark:text-black shadow-md group-hover:scale-105 transition-transform">
						<svg class="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.008 3.824H5.053z"/></svg>
					</div>
					<span class="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">X</span>
				</button>
				<button onclick={() => shareSocial('instagram')} class="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity md:cursor-pointer group">
					<div class="bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-500 rounded-full p-3.5 text-white shadow-md group-hover:scale-105 transition-transform">
						<svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
					</div>
					<span class="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">Instagram</span>
				</button>
				<button onclick={() => shareSocial('linkedin')} class="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity md:cursor-pointer group">
					<div class="bg-blue-600 rounded-full p-3.5 text-white shadow-md group-hover:scale-105 transition-transform">
						<svg class="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
					</div>
					<span class="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">LinkedIn</span>
				</button>
				<button onclick={() => shareSocial('facebook')} class="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity md:cursor-pointer group">
					<div class="bg-blue-500 rounded-full p-3.5 text-white shadow-md group-hover:scale-105 transition-transform">
						<svg class="h-6 w-6 fill-current" viewBox="0 0 24 24"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
					</div>
					<span class="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">Facebook</span>
				</button>
				<button onclick={copyUrl} class="flex flex-col items-center gap-2 hover:opacity-80 transition-opacity md:cursor-pointer group">
					<div class="bg-muted rounded-full p-3.5 text-foreground shadow-md group-hover:scale-105 transition-transform border border-border">
						<Copy class="h-6 w-6" />
					</div>
					<span class="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors">{copied ? 'Copiado!' : 'Copiar URL'}</span>
				</button>
			</div>
		</div>
	</div>
{/if}
