<script lang="ts">
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';
	import type { Notification, NotificationType } from '$lib/types/notification.type';
	import { BellOff, Heart, MessageSquareText, Sparkles, UserPlus } from 'lucide-svelte';

	let {
		notifications,
		compact = false
	}: {
		notifications: Notification[];
		compact?: boolean;
	} = $props();

	const notificationMeta = {
		comment: {
			label: 'Comment',
			Icon: MessageSquareText,
			badgeClass: 'bg-sky-500/15 text-sky-300 ring-sky-500/20'
		},
		like: {
			label: 'Like',
			Icon: Heart,
			badgeClass: 'bg-rose-500/15 text-rose-300 ring-rose-500/20'
		},
		follow: {
			label: 'Follow',
			Icon: UserPlus,
			badgeClass: 'bg-emerald-500/15 text-emerald-300 ring-emerald-500/20'
		},
		system: {
			label: 'Update',
			Icon: Sparkles,
			badgeClass: 'bg-amber-500/15 text-amber-300 ring-amber-500/20'
		}
	} satisfies Record<NotificationType, { label: string; Icon: typeof Heart; badgeClass: string }>;

	function getNotificationMeta(type: NotificationType) {
		return notificationMeta[type];
	}
</script>

{#if notifications.length > 0}
	<div class:space-y-3={compact} class:space-y-4={!compact} class:pb-40={compact}>
		{#each notifications as notification (notification.id)}
			{@const meta = getNotificationMeta(notification.type)}
			{@const Icon = meta.Icon}
			<a
				href={resolve(notification.href as '/profile')}
				class={`group flex items-start gap-3 overflow-hidden rounded-3xl border border-white/8 bg-background/75 p-3 text-left shadow-lg ring-1 shadow-black/10 ring-transparent transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:ring-primary/20 ${compact ? 'pr-4' : 'p-4 sm:gap-4'}`}
			>
				<div class="relative shrink-0">
					<img
						src={notification.actorAvatar}
						alt={notification.actorName}
						class={`rounded-2xl object-cover ring-1 ring-white/10 ${compact ? 'h-12 w-12' : 'h-14 w-14'}`}
					/>
					{#if notification.unread}
						<span
							class="absolute -top-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-card bg-primary"
						></span>
					{/if}
				</div>

				<div class="min-w-0 flex-1">
					<div class="flex flex-wrap items-center gap-2">
						<p class="text-sm font-semibold tracking-tight text-foreground sm:text-base">
							{notification.actorName}
						</p>
						<span class="text-xs text-muted-foreground">{notification.actorUsername}</span>
						<span
							class={`inline-flex items-center rounded-full px-2 py-1 text-[11px] font-semibold ring-1 ${meta.badgeClass}`}
						>
							<Icon class="mr-1 h-3.5 w-3.5" />
							{meta.label}
						</span>
					</div>

					<p class="mt-2 text-sm leading-6 text-foreground/90 sm:text-[15px]">
						{notification.message}
					</p>

					{#if notification.context}
						<p class="mt-2 line-clamp-2 text-sm text-muted-foreground">
							{notification.context}
						</p>
					{/if}

					<div class="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
						<span>{notification.timeLabel}</span>
						{#if notification.unread}
							<span class="rounded-full bg-primary/12 px-2 py-1 font-semibold text-primary">
								New
							</span>
						{/if}
					</div>
				</div>
			</a>
		{/each}
	</div>
{:else}
	<div
		class={`flex flex-col items-center justify-center rounded-4xl border border-dashed border-white/12 bg-background/60 text-center ${compact ? 'px-6 py-10' : 'px-8 py-14'}`}
	>
		<div
			class="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground ring-1 ring-white/10"
		>
			<BellOff class="h-7 w-7" />
		</div>
		<h3 class="mt-5 text-xl font-black tracking-tight text-foreground">
			{m.notifications_empty_title()}
		</h3>
		<p class="mt-2 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
			{m.notifications_empty()}
		</p>
	</div>
{/if}
