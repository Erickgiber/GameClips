<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { authStatus, user } from '$lib/stores/user.svelte';

	let hasRedirected = false;

	$effect(() => {
		if (!authStatus.initialized) return;
		if (hasRedirected) return;

		hasRedirected = true;

		if (user.authenticated && user.username) {
			goto(resolve(`/${user.username}`));
		} else {
			goto(resolve('/login'));
		}
	});
</script>