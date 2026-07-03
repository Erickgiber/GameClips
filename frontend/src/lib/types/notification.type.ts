export type NotificationType = 'comment' | 'like' | 'follow' | 'system';

export type Notification = {
	id: string;
	type: NotificationType;
	actorName: string;
	actorUsername: string;
	actorAvatar: string;
	message: string;
	context?: string;
	timeLabel: string;
	unread: boolean;
	href: string;
};
