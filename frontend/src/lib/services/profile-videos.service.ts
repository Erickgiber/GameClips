import type { Video } from '$lib/types/video.type';
import { api } from './api.js';

export async function getVideosByProfile(userId: string, limit = 100): Promise<Video[]> {
	try {
		return await api.get(`/users/${userId}/videos?limit=${limit}`);
	} catch (error) {
		console.error(`[getVideosByProfile] failed for ${userId}:`, error);
		throw error;
	}
}

export async function getSavedVideosByProfile(userId: string, limit = 100): Promise<Video[]> {
	try {
		return await api.get(`/users/${userId}/saved?limit=${limit}`);
	} catch (error) {
		console.error(`[getSavedVideosByProfile] failed for ${userId}:`, error);
		throw error;
	}
}

export async function getLikedVideosByProfile(userId: string, limit = 100): Promise<Video[]> {
	try {
		return await api.get(`/users/${userId}/liked?limit=${limit}`);
	} catch (error) {
		console.error(`[getLikedVideosByProfile] failed for ${userId}:`, error);
		throw error;
	}
}
