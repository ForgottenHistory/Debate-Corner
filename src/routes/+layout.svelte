<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>AI Debate Arena</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<header class="bg-white shadow-sm border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 py-4">
			<div class="flex items-center justify-between">
				<a href="/" class="text-2xl font-bold text-gray-900">
					AI Debate Arena
				</a>
				<div class="flex gap-3">
					<a
						href="/personalities"
						class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
					>
						Personalities
					</a>
					<a
						href="/settings"
						class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
					>
						Settings
					</a>
				</div>
			</div>
		</div>
	</header>

	<main>
		{@render children?.()}
	</main>
</div>
