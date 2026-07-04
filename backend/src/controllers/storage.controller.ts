import type { Response } from 'express';
import type { AuthenticatedRequest } from '../middleware/auth.js';
import { getSupabaseUserClient } from '../lib/supabase-user.js';

/**
 * POST /api/storage/upload/:bucket
 * Uploads a binary file to the specified Supabase storage bucket.
 * Expects the raw file buffer in the request body, and headers:
 * - x-file-name: The target file name
 * - x-content-type: The MIME type of the file
 */
export async function uploadFile(req: AuthenticatedRequest, res: Response): Promise<void> {
	const { user } = req;
	const bucket = req.params.bucket as string;
	const rawFileName = req.headers['x-file-name'];
	const fileName = (Array.isArray(rawFileName) ? rawFileName[0] : rawFileName) as string;
	const rawContentType = req.headers['x-content-type'];
	const contentType = (Array.isArray(rawContentType) ? rawContentType[0] : rawContentType) as string;

	if (!bucket) {
		res.status(400).json({ error: 'Bucket parameter is required' });
		return;
	}

	if (!fileName || typeof fileName !== 'string') {
		res.status(400).json({ error: 'x-file-name header is required and must be a string' });
		return;
	}

	if (!req.body || !(req.body instanceof Buffer)) {
		res.status(400).json({ error: 'Request body must be a raw binary buffer' });
		return;
	}

	try {
		const token = req.headers.authorization!.slice(7);
		const userClient = getSupabaseUserClient(token);

		// Validations: prevent directory traversal or uploading to other users' directories
		const userPrefix = `${user.id}/`;
		if (!fileName.startsWith(userPrefix)) {
			res.status(403).json({ error: 'You are only allowed to upload files to your own folder' });
			return;
		}

		// For avatar uploads, we try to remove the old avatar first (similar to frontend service)
		if (bucket === 'avatars') {
			await userClient.storage.from(bucket).remove([fileName]);
		}

		const { error: uploadError } = await userClient.storage
			.from(bucket)
			.upload(fileName, req.body, {
				cacheControl: '3600',
				upsert: true,
				contentType: contentType || 'application/octet-stream'
			});

		if (uploadError) throw uploadError;

		const { data } = userClient.storage.from(bucket).getPublicUrl(fileName);

		res.status(200).json({
			path: fileName,
			publicUrl: data.publicUrl
		});
	} catch (error: any) {
		console.error(`[uploadFile] Error uploading to storage:`, error);
		res.status(500).json({ error: error.message || 'Failed to upload file to storage' });
	}
}
