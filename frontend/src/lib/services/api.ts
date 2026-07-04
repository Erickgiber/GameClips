import { env } from '$env/dynamic/public';
import { supabase } from '$lib/supabase/client';

const API_BASE = (env.PUBLIC_API_URL || 'http://localhost:3000') + '/api';

export async function request(path: string, options: RequestInit = {}): Promise<any> {
	const headers = new Headers(options.headers);

	// Get current active session from frontend Supabase SDK (handles auto-refresh natively)
	const { data: { session } } = await supabase.auth.getSession();
	if (session?.access_token) {
		headers.set('Authorization', `Bearer ${session.access_token}`);
	}

	if (!headers.has('Content-Type') && !(options.body instanceof FormData) && !(options.body instanceof ArrayBuffer) && !(options.body instanceof Blob)) {
		headers.set('Content-Type', 'application/json');
	}

	const response = await fetch(`${API_BASE}${path}`, {
		...options,
		headers
	});

	if (!response.ok) {
		let errMsg = `HTTP ${response.status}: ${response.statusText}`;
		try {
			const errBody = await response.json();
			if (errBody?.error) errMsg = errBody.error;
			else if (errBody?.message) errMsg = errBody.message;
		} catch {
			// ignore
		}
		throw new Error(errMsg);
	}

	if (response.status === 204) return null;
	const text = await response.text();
	return text ? JSON.parse(text) : null;
}

export const api = {
	get: (path: string, options?: RequestInit) => request(path, { ...options, method: 'GET' }),
	post: (path: string, body?: any, options?: RequestInit) => {
		const isBinary = body instanceof ArrayBuffer || body instanceof Blob;
		return request(path, {
			...options,
			method: 'POST',
			body: isBinary ? body : JSON.stringify(body)
		});
	},
	patch: (path: string, body?: any, options?: RequestInit) => {
		const isBinary = body instanceof ArrayBuffer || body instanceof Blob;
		return request(path, {
			...options,
			method: 'PATCH',
			body: isBinary ? body : JSON.stringify(body)
		});
	},
	delete: (path: string, options?: RequestInit) => request(path, { ...options, method: 'DELETE' })
};
