alter table public.videos
	add column if not exists thumbnail_url text,
	add column if not exists game text not null default 'Game Clip',
	add column if not exists tags text[] not null default '{}',
	add column if not exists views_count integer not null default 0;

create index if not exists videos_created_at_idx on public.videos (created_at desc);
create index if not exists video_likes_video_id_idx on public.video_likes (video_id);

create or replace function public.get_videos_feed(p_limit integer default 30)
returns table (
	id uuid,
	user_id uuid,
	title text,
	video_url text,
	thumbnail_url text,
	game text,
	tags text[],
	views_count integer,
	likes_count integer,
	created_at timestamptz,
	username text,
	avatar_url text
)
language sql
stable
as $$
	select
		v.id,
		v.user_id,
		v.title,
		v.video_url,
		coalesce(v.thumbnail_url, v.video_url) as thumbnail_url,
		v.game,
		v.tags,
		v.views_count,
		coalesce(l.likes_count, 0)::int as likes_count,
		v.created_at,
		p.username,
		p.avatar_url
	from public.videos v
	left join public.profiles p on p.id = v.user_id
	left join lateral (
		select count(*)::int as likes_count
		from public.video_likes vl
		where vl.video_id = v.id
	) l on true
	order by v.created_at desc
	limit greatest(coalesce(p_limit, 30), 1);
$$;

grant execute on function public.get_videos_feed(integer) to anon, authenticated;
