<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	import { setLocale, getLocale } from '$lib/paraglide/runtime';

	type Language = 'es' | 'en';

	const languages = [
		{ code: 'es' as const, label: 'Español' },
		{ code: 'en' as const, label: 'English' }
	];

	let current: Language = getLocale() as Language;

	function selectLanguage(lang: Language) {
		setLocale(lang);
		current = lang;
	}
</script>

<!-- DESCRIPTION -->
<p class="mb-4 text-sm text-muted-foreground">
	{m.settings_language_description?.() ?? 'Choose your preferred language'}
</p>

<!-- LIST -->
<div class="overflow-hidden rounded-xl border border-border bg-card">
	{#each languages as lang, i (lang.code)}
		<button
			onclick={() => selectLanguage(lang.code)}
			class="flex w-full items-center justify-between bg-card px-4 py-3
				text-card-foreground transition hover:bg-accent/40"
			class:border-b={i !== languages.length - 1}
		>
			<span class="text-sm">{lang.label}</span>

			{#if current === lang.code}
				<span
					class="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground"
				>
					✓
				</span>
			{:else}
				<span class="h-5 w-5 rounded-full border border-border"></span>
			{/if}
		</button>
	{/each}
</div>
