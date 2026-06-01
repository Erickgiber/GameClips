<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { t } from '$lib/helpers/translate';
	import NotificationsFeed from '$lib/components/notifications/NotificationsFeed.svelte';
	import { mockNotifications } from '$lib/mocks/notifications';
	import { user } from '$lib/stores/user.svelte';
	import { Bell, Search, User, X } from 'lucide-svelte';
	import { fade, scale } from 'svelte/transition';
	import ToggleTheme from './ui/ToggleTheme.svelte';
	import { m } from '$lib/paraglide/messages';

	let isNotificationsOpen = $state(false);

	const unreadNotifications = $derived(
		mockNotifications.filter((notification) => notification.unread)
	);
	const unreadCount = $derived(unreadNotifications.length);
	const hasNotifications = $derived(mockNotifications.length > 0);

	function openNotifications() {
		isNotificationsOpen = true;
	}

	function closeNotifications() {
		isNotificationsOpen = false;
	}

	function handleDocumentKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isNotificationsOpen) {
			closeNotifications();
		}
	}

	$effect(() => {
		if (!browser) {
			return;
		}

		document.body.style.overflow = isNotificationsOpen ? 'hidden' : '';

		return () => {
			document.body.style.overflow = '';
		};
	});
</script>

<svelte:document onkeydown={handleDocumentKeydown} />

<nav
	class="z-50 flex h-header items-center justify-between border-b border-border bg-card/50 px-4 backdrop-blur-md"
>
	<div class="flex items-center gap-2">
		<div
			class="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-secondary"
		>
			<div class="h-4 w-4 rounded-sm bg-accent"></div>
		</div>
		<h1 class="text-xl font-black tracking-tight">GAMECLIP</h1>
	</div>

	<div class="mx-8 hidden max-w-md flex-1 md:block">
		<div class="relative">
			<Search class="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<input
				type="text"
				placeholder={t['search.placeholder']}
				class="w-full rounded-lg border border-border bg-muted/50 py-2 pr-4 pl-10 text-sm transition-all focus:ring-2 focus:ring-primary/50 focus:outline-none"
			/>
		</div>
	</div>

	<div class="flex items-center gap-3">
		<ToggleTheme />

		<button
			type="button"
			class="relative rounded-lg p-2 transition-colors hover:bg-muted"
			aria-controls="notifications-modal"
			aria-expanded={isNotificationsOpen}
			aria-haspopup="dialog"
			aria-label={`Open notifications${unreadCount ? `. ${unreadCount} unread` : ''}`}
			onclick={openNotifications}
		>
			<Bell class="h-5 w-5" />
			{#if hasNotifications}
				<div class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive"></div>
			{/if}
		</button>
		<a href={resolve(`/${user.username}`)} class="rounded-lg p-2 transition-colors hover:bg-muted">
			<User class="h-5 w-5" />
		</a>
	</div>
</nav>

{#if isNotificationsOpen}
	<div class="fixed inset-0 z-60">
		<button
			type="button"
			class="absolute inset-0 bg-background/10 backdrop-blur-sm transition-opacity"
			aria-label="Close notifications"
			onclick={closeNotifications}
			transition:fade={{ duration: 180 }}
		></button>

		<div
			class="pointer-events-none relative mx-auto flex h-screen items-start justify-end pt-10 pr-28"
		>
			<div
				id="notifications-modal"
				role="dialog"
				aria-modal="true"
				aria-labelledby="notifications-modal-title"
				class="pointer-events-auto max-h-2/3 w-full max-w-md overflow-hidden rounded-4xl border border-white/10 bg-card/92 shadow-2xl ring-1 shadow-black/35 ring-white/10 backdrop-blur-2xl"
				transition:scale={{ duration: 220, start: 0.96 }}
			>
				<div class="border-b border-white/10 px-5 py-4">
					<div class="flex items-start justify-between gap-4">
						<div>
							<h2 id="notifications-modal-title" class="mt-2 text-2xl font-black tracking-tight">
								{m.notifications()}
							</h2>
						</div>

						<button
							type="button"
							class="rounded-2xl border border-white/10 bg-background/60 p-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
							aria-label="Close notifications"
							onclick={closeNotifications}
						>
							<X class="h-5 w-5" />
						</button>
					</div>

					{#if unreadCount > 0}
						<div
							class="mt-4 inline-flex rounded-full bg-primary/12 px-3 py-1 text-xs font-semibold text-primary"
						>
							{m.unread_notification({ count: unreadCount })}
						</div>
					{/if}
				</div>

				<div class="max-h-[70vh] overflow-y-auto px-5 py-5">
					<NotificationsFeed notifications={mockNotifications} compact />
				</div>

				<div class="border-t border-white/10 px-5 py-4">
					<a
						href={resolve('/notifications')}
						class="inline-flex w-full items-center justify-center rounded-2xl bg-linear-to-r from-primary to-secondary px-4 py-3 text-sm font-semibold text-white transition-transform duration-200 hover:scale-[1.01]"
						onclick={closeNotifications}
					>
						{m.open_notifications()}
					</a>
				</div>
			</div>
		</div>
	</div>
{/if}
