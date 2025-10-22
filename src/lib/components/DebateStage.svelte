<script lang="ts">
	import type { DebateTurn } from '$lib/types';
	import DebateTurnComponent from './DebateTurn.svelte';

	interface Props {
		topic: string;
		turns: DebateTurn[];
	}

	let { topic, turns }: Props = $props();

	const forTurns = $derived(turns.filter((t) => t.position === 'FOR'));
	const againstTurns = $derived(turns.filter((t) => t.position === 'AGAINST'));

	let forContainer: HTMLDivElement;
	let againstContainer: HTMLDivElement;

	// Auto-scroll to bottom when content changes
	$effect(() => {
		// Track changes to turns to trigger scroll
		turns;

		// Scroll both containers to bottom
		if (forContainer) {
			forContainer.scrollTop = forContainer.scrollHeight;
		}
		if (againstContainer) {
			againstContainer.scrollTop = againstContainer.scrollHeight;
		}
	});
</script>

<div class="space-y-6">
	<div class="bg-white rounded-lg shadow-lg p-6">
		<h2 class="text-2xl font-bold text-gray-900 mb-2">Debate Topic</h2>
		<p class="text-lg text-gray-700">{topic}</p>
	</div>

	<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
		<!-- FOR Column -->
		<div class="flex flex-col min-h-[300px] max-h-[600px]">
			<div class="bg-blue-600 text-white px-4 py-3 rounded-t-lg">
				<h3 class="text-xl font-bold text-center">FOR</h3>
			</div>
			<div
				bind:this={forContainer}
				class="flex-1 bg-white border-2 border-blue-600 rounded-b-lg p-4 overflow-y-auto"
			>
				<div class="space-y-2">
					{#each forTurns as turn, index}
						<DebateTurnComponent {turn} isLatest={index === forTurns.length - 1} />
					{/each}
				</div>
			</div>
		</div>

		<!-- AGAINST Column -->
		<div class="flex flex-col min-h-[300px] max-h-[600px]">
			<div class="bg-red-600 text-white px-4 py-3 rounded-t-lg">
				<h3 class="text-xl font-bold text-center">AGAINST</h3>
			</div>
			<div
				bind:this={againstContainer}
				class="flex-1 bg-white border-2 border-red-600 rounded-b-lg p-4 overflow-y-auto"
			>
				<div class="space-y-2">
					{#each againstTurns as turn, index}
						<DebateTurnComponent {turn} isLatest={index === againstTurns.length - 1} />
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
