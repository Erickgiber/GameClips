<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import {
		CircleCheck,
		CircleX,
		Mail,
		LoaderCircle,
		Gamepad2,
		ArrowRight,
		RefreshCw
	} from 'lucide-svelte';
	import { fly, scale, fade } from 'svelte/transition';
	import { elasticOut } from 'svelte/easing';
	import { resolve } from '$app/paths';
	import { m } from '$lib/paraglide/messages';

	type VerificationStatus = 'loading' | 'success' | 'error' | 'expired';

	let status = $state<VerificationStatus>('loading');
	let countdown = $state(5);
	let email = $state('');

	$effect(() => {
		const token = page.url.searchParams.get('token');
		const emailParam = page.url.searchParams.get('email');

		if (emailParam) {
			email = emailParam;
		}

		const timer = setTimeout(() => {
			if (token === 'expired') {
				status = 'expired';
			} else if (token === 'invalid') {
				status = 'error';
			} else {
				status = 'success';
			}
		}, 2000);

		return () => clearTimeout(timer);
	});

	$effect(() => {
		if (status === 'success' && countdown > 0) {
			const timer = setTimeout(() => {
				countdown--;
			}, 1000);
			return () => clearTimeout(timer);
		} else if (status === 'success' && countdown === 0) {
			goto(resolve('/'));
		}
	});

	function handleResendEmail() {
		status = 'loading';
		setTimeout(() => {
			status = 'success';
			countdown = 5;
		}, 2000);
	}
</script>

<div
	class="flex size-full min-h-screen items-center justify-center overflow-auto bg-background p-4 text-foreground"
>
	<div class="w-full max-w-md">
		<div in:fly={{ y: -20, duration: 500 }} class="mb-8 text-center">
			<div class="mb-4 inline-flex items-center gap-3">
				<div
					class="flex h-12 w-12 items-center justify-center rounded-xl bg-linear-to-br from-primary to-secondary shadow-lg shadow-primary/30"
				>
					<Gamepad2 class="h-7 w-7 text-white" />
				</div>
				<h1 class="text-3xl font-black tracking-tight">GAMECLIP</h1>
			</div>
		</div>

		<div
			in:fly={{ y: 20, duration: 500, delay: 100 }}
			class="relative min-h-max h-72 overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-2xl lg:p-10"
		>
			{#if status === 'loading'}
				<div
					in:fade={{ duration: 200 }}
					class="absolute inset-0 z-10 flex h-full flex-col justify-center bg-card p-8 text-center lg:p-10"
				>
					<div class="mx-auto mb-6 h-20 w-20 animate-spin">
						<div
							class="flex h-full w-full items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary"
						>
							<LoaderCircle class="h-10 w-10 text-white" />
						</div>
					</div>
					<h2 class="mb-3 text-2xl font-black">{m.verifying_email_title()}</h2>
					<p class="text-muted-foreground">{m.verifying_email_desc()}</p>
				</div>
			{/if}

			{#if status === 'success'}
				<div in:fade={{ duration: 300, delay: 200 }} class="text-center">
					<div in:scale={{ start: 0, duration: 600, easing: elasticOut, delay: 300 }} class="mb-6">
						<div
							class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30"
						>
							<CircleCheck class="h-12 w-12 text-white" />
						</div>
					</div>

					<div in:fly={{ y: 10, duration: 400, delay: 400 }}>
						<h2 class="mb-3 text-2xl font-black lg:text-3xl">{m.email_verified_title()}</h2>
						<p class="mb-6 text-muted-foreground">
							{m.email_verified_desc()}
						</p>

						{#if email}
							<div class="mb-6 rounded-lg border border-border bg-muted/50 p-4">
								<div class="flex items-center justify-center gap-2 text-sm">
									<Mail class="h-4 w-4 text-accent" />
									<span class="font-mono">{email}</span>
								</div>
							</div>
						{/if}

						<div class="space-y-3">
							<button
								onclick={() => goto(resolve('/'))}
								class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]"
							>
								<span>{m.continue_to_gameclip()}</span>
								<ArrowRight class="h-5 w-5" />
							</button>

							<p class="text-center text-xs text-muted-foreground">
								{m.redirecting_countdown({ countdown })}
							</p>
						</div>
					</div>
				</div>
			{/if}

			{#if status === 'error'}
				<div in:fade={{ duration: 300, delay: 200 }} class="text-center">
					<div in:scale={{ start: 0, duration: 600, easing: elasticOut, delay: 300 }} class="mb-6">
						<div
							class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-destructive to-red-600 shadow-lg shadow-destructive/30"
						>
							<CircleX class="h-12 w-12 text-white" />
						</div>
					</div>

					<div in:fly={{ y: 10, duration: 400, delay: 400 }}>
						<h2 class="mb-3 text-2xl font-black lg:text-3xl">{m.verification_failed_title()}</h2>
						<p class="mb-6 text-muted-foreground">
							{m.verification_failed_desc()}
						</p>

						<div class="space-y-3">
							<button
								onclick={handleResendEmail}
								class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]"
							>
								<RefreshCw class="h-5 w-5" />
								<span>{m.resend_verification_email()}</span>
							</button>

							<button
								onclick={() => goto(resolve('/login'))}
								class="w-full rounded-lg bg-muted/50 py-3 font-bold text-foreground transition-all hover:bg-muted"
							>
								{m.back_to_login()}
							</button>
						</div>
					</div>
				</div>
			{/if}

			{#if status === 'expired'}
				<div in:fade={{ duration: 300, delay: 200 }} class="text-center">
					<div in:scale={{ start: 0, duration: 600, easing: elasticOut, delay: 300 }} class="mb-6">
						<div
							class="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-orange-500 to-amber-600 shadow-lg shadow-orange-500/30"
						>
							<Mail class="h-12 w-12 text-white" />
						</div>
					</div>

					<div in:fly={{ y: 10, duration: 400, delay: 400 }}>
						<h2 class="mb-3 text-2xl font-black lg:text-3xl">{m.link_expired_title()}</h2>
						<p class="mb-6 text-muted-foreground">
							{m.link_expired_desc()}
						</p>

						<div class="mb-6 rounded-lg border border-border bg-muted/50 p-4">
							<div class="flex items-start gap-3 text-left text-sm">
								<Mail class="mt-0.5 h-5 w-5 shrink-0 text-accent" />
								<div>
									<p class="mb-1 font-semibold">{m.need_new_link_title()}</p>
									<p class="text-xs text-muted-foreground">
										{m.need_new_link_desc()}
									</p>
								</div>
							</div>
						</div>

						<div class="space-y-3">
							<button
								onclick={handleResendEmail}
								class="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 font-bold text-white shadow-lg shadow-primary/30 transition-transform hover:scale-[1.02] hover:bg-primary/90 active:scale-[0.98]"
							>
								<RefreshCw class="h-5 w-5" />
								<span>{m.send_new_verification_email()}</span>
							</button>

							<button
								onclick={() => goto(resolve('/login'))}
								class="w-full rounded-lg bg-muted/50 py-3 font-bold text-foreground transition-all hover:bg-muted"
							>
								{m.back_to_login()}
							</button>
						</div>
					</div>
				</div>
			{/if}
		</div>

		<div in:fade={{ duration: 400, delay: 300 }} class="mt-6 text-center">
			<p class="text-xs text-muted-foreground">
				{m.having_trouble()}
				<a href="#support" class="font-medium text-accent hover:text-accent/80">
					{m.contact_support()}
				</a>
			</p>
		</div>
	</div>
</div>
