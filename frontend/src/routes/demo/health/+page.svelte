<script lang="ts">
	import { env } from '$env/dynamic/public';
	const API_BASE = env.PUBLIC_API_URL || 'http://localhost:3000';

	let status = $state<string>('idle');
	let data = $state<{ status: string; timestamp: string; uptime: number } | null>(null);
	let error = $state<string | null>(null);

	async function checkHealth() {
		status = 'loading';
		error = null;
		data = null;

		try {
			const res = await fetch(`${API_BASE}/api/health`);

			if (!res.ok) {
				throw new Error(`HTTP ${res.status}: ${res.statusText}`);
			}

			data = await res.json();
			status = 'success';
		} catch (err) {
			error = err instanceof Error ? err.message : 'Unknown error';
			status = 'error';
		}
	}
</script>

<div class="mx-auto max-w-md space-y-6 p-8">
	<h1 class="text-2xl font-bold">Backend Health Check</h1>
	<p class="text-sm text-gray-500">
		Fetches <code class="rounded bg-gray-100 px-1 dark:bg-gray-800">GET /api/health</code> from the
		backend on port 3000.
	</p>

	<button
		onclick={checkHealth}
		disabled={status === 'loading'}
		class="rounded-lg bg-indigo-600 px-4 py-2 text-white transition-colors hover:bg-indigo-700 disabled:opacity-50"
	>
		{status === 'loading' ? 'Checking…' : 'Check Backend'}
	</button>

	{#if status === 'success' && data}
		<div class="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-950">
			<p class="font-semibold text-green-700 dark:text-green-300">✅ Backend is online</p>
			<ul class="mt-2 space-y-1 text-sm text-green-600 dark:text-green-400">
				<li><strong>Status:</strong> {data.status}</li>
				<li><strong>Timestamp:</strong> {data.timestamp}</li>
				<li><strong>Uptime:</strong> {data.uptime.toFixed(1)}s</li>
			</ul>
		</div>
	{/if}

	{#if status === 'error'}
		<div class="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-950">
			<p class="font-semibold text-red-700 dark:text-red-300">❌ Connection failed</p>
			<p class="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
		</div>
	{/if}
</div>
