import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { supabase } from '../lib/supabase.js';

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

/**
 * GET /api/notifications — Get the authenticated user's notifications
 */
export async function getNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
	const { user } = req;

	try {
		const { data, error } = await supabase
			.from('notifications')
			.select('id, message, read, created_at')
			.eq('user_id', user.id)
			.order('created_at', { ascending: false });

		if (error) throw new Error(error.message);

		const mapped = ((data as NotificationRow[] | null) ?? []).map((row) => ({
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

		res.json(mapped);
	} catch (error: unknown) {
		console.error('[getNotifications] Error:', error);
		res.status(500).json({ error: (error as Error).message || 'Failed to fetch notifications' });
	}
}
