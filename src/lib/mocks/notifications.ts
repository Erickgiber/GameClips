import type { Notification } from '$lib/types/notification.type';

export const mockNotifications: Notification[] = [
	{
		id: 'notif-1',
		type: 'comment',
		actorName: 'PixelRogue',
		actorUsername: '@pixelrogue',
		actorAvatar:
			'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&h=120&fit=crop',
		message: 'left a comment on your Apex Legends clip.',
		context: '"That final rotation was clean. Upload the full match."',
		timeLabel: '2 min ago',
		unread: true,
		href: '/demo'
	},
	{
		id: 'notif-2',
		type: 'like',
		actorName: 'NovaAim',
		actorUsername: '@novaaim',
		actorAvatar:
			'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop',
		message: 'liked your Valorant ace montage.',
		context: 'Your clip is still trending in the evening highlight feed.',
		timeLabel: '12 min ago',
		unread: true,
		href: '/discover'
	},
	{
		id: 'notif-3',
		type: 'follow',
		actorName: 'StratCaller',
		actorUsername: '@stratcaller',
		actorAvatar:
			'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop',
		message: 'started following your profile.',
		context: 'They want to get notified when you post tactical breakdowns.',
		timeLabel: '1 h ago',
		unread: false,
		href: '/discover'
	},
	{
		id: 'notif-4',
		type: 'system',
		actorName: 'GameClips',
		actorUsername: '@gameclips',
		actorAvatar:
			'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=120&h=120&fit=crop',
		message: 'featured your latest montage in Discover picks.',
		context: 'Keep the momentum going. Your reach jumped 18% this morning.',
		timeLabel: '3 h ago',
		unread: false,
		href: '/'
	}
];

export const emptyNotifications: Notification[] = [];
