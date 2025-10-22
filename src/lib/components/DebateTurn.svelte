<script lang="ts">
	import type { DebateTurn } from '$lib/types';

	interface Props {
		turn: DebateTurn;
		isLatest: boolean;
	}

	let { turn, isLatest }: Props = $props();

	const bgColor = turn.position === 'FOR' ? 'bg-blue-50' : 'bg-red-50';
	const borderColor = turn.position === 'FOR' ? 'border-blue-300' : 'border-red-300';
	const textColor = turn.position === 'FOR' ? 'text-blue-900' : 'text-red-900';
	const badgeColor = turn.position === 'FOR' ? 'bg-blue-600' : 'bg-red-600';

	const turnLabel = turn.type === 'opening' ? 'Opening Statement' : `Round ${turn.round} Rebuttal`;

	let isExpanded = $state(false);
</script>

{#if isLatest}
	<!-- Latest turn - fully expanded -->
	<div class="p-4 {bgColor} border {borderColor} rounded-lg shadow-sm">
		<div class="flex items-center gap-2 mb-3">
			<span class="{badgeColor} text-white px-3 py-1 rounded-full text-sm font-semibold">
				{turn.position}
			</span>
			<span class="text-sm font-medium {textColor}">
				{turnLabel}
			</span>
		</div>
		<p class="text-gray-800 leading-relaxed whitespace-pre-wrap">
			{turn.content}
		</p>
	</div>
{:else}
	<!-- Previous turn - collapsed -->
	<button
		onclick={() => (isExpanded = !isExpanded)}
		class="w-full text-left p-3 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors"
	>
		<div class="flex items-center justify-between">
			<div class="flex items-center gap-2">
				<span class="{badgeColor} text-white px-2 py-0.5 rounded-full text-xs font-semibold">
					{turn.position}
				</span>
				<span class="text-xs font-medium text-gray-700">
					{turnLabel}
				</span>
			</div>
			<svg
				class="w-4 h-4 text-gray-500 transition-transform {isExpanded ? 'rotate-180' : ''}"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
			>
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
			</svg>
		</div>
		{#if isExpanded}
			<p class="text-sm text-gray-700 leading-relaxed mt-2 whitespace-pre-wrap">
				{turn.content}
			</p>
		{/if}
	</button>
{/if}
