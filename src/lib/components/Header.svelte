<script>
	import { t } from '$lib/helpers/translate';
	import { Search, Bell, User } from 'lucide-svelte';
	import ToggleTheme from './ui/ToggleTheme.svelte';
	import { resolve } from '$app/paths';
	import { user } from '$lib/stores/user.svelte';
</script>

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

		<button class="relative rounded-lg p-2 transition-colors hover:bg-muted">
			<Bell class="h-5 w-5" />
			<div class="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-destructive"></div>
		</button>
		<a href={resolve(`/${user.username}`)} class="rounded-lg p-2 transition-colors hover:bg-muted">
			<User class="h-5 w-5" />
		</a>
	</div>
</nav>
