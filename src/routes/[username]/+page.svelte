<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	import ViewLoader from '$lib/components/ui/ViewLoader.svelte';
	import Profile from '$lib/components/views/profile/Profile.svelte';

	import { client } from '$lib/stores/isClient.svelte';
	import { user } from '$lib/stores/user.svelte';
	import { getProfileByUsername } from '$lib/services/profile.service';
	import type { User } from '$lib/types/user.type';

	const username = page.params.username;

	const isSelfProfile = $derived(username === user.username);

	let isLoaded = $state(false);
	let fetchedProfile: User | null = $state(null);

	const userProfile = $derived(isSelfProfile ? user : fetchedProfile);

	async function loadProfile() {
		if (!browser) return;
		if (!username) {
			isLoaded = true;
			return;
		}

		try {
			if (isSelfProfile) {
				isLoaded = true;
				return;
			}

			fetchedProfile = await getProfileByUsername(username);
		} catch (error) {
			console.error('Error fetching profile:', error);
		} finally {
			isLoaded = true;
		}
	}

	onMount(() => {
		if (!client.current) return;

		loadProfile();
	});
</script>

{#if isLoaded && userProfile}
	<Profile user={userProfile} />
{:else}
	<ViewLoader />
{/if}
