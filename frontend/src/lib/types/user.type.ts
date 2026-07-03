export type User = {
	id?: string;
	authenticated: boolean;
	username: string;
	email: string;
	name: string | null;
	description: string | null;
	title: string;
	role: string;
	dedication: string | null;
	avatar_url: string | null;
	followers_count: number;
	following_count: number;
	videos_count: number;
	likes_count: number;
	saved_videos_count: number;
	liked_videos_count: number;
	sponsored_by?: string[];
};
