<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { goto } from '$app/navigation';

	let { children } = $props();

	function navigateHome() {
		// Force a full page reload to reset state
		window.location.href = '/';
	}

	function navigateToPersonalities() {
		goto('/personalities');
	}

	function navigateToSettings() {
		goto('/settings');
	}
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>AI Debate Arena</title>
</svelte:head>

<div class="min-h-screen bg-gray-50">
	<header class="bg-white shadow-sm border-b border-gray-200">
		<div class="max-w-7xl mx-auto px-4 py-4">
			<div class="flex items-center justify-between">
				<button onclick={navigateHome} class="text-2xl font-bold text-gray-900 hover:text-gray-700 transition-colors">
					AI Debate Arena
				</button>
				<div class="flex gap-3">
					<button
						onclick={navigateToPersonalities}
						class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
					>
						Personalities
					</button>
					<button
						onclick={navigateToSettings}
						class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
					>
						Settings
					</button>
				</div>
			</div>
		</div>
	</header>

	<main>
		{@render children?.()}
	</main>
</div>
