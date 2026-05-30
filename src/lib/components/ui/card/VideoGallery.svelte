<script lang="ts">
	import VideoCard from './VideoCard.svelte';

	let { mockVideos } = $props();

	// Manejo de estado en Svelte 5
	let selectedVideo = $state(null);
	let isLiked = $state(false);
	let isSaved = $state(false);

	// Función que se dispara al hacer click en una tarjeta
	function handleVideoSelect(video) {
		selectedVideo = video;
		isLiked = false;
		isSaved = false;

		// Aquí puedes agregar lógica adicional (ej: abrir modal)
		console.log('Video seleccionado:', video.title);
	}
</script>

<div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
	{#each mockVideos as video (video.id)}
		<VideoCard {video} onclick={() => handleVideoSelect(video)} />
	{/each}
</div>
