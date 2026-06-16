<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { Camera, Trophy, Save, Link2, User, FileText, AtSign, LoaderCircle } from 'lucide-svelte';
	import { user } from '$lib/stores/user.svelte';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';
	import AuthGuard from '$lib/components/auth/AuthGuard.svelte';
	import { updateProfile } from '$lib/services/profile.service';

	let fileInputRef: HTMLInputElement | undefined = $state();
	let saved = $state(false);
	let saving = $state(false);

	// Estado local para el formulario (evita mutar el store global hasta guardar)
	let formData = $derived({
		username: user.username || '',
		name: user.name || '',
		title: user.title || '',
		description: user.description || '',
		avatar_url: user.avatar_url,
		sponsor: user.sponsored_by?.join(', ') || ''
	});

	const maxDescription = 150;
	let charCount = $derived(formData.description.length);

	async function handleSave() {
		if (!user.id) {
			alert(m.error_unauthorized());
			return;
		}

		const updatedProfile = {
			username: formData.username,
			name: formData.name,
			title: formData.title,
			description: formData.description,
			avatar_url: formData.avatar_url,
			sponsored_by: formData.sponsor
				.split(',')
				.map((s) => s.trim())
				.filter(Boolean)
		};

		saving = true;
		const req = await updateProfile(user.id, updatedProfile);
		saving = false;

		if (!req.success) {
			console.error('Error updating profile:', req.message);
			alert(req.message ?? m.error_generic());
			return;
		}

		user.username = formData.username;
		user.name = formData.name;
		user.title = formData.title;
		user.description = formData.description;
		user.avatar_url = formData.avatar_url;

		user.sponsored_by = formData.sponsor
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);

		saved = true;

		setInterval(() => {
			saved = false;
		}, 3000);
	}

	function handleAvatarClick() {
		fileInputRef?.click();
	}
</script>

<AuthGuard>
	<div class="size-full overflow-y-auto bg-background text-foreground">
		<div class="mx-auto max-w-4xl space-y-6 pb-16 lg:px-6">
			<div
				in:fly={{ y: 16, duration: 300 }}
				class="flex flex-col items-center gap-6 rounded-xl border border-border bg-card p-6 sm:flex-row"
			>
				<div class="relative shrink-0">
					<img
						src={formData.avatar_url}
						alt="Avatar"
						class="h-24 w-24 rounded-full border-4 border-primary/20 object-cover shadow-lg shadow-primary/20 lg:h-28 lg:w-28"
					/>
					<div
						class="absolute -right-1 -bottom-1 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-linear-to-br from-primary to-secondary"
					>
						<Trophy class="h-4 w-4 text-white" />
					</div>
					<button
						onclick={handleAvatarClick}
						class="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity hover:opacity-100"
					>
						<Camera class="h-7 w-7 text-white" />
					</button>
					<input bind:this={fileInputRef} type="file" accept="image/*" class="hidden" />
				</div>
				<div class="text-center sm:text-left">
					<h3 class="mb-1 text-lg font-black">{formData.username}</h3>
					<p class="mb-3 text-sm text-muted-foreground">{m.avatar_hint()}</p>
					<button
						onclick={handleAvatarClick}
						class="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/20"
					>
						<Camera class="h-4 w-4" />
						{m.change_photo()}
					</button>
				</div>
			</div>

			<div
				in:fly={{ y: 16, duration: 300, delay: 50 }}
				class="space-y-5 rounded-xl border border-border bg-card p-6"
			>
				<div class="mb-1 flex items-center gap-2">
					<User class="h-5 w-5 text-primary" />
					<h3 class="text-base font-black">{m.basic_info()}</h3>
				</div>

				<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
					<div class="space-y-1.5">
						<label
							class="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase"
						>
							<AtSign class="h-3.5 w-3.5" />
							{m.username_label()}
						</label>
						<input
							type="text"
							bind:value={formData.username}
							class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none"
							placeholder={m.username_placeholder()}
						/>
					</div>

					<div class="space-y-1.5">
						<label
							class="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase"
						>
							<User class="h-3.5 w-3.5" />
							{m.name_label()}
						</label>
						<input
							type="text"
							bind:value={formData.name}
							class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none"
							placeholder={m.name_placeholder()}
						/>
					</div>
				</div>

				<div class="space-y-1.5">
					<label
						class="flex items-center gap-1.5 text-xs font-bold tracking-wider text-muted-foreground uppercase"
					>
						<Trophy class="h-3.5 w-3.5" />
						{m.title_role_label()}
					</label>
					<input
						type="text"
						bind:value={formData.title}
						class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none"
						placeholder={m.title_role_placeholder()}
					/>
				</div>
			</div>

			<div
				in:fly={{ y: 16, duration: 300, delay: 100 }}
				class="space-y-3 rounded-xl border border-border bg-card p-6"
			>
				<div class="flex items-center gap-2">
					<FileText class="h-5 w-5 text-primary" />
					<h3 class="text-base font-black">{m.description_label()}</h3>
				</div>
				<div class="relative">
					<textarea
						bind:value={formData.description}
						maxlength={maxDescription}
						rows="3"
						class="w-full resize-none rounded-lg border border-border bg-background px-4 py-3 text-sm transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none"
						placeholder={m.description_placeholder()}
					></textarea>
					<span
						class={`absolute right-3 bottom-2.5 font-mono text-xs ${charCount >= maxDescription ? 'text-red-400' : 'text-muted-foreground'}`}
					>
						{charCount}/{maxDescription}
					</span>
				</div>
				<p class="text-xs text-muted-foreground">{m.description_tip()}</p>
			</div>

			<div
				in:fly={{ y: 16, duration: 300, delay: 150 }}
				class="space-y-5 rounded-xl border border-border bg-card p-6"
			>
				<div class="flex items-center gap-2">
					<Link2 class="h-5 w-5 text-primary" />
					<h3 class="text-base font-black">{m.sponsorship_links_label()}</h3>
				</div>

				<div class="space-y-1.5">
					<label
						for="sponsor"
						class="text-xs font-bold tracking-wider text-muted-foreground uppercase"
					>
						{m.sponsored_by_label()}
					</label>
					<input
						type="text"
						id="sponsor"
						bind:value={formData.sponsor}
						class="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none"
						placeholder={m.sponsor_placeholder()}
					/>
				</div>
			</div>

			<div class="flex gap-5" in:fly={{ y: 16, duration: 300, delay: 200 }}>
				<button
					disabled={saving}
					onclick={handleSave}
					class="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-black text-white shadow-xl shadow-primary/30 transition-all hover:bg-primary/90 active:scale-97 lg:cursor-pointer"
				>
					{#if saving}
						<LoaderCircle class="h-5 w-5 animate-spin" />
					{:else}
						<Save class="h-5 w-5" />
						{saved ? m.profile_saved() : m.save_profile()}
					{/if}
				</button>
				<button
					disabled={saving}
					onclick={() => goto(resolve('/profile'))}
					class="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-4 text-base font-black text-white shadow-xl shadow-border/30 transition-all hover:bg-border/90 active:scale-97 lg:cursor-pointer"
				>
					{m.cancel()}
				</button>
			</div>
		</div>
	</div>
</AuthGuard>
