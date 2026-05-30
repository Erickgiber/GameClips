<script lang="ts">
	import { m } from '$lib/paraglide/messages';

	// Importamos las funciones de traducción generadas por Paraglide

	// Definimos la interfaz de las Runas de Svelte 5
	interface Props {
		activeCategory: string;
		onCategoryChange: (category: string) => void;
	}

	// Desestructuramos las propiedades usando la runa $props()
	let { activeCategory, onCategoryChange }: Props = $props();

	// Mapeamos los identificadores con sus respectivas funciones de traducción de Paraglide
	const categories = [
		{ id: 'for_you', label: m.category_for_you },
		{ id: 'fps', label: m.category_fps },
		{ id: 'moba', label: m.category_moba },
		{ id: 'battle_royale', label: m.category_battle_royale },
		{ id: 'rpg', label: m.category_rpg },
		{ id: 'strategy', label: m.category_strategy },
		{ id: 'fighting', label: m.category_fighting },
		{ id: 'racing', label: m.category_racing },
		{ id: 'indie', label: m.category_indie },
		{ id: 'trending', label: m.category_trending }
	];
</script>

<div
	class=" scrollbar-hide flex items-center overflow-x-auto border-b border-border bg-card/30 backdrop-blur-sm"
>
	<div class="flex h-category-nav items-center gap-2 px-4">
		{#each categories as category (category.id)}
			<button
				type="button"
				onclick={() => onCategoryChange(category.id)}
				class="h-max rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-all md:cursor-pointer
          {activeCategory === category.id
					? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
					: 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'}"
			>
				{category.label()}
			</button>
		{/each}
	</div>
</div>
