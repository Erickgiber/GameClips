<script lang="ts">
	// import { goto } from '$app/navigation';
	import { m } from '$lib/paraglide/messages';
	import { Eye, EyeOff, Mail, Lock, Gamepad2 } from 'lucide-svelte';
	import { fly } from 'svelte/transition';

	let showPassword = $state(false);
	let email = $state('');
	let password = $state('');

	function handleSubmit(e: Event) {
		e.preventDefault();
		// goto('/');
	}
</script>

<div
	class="flex size-full items-center justify-center overflow-auto bg-background p-4 text-foreground"
>
	<div class="w-full max-w-md">
		<div in:fly={{ y: -20, duration: 400 }} class="mb-8 text-center">
			<div class="mb-4 inline-flex items-center gap-3">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/30"
				>
					<Gamepad2 class="h-7 w-7 text-white" />
				</div>
				<h1 class="text-3xl font-black tracking-tight">GAMECLIP</h1>
			</div>
			<p class="text-sm text-muted-foreground">
				{m.welcome_back()}
			</p>
		</div>

		<div
			in:fly={{ y: 20, duration: 400, delay: 100 }}
			class="rounded-2xl border border-border bg-card p-8 shadow-2xl"
		>
			<h2 class="mb-6 text-2xl font-black">{m.sign_in_title()}</h2>

			<form onsubmit={handleSubmit} class="space-y-5">
				<div>
					<label for="email" class="mb-2 block text-sm font-semibold">
						{m.email_address()}
					</label>
					<div class="relative">
						<Mail class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
						<input
							id="email"
							type="email"
							bind:value={email}
							placeholder={m.enter_email()}
							class="w-full rounded-lg border border-border bg-muted/50 py-3 pr-4 pl-11 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none"
							required
						/>
					</div>
				</div>

				<div>
					<label for="password" class="mb-2 block text-sm font-semibold">
						{m.password()}
					</label>
					<div class="relative">
						<Lock class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							placeholder={m.enter_password()}
							class="w-full rounded-lg border border-border bg-muted/50 py-3 pr-12 pl-11 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary/50 focus:outline-none"
							required
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							class="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
						>
							{#if showPassword}
								<EyeOff class="h-5 w-5" />
							{:else}
								<Eye class="h-5 w-5" />
							{/if}
						</button>
					</div>
				</div>

				<div class="flex items-center justify-between text-sm">
					<label class="flex cursor-pointer items-center gap-2">
						<input
							type="checkbox"
							class="h-4 w-4 rounded border-border bg-muted/50 text-primary focus:ring-2 focus:ring-primary/50"
						/>
						<span class="text-muted-foreground">{m.remember_me()}</span>
					</label>
					<a
						href="/forgot-password"
						class="font-medium text-accent transition-colors hover:text-accent/80"
					>
						{m.forgot_password()}
					</a>
				</div>

				<button
					type="submit"
					class="w-full rounded-lg bg-primary py-3 font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 active:scale-95"
				>
					{m.sign_in_button()}
				</button>
			</form>

			<div class="relative my-6">
				<div class="absolute inset-0 flex items-center">
					<div class="w-full border-t border-border"></div>
				</div>
				<div class="relative flex justify-center text-xs">
					<span class="bg-card px-4 text-muted-foreground">{m.or_continue_with()}</span>
				</div>
			</div>

			<div class="grid grid-cols-2 gap-3">
				<button
					class="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 py-3 font-semibold transition-all hover:bg-muted active:scale-95"
				>
					<svg class="h-5 w-5" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="currentColor"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="currentColor"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="currentColor"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					<span class="text-sm">Google</span>
				</button>
				<button
					class="flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/50 py-3 font-semibold transition-all hover:bg-muted active:scale-95"
				>
					<svg class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
						<path
							d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"
						/>
					</svg>
					<span class="text-sm">Facebook</span>
				</button>
			</div>

			<p class="mt-6 text-center text-sm text-muted-foreground">
				{m.no_account()}
				<a href="/register" class="font-bold text-accent transition-colors hover:text-accent/80">
					{m.sign_up()}
				</a>
			</p>
		</div>

		<p class="mt-6 text-center text-xs text-muted-foreground">
			{m.terms_agreement()}
			<a href="/terms" class="text-accent hover:text-accent/80">{m.terms_of_service()}</a>
			{m.and()}
			<a href="/privacy" class="text-accent hover:text-accent/80">{m.privacy_policy()}</a>
		</p>
	</div>
</div>
