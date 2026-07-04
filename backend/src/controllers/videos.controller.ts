import type { Request, Response } from 'express';
import { supabase } from '../lib/supabase.js';

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

function mapVideo(video: {
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
}) {
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

/**
 * GET /api/videos/feed — Get the video feed
 */
export async function getVideosFeed(req: Request, res: Response): Promise<void> {
	const limit = Math.min(parseInt(req.query.limit as string) || 30, 100);

	// Try RPC function first
	const { data: rpcData, error: rpcError } = await supabase.rpc('get_videos_feed', {
		p_limit: limit
	});

	if (!rpcError) {
		const videos = ((rpcData as VideoFeedRow[] | null) ?? []).map((video) =>
			mapVideo({
				...video,
				creator: video.username,
				avatar: video.avatar_url
			})
		);
		res.json(videos);
		return;
	}

	// Fallback if RPC function doesn't exist
	if (rpcError.code !== '42883' && rpcError.code !== 'PGRST202') {
		console.error('[getVideosFeed] RPC error:', rpcError);
		res.status(500).json({ error: 'Failed to fetch videos' });
		return;
	}

	// Manual fallback query
	const { data: videosData, error: videosError } = await supabase
		.from('videos')
		.select('id, user_id, title, video_url, thumbnail_url, game, tags, views_count, created_at')
		.order('created_at', { ascending: false })
		.limit(limit);

	if (videosError) {
		console.error('[getVideosFeed] Fallback error:', videosError);
		res.status(500).json({ error: 'Failed to fetch videos' });
		return;
	}

	const videos = (videosData as VideoRow[] | null) ?? [];
	if (videos.length === 0) {
		res.json([]);
		return;
	}

	// Enrich with profiles and like counts
	const userIds = Array.from(new Set(videos.map((v) => v.user_id)));
	const videoIds = videos.map((v) => v.id);

	const [profilesResult, likesResult] = await Promise.all([
		supabase.from('profiles').select('id, username, avatar_url').in('id', userIds),
		supabase.from('video_likes').select('video_id').in('video_id', videoIds)
	]);

	const profilesMap = new Map(
		((profilesResult.data as ProfileRow[] | null) ?? []).map((p) => [p.id, p])
	);

	const likesMap = new Map<string, number>();
	for (const row of (likesResult.data as LikeCountRow[] | null) ?? []) {
		likesMap.set(row.video_id, (likesMap.get(row.video_id) ?? 0) + 1);
	}

	const enriched = videos.map((video) => {
		const profile = profilesMap.get(video.user_id);
		return mapVideo({
			...video,
			likes_count: likesMap.get(video.id) ?? 0,
			creator: profile?.username,
			avatar: profile?.avatar_url
		});
	});

	res.json(enriched);
}
