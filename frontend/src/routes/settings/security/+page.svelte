<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import {
		Key,
		Shield,
		Smartphone,
		LoaderCircle,
		CheckCircle2,
		XCircle,
		Link as LinkIcon,
		Unlink,
		FingerprintPattern,
		Trash2
	} from 'lucide-svelte';
	import * as m from '$lib/paraglide/messages';
	import {
		updatePassword,
		getMfaStatus,
		enrollMfa,
		verifyMfa,
		unenrollMfa,
		getLinkedIdentities,
		linkIdentity,
		unlinkIdentity,
		getPasskeys,
		enrollPasskey,
		deletePasskey
	} from '$lib/services/auth.service';
	import type { Identity } from '@supabase/supabase-js';

	// --- Password State ---
	let isChangingPassword = $state(false);
	let newPassword = $state('');
	let confirmPassword = $state('');
	let isSavingPassword = $state(false);
	let passwordError = $state('');
	let passwordSuccess = $state(false);

	const isPasswordLengthValid = $derived(newPassword.length >= 6);
	const doPasswordsMatch = $derived(newPassword && newPassword === confirmPassword);
	const isPasswordFormValid = $derived(isPasswordLengthValid && doPasswordsMatch);

	async function handlePasswordSave() {
		passwordError = '';
		passwordSuccess = false;

		if (!isPasswordFormValid) return;

		isSavingPassword = true;
		try {
			await updatePassword(newPassword);
			passwordSuccess = true;
			newPassword = '';
			confirmPassword = '';
			isChangingPassword = false;
			setTimeout(() => (passwordSuccess = false), 3000);
		} catch (error: unknown) {
			passwordError = (error as Error).message;
		} finally {
			isSavingPassword = false;
		}
	}

	// --- 2FA State ---
	let isMfaEnrolled = $state(false);
	let mfaFactorId = $state<string | null>(null);
	let isLoadingMfa = $state(true);

	let isEnrollingMfa = $state(false);
	let qrCodeSvg = $state('');
	let verificationCode = $state('');
	let mfaError = $state('');

	async function loadMfaStatus() {
		isLoadingMfa = true;
		try {
			const status = await getMfaStatus();
			isMfaEnrolled = status.isEnrolled;
			mfaFactorId = status.factorId ?? null;
		} catch (error) {
			console.error('Error loading MFA status:', error);
		} finally {
			isLoadingMfa = false;
		}
	}

	async function startMfaEnroll() {
		mfaError = '';
		try {
			const data = await enrollMfa();
			mfaFactorId = data.id;
			qrCodeSvg = data.totp.qr_code;
			isEnrollingMfa = true;
		} catch (error: unknown) {
			mfaError = (error as Error).message;
		}
	}

	async function confirmMfa() {
		mfaError = '';
		if (!verificationCode || !mfaFactorId) return;

		try {
			await verifyMfa(mfaFactorId, verificationCode);
			isMfaEnrolled = true;
			isEnrollingMfa = false;
			verificationCode = '';
			alert(m.security_2fa_enabled_success?.() ?? '2FA enabled!');
		} catch (error: unknown) {
			mfaError = (error as Error).message;
		}
	}

	async function disableMfa() {
		if (!mfaFactorId) return;
		try {
			await unenrollMfa(mfaFactorId);
			isMfaEnrolled = false;
			mfaFactorId = null;
			alert(m.security_2fa_disabled_success?.() ?? '2FA disabled!');
		} catch (error: unknown) {
			alert((error as Error).message);
		}
	}

	// --- Social Linking State ---
	let linkedIdentities = $state<Identity[]>([]);
	let isLoadingIdentities = $state(true);

	async function loadIdentities() {
		isLoadingIdentities = true;
		try {
			linkedIdentities = await getLinkedIdentities();
		} catch (error) {
			console.error('Error loading identities:', error);
		} finally {
			isLoadingIdentities = false;
		}
	}

	function isLinked(provider: string) {
		return linkedIdentities.some((id) => id.provider === provider);
	}

	async function toggleLink(provider: string) {
		const identity = linkedIdentities.find((id) => id.provider === provider);
		try {
			if (identity) {
				await unlinkIdentity(identity);
				await loadIdentities();
			} else {
				// linking initiates an OAuth flow, which redirects the page.
				// user will need to sign in again via the provider.
				await linkIdentity(provider);
			}
		} catch (error: unknown) {
			alert((error as Error).message);
		}
	}

	// --- Passkeys State ---
	let passkeys = $state<unknown[]>([]);
	let isLoadingPasskeys = $state(true);

	async function loadPasskeys() {
		isLoadingPasskeys = true;
		try {
			passkeys = await getPasskeys();
		} catch (error) {
			console.error('Error loading passkeys:', error);
		} finally {
			isLoadingPasskeys = false;
		}
	}

	async function handleAddPasskey() {
		try {
			await enrollPasskey();
			await loadPasskeys();
			alert(m.security_passkey_added_success?.() ?? 'Passkey added!');
		} catch (error: unknown) {
			alert((error as Error).message);
		}
	}

	async function handleDeletePasskey(id: string) {
		try {
			await deletePasskey(id);
			await loadPasskeys();
			alert(m.security_passkey_deleted_success?.() ?? 'Passkey deleted!');
		} catch (error: unknown) {
			alert((error as Error).message);
		}
	}

	onMount(() => {
		loadMfaStatus();
		loadIdentities();
		loadPasskeys();
	});
</script>

<div class="size-full overflow-y-auto bg-background text-foreground">
	<div class="mx-auto max-w-4xl space-y-6 pb-16 lg:px-6">
		<!-- Change Password Section -->
		<div
			in:fly={{ y: 16, duration: 300 }}
			class="space-y-5 rounded-xl border border-border bg-card p-6"
		>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Key class="h-5 w-5 text-primary" />
					<h3 class="text-base font-black">{m.security_password_title?.() ?? 'Change Password'}</h3>
				</div>
				{#if !isChangingPassword}
					<button
						onclick={() => (isChangingPassword = true)}
						class="rounded-xl bg-secondary px-3 py-2 text-sm font-bold text-secondary-foreground transition-colors hover:bg-secondary/80 active:scale-95 md:cursor-pointer"
					>
						{m.security_password_update_action?.() ?? 'Update'}
					</button>
				{/if}
			</div>

			{#if isChangingPassword}
				<div class="animate-in fade-in slide-in-from-top-4 duration-300">
					<div class="grid grid-cols-1 gap-5 sm:grid-cols-2">
						<div class="space-y-1.5">
							<label
								for="newPassword"
								class="text-xs font-bold tracking-wider text-muted-foreground uppercase"
							>
								{m.security_new_password?.() ?? 'New Password'}
							</label>
							<input
								type="password"
								id="newPassword"
								bind:value={newPassword}
								class="w-full rounded-lg border bg-background px-4 py-2.5 text-sm transition-colors focus:ring-1 focus:outline-none {newPassword.length >
									0 && !isPasswordLengthValid
									? 'border-destructive focus:border-destructive focus:ring-destructive/30'
									: 'border-border focus:border-primary focus:ring-primary/30'}"
							/>
							{#if newPassword.length > 0 && !isPasswordLengthValid}
								<p class="text-xs font-semibold text-destructive">
									{m.security_password_req_length?.() ?? 'Minimum 6 characters'}
								</p>
							{/if}
						</div>

						<div class="space-y-1.5">
							<label
								for="confirmPassword"
								class="text-xs font-bold tracking-wider text-muted-foreground uppercase"
							>
								{m.security_confirm_password?.() ?? 'Confirm Password'}
							</label>
							<input
								type="password"
								id="confirmPassword"
								bind:value={confirmPassword}
								class="w-full rounded-lg border bg-background px-4 py-2.5 text-sm transition-colors focus:ring-1 focus:outline-none {confirmPassword.length >
									0 && !doPasswordsMatch
									? 'border-destructive focus:border-destructive focus:ring-destructive/30'
									: 'border-border focus:border-primary focus:ring-primary/30'}"
							/>
							{#if confirmPassword.length > 0 && !doPasswordsMatch}
								<p class="text-xs font-semibold text-destructive">
									{m.security_password_mismatch?.() ?? 'Passwords do not match'}
								</p>
							{/if}
						</div>
					</div>

					{#if passwordError}
						<p class="mt-4 text-sm font-semibold text-destructive">{passwordError}</p>
					{/if}

					<div class="mt-5 flex items-center gap-3">
						<button
							disabled={isSavingPassword || !isPasswordFormValid}
							onclick={handlePasswordSave}
							class="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-black text-white shadow-md shadow-primary/30 transition-all hover:bg-primary/90 active:scale-95 disabled:opacity-50 md:cursor-pointer"
						>
							{#if isSavingPassword}
								<LoaderCircle class="h-4 w-4 animate-spin" />
							{:else}
								{m.security_save_password?.() ?? 'Save Password'}
							{/if}
						</button>
						<button
							onclick={() => {
								isChangingPassword = false;
								newPassword = '';
								confirmPassword = '';
								passwordError = '';
							}}
							class="text-sm font-bold text-muted-foreground transition-colors hover:text-foreground md:cursor-pointer"
						>
							{m.cancel?.() ?? 'Cancel'}
						</button>
					</div>
				</div>
			{/if}

			{#if passwordSuccess}
				<p class="text-sm font-semibold text-green-500">
					{m.security_password_updated?.() ?? 'Password updated!'}
				</p>
			{/if}
		</div>

		<!-- Passkeys Section -->
		<div
			in:fly={{ y: 16, duration: 300, delay: 150 }}
			class="space-y-5 rounded-xl border border-border bg-card p-6"
		>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<FingerprintPattern class="h-5 w-5 text-primary" />
					<div>
						<h3 class="text-base font-black">{m.security_passkey_title?.() ?? 'Passkeys'}</h3>
						<p class="text-xs text-muted-foreground">
							{m.security_passkey_desc?.() ?? 'Sign in securely with your fingerprint or face'}
						</p>
					</div>
				</div>
				<button
					onclick={handleAddPasskey}
					class="rounded-xl bg-secondary px-4 py-2 text-sm font-bold text-secondary-foreground transition-colors hover:bg-secondary/80 active:scale-95 md:cursor-pointer"
				>
					{m.security_passkey_add?.() ?? 'Add'}
				</button>
			</div>

			{#if isLoadingPasskeys}
				<div class="flex justify-center p-4">
					<LoaderCircle class="h-5 w-5 animate-spin text-muted-foreground" />
				</div>
			{:else if passkeys.length > 0}
				<div class="space-y-3">
					{#each passkeys as pk, i (i)}
						<div
							class="flex items-center justify-between rounded-lg border border-border bg-background p-3 transition hover:bg-muted/50"
						>
							<div class="flex items-center gap-3">
								<div class="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
									<FingerprintPattern class="h-5 w-5 text-primary" />
								</div>
								<div>
									<p class="text-sm font-bold">{pk.friendly_name || 'Passkey'}</p>
									<p class="text-xs text-muted-foreground">
										Added: {new Date(pk.created_at).toLocaleDateString()}
									</p>
								</div>
							</div>
							<button
								onclick={() => handleDeletePasskey(pk.id)}
								class="rounded-lg p-2 text-destructive transition-colors hover:bg-destructive/10 active:scale-95 md:cursor-pointer"
								title={m.security_passkey_delete?.() ?? 'Delete'}
							>
								<Trash2 class="h-4 w-4" />
							</button>
						</div>
					{/each}
				</div>
			{:else}
				<p class="text-sm text-muted-foreground">
					{m.security_passkey_empty?.() ?? 'No passkeys added yet.'}
				</p>
			{/if}
		</div>

		<!-- 2FA Section -->
		<div
			in:fly={{ y: 16, duration: 300, delay: 50 }}
			class="space-y-5 rounded-xl border border-border bg-card p-6"
		>
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-2">
					<Shield class="h-5 w-5 text-primary" />
					<div>
						<h3 class="text-base font-black">
							{m.security_2fa_title?.() ?? 'Two-Factor Authentication'}
						</h3>
						<p class="text-xs text-muted-foreground">
							{m.security_2fa_desc?.() ?? 'Add an extra layer of security'}
						</p>
					</div>
				</div>
				{#if isLoadingMfa}
					<LoaderCircle class="h-5 w-5 animate-spin text-muted-foreground" />
				{:else if isMfaEnrolled}
					<span
						class="flex items-center gap-1 rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-xs font-bold text-green-500"
					>
						<CheckCircle2 class="h-3 w-3" />
						{m.security_2fa_status_enabled?.() ?? 'Enabled'}
					</span>
				{:else}
					<span
						class="flex items-center gap-1 rounded-full border border-destructive/20 bg-destructive/10 px-3 py-1 text-xs font-bold text-destructive"
					>
						<XCircle class="h-3 w-3" />
						{m.security_2fa_status_disabled?.() ?? 'Disabled'}
					</span>
				{/if}
			</div>

			{#if !isLoadingMfa}
				{#if isMfaEnrolled}
					<button
						onclick={disableMfa}
						class="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2.5 text-sm font-bold text-destructive transition-colors hover:bg-destructive/20 active:scale-95 md:cursor-pointer"
					>
						{m.security_2fa_disable?.() ?? 'Disable 2FA'}
					</button>
				{:else if !isEnrollingMfa}
					<button
						onclick={startMfaEnroll}
						class="rounded-xl bg-secondary px-4 py-2.5 text-sm font-bold text-secondary-foreground transition-colors hover:bg-secondary/80 active:scale-95 md:cursor-pointer"
					>
						{m.security_2fa_enable?.() ?? 'Enable 2FA'}
					</button>
				{:else}
					<div
						class="animate-in fade-in slide-in-from-top-4 rounded-xl border border-border bg-background p-5 duration-300"
					>
						<p class="mb-4 text-sm font-semibold">
							{m.security_2fa_scan_qr?.() ?? 'Scan this QR code:'}
						</p>
						<div
							class="mx-auto mb-4 flex max-w-max justify-center rounded-lg bg-white p-4 shadow-sm"
						>
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html qrCodeSvg}
						</div>

						<div class="mt-4 space-y-1.5">
							<label
								for="verificationCode"
								class="text-xs font-bold tracking-wider text-muted-foreground uppercase"
							>
								{m.security_2fa_enter_code?.() ?? 'Enter code'}
							</label>
							<div class="flex gap-2">
								<input
									type="text"
									id="verificationCode"
									maxlength="6"
									bind:value={verificationCode}
									class="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-center font-mono text-lg tracking-widest transition-colors focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none"
									placeholder="000000"
								/>
								<button
									onclick={confirmMfa}
									disabled={verificationCode.length < 6}
									class="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90 disabled:opacity-50 md:cursor-pointer"
								>
									{m.security_2fa_verify?.() ?? 'Verify'}
								</button>
							</div>
							{#if mfaError}
								<p class="mt-1 text-xs font-semibold text-destructive">{mfaError}</p>
							{/if}
						</div>
						<button
							onclick={() => (isEnrollingMfa = false)}
							class="mt-4 text-xs font-bold text-muted-foreground hover:text-foreground md:cursor-pointer"
						>
							{m.cancel?.() ?? 'Cancel'}
						</button>
					</div>
				{/if}
			{/if}
		</div>

		<!-- Social Accounts Section -->
		<div
			in:fly={{ y: 16, duration: 300, delay: 100 }}
			class="space-y-5 rounded-xl border border-border bg-card p-6"
		>
			<div class="flex items-center gap-2">
				<Smartphone class="h-5 w-5 text-primary" />
				<div>
					<h3 class="text-base font-black">{m.security_social_title?.() ?? 'Social Accounts'}</h3>
					<p class="text-xs text-muted-foreground">
						{m.security_social_desc?.() ?? 'Link your social accounts'}
					</p>
				</div>
			</div>

			{#if isLoadingIdentities}
				<div class="flex justify-center p-4">
					<LoaderCircle class="h-6 w-6 animate-spin text-muted-foreground" />
				</div>
			{:else}
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
					<!-- Google -->
					<div
						class="flex flex-col items-center justify-between rounded-xl border border-border bg-background p-4 text-center"
					>
						<div
							class="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-border/50 bg-white shadow-sm"
						>
							<svg class="h-6 w-6" viewBox="0 0 24 24"
								><path
									d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
									fill="#4285F4"
								/><path
									d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
									fill="#34A853"
								/><path
									d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
									fill="#FBBC05"
								/><path
									d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
									fill="#EA4335"
								/></svg
							>
						</div>
						<h4 class="mb-1 font-bold">Google</h4>
						{#if isLinked('google')}
							<span class="mb-3 text-xs font-semibold text-green-500"
								>{m.security_social_linked?.() ?? 'Linked'}</span
							>
							<button
								onclick={() => toggleLink('google')}
								class="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold transition hover:bg-muted md:cursor-pointer"
							>
								<Unlink class="h-3 w-3" />
								{m.security_social_unlink?.() ?? 'Unlink'}
							</button>
						{:else}
							<span class="mb-3 text-xs font-medium text-muted-foreground">Not Linked</span>
							<button
								onclick={() => toggleLink('google')}
								class="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-bold transition hover:bg-muted md:cursor-pointer"
							>
								<LinkIcon class="h-3 w-3" />
								{m.security_social_link?.() ?? 'Link'}
							</button>
						{/if}
					</div>

					<!-- Facebook -->
					<div
						class="flex flex-col items-center justify-between rounded-xl border border-border bg-background p-4 text-center"
					>
						<div
							class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1877F2] text-white shadow-sm"
						>
							<svg class="h-6 w-6 fill-current" viewBox="0 0 24 24"
								><path
									d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
								/></svg
							>
						</div>
						<h4 class="mb-1 font-bold">Facebook</h4>
						{#if isLinked('facebook')}
							<span class="mb-3 text-xs font-semibold text-green-500"
								>{m.security_social_linked?.() ?? 'Linked'}</span
							>
							<button
								onclick={() => toggleLink('facebook')}
								class="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold transition hover:bg-muted md:cursor-pointer"
							>
								<Unlink class="h-3 w-3" />
								{m.security_social_unlink?.() ?? 'Unlink'}
							</button>
						{:else}
							<span class="mb-3 text-xs font-medium text-muted-foreground">Not Linked</span>
							<button
								onclick={() => toggleLink('facebook')}
								class="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-bold transition hover:bg-muted md:cursor-pointer"
							>
								<LinkIcon class="h-3 w-3" />
								{m.security_social_link?.() ?? 'Link'}
							</button>
						{/if}
					</div>

					<!-- Apple -->
					<div
						class="flex flex-col items-center justify-between rounded-xl border border-border bg-background p-4 text-center"
					>
						<div
							class="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-sm dark:bg-white dark:text-black"
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="#000000"
								width="35px"
								height="35px"
								viewBox="0 0 25 26"
							>
								<path
									d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"
								/>
							</svg>
						</div>
						<h4 class="mb-1 font-bold">Apple</h4>
						{#if isLinked('apple')}
							<span class="mb-3 text-xs font-semibold text-green-500"
								>{m.security_social_linked?.() ?? 'Linked'}</span
							>
							<button
								onclick={() => toggleLink('apple')}
								class="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-xs font-bold transition hover:bg-muted md:cursor-pointer"
							>
								<Unlink class="h-3 w-3" />
								{m.security_social_unlink?.() ?? 'Unlink'}
							</button>
						{:else}
							<span class="mb-3 text-xs font-medium text-muted-foreground">Not Linked</span>
							<button
								onclick={() => toggleLink('apple')}
								class="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 py-2 text-xs font-bold transition hover:bg-muted md:cursor-pointer"
							>
								<LinkIcon class="h-3 w-3" />
								{m.security_social_link?.() ?? 'Link'}
							</button>
						{/if}
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
