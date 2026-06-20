<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authStatus, user } from '$lib/stores/user.svelte';
	import ToggleTheme from '$lib/components/ui/ToggleTheme.svelte';
	import { setLocale, getLocale } from '$lib/paraglide/runtime';

	let { children } = $props();

	let currentLanguage = $state(getLocale());

	function toggleLanguage() {
		const newLang = currentLanguage === 'es' ? 'en' : 'es';
		setLocale(newLang);
		currentLanguage = newLang;
	}

	$effect(() => {
		if (!authStatus.initialized) return;

		if (user.authenticated) {
			goto(resolve('/'));
		}
	});
</script>

{#if authStatus.initialized && !user.authenticated}
	<div class="fixed top-4 right-4 z-50 flex items-center gap-3">
		<button
			onclick={toggleLanguage}
			title="Cambiar idioma / Change language"
			class="flex h-8 w-10 cursor-pointer items-center justify-center rounded-full bg-gray-200 text-xs font-black text-foreground uppercase shadow-lg transition-colors duration-300 hover:opacity-80 dark:bg-gray-700"
		>
			{currentLanguage}
		</button>
		<ToggleTheme />
	</div>

	{@render children()}
{/if}
