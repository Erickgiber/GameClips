import { supabase } from '$lib/supabase/client';
import type { Notification } from '$lib/types/notification.type';

type NotificationRow = {
	id: string;
	message: string;
	read: boolean;
	created_at: string;
};

function relativeTimeLabel(dateIso: string): string {
	const date = new Date(dateIso);
	const now = Date.now();
	const diffMs = Math.max(0, now - date.getTime());
	const minutes = Math.floor(diffMs / 60000);

	if (minutes < 1) return 'just now';
	if (minutes < 60) return `${minutes} min ago`;

	const hours = Math.floor(minutes / 60);
	if (hours < 24) return `${hours} h ago`;

	const days = Math.floor(hours / 24);
	return `${days} d ago`;
}

export async function getNotifications(): Promise<Notification[]> {
	const {
		data: { user },
		error: authError
	} = await supabase.auth.getUser();

	if (authError) throw new Error(authError.message);
	if (!user) return [];

	const { data, error } = await supabase
		.from('notifications')
		.select('id, message, read, created_at')
		.eq('user_id', user.id)
		.order('created_at', { ascending: false });

	if (error) throw new Error(error.message);

	return ((data as NotificationRow[] | null) ?? []).map((row) => ({
		id: row.id,
		type: 'system',
		actorName: 'GameClips',
		actorUsername: '@gameclips',
		actorAvatar: 'https://placehold.co/120x120?text=GC',
		message: row.message,
		timeLabel: relativeTimeLabel(row.created_at),
		unread: !row.read,
		href: '/notifications'
	}));
}
