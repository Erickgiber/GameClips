<script lang="ts">
	import { cn } from '$lib/utils';
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, class: className, ...rest }: HTMLAttributes<HTMLParagraphElement> = $props();
</script>

<p data-slot="card-description" class={cn('text-muted-foreground', className)} {...rest}>
	{@render children?.()}
</p>
