import { supabase } from '$lib/supabase/client';
import type { Provider, Identity } from '@supabase/supabase-js';
// import { ensureProfileForUser } from '$lib/services/profile.service';

export type AuthCredentials = {
	email: string;
	password: string;
};

export type RegisterPayload = AuthCredentials & {
	username: string;
};

function usernameFromEmail(email: string): string {
	return email.split('@')[0] || 'player';
}

export async function signInWithEmail(credentials: AuthCredentials) {
	const { email, password } = credentials;
	const { data, error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) throw new Error(error.message);
	return data;
}

export async function registerWithEmail(payload: RegisterPayload) {
	const username = payload.username?.trim() || usernameFromEmail(payload.email);
	const { data, error } = await supabase.auth.signUp({
		email: payload.email,
		password: payload.password,
		options: {
			data: {
				username
			}
		}
	});

	if (error) throw new Error(error.message);

	// if (data.user) {
	// 	await ensureProfileForUser({
	// 		id: data.user.id,
	// 		username
	// 	});
	// }

	return data;
}

export async function signOut() {
	const { error } = await supabase.auth.signOut();
	if (error) throw new Error(error.message);
}

export async function updatePassword(password: string) {
	const { error } = await supabase.auth.updateUser({ password });
	if (error) throw new Error(error.message);
}

export async function getMfaStatus() {
	const { data, error } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel();
	if (error) throw new Error(error.message);
	
	const { data: factorsData, error: factorsError } = await supabase.auth.mfa.listFactors();
	if (factorsError) throw new Error(factorsError.message);
	
	// find the verified totp factor
	const totpFactor = factorsData.totp.find((f) => f.status === 'verified');
	
	return {
		aal: data,
		isEnrolled: !!totpFactor,
		factorId: totpFactor?.id
	};
}

export async function enrollMfa() {
	const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
	if (error) throw new Error(error.message);
	return data;
}

export async function verifyMfa(factorId: string, code: string) {
	const challenge = await supabase.auth.mfa.challenge({ factorId });
	if (challenge.error) throw new Error(challenge.error.message);

	const verify = await supabase.auth.mfa.verify({
		factorId,
		challengeId: challenge.data.id,
		code
	});
	if (verify.error) throw new Error(verify.error.message);
	return verify.data;
}

export async function unenrollMfa(factorId: string) {
	const { error } = await supabase.auth.mfa.unenroll({ factorId });
	if (error) throw new Error(error.message);
}

export async function getLinkedIdentities() {
	const { data, error } = await supabase.auth.getUserIdentities();
	if (error) throw new Error(error.message);
	// Handle object vs array response depending on Supabase version
	return Array.isArray(data) ? data : (data?.identities || []);
}

export async function linkIdentity(provider: Provider) {
	const { data, error } = await supabase.auth.linkIdentity({ provider });
	if (error) throw new Error(error.message);
	return data;
}

export async function unlinkIdentity(identity: Identity) {
	const { error } = await supabase.auth.unlinkIdentity(identity);
	if (error) throw new Error(error.message);
}

export async function getPasskeys() {
	const { data, error } = await supabase.auth.passkey.list();
	if (error) throw new Error(error.message);
	return data || [];
}

export async function enrollPasskey() {
	const { data, error } = await supabase.auth.registerPasskey();
	if (error) throw new Error(error.message);
	return data;
}

export async function deletePasskey(passkeyId: string) {
	const { error } = await supabase.auth.passkey.delete({ passkeyId });
	if (error) throw new Error(error.message);
}

export async function signInWithPasskeyService() {
	const { data, error } = await supabase.auth.signInWithPasskey();
	if (error) throw new Error(error.message);
	return data;
}
