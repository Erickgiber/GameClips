<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, class: className, ...rest }: HTMLAttributes<HTMLHeadingElement> = $props();
</script>

<h4 data-slot="card-title" class={cn('leading-none', className)} {...rest}>
	{@render children?.()}
</h4>
