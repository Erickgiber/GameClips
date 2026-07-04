import type { Notification } from '$lib/types/notification.type';
import { api } from './api.js';

export async function getNotifications(): Promise<Notification[]> {
	try {
		return await api.get('/notifications');
	} catch (error) {
		console.error('[getNotifications] failed:', error);
		return [];
	}
}
