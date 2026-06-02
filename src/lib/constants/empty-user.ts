import type { User } from '$lib/types/user.type';

export const emptyUser: User = {
	authenticated: false,
	username: '',
	email: '',
	name: null,
	description: null,
	title: '',
	role: '',
	dedication: null,
	avatar_url: null,
	followers_count: 0,
	following_count: 0,
	videos_count: 0,
	likes_count: 0,
	saved_videos_count: 0,
	liked_videos_count: 0,
	sponsored_by: []
};