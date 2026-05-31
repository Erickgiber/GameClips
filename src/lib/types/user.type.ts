export type User = {
	id?: string;
	authenticated: boolean;
	username: string;
	email: string;
	name: string;
	description: string;
	title: string;
	role: 'customer' | 'admin' | 'moderator';
	dedication: string;
	avatar_url: string;
	followers_count: number;
	following_count: number;
	videos_count: number;
	likes_count: number;
	saved_videos_count: number;
	liked_videos_count: number;
	sponsored_by?: string[];
};
