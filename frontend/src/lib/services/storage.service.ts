import { env } from '$env/dynamic/public';
import { user } from '$lib/stores/user.svelte';
import { api } from './api.js';

export type UploadableVideo = Blob | File | ArrayBuffer;

export type UploadVideoParams = {
	userId?: string;
	fileName?: string;
	contentType?: string;
};

function buildFileExt(params: UploadVideoParams, payload: UploadableVideo): string {
	if (params.fileName?.includes('.')) {
		return params.fileName.split('.').pop() ?? 'mp4';
	}

	if (payload instanceof File && payload.name.includes('.')) {
		return payload.name.split('.').pop() ?? 'mp4';
	}

	return 'mp4';
}

function buildUploadBody(payload: UploadableVideo): Blob | File | ArrayBuffer {
	if (payload instanceof ArrayBuffer) return payload;
	return payload;
}

export async function uploadVideoToStorage(
	payload: UploadableVideo,
	params: UploadVideoParams = {}
) {
	const bucket = env.PUBLIC_SUPABASE_STORAGE_BUCKET || 'game-clips';

	const ownerId = params.userId ?? user.id;
	if (!ownerId) {
		throw new Error('A signed-in user is required to upload videos.');
	}

	const extension = buildFileExt(params, payload);
	const fileName = params.fileName ?? `${Date.now()}-${crypto.randomUUID()}.${extension}`;
	const storagePath = `${ownerId}/${fileName}`;
	const uploadBody = buildUploadBody(payload);
	const contentType =
		params.contentType ?? (payload instanceof Blob && payload.type ? payload.type : 'video/mp4');

	const data = await api.post<{ path: string; publicUrl: string }>(
		`/storage/upload/${bucket}`,
		uploadBody,
		{
			headers: {
				'x-file-name': storagePath,
				'x-content-type': contentType
			}
		}
	);

	return {
		path: data.path,
		publicUrl: data.publicUrl
	};
}

export async function uploadAvatarToStorage(payload: Blob | File, userId: string) {
	const bucket = 'avatars';
	const storagePath = `${userId}/avatar.png`;
	const contentType = payload.type || 'image/png';

	const data = await api.post<{ path: string; publicUrl: string }>(
		`/storage/upload/${bucket}`,
		payload,
		{
			headers: {
				'x-file-name': storagePath,
				'x-content-type': contentType
			}
		}
	);

	return {
		path: data.path,
		publicUrl: `${data.publicUrl}?t=${Date.now()}`
	};
}
