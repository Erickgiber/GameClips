import { env } from '$env/dynamic/public';
import { supabase } from '$lib/supabase/client';

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

export async function uploadVideoToStorage(payload: UploadableVideo, params: UploadVideoParams = {}) {
	const bucket = env.PUBLIC_SUPABASE_STORAGE_BUCKET || 'game-clips';

	const {
		data: { user },
		error: authError
	} = await supabase.auth.getUser();

	if (authError) throw new Error(authError.message);

	const ownerId = params.userId ?? user?.id;
	if (!ownerId) {
		throw new Error('A signed-in user is required to upload videos.');
	}

	const extension = buildFileExt(params, payload);
	const fileName = params.fileName ?? `${Date.now()}-${crypto.randomUUID()}.${extension}`;
	const storagePath = `${ownerId}/${fileName}`;
	const uploadBody = buildUploadBody(payload);

	const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, uploadBody, {
		cacheControl: '3600',
		upsert: false,
		contentType:
			params.contentType ??
			(payload instanceof Blob && payload.type ? payload.type : 'video/mp4')
	});

	if (uploadError) throw new Error(uploadError.message);

	const {
		data: { publicUrl }
	} = supabase.storage.from(bucket).getPublicUrl(storagePath);

	return {
		path: storagePath,
		publicUrl
	};
}
