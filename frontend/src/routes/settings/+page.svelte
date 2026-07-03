<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { resolve } from '$app/paths';
	import { logoutUser } from '$lib/stores/user.svelte';

	const sections = [
		{
			title: m.settings_account(),
			items: [
				{ label: m.settings_edit_profile(), href: resolve('/settings/profile') },
				{ label: m.settings_security(), href: resolve('/settings/security') }
			]
		},
		{
			title: m.settings_preferences(),
			items: [
				{ label: m.settings_language(), href: resolve('/settings/language') },
				{ label: m.settings_notifications(), href: resolve('/settings/notifications') }
			]
		}
	];
</script>

<!-- SECTIONS -->
{#each sections as section, id (id)}
	<div class="mb-6">
		<p class="mb-2 text-xs tracking-wide text-muted-foreground uppercase">
			{section.title}
		</p>

		<div class="overflow-hidden rounded-xl border border-border bg-card">
			{#each section.items as item, i (i)}
				<a
					href={item.href}
					class="flex items-center justify-between bg-card px-4 py-3
						text-card-foreground transition hover:bg-accent/40"
					class:border-b={i !== section.items.length - 1}
				>
					<span class="text-sm">{item.label}</span>
					<span class="text-muted-foreground">›</span>
				</a>
			{/each}
		</div>
	</div>
{/each}

<!-- LOGOUT -->
<div class="mt-10">
	<button
		onclick={logoutUser}
		class="w-full rounded-xl border border-destructive/20 bg-destructive/10 py-3
			text-destructive transition hover:bg-destructive/20"
	>
		{m.settings_logout()}
	</button>
</div>
