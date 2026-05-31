<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { client } from '$lib/stores/isClient.svelte';
</script>

{#if client.showLoader}
	<div
		class="fixed inset-0 z-9999 flex items-center justify-center bg-foreground/95 text-white"
	>
		<div class="space-y-6 text-center">
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
