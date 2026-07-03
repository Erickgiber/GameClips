type StorageValue = string | null;

const REMEMBER_ME_KEY = 'gc.auth.remember_me';
let rememberMePreference = false;

type AsyncStorage = {
	getItem: (key: string) => Promise<StorageValue>;
	setItem: (key: string, value: string) => Promise<void>;
	removeItem: (key: string) => Promise<void>;
};

type PreferencesAdapter = {
	get: (key: string) => Promise<StorageValue>;
	set: (key: string, value: string) => Promise<void>;
	remove: (key: string) => Promise<void>;
};

async function getPreferencesAdapter(): Promise<PreferencesAdapter | null> {
	if (typeof window === 'undefined') return null;

	try {
		const { Preferences } = await import('@capacitor/preferences');

		// Return plain functions to avoid Promise trying to access `Preferences.then` on web.
		return {
			get: async (key) => {
				const { value } = await Preferences.get({ key });
				return value;
			},
			set: async (key, value) => {
				await Preferences.set({ key, value });
			},
			remove: async (key) => {
				await Preferences.remove({ key });
			}
		};
	} catch {
		return null;
	}
}

function getWebStorage(): Storage | null {
	if (typeof window === 'undefined') return null;

	try {
		return window.localStorage;
	} catch {
		return null;
	}
}

function getSessionStorage(): Storage | null {
	if (typeof window === 'undefined') return null;

	try {
		return window.sessionStorage;
	} catch {
		return null;
	}
}

async function writeRememberMePreference(value: boolean) {
	rememberMePreference = value;

	const preferences = await getPreferencesAdapter();
	if (preferences) {
		await preferences.set(REMEMBER_ME_KEY, value ? 'true' : 'false');
	}

	getWebStorage()?.setItem(REMEMBER_ME_KEY, value ? 'true' : 'false');
}

async function readRememberMePreference() {
	const preferences = await getPreferencesAdapter();
	const fromPreferences = preferences ? await preferences.get(REMEMBER_ME_KEY) : null;

	if (fromPreferences !== null) {
		rememberMePreference = fromPreferences === 'true';
		return;
	}

	const fromWebStorage = getWebStorage()?.getItem(REMEMBER_ME_KEY);
	rememberMePreference = fromWebStorage === 'true';
}

export async function setAuthRememberMe(remember: boolean) {
	await writeRememberMePreference(remember);
}

export async function initializeAuthRememberPreference() {
	await readRememberMePreference();
}

export const capacitorAuthStorage: AsyncStorage = {
	async getItem(key) {
		const inSession = getSessionStorage()?.getItem(key) ?? null;
		if (inSession !== null) return inSession;

		await readRememberMePreference();
		if (!rememberMePreference) {
			return null;
		}

		const preferences = await getPreferencesAdapter();
		if (preferences) {
			const value = await preferences.get(key);
			if (value !== null) return value;
		}

		return getWebStorage()?.getItem(key) ?? null;
	},
	async setItem(key, value) {
		await readRememberMePreference();

		if (!rememberMePreference) {
			getSessionStorage()?.setItem(key, value);

			const preferences = await getPreferencesAdapter();
			if (preferences) {
				await preferences.remove(key);
			}

			getWebStorage()?.removeItem(key);
			return;
		}

		const preferences = await getPreferencesAdapter();
		if (preferences) {
			await preferences.set(key, value);
			getSessionStorage()?.removeItem(key);
			return;
		}

		getWebStorage()?.setItem(key, value);
		getSessionStorage()?.removeItem(key);
	},
	async removeItem(key) {
		getSessionStorage()?.removeItem(key);

		const preferences = await getPreferencesAdapter();
		if (preferences) {
			await preferences.remove(key);
		}

		getWebStorage()?.removeItem(key);
	}
};
