import { getVideos } from '$lib/services/videos.service';
import type { Video } from '$lib/types/video.type';

export const videosState = $state({
	items: [] as Video[],
	loading: false,
	error: null as string | null
});

export async function loadVideos(limit = 30) {
	videosState.loading = true;
	videosState.error = null;

	try {
		videosState.items = await getVideos(limit);
	} catch (error) {
		videosState.error = error instanceof Error ? error.message : 'Unable to load videos.';
	} finally {
		videosState.loading = false;
	}
}
