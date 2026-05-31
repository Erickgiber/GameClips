<script lang="ts">
	import { goto } from '$app/navigation';
	import { Eye, EyeOff, Mail, Lock, User, Gamepad2 } from 'lucide-svelte';
	import { fly } from 'svelte/transition';
	import * as m from '$lib/paraglide/messages';
	import { resolve } from '$app/paths';

	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	
	let formData = $state({
		username: '',
		email: '',
		password: '',
		confirmPassword: ''
	});

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (formData.password !== formData.confirmPassword) {
			alert(m.passwords_do_not_match());
			return;
		}
		goto(resolve('/'));
	}
</script>

<div class="size-full bg-background text-foreground flex items-center justify-center p-4 overflow-auto">
	<div class="w-full max-w-md">
		<div
			in:fly={{ y: -20, duration: 400 }}
			class="text-center mb-8"
		>
			<div class="inline-flex items-center gap-3 mb-4">
				<div class="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-primary/30">
					<Gamepad2 class="w-7 h-7 text-white" />
				</div>
				<h1 class="text-3xl font-black tracking-tight">GAMECLIP</h1>
			</div>
			<p class="text-muted-foreground text-sm">
				{m.join_community()}
			</p>
		</div>

		<div
			in:fly={{ y: 20, duration: 400, delay: 100 }}
			class="bg-card border border-border rounded-2xl p-8 shadow-2xl"
		>
			<h2 class="text-2xl font-black mb-6">{m.create_account_title()}</h2>

			<form onsubmit={handleSubmit} class="space-y-4">
				<div>
					<label for="username" class="block text-sm font-semibold mb-2">
						{m.username()}
					</label>
					<div class="relative">
						<User class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
						<input
							id="username"
							type="text"
							bind:value={formData.username}
							placeholder={m.choose_username()}
							class="w-full bg-muted/50 border border-border rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
							required
						/>
					</div>
				</div>

				<div>
					<label for="email" class="block text-sm font-semibold mb-2">
						{m.email_address()}
					</label>
					<div class="relative">
						<Mail class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
						<input
							id="email"
							type="email"
							bind:value={formData.email}
							placeholder={m.enter_email()}
							class="w-full bg-muted/50 border border-border rounded-lg pl-11 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
							required
						/>
					</div>
				</div>

				<div>
					<label for="password" class="block text-sm font-semibold mb-2">
						{m.password()}
					</label>
					<div class="relative">
						<Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
						<input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={formData.password}
							placeholder={m.create_password()}
							class="w-full bg-muted/50 border border-border rounded-lg pl-11 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
							required
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
						>
							{#if showPassword}
								<EyeOff class="w-5 h-5" />
							{:else}
								<Eye class="w-5 h-5" />
							{/if}
						</button>
					</div>
				</div>

				<div>
					<label for="confirmPassword" class="block text-sm font-semibold mb-2">
						{m.confirm_password()}
					</label>
					<div class="relative">
						<Lock class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
						<input
							id="confirmPassword"
							type={showConfirmPassword ? 'text' : 'password'}
							bind:value={formData.confirmPassword}
							placeholder={m.confirm_your_password()}
							class="w-full bg-muted/50 border border-border rounded-lg pl-11 pr-12 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
							required
						/>
						<button
							type="button"
							onclick={() => (showConfirmPassword = !showConfirmPassword)}
							class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
						>
							{#if showConfirmPassword}
								<EyeOff class="w-5 h-5" />
							{:else}
								<Eye class="w-5 h-5" />
							{/if}
						</button>
					</div>
				</div>

				<div>
					<label class="flex items-start gap-2 cursor-pointer text-sm">
						<input
							type="checkbox"
							class="mt-1 w-4 h-4 rounded border-border bg-muted/50 text-primary focus:ring-2 focus:ring-primary/50"
							required
						/>
						<span class="text-muted-foreground">
							{m.i_agree_to()}
							<a href={resolve('/')} class="text-accent hover:text-accent/80 font-medium">
								{m.terms_of_service()}
							</a>
							{m.and()}
							<a href={resolve('/')} class="text-accent hover:text-accent/80 font-medium">
								{m.privacy_policy()}
							</a>
						</span>
					</label>
				</div>

				<button
					type="submit"
					class="w-full bg-primary hover:bg-primary/90 active:scale-95 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-primary/30"
				>
					{m.create_account_button()}
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
					class="flex items-center justify-center gap-2 bg-muted/50 hover:bg-muted active:scale-95 border border-border rounded-lg py-3 font-semibold transition-all"
				>
					<svg class="w-5 h-5" viewBox="0 0 24 24">
						<path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
						<path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
						<path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
						<path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
					</svg>
					<span class="text-sm">Google</span>
				</button>
				<button
					class="flex items-center justify-center gap-2 bg-muted/50 hover:bg-muted active:scale-95 border border-border rounded-lg py-3 font-semibold transition-all"
				>
					<svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
						<path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
					</svg>
					<span class="text-sm">Facebook</span>
				</button>
			</div>

			<p class="text-center text-sm text-muted-foreground mt-6">
				{m.already_have_account()}
				<a href={resolve('/login')} class="text-accent hover:text-accent/80 font-bold transition-colors">
					{m.sign_in()}
				</a>
			</p>
		</div>
	</div>
</div>