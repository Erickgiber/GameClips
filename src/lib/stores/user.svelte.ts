import type { User } from '$lib/types/user.type';

const userInitial: User = {
	authenticated: true
};

export const user: User = $state(userInitial);
