import { browser } from '$app/environment';
import type { AuthChangeEvent, Session, User as SupabaseAuthUser } from '@supabase/supabase-js';
import { registerWithEmail, signInWithEmail, signOut } from '$lib/services/auth.service';
import { buildAppUserFromAuth } from '$lib/services/profile.service';
import { supabase } from '$lib/supabase/client';
import {
	initializeAuthRememberPreference,
	setAuthRememberMe
} from '$lib/supabase/capacitor-storage';
import { emptyUser } from '$lib/constants/empty-user';
import type { User } from '$lib/types/user.type';

type AuthStatus = {
	initialized: boolean;
	loading: boolean;
	error: string | null;
};

const userInitial: User = {
	...emptyUser,
	authenticated: false
};

let hasInitializedAuth = false;
let authSubscription: { unsubscribe: () => void } | null = null;

export const user: User = $state(userInitial);
export const authStatus: AuthStatus = $state({
	initialized: false,
	loading: false,
	error: null
});

function resetUserState() {
	Object.assign(user, {
		...emptyUser,
		authenticated: false,
		id: undefined
	});
}

async function applyAuthUser(authUser: SupabaseAuthUser | null) {
	if (!authUser) {
		resetUserState();
		return;
	}

	const mappedUser = await buildAppUserFromAuth(authUser);
	Object.assign(user, mappedUser);
}

async function syncSession(session: Session | null) {
	try {
		authStatus.error = null;
		await applyAuthUser(session?.user ?? null);
	} catch (error) {
		authStatus.error = error instanceof Error ? error.message : 'Unable to sync session';
		resetUserState();
	}
}

function ensureAuthListener() {
	if (authSubscription) return;

	authSubscription = supabase.auth.onAuthStateChange(
		(_event: AuthChangeEvent, session: Session | null) => {
			void syncSession(session);
		}
	).data.subscription;
}

export async function initializeAuthState() {
	if (!browser || hasInitializedAuth) return;

	hasInitializedAuth = true;
	authStatus.loading = true;

	try {
		await initializeAuthRememberPreference();

		const {
			data: { session },
			error
		} = await supabase.auth.getSession();

		if (error) throw error;

		await syncSession(session);
		ensureAuthListener();
	} catch (error) {
		authStatus.error = error instanceof Error ? error.message : 'Unable to initialize auth';
		resetUserState();
	} finally {
		authStatus.loading = false;
		authStatus.initialized = true;
	}
}

export async function loginWithEmail(payload: {
	email: string;
	password: string;
	rememberMe: boolean;
}) {
	authStatus.loading = true;
	authStatus.error = null;

	try {
		await setAuthRememberMe(payload.rememberMe);

		const data = await signInWithEmail(payload);
		await syncSession(data.session ?? null);
	} catch (error) {
		authStatus.error = error instanceof Error ? error.message : 'Unable to sign in';
		throw error;
	} finally {
		authStatus.loading = false;
	}
}

export async function registerWithEmailPassword(payload: {
	email: string;
	password: string;
	username: string;
}) {
	authStatus.loading = true;
	authStatus.error = null;

	try {
		const data = await registerWithEmail(payload);
		await syncSession(data.session ?? null);
		return data;
	} catch (error) {
		authStatus.error = error instanceof Error ? error.message : 'Unable to register';
		throw error;
	} finally {
		authStatus.loading = false;
	}
}

export async function logoutUser() {
	authStatus.loading = true;

	try {
		await signOut();
		resetUserState();
	} finally {
		authStatus.loading = false;
	}
}
