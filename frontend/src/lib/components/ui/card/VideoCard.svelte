<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { Play } from 'lucide-svelte';
	import type { Video } from '$lib/types/video.type';

	let {
		video,
		onclick
	}: {
		video: Video;
		onclick: (v: Video) => void;
	} = $props();

	// Función simple para formatear números (ej: 1500 -> 1.5K)
	function formatNumber(num: number) {
		return new Intl.NumberFormat('en-US', {
			notation: 'compact',
			maximumFractionDigits: 1
		}).format(num);
	}
</script>

<button
	class="group h-max w-full cursor-pointer overflow-hidden rounded-xl border border-border bg-card text-left shadow-lg transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-xl focus:ring-2 focus:ring-primary focus:outline-none"
	aria-label={`Ver video de ${video.creator}`}
	onclick={() => onclick(video)}
>
	<div class="relative aspect-9/13">
		<img src={video.thumbnail} alt={video.title} class="h-full w-full object-cover" />

		<div
			class="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
		>
			<div
				class="flex h-16 w-16 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"
			>
				<Play class="ml-1 h-8 w-8 text-white" />
			</div>
		</div>

		<div
			class="absolute top-3 left-3 rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-white backdrop-blur-md"
		>
			{video.game}
		</div>

		<div class="absolute right-0 bottom-0 left-0 bg-linear-to-t from-black/80 to-transparent p-4">
			<div class="mb-2 flex items-center gap-2">
				<img
					src={video.avatar}
					alt={video.creator}
					class="h-8 w-8 rounded-full border-2 border-white/20"
				/>
				<span class="text-sm font-bold text-white">{video.creator}</span>
			</div>

			<p class="mb-2 line-clamp-2 text-sm font-bold text-white">
				{video.title}
			</p>

			<div class="flex items-center gap-4 font-mono text-xs text-white/80">
				<span>{formatNumber(video.views)} {m.views()}</span>
				<span>{formatNumber(video.likes)} {m.likes()}</span>
			</div>
		</div>
	</div>
</button>
