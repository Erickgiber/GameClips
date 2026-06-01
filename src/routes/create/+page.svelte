<script lang="ts">
	import { resolve } from '$app/paths';
	import AuthGuard from '$lib/components/auth/AuthGuard.svelte';
	import { m } from '$lib/paraglide/messages';
	import { ArrowLeft, SquarePlus, Video, WandSparkles } from 'lucide-svelte';
</script>

<AuthGuard>
	<div class="min-h-screen bg-background px-4 pt-6 pb-28 text-foreground">
		<div class="mx-auto flex max-w-3xl flex-col gap-6">
			<a
				href={resolve('/')}
				class="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium backdrop-blur-sm transition-colors hover:bg-card"
			>
				<ArrowLeft class="h-4 w-4" />
				{m.back_to_home()}
			</a>

			<section
				class="relative overflow-hidden rounded-4xl border border-border bg-card/70 p-6 shadow-2xl shadow-black/20 backdrop-blur-xl"
			>
				<div
					class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,191,36,0.22),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(244,63,94,0.20),transparent_40%)]"
				></div>
				<div class="relative space-y-5">
					<div
						class="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/20"
					>
						<SquarePlus class="h-8 w-8" />
					</div>
					<div>
						<p class="text-xs font-semibold tracking-[0.3em] text-primary uppercase">
							{m.almostThere()}
						</p>
						<h1 class="mt-2 text-3xl font-black sm:text-4xl">Create</h1>
						<p class="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
							Clip upload, trim tools and publishing settings will live in this space.
						</p>
					</div>

					<div class="grid gap-3 sm:grid-cols-2">
						<div class="rounded-2xl border border-white/10 bg-background/60 p-4">
							<div class="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
								<Video class="h-4 w-4 text-accent" />
								Upload pipeline
							</div>
							<p class="text-sm text-muted-foreground">
								Add raw footage, choose a cover and prepare your next highlight.
							</p>
						</div>
						<div class="rounded-2xl border border-white/10 bg-background/60 p-4">
							<div class="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
								<WandSparkles class="h-4 w-4 text-secondary" />
								Editing tools
							</div>
							<p class="text-sm text-muted-foreground">
								Caption presets, trimming and publish options can be attached here next.
							</p>
						</div>
					</div>
				</div>
			</section>
		</div>
	</div>
</AuthGuard>
