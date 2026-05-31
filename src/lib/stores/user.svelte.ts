import type { User } from '$lib/types/user.type';

const userInitial: User = {
	authenticated: false
};

export const user: User = $state(userInitial);
