export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
	public: {
		Tables: {
			profile_roles: {
				Row: {
					id: number;
					code: string;
					label: string;
					created_at: string;
				};
				Insert: {
					id?: number;
					code: string;
					label: string;
					created_at?: string;
				};
				Update: {
					id?: number;
					code?: string;
					label?: string;
					created_at?: string;
				};
				Relationships: [];
			};
			profiles: {
				Row: {
					id: string;
					username: string;
					email: string | null;
					name: string | null;
					description: string | null;
					title: string | null;
					role: string | null;
					role_id: number;
					dedication: string | null;
					avatar_url: string | null;
					followers_count: number;
					following_count: number;
					videos_count: number;
					likes_count: number;
					saved_videos_count: number;
					liked_videos_count: number;
					sponsored_by: string[];
					created_at: string;
					updated_at: string;
				};
				Insert: {
					id: string;
					username: string;
					email?: string | null;
					name?: string | null;
					description?: string | null;
					title?: string | null;
					role?: string | null;
					role_id?: number;
					dedication?: string | null;
					avatar_url?: string | null;
					followers_count?: number;
					following_count?: number;
					videos_count?: number;
					likes_count?: number;
					saved_videos_count?: number;
					liked_videos_count?: number;
					sponsored_by?: string[];
					created_at?: string;
					updated_at?: string;
				};
				Update: {
					id?: string;
					username?: string;
					email?: string | null;
					name?: string | null;
					description?: string | null;
					title?: string | null;
					role?: string | null;
					role_id?: number;
					dedication?: string | null;
					avatar_url?: string | null;
					followers_count?: number;
					following_count?: number;
					videos_count?: number;
					likes_count?: number;
					saved_videos_count?: number;
					liked_videos_count?: number;
					sponsored_by?: string[];
					created_at?: string;
					updated_at?: string;
				};
				Relationships: [];
			};
			videos: {
				Row: {
					id: string;
					user_id: string;
					video_url: string;
					thumbnail_url: string | null;
					title: string;
					game: string;
					tags: string[];
					views_count: number;
					created_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					video_url: string;
					thumbnail_url?: string | null;
					title: string;
					game?: string;
					tags?: string[];
					views_count?: number;
					created_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					video_url?: string;
					thumbnail_url?: string | null;
					title?: string;
					game?: string;
					tags?: string[];
					views_count?: number;
					created_at?: string;
				};
				Relationships: [];
			};
			notifications: {
				Row: {
					id: string;
					user_id: string;
					message: string;
					read: boolean;
					created_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					message: string;
					read?: boolean;
					created_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					message?: string;
					read?: boolean;
					created_at?: string;
				};
				Relationships: [];
			};
			video_likes: {
				Row: {
					id: string;
					user_id: string;
					video_id: string;
					created_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					video_id: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					video_id?: string;
					created_at?: string;
				};
				Relationships: [];
			};
			saved_videos: {
				Row: {
					id: string;
					user_id: string;
					video_id: string;
					created_at: string;
				};
				Insert: {
					id?: string;
					user_id: string;
					video_id: string;
					created_at?: string;
				};
				Update: {
					id?: string;
					user_id?: string;
					video_id?: string;
					created_at?: string;
				};
				Relationships: [];
			};
			follows: {
				Row: {
					follower_id: string;
					following_id: string;
					created_at: string;
				};
				Insert: {
					follower_id: string;
					following_id: string;
					created_at?: string;
				};
				Update: {
					follower_id?: string;
					following_id?: string;
					created_at?: string;
				};
				Relationships: [];
			};
		};
		Views: Record<string, never>;
		Functions: {
			get_videos_feed: {
				Args: {
					p_limit?: number;
				};
				Returns: {
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
				}[];
			};
		};
		Enums: Record<string, never>;
		CompositeTypes: Record<string, never>;
	};
};
