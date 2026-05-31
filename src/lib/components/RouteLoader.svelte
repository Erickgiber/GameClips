<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/stores/isClient.svelte';

	// ERROR CORREGIDO: Si es visible al inicio, debe renderizarse de inmediato
	let rendered = $state(client.showLoader);
	let closing = $state(false);

	const EXIT_DURATION = 200;

	$effect(() => {
		if (client.showLoader) {
			rendered = true;
			closing = false;
			return;
		}

		// Si no está renderizado, no hacemos nada
		if (!rendered) return;

		closing = true;

		const t = setTimeout(() => {
			rendered = false;
			closing = false;
		}, EXIT_DURATION);

		return () => clearTimeout(t);
	});
</script>

{#if rendered}
	<div
		class="fixed inset-0 z-9999 flex items-center justify-center bg-foreground/95 text-white backdrop-blur-md"
	>
		<div
			class={[
				'transform-gpu space-y-6 text-center will-change-transform',
				!closing
					? 'animate-in fade-in zoom-in-95 duration-300 ease-out'
					: 'animate-out fade-out zoom-out-95 translate-y-2 duration-200 ease-in'
			].join(' ')}
		>
			<div
				class="mx-auto h-24 w-24 animate-spin rounded-full border-4 border-gray-700 border-t-primary"
			></div>

			<div class="text-4xl font-semibold text-primary">
				{m.almostThere()}
			</div>

			<div class="text-sm text-muted-foreground">
				<p>{m.gettingReady()}</p>
				<p>{m.sitTight()}</p>
			</div>
		</div>
	</div>
{/if}
