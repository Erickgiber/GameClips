<script lang="ts">
	import VideoCard from './VideoCard.svelte';
	import type { Video } from '$lib/types/video.type';

	let { videos }: { videos: Video[] } = $props();

	// Función que se dispara al hacer click en una tarjeta
	function handleVideoSelect(video: Video) {
		// Aquí puedes agregar lógica adicional (ej: abrir modal)
		console.log('Video seleccionado:', video.title);
	}
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
	{#each videos as video (video.id)}
		<VideoCard {video} onclick={() => handleVideoSelect(video)} />
	{/each}
</div>
