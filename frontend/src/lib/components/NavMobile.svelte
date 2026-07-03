<script>
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';
	import { getHasNotifications, loadNotifications } from '$lib/stores/notifications.svelte';
	import { user } from '$lib/stores/user.svelte';
	import { House, Compass, SquarePlus, Bell, User } from 'lucide-svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		if (user.authenticated) {
			void loadNotifications();
		}
	});

	const defaultItemClass =
		'flex flex-col items-center gap-1 px-4 py-2 transition-transform active:scale-90';
	const primaryItemClass =
		'-mt-3 flex flex-col items-center gap-1 transition-transform active:scale-90';
	const currentRouteId = $derived(page.route.id ?? '');
	const hasNotifications = $derived(getHasNotifications());

	const navItems = $derived([
		{
			id: 'home',
			label: m.nav_home(),
			icon: House,
			href: resolve('/'),
			className: defaultItemClass,
			isActive: currentRouteId === '/'
		},
		{
			id: 'discover',
			label: m.nav_discover(),
			icon: Compass,
			href: resolve('/discover'),
			className: defaultItemClass,
			isActive: currentRouteId === '/discover'
		},
		{
			id: 'create',
			label: 'Create',
			icon: SquarePlus,
			href: resolve('/create'),
			className: primaryItemClass,
			isPrimary: true,
			isActive: currentRouteId === '/create'
		},
		{
			id: 'inbox',
			label: m.nav_inbox(),
			icon: Bell,
			href: resolve('/notifications'),
			className: `${defaultItemClass} relative`,
			isActive: currentRouteId === '/notifications',
			hasNotification: hasNotifications
		},
		{
			id: 'profile',
			label: m.nav_profile(),
			icon: User,
			href: resolve(`/${user.username}`),
			className: defaultItemClass,
			isActive: currentRouteId === '/[username]'
		}
	]);
</script>

<div
	style="padding-bottom: calc(env(safe-area-inset-bottom) + 0.5rem);"
	class="fixed right-0 bottom-0 left-0 z-50 border-t border-[#1e293b] bg-card-foreground/10 backdrop-blur-md"
>
	<div class="flex items-center justify-around pt-2">
		{#each navItems as item (item.id)}
			<a
				href={item.href}
				aria-current={item.isActive ? 'page' : undefined}
				aria-label={item.label}
				class={`${item.className} ${item.isPrimary ? '' : item.isActive ? 'rounded-2xl bg-white/8 text-white' : 'text-muted-foreground'}`}
			>
				{#if item.isPrimary}
					<div
						class={`flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary text-white shadow-lg transition-all ${item.isActive ? 'scale-105 ring-2 shadow-primary/70 ring-white/40' : 'shadow-primary/50'}`}
					>
						<item.icon class="h-6 w-6" />
					</div>
					<span class="sr-only">{item.label}</span>
				{:else}
					<item.icon class={`h-6 w-6 ${item.isActive ? 'text-white' : 'text-muted-foreground'}`} />
					<span
						class={`text-xs font-medium ${item.isActive ? 'text-white' : 'text-muted-foreground'}`}
					>
						{item.label}
					</span>
					{#if item.hasNotification}
						<div class="absolute top-1.5 right-3 h-2 w-2 rounded-full bg-destructive"></div>
					{/if}
				{/if}
			</a>
		{/each}
	</div>
</div>
