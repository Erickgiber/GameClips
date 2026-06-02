import type { User } from '$lib/types/user.type';

export const offlineUserMock: User = {
	authenticated: false,
	username: 'offline_player',
	email: 'offline@example.com',
	name: 'Offline Player',
	description: 'Offline test profile for local UI checks without network.',
	title: 'Guest User',
	role: 'customer',
	dedication: 'Offline tester',
	avatar_url: 'https://placehold.co/256x256?text=Offline',
	followers_count: 0,
	following_count: 0,
	videos_count: 0,
	likes_count: 0,
	saved_videos_count: 0,
	liked_videos_count: 0,
	sponsored_by: []
};
