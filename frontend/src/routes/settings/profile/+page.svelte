<script lang="ts">
	import { goto } from '$app/navigation';
	import { fly } from 'svelte/transition';
	import { Camera, Trophy, Save, Link2, User, FileText, AtSign, LoaderCircle } from 'lucide-svelte';
	import { user } from '$lib/stores/user.svelte';
	import { resolve } from '$app/paths';
	import * as m from '$lib/paraglide/messages';
	import { updateProfile } from '$lib/services/profile.service';
	import { normalizeText } from '$lib/utils/normalizeText';
	import Cropper from 'cropperjs';
	import 'cropperjs/dist/cropper.css';
	import { uploadAvatarToStorage } from '$lib/services/storage.service';

	let fileInputRef: HTMLInputElement | undefined = $state();
	let saved = $state(false);
	let saving = $state(false);
	let cropModalOpen = $state(false);
	let cropImageSrc = $state('');
	let cropper: Cropper | null = null;
	let cropImgRef: HTMLImageElement | undefined = $state();
	let uploadingAvatar = $state(false);

	let toast = $state<{ show: boolean; message: string; type: 'success' | 'error' }>({
		show: false,
		message: '',
		type: 'success'
	});

	function displayToast(message: string, type: 'success' | 'error' = 'success') {
		toast.message = message;
		toast.type = type;
		toast.show = true;
		setTimeout(() => {
			toast.show = false;
		}, 4000);
	}

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
			displayToast(m.error_unauthorized(), 'error');
			return;
		}

		const updatedProfile = {
			username: normalizeText(formData.username),
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
			displayToast(req.message ?? m.error_generic(), 'error');
			return;
		}

		user.username = normalizeText(formData.username);
		user.name = formData.name;
		user.title = formData.title;
		user.description = formData.description;
		user.avatar_url = formData.avatar_url;

		user.sponsored_by = formData.sponsor
			.split(',')
			.map((s) => s.trim())
			.filter(Boolean);

		saved = true;
		displayToast(m.profile_saved());

		setTimeout(() => {
			saved = false;
		}, 3000);
	}

	function handleAvatarClick() {
		fileInputRef?.click();
	}

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = (e) => {
				cropImageSrc = e.target?.result as string;
				cropModalOpen = true;
				setTimeout(() => initCropper(), 10);
			};
			reader.readAsDataURL(file);
		}
		if (fileInputRef) fileInputRef.value = '';
	}

	function initCropper() {
		if (cropper) {
			cropper.destroy();
		}
		if (cropImgRef) {
			cropper = new Cropper(cropImgRef, {
				aspectRatio: 1,
				viewMode: 1,
				dragMode: 'move',
				autoCropArea: 1,
				restore: false,
				guides: false,
				center: false,
				highlight: false,
				cropBoxMovable: true,
				cropBoxResizable: true,
				toggleDragModeOnDblclick: false,
				background: false
			});
		}
	}

	function closeCropper() {
		cropModalOpen = false;
		if (cropper) {
			cropper.destroy();
			cropper = null;
		}
		cropImageSrc = '';
	}

	async function confirmCrop() {
		if (!cropper || !user.username) return;

		uploadingAvatar = true;
		cropper
			.getCroppedCanvas({
				width: 500,
				height: 500
			})
			.toBlob(async (blob: Blob | null) => {
				if (blob) {
					try {
						const result = await uploadAvatarToStorage(blob, user.id!);

						// Guardamos la nueva URL en la tabla profiles
						await updateProfile(user.id!, { avatar_url: result.publicUrl });

						// Actualizamos el store en tiempo real
						user.avatar_url = result.publicUrl;
						displayToast(m.profile_saved());
					} catch (e) {
						console.error('Error uploading avatar:', e);
						displayToast(m.error_generic(), 'error');
					}
				}
				uploadingAvatar = false;
				closeCropper();
			}, 'image/png');
	}
</script>

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
				<button
					onclick={handleAvatarClick}
					class="absolute inset-0 z-10 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity hover:opacity-100"
				>
					<Camera class="h-7 w-7 text-white" />
				</button>
				<div
					class="absolute -right-1 -bottom-1 z-20 flex h-8 w-8 items-center justify-center rounded-full border-4 border-background bg-linear-to-br from-primary to-secondary"
				>
					<Trophy class="h-4 w-4 text-white" />
				</div>
				<input
					bind:this={fileInputRef}
					type="file"
					accept="image/*"
					class="hidden"
					onchange={handleFileChange}
				/>
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
				onclick={() => goto(resolve('/profile'))}
				class="flex w-full items-center justify-center gap-2 rounded-xl border border-border py-4 text-base font-black text-white shadow-xl shadow-border/30 transition-all hover:bg-border/90 active:scale-97 lg:cursor-pointer"
			>
				{m.cancel()}
			</button>
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
		</div>
	</div>
</div>

{#if cropModalOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
		onclick={closeCropper}
		transition:fly={{ duration: 200, y: 10 }}
	>
		<div
			class="relative flex w-full max-w-md flex-col overflow-hidden rounded-2xl bg-card shadow-2xl"
			onclick={(e) => e.stopPropagation()}
		>
			<div class="border-b border-border p-4 text-center">
				<h3 class="text-lg font-black text-foreground">{m.crop_image_title()}</h3>
			</div>
			<div class="relative h-[400px] w-full overflow-hidden bg-black/5">
				<img
					bind:this={cropImgRef}
					src={cropImageSrc}
					alt="Crop target"
					class="block h-auto max-w-full"
				/>
			</div>
			<div class="relative z-10 flex gap-4 bg-card p-6 pt-4">
				<button
					onclick={closeCropper}
					disabled={uploadingAvatar}
					class="flex-1 cursor-pointer rounded-xl border border-border/40 bg-secondary/30 py-3.5 text-base font-bold text-secondary-foreground shadow-sm transition-colors hover:bg-secondary/50 disabled:opacity-50"
				>
					{m.crop_cancel()}
				</button>
				<button
					onclick={confirmCrop}
					disabled={uploadingAvatar}
					class="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-base font-black text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 disabled:opacity-50"
				>
					{#if uploadingAvatar}
						<LoaderCircle class="h-4 w-4 animate-spin" />
						{m.uploading()}
					{:else}
						{m.crop_confirm()}
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}

{#if toast.show}
	<div
		transition:fly={{ y: -20, duration: 300 }}
		class={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-xl border px-4 py-3 shadow-xl backdrop-blur-md transition-all duration-300 ${
			toast.type === 'success'
				? 'border-green-500/20 bg-green-500/10 text-green-500 shadow-green-500/5'
				: 'border-red-500/20 bg-red-500/10 text-red-500 shadow-red-500/5'
		}`}
	>
		{#if toast.type === 'success'}
			<svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		{:else}
			<svg class="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
				<path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
				/>
			</svg>
		{/if}
		<span class="text-sm font-bold">{toast.message}</span>
	</div>
{/if}

<style>
	/* Make the cropper mask circular */
	:global(.cropper-view-box),
	:global(.cropper-face) {
		border-radius: 50%;
	}
	:global(.cropper-view-box) {
		outline: 0;
		box-shadow: 0 0 0 1000px rgba(0, 0, 0, 0.6);
	}
</style>
