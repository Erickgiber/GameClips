import { supabase } from '$lib/supabase/client';
import type { Video } from '$lib/types/video.type';

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

type UserVideoRefRow = {
	video_id: string;
};

type LikeCountRow = {
	video_id: string;
};

async function getLikeCounts(videoIds: string[]) {
	if (videoIds.length === 0) return new Map<string, number>();

	const { data, error } = await supabase
		.from('video_likes')
		.select('video_id')
		.in('video_id', videoIds);

	if (error) throw new Error(error.message);

	const counts = new Map<string, number>();
	for (const row of (data as LikeCountRow[] | null) ?? []) {
		counts.set(row.video_id, (counts.get(row.video_id) ?? 0) + 1);
	}

	return counts;
}

async function getProfilesMap(userIds: string[]) {
	if (userIds.length === 0) return new Map<string, ProfileRow>();

	const { data, error } = await supabase
		.from('profiles')
		.select('id, username, avatar_url')
		.in('id', Array.from(new Set(userIds)));

	if (error) throw new Error(error.message);

	return new Map(((data as ProfileRow[] | null) ?? []).map((profile) => [profile.id, profile]));
}

function toVideoUi(video: VideoRow, profile: ProfileRow | undefined, likes: number): Video {
	return {
		id: video.id,
		user_id: video.user_id,
		title: video.title,
		video_url: video.video_url,
		thumbnail: video.thumbnail_url ?? video.video_url,
		creator: profile?.username ?? 'creator',
		avatar: profile?.avatar_url ?? 'https://placehold.co/100x100?text=GC',
		game: video.game,
		tags: video.tags ?? [],
		views: video.views_count ?? 0,
		likes,
		comments: 0,
		shares: 0,
		created_at: video.created_at
	};
}

async function enrichVideos(videos: VideoRow[]) {
	if (videos.length === 0) return [];

	const [profilesMap, likesMap] = await Promise.all([
		getProfilesMap(videos.map((video) => video.user_id)),
		getLikeCounts(videos.map((video) => video.id))
	]);

	return videos.map((video) =>
		toVideoUi(video, profilesMap.get(video.user_id), likesMap.get(video.id) ?? 0)
	);
}

export async function getVideosByProfile(userId: string, limit = 100): Promise<Video[]> {
	const { data, error } = await supabase
		.from('videos')
		.select('id, user_id, title, video_url, thumbnail_url, game, tags, views_count, created_at')
		.eq('user_id', userId)
		.order('created_at', { ascending: false })
		.limit(limit);

	if (error) throw new Error(error.message);
	return enrichVideos((data as VideoRow[] | null) ?? []);
}

export async function getSavedVideosByProfile(userId: string, limit = 100): Promise<Video[]> {
	const { data, error } = await supabase
		.from('saved_videos')
		.select('video_id')
		.eq('user_id', userId)
		.order('created_at', { ascending: false })
		.limit(limit);

	if (error) throw new Error(error.message);

	const videoIds = ((data as UserVideoRefRow[] | null) ?? []).map((row) => row.video_id);
	if (videoIds.length === 0) return [];

	const { data: videosData, error: videosError } = await supabase
		.from('videos')
		.select('id, user_id, title, video_url, thumbnail_url, game, tags, views_count, created_at')
		.in('id', videoIds);

	if (videosError) throw new Error(videosError.message);

	const videosById = new Map(
		((videosData as VideoRow[] | null) ?? []).map((video) => [video.id, video])
	);
	const orderedVideos = videoIds
		.map((id) => videosById.get(id))
		.filter((video): video is VideoRow => Boolean(video));

	return enrichVideos(orderedVideos);
}

export async function getLikedVideosByProfile(userId: string, limit = 100): Promise<Video[]> {
	const { data, error } = await supabase
		.from('video_likes')
		.select('video_id')
		.eq('user_id', userId)
		.order('created_at', { ascending: false })
		.limit(limit);

	if (error) throw new Error(error.message);

	const videoIds = ((data as UserVideoRefRow[] | null) ?? []).map((row) => row.video_id);
	if (videoIds.length === 0) return [];

	const { data: videosData, error: videosError } = await supabase
		.from('videos')
		.select('id, user_id, title, video_url, thumbnail_url, game, tags, views_count, created_at')
		.in('id', videoIds);

	if (videosError) throw new Error(videosError.message);

	const videosById = new Map(
		((videosData as VideoRow[] | null) ?? []).map((video) => [video.id, video])
	);
	const orderedVideos = videoIds
		.map((id) => videosById.get(id))
		.filter((video): video is VideoRow => Boolean(video));

	return enrichVideos(orderedVideos);
}
