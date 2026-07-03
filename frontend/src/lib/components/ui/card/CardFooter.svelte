<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, class: className, ...rest }: HTMLAttributes<HTMLDivElement> = $props();
</script>

<div
	data-slot="card-footer"
	class={cn('flex items-center px-6 pb-6 [.border-t]:pt-6', className)}
	{...rest}
>
	{@render children?.()}
</div>
