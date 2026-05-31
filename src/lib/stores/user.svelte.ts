import type { User } from '$lib/types/user.type';

const userInitial: User = {
	authenticated: true,
	username: 'erickgiber',
	email: 'erickgiber7@gmail.com',
	name: 'Erick Ramirez',
	description: '🎮 Radiant League of Legends Player | 🏆 Tournament Champion | 📺 Streaming Daily',
	title: 'Professional Esports Player',
	role: 'customer',
	dedication: 'Content Creator',
	avatar_url: 'https://i.ibb.co/MkfnJMF/c626c26ad861.jpg',
	followers_count: 1200,
	following_count: 300,
	videos_count: 50,
	likes_count: 5000,
	saved_videos_count: 3,
	liked_videos_count: 10,
	sponsored_by: ['ESPN Esports', 'Red Bull', 'Logitech G']
};

export const user: User = $state(userInitial);
