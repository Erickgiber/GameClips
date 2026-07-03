<script lang="ts">
	import { browser } from '$app/environment';
	import { resolve } from '$app/paths';
	import { t } from '$lib/helpers/translate';
	import NotificationsFeed from '$lib/components/notifications/NotificationsFeed.svelte';
	import {
		getHasNotifications,
		getUnreadNotificationsCount,
		loadNotifications,
		notificationsState
	} from '$lib/stores/notifications.svelte';
	import { logoutUser, user } from '$lib/stores/user.svelte';
	import {
		Bell,
		Search,
		User,
		X,
		ChevronDown,
		Settings,
		Shield,
		CircleQuestionMark,
		LogOut
	} from 'lucide-svelte';
	import { fade, fly, scale } from 'svelte/transition';
	import ToggleTheme from './ui/ToggleTheme.svelte';
	import { m } from '$lib/paraglide/messages';
	import { onMount, type Component } from 'svelte';

	let isNotificationsOpen = $state(false);
	let isUserMenuOpen = $state(false);
	let menuStyle = $state('');
	let dropdownBtn: HTMLButtonElement | null = $state(null);
	let notificationsBtn: HTMLButtonElement | null = $state(null);

	const unreadCount = $derived(getUnreadNotificationsCount());
	const hasNotifications = $derived(getHasNotifications());

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

	function toggleUserMenu() {
		isUserMenuOpen = !isUserMenuOpen;
	}

	function closeUserMenu() {
		isUserMenuOpen = false;
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.key === 'Escape') {
			closeUserMenu();
			closeNotifications();
		}
	}

	function updateMenuPosition(btn: HTMLButtonElement | null) {
		if (!btn) return;

		const rect = btn.getBoundingClientRect();

		menuStyle = `
		top:${rect.bottom + 12}px;
		left:${rect.right - 320}px;
	`;
	}

	const navActions = [
		{
			id: 'theme',
			component: ToggleTheme
		},
		{
			id: 'notifications',
			component: Bell,
			onClick: openNotifications,
			showBadge: true
		},
		{
			id: 'profile',
			component: User,
			href: resolve(`/${user.username}`)
		},
		{
			id: 'user-dropdown',
			component: ChevronDown,
			onClick: toggleUserMenu
		}
	] as const;

	$effect(() => {
		if (!browser) return;
		if (user.authenticated) {
			void loadNotifications();
		}

		if (isUserMenuOpen && browser) {
			requestAnimationFrame(() => updateMenuPosition(dropdownBtn));
		}

		if (isNotificationsOpen && browser) {
			requestAnimationFrame(() => updateMenuPosition(notificationsBtn));
		}

		document.body.style.overflow = isNotificationsOpen || isUserMenuOpen ? 'hidden' : '';

		return () => {
			document.body.style.overflow = '';
		};
	});

	onMount(() => {
		if (!browser) return;

		document.addEventListener('keydown', handleKeyDown);

		return () => {
			document.removeEventListener('keydown', handleKeyDown);
		};
	});
</script>

<svelte:document onkeydown={handleDocumentKeydown} />

<nav
	class="z-50 flex h-nav-desktop items-center justify-between border-b border-border bg-card/50 px-4 backdrop-blur-md"
>
	<a href={resolve('/')} class="flex items-center gap-2">
		<div
			class="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-primary to-secondary"
		>
			<div class="h-4 w-4 rounded-sm bg-accent"></div>
		</div>

		<h1 class="text-xl font-black tracking-tight">GAMECLIP</h1>
	</a>

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
		{#each navActions as action (action.id)}
			{@const Component = action.component as Component}
			{#if 'href' in action}
				<a
					href={action.href}
					class="rounded-lg p-2 transition-colors hover:bg-muted md:cursor-pointer"
				>
					<Component class="h-5 w-5" />
				</a>
			{:else if 'onClick' in action}
				{#if action.id === 'user-dropdown'}
					<button
						title="User menu"
						bind:this={dropdownBtn}
						type="button"
						class="relative rounded-lg p-2 transition-colors hover:bg-muted md:cursor-pointer"
						onclick={action.onClick}
					>
						<Component class="h-5 w-5" />
					</button>
				{:else if action.id === 'notifications'}
					<button
						title="Notifications"
						bind:this={notificationsBtn}
						type="button"
						class="relative rounded-lg p-2 transition-colors hover:bg-muted md:cursor-pointer"
						onclick={action.onClick}
					>
						<Component class="h-5 w-5" />
					</button>
				{:else}
					{@const onclick =
						'onClick' in action ? (action as { onClick: () => void }).onClick : undefined}
					{@const showBadge =
						'showBadge' in action ? (action as { showBadge: boolean }).showBadge : false}
					<button
						type="button"
						class="relative rounded-lg p-2 transition-colors hover:bg-muted md:cursor-pointer"
						{onclick}
					>
						<Component class="h-5 w-5" />

						{#if showBadge && hasNotifications}
							<div class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive"></div>
						{/if}
					</button>
				{/if}
			{:else}
				<action.component />
			{/if}
		{/each}
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
			style={menuStyle}
			id="notifications-modal"
			class="fixed z-70 w-80 overflow-hidden rounded-4xl border border-border bg-card/92 shadow-2xl ring-1 shadow-black/35 ring-border/10 backdrop-blur-2xl"
			transition:scale={{ duration: 220, start: 0.96 }}
		>
			<div class="border-b border-border px-5 py-4">
				<div class="flex items-start justify-between gap-4">
					<div>
						<h2 id="notifications-modal-title" class="mt-2 text-2xl font-black tracking-tight">
							{m.notifications()}
						</h2>
					</div>

					<button
						type="button"
						class="rounded-2xl border border-border bg-background/60 p-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
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
				<NotificationsFeed notifications={notificationsState.items} compact />
			</div>

			<div class="border-t border-border px-5 py-4">
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
{/if}

{#if isUserMenuOpen}
	<div class="fixed inset-0 z-60">
		<button
			type="button"
			class="absolute inset-0 bg-background/10 backdrop-blur-sm transition-opacity"
			aria-label="Close user menu"
			onclick={closeUserMenu}
			transition:fade={{ duration: 180 }}
		></button>

		<!-- Desktop -->
		<div class="hidden md:block">
			<div
				style={menuStyle}
				class="fixed z-70 w-80 overflow-hidden rounded-4xl border border-border bg-card/92 shadow-2xl ring-1 shadow-black/35 ring-border/10 backdrop-blur-2xl"
				transition:scale={{ duration: 220, start: 0.96 }}
			>
				<!-- Header -->
				<div class="border-b border-border px-5 py-4">
					<div class="flex items-start justify-between gap-4">
						<div>
							<h2 id="user-menu-title" class="mt-2 text-2xl font-black tracking-tight">
								{m.user_menu()}
							</h2>

							<p class="text-sm text-muted-foreground">
								{m.user_menu_subtitle()}
							</p>
						</div>

						<button
							type="button"
							class="rounded-2xl border border-border bg-background/60 p-2 text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
							onclick={closeUserMenu}
						>
							<X class="h-5 w-5" />
						</button>
					</div>
				</div>

				<div class="space-y-2 px-3 py-4">
					<a
						href={resolve('/profile')}
						class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5"
						onclick={closeUserMenu}
					>
						<User class="h-5 w-5 text-muted-foreground" />
						{m.view_profile()}
					</a>

					<a
						href={resolve('/settings')}
						class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5"
						onclick={closeUserMenu}
					>
						<Settings class="h-5 w-5 text-muted-foreground" />
						{m.settings()}
					</a>

					<a
						href={resolve('/account')}
						class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5"
						onclick={closeUserMenu}
					>
						<Shield class="h-5 w-5 text-muted-foreground" />
						{m.account()}
					</a>

					<a
						href={resolve('/help')}
						class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors hover:bg-white/5"
						onclick={closeUserMenu}
					>
						<CircleQuestionMark class="h-5 w-5 text-muted-foreground" />
						{m.help()}
					</a>
				</div>

				<div class="border-t border-border px-5 py-4">
					<button
						type="button"
						class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-400 transition-colors hover:bg-red-500/20"
						onclick={logoutUser}
					>
						<LogOut class="h-5 w-5" />
						{m.logout()}
					</button>
				</div>
			</div>
		</div>

		<!-- Mobile -->
		<div class="md:hidden">
			<button
				title="Close user menu"
				type="button"
				class="absolute inset-0 bg-background/30 backdrop-blur-sm"
				onclick={closeUserMenu}
				transition:fade={{ duration: 180 }}
			></button>

			<div
				class="absolute right-0 bottom-0 left-0 overflow-hidden rounded-t-4xl border-t border-border bg-card shadow-2xl"
				style="padding-bottom:max(1rem,env(safe-area-inset-bottom));"
				transition:fly={{ y: 400, duration: 250 }}
			>
				<div class="border-b border-border px-5 py-4">
					<div class="flex items-center justify-between">
						<h2 class="text-xl font-black">
							{m.user_menu()}
						</h2>

						<button
							type="button"
							class="rounded-2xl border border-border bg-background/60 p-2"
							onclick={closeUserMenu}
						>
							<X class="h-5 w-5" />
						</button>
					</div>
				</div>

				<div class="space-y-2 px-4 py-4">
					<a
						href={resolve('/profile')}
						class="flex items-center gap-3 rounded-2xl px-4 py-4 hover:bg-white/5"
						onclick={closeUserMenu}
					>
						<User class="h-5 w-5" />
						{m.view_profile()}
					</a>

					<a
						href={resolve('/settings')}
						class="flex items-center gap-3 rounded-2xl px-4 py-4 hover:bg-white/5"
						onclick={closeUserMenu}
					>
						<Settings class="h-5 w-5" />
						{m.settings()}
					</a>

					<a
						href={resolve('/account')}
						class="flex items-center gap-3 rounded-2xl px-4 py-4 hover:bg-white/5"
						onclick={closeUserMenu}
					>
						<Shield class="h-5 w-5" />
						{m.account()}
					</a>

					<a
						href={resolve('/help')}
						class="flex items-center gap-3 rounded-2xl px-4 py-4 hover:bg-white/5"
						onclick={closeUserMenu}
					>
						<CircleQuestionMark class="h-5 w-5" />
						{m.help()}
					</a>
				</div>

				<div class="border-t border-border p-4">
					<button
						type="button"
						class="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500/10 px-4 py-4 font-semibold text-red-400"
						onclick={logoutUser}
					>
						<LogOut class="h-5 w-5" />
						{m.logout()}
					</button>
				</div>
			</div>
		</div>
	</div>
{/if}
