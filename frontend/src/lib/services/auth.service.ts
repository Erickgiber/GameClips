import { supabase } from '$lib/supabase/client';
import { api } from './api.js';

export type AuthCredentials = {
	email: string;
	password: string;
};

export type RegisterPayload = AuthCredentials & {
	username: string;
};

export async function signInWithEmail(credentials: AuthCredentials) {
	return await api.post('/auth/login', credentials);
}

export async function registerWithEmail(payload: RegisterPayload) {
	return await api.post('/auth/register', payload);
}

export async function signOut() {
	try {
		await api.post('/auth/logout');
	} catch {
		// Ignore API sign-out failures
	}
	const { error } = await supabase.auth.signOut();
	if (error) throw new Error(error.message);
}

export async function updatePassword(password: string) {
	return await api.post('/auth/update-password', { password });
}

export async function getMfaStatus() {
	return await api.get('/auth/mfa/status');
}

export async function enrollMfa() {
	return await api.post('/auth/mfa/enroll');
}

export async function verifyMfa(factorId: string, code: string) {
	return await api.post('/auth/mfa/verify', { factorId, code });
}

export async function unenrollMfa(factorId: string) {
	return await api.post('/auth/mfa/unenroll', { factorId });
}

export async function getLinkedIdentities() {
	return await api.get('/auth/identities');
}

export async function linkIdentity(provider: string) {
	const data = await api.post('/auth/identities/link', { provider });
	if (data?.url) {
		window.location.href = data.url;
	}
	return data;
}

export async function unlinkIdentity(identity: unknown) {
	return await api.post('/auth/identities/unlink', { identity });
}

export async function getPasskeys() {
	return await api.get('/auth/passkeys');
}

export async function enrollPasskey() {
	const { data, error } = await supabase.auth.registerPasskey();
	if (error) throw new Error(error.message);
	return data;
}

export async function deletePasskey(passkeyId: string) {
	return await api.post('/auth/passkeys/delete', { passkeyId });
}

export async function signInWithPasskeyService() {
	const { data, error } = await supabase.auth.signInWithPasskey();
	if (error) throw new Error(error.message);
	return data;
}
