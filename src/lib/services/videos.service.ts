import { supabase } from '$lib/supabase/client';
import type { Video } from '$lib/types/video.type';

type VideoFeedRow = {
	id: string;
	user_id: string;
	title: string;
	video_url: string;
	created_at: string;
	username: string | null;
	avatar_url: string | null;
};

type VideoRow = {
	id: string;
	user_id: string;
	title: string;
	video_url: string;
	created_at: string;
};

type ProfileRow = {
	id: string;
	username: string;
	avatar_url: string | null;
};

function mapVideoRowToUi(video: {
	id: string;
	user_id: string;
	title: string;
	video_url: string;
	created_at: string;
	creator?: string | null;
	avatar?: string | null;
}): Video {
	return {
		id: video.id,
		user_id: video.user_id,
		title: video.title,
		video_url: video.video_url,
		thumbnail: video.video_url,
		creator: video.creator ?? 'creator',
		avatar: video.avatar ?? 'https://placehold.co/100x100?text=GC',
		game: 'Game Clip',
		tags: ['#gameclip'],
		views: 0,
		likes: 0,
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
		.select('id, user_id, title, video_url, created_at')
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

	return videos.map((video) => {
		const profile = profilesMap.get(video.user_id);

		return mapVideoRowToUi({
			...video,
			creator: profile?.username,
			avatar: profile?.avatar_url
		});
	});
}
