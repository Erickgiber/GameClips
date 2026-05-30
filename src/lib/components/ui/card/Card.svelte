<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, class: className, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	data-slot="card"
	class={cn('flex flex-col gap-6 rounded-xl border bg-card text-card-foreground', className)}
	{...rest}
>
	{@render children?.()}
</div>
