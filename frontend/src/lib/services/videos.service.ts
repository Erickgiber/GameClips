import type { Video } from '$lib/types/video.type';
import { api } from './api.js';

export async function getVideos(limit = 30): Promise<Video[]> {
	try {
		return await api.get(`/videos/feed?limit=${limit}`);
	} catch (error) {
		console.error('[getVideos] failed:', error);
		throw error;
	}
}
