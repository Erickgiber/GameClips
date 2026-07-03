import { getNotifications } from '$lib/services/notifications.service';
import type { Notification } from '$lib/types/notification.type';

export const notificationsState = $state({
	items: [] as Notification[],
	loading: false,
	error: null as string | null
});

const unreadNotificationsCount = $derived(
	notificationsState.items.filter((notification) => notification.unread).length
);

const hasNotifications = $derived(notificationsState.items.length > 0);

export function getUnreadNotificationsCount() {
	return unreadNotificationsCount;
}

export function getHasNotifications() {
	return hasNotifications;
}

export async function loadNotifications() {
	notificationsState.loading = true;
	notificationsState.error = null;

	try {
		notificationsState.items = await getNotifications();
	} catch (error) {
		notificationsState.error =
			error instanceof Error ? error.message : 'Unable to load notifications.';
	} finally {
		notificationsState.loading = false;
	}
}

export function clearNotifications() {
	notificationsState.items = [];
	notificationsState.error = null;
}
