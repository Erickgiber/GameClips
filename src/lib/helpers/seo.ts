type RouteSeoInput = {
	pathname: string;
	routeId: string | null;
	params: Record<string, string>;
	origin: string;
	locale?: ReturnType<typeof getLocale>;
};

import { m } from '$lib/paraglide/messages';

import { getLocale } from '$lib/paraglide/runtime';

export type SeoMetadata = {
	title: string;
	description: string;
	canonical: string;
	robots: string;
	ogType: 'website' | 'profile';
	twitterCard: 'summary';
	keywords: string[];
	profileUsername?: string;
};

const SITE_NAME = 'GameClips';

const INDEX_ROBOTS = 'index, follow';
const NOINDEX_ROBOTS = 'noindex, nofollow';

function getKeywords(locale: ReturnType<typeof getLocale>) {
	if (locale === 'es') {
		return ['clips de juegos', 'highlights gaming', 'clips de esports', 'plataforma para creadores'];
	}

	return ['game clips', 'gaming highlights', 'esports clips', 'creator platform'];
}

function buildCanonical(origin: string, pathname: string) {
	const normalizedPath = pathname !== '/' ? pathname.replace(/\/+$/, '') : pathname;
	return new URL(normalizedPath || '/', origin).toString();
}

function buildSeoPage(input: RouteSeoInput): Omit<SeoMetadata, 'canonical'> {
	const locale = input.locale ?? getLocale();
	const defaultKeywords = getKeywords(locale);
	const defaultDescription = m['seo.default_description']({}, { locale });

	switch (input.routeId) {
		case '/':
			return {
				title: SITE_NAME,
				description: defaultDescription,
				robots: INDEX_ROBOTS,
				ogType: 'website',
				twitterCard: 'summary',
				keywords:
					locale === 'es'
						? [...defaultKeywords, 'comunidad gamer', 'clips en tendencia']
						: [...defaultKeywords, 'gaming community', 'trending clips']
			};

		case '/discover':
			return {
				title: m['seo.discover_title']({}, { locale }),
				description: m['seo.discover_description']({}, { locale }),
				robots: INDEX_ROBOTS,
				ogType: 'website',
				twitterCard: 'summary',
				keywords:
					locale === 'es'
						? [...defaultKeywords, 'descubrir creadores', 'juegos en tendencia', 'clips virales gaming']
						: [...defaultKeywords, 'discover creators', 'trending games', 'viral gaming clips']
			};

		case '/create':
			return {
				title: m['seo.create_title']({}, { locale }),
				description: m['seo.create_description']({}, { locale }),
				robots: NOINDEX_ROBOTS,
				ogType: 'website',
				twitterCard: 'summary',
				keywords:
					locale === 'es'
						? [...defaultKeywords, 'subir clips gaming', 'editor de clips', 'publicar highlights']
						: [...defaultKeywords, 'upload gaming clips', 'clip editor', 'publish highlights']
			};

		case '/inbox':
			return {
				title: m['seo.inbox_title']({}, { locale }),
				description: m['seo.inbox_description']({}, { locale }),
				robots: NOINDEX_ROBOTS,
				ogType: 'website',
				twitterCard: 'summary',
				keywords:
					locale === 'es'
						? [...defaultKeywords, 'bandeja de creador', 'actividad de comunidad', 'notificaciones gaming']
						: [...defaultKeywords, 'creator inbox', 'community activity', 'gaming notifications']
			};

		case '/(auth)/login':
			return {
				title: m['seo.login_title']({}, { locale }),
				description: m['seo.login_description']({}, { locale }),
				robots: NOINDEX_ROBOTS,
				ogType: 'website',
				twitterCard: 'summary',
				keywords: locale === 'es' ? [...defaultKeywords, 'iniciar sesión', 'acceso a cuenta'] : [...defaultKeywords, 'login', 'account access']
			};

		case '/(auth)/register':
			return {
				title: m['seo.register_title']({}, { locale }),
				description: m['seo.register_description']({}, { locale }),
				robots: NOINDEX_ROBOTS,
				ogType: 'website',
				twitterCard: 'summary',
				keywords:
					locale === 'es'
						? [...defaultKeywords, 'registro', 'crear cuenta', 'perfil de creador gaming']
						: [...defaultKeywords, 'sign up', 'create account', 'gaming creator profile']
			};

		case '/(auth)/forgot-password':
			return {
				title: m['seo.forgot_password_title']({}, { locale }),
				description: m['seo.forgot_password_description']({}, { locale }),
				robots: NOINDEX_ROBOTS,
				ogType: 'website',
				twitterCard: 'summary',
				keywords:
					locale === 'es'
						? [...defaultKeywords, 'restablecer contraseña', 'recuperar cuenta']
						: [...defaultKeywords, 'password reset', 'account recovery']
			};

		case '/demo':
			return {
				title: m['seo.demo_title']({}, { locale }),
				description: m['seo.demo_description']({}, { locale }),
				robots: NOINDEX_ROBOTS,
				ogType: 'website',
				twitterCard: 'summary',
				keywords: locale === 'es' ? [...defaultKeywords, 'demo', 'prototipo'] : [...defaultKeywords, 'demo', 'prototype']
			};

		case '/demo/paraglide':
			return {
				title: m['seo.paraglide_title']({}, { locale }),
				description: m['seo.paraglide_description']({}, { locale }),
				robots: NOINDEX_ROBOTS,
				ogType: 'website',
				twitterCard: 'summary',
				keywords:
					locale === 'es'
						? [...defaultKeywords, 'paraglide', 'demo i18n', 'localización']
						: [...defaultKeywords, 'paraglide', 'i18n demo', 'localization']
			};

		case '/[username]': {
			const username = input.params.username?.trim() || 'Creator';
			const profileUsername = `@${username}`;
			return {
				title: m['seo.profile_title']({ username: profileUsername }, { locale }),
				description: m['seo.profile_description']({ username: profileUsername }, { locale }),
				robots: INDEX_ROBOTS,
				ogType: 'profile',
				twitterCard: 'summary',
				keywords:
					locale === 'es'
						? [...defaultKeywords, username, 'perfil de creador', 'creador gaming']
						: [...defaultKeywords, username, 'creator profile', 'gaming creator'],
				profileUsername: username
			};
		}

		default:
			return {
				title: SITE_NAME,
				description: defaultDescription,
				robots: INDEX_ROBOTS,
				ogType: 'website',
				twitterCard: 'summary',
				keywords: defaultKeywords
			};
	}
}

export function buildSeoMetadata(input: RouteSeoInput): SeoMetadata {
	const pageSeo = buildSeoPage(input);

	return {
		...pageSeo,
		canonical: buildCanonical(input.origin, input.pathname)
	};
}