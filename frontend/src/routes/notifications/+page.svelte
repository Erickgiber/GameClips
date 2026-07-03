<script lang="ts">
	import { resolve } from '$app/paths';
	import AuthGuard from '$lib/components/auth/AuthGuard.svelte';
	import NotificationsFeed from '$lib/components/notifications/NotificationsFeed.svelte';
	import {
		getUnreadNotificationsCount,
		loadNotifications,
		notificationsState
	} from '$lib/stores/notifications.svelte';
	import { onMount } from 'svelte';
	import { m } from '$lib/paraglide/messages';
	import { ArrowLeft, Bell } from 'lucide-svelte';

	const unreadCount = $derived(getUnreadNotificationsCount());

	onMount(() => {
		void loadNotifications();
	});
</script>

<svelte:head>
	<title>Notifications | GameClips</title>
	<meta
		name="description"
		content="Review your latest GameClips activity, creator follows and featured clip updates."
	/>
</svelte:head>

<AuthGuard>
	<div class="min-h-screen bg-background px-4 pt-6 pb-28 text-foreground">
		<div class="mx-auto flex flex-col gap-6">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<a
					href={resolve('/')}
					class="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-card"
				>
					<ArrowLeft class="h-4 w-4" />
					{m.back_to_home()}
				</a>

				<div
					class="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary"
				>
					<span class="h-2.5 w-2.5 rounded-full bg-primary"></span>
					{m.unread_notification({ count: unreadCount })}
				</div>
			</div>

			<section
				class="relative overflow-hidden rounded-4xl border border-border bg-card/75 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-8"
			>
				<div
					class="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(249,115,22,0.16),transparent_40%)]"
				></div>

				<div class="relative space-y-6">
					<div class="flex flex-wrap items-start justify-between gap-4">
						<div class="flex max-w-2xl items-center gap-3">
							<div
								class="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20"
							>
								<Bell class="h-6 w-6" />
							</div>
							<h1 class="text-3xl font-black tracking-tight sm:text-4xl">
								{m.notifications()}
							</h1>
						</div>

						<a
							href={resolve('/discover')}
							class="inline-flex items-center rounded-2xl border border-white/10 bg-background/60 px-4 py-3 text-sm font-semibold transition-colors hover:bg-background"
						>
							{m.explore_creators()}
						</a>
					</div>

					<NotificationsFeed notifications={notificationsState.items} />
				</div>
			</section>
		</div>
	</div>
</AuthGuard>
