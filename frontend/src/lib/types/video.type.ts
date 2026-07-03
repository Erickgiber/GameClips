export type Video = {
	id: string;
	user_id: string;
	title: string;
	video_url: string;
	thumbnail: string;
	creator: string;
	avatar: string;
	game: string;
	tags: string[];
	views: number;
	likes: number;
	comments: number;
	shares: number;
	created_at: string;
};
