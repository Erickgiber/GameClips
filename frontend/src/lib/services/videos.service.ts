import { supabase } from '$lib/supabase/client';
import type { Video } from '$lib/types/video.type';

type VideoFeedRow = {
	id: string;
	user_id: string;
	title: string;
	video_url: string;
	thumbnail_url: string;
	game: string;
	tags: string[];
	views_count: number;
	likes_count: number;
	created_at: string;
	username: string | null;
	avatar_url: string | null;
};

type VideoRow = {
	id: string;
	user_id: string;
	title: string;
	video_url: string;
	thumbnail_url: string | null;
	game: string;
	tags: string[];
	views_count: number;
	created_at: string;
};

type ProfileRow = {
	id: string;
	username: string;
	avatar_url: string | null;
};

type LikeCountRow = {
	video_id: string;
};

function mapVideoRowToUi(video: {
	id: string;
	user_id: string;
	title: string;
	video_url: string;
	thumbnail_url?: string | null;
	game?: string | null;
	tags?: string[] | null;
	views_count?: number | null;
	likes_count?: number | null;
	created_at: string;
	creator?: string | null;
	avatar?: string | null;
}): Video {
	return {
		id: video.id,
		user_id: video.user_id,
		title: video.title,
		video_url: video.video_url,
		thumbnail: video.thumbnail_url ?? video.video_url,
		creator: video.creator ?? 'creator',
		avatar: video.avatar ?? 'https://placehold.co/100x100?text=GC',
		game: video.game ?? 'Game Clip',
		tags: video.tags ?? [],
		views: video.views_count ?? 0,
		likes: video.likes_count ?? 0,
		comments: 0,
		shares: 0,
		created_at: video.created_at
	};
}

export async function getVideos(limit = 30): Promise<Video[]> {
	const { data: rpcData, error: rpcError } = await supabase.rpc('get_videos_feed', {
		p_limit: limit
	});

	if (!rpcError) {
		return ((rpcData as VideoFeedRow[] | null) ?? []).map((video) =>
			mapVideoRowToUi({
				...video,
				creator: video.username,
				avatar: video.avatar_url
			})
		);
	}

	if (rpcError.code !== '42883' && rpcError.code !== 'PGRST202') {
		throw new Error(rpcError.message);
	}

	// Fallback for environments where migration with RPC function has not been applied yet.
	const { data: videosData, error: videosError } = await supabase
		.from('videos')
		.select('id, user_id, title, video_url, thumbnail_url, game, tags, views_count, created_at')
		.order('created_at', { ascending: false })
		.limit(limit);

	if (videosError) throw new Error(videosError.message);

	const videos = (videosData as VideoRow[] | null) ?? [];
	if (videos.length === 0) return [];

	const userIds = Array.from(new Set(videos.map((video) => video.user_id)));

	const { data: profilesData, error: profilesError } = await supabase
		.from('profiles')
		.select('id, username, avatar_url')
		.in('id', userIds);

	if (profilesError) throw new Error(profilesError.message);

	const profilesMap = new Map(
		((profilesData as ProfileRow[] | null) ?? []).map((profile) => [profile.id, profile])
	);

	const videoIds = videos.map((video) => video.id);
	const { data: likesData, error: likesError } = await supabase
		.from('video_likes')
		.select('video_id')
		.in('video_id', videoIds);

	if (likesError) throw new Error(likesError.message);

	const likesMap = new Map<string, number>();
	for (const row of (likesData as LikeCountRow[] | null) ?? []) {
		likesMap.set(row.video_id, (likesMap.get(row.video_id) ?? 0) + 1);
	}

	return videos.map((video) => {
		const profile = profilesMap.get(video.user_id);

		const likesCount = likesMap.get(video.id) ?? 0;

		return mapVideoRowToUi({
			...video,
			likes_count: likesCount,
			creator: profile?.username,
			avatar: profile?.avatar_url
		});
	});
}
