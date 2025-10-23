<script lang="ts">
	import type { LLMParameters } from '$lib/types';

	interface Props {
		params: LLMParameters;
		label: string;
	}

	let { params, label }: Props = $props();
</script>

<div class="space-y-4">
	<!-- Temperature -->
	<div>
		<div class="flex justify-between items-center mb-2">
			<label class="text-sm font-medium text-gray-700">Temperature</label>
			<span class="text-sm text-gray-600 font-mono">{params.temperature.toFixed(2)}</span>
		</div>
		<input
			type="range"
			min="0"
			max="2"
			step="0.01"
			bind:value={params.temperature}
			class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
		/>
		<p class="text-xs text-gray-500 mt-1">Lower = deterministic, Higher = random</p>
	</div>

	<!-- Top P -->
	<div>
		<div class="flex justify-between items-center mb-2">
			<label class="text-sm font-medium text-gray-700">Top P</label>
			<span class="text-sm text-gray-600 font-mono">{params.topP.toFixed(2)}</span>
		</div>
		<input
			type="range"
			min="0.01"
			max="1"
			step="0.01"
			bind:value={params.topP}
			class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
		/>
		<p class="text-xs text-gray-500 mt-1">Cumulative probability of top tokens</p>
	</div>

	<!-- Top K -->
	<div>
		<div class="flex justify-between items-center mb-2">
			<label class="text-sm font-medium text-gray-700">Top K</label>
			<span class="text-sm text-gray-600 font-mono">{params.topK}</span>
		</div>
		<input
			type="range"
			min="-1"
			max="100"
			step="1"
			bind:value={params.topK}
			class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
		/>
		<p class="text-xs text-gray-500 mt-1">-1 = all tokens, or limit top tokens</p>
	</div>

	<!-- Frequency Penalty -->
	<div>
		<div class="flex justify-between items-center mb-2">
			<label class="text-sm font-medium text-gray-700">Frequency Penalty</label>
			<span class="text-sm text-gray-600 font-mono">{params.frequencyPenalty.toFixed(2)}</span>
		</div>
		<input
			type="range"
			min="-2"
			max="2"
			step="0.01"
			bind:value={params.frequencyPenalty}
			class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
		/>
		<p class="text-xs text-gray-500 mt-1">&gt; 0 = new tokens, &lt; 0 = repetition</p>
	</div>

	<!-- Presence Penalty -->
	<div>
		<div class="flex justify-between items-center mb-2">
			<label class="text-sm font-medium text-gray-700">Presence Penalty</label>
			<span class="text-sm text-gray-600 font-mono">{params.presencePenalty.toFixed(2)}</span>
		</div>
		<input
			type="range"
			min="-2"
			max="2"
			step="0.01"
			bind:value={params.presencePenalty}
			class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
		/>
		<p class="text-xs text-gray-500 mt-1">&gt; 0 = new tokens, &lt; 0 = repetition</p>
	</div>

	<!-- Repetition Penalty -->
	<div>
		<div class="flex justify-between items-center mb-2">
			<label class="text-sm font-medium text-gray-700">Repetition Penalty</label>
			<span class="text-sm text-gray-600 font-mono">{params.repetitionPenalty.toFixed(2)}</span>
		</div>
		<input
			type="range"
			min="0"
			max="2"
			step="0.01"
			bind:value={params.repetitionPenalty}
			class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
		/>
		<p class="text-xs text-gray-500 mt-1">&gt; 1 = new tokens, &lt; 1 = repetition</p>
	</div>

	<!-- Min P -->
	<div>
		<div class="flex justify-between items-center mb-2">
			<label class="text-sm font-medium text-gray-700">Min P</label>
			<span class="text-sm text-gray-600 font-mono">{params.minP.toFixed(2)}</span>
		</div>
		<input
			type="range"
			min="0"
			max="1"
			step="0.01"
			bind:value={params.minP}
			class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
		/>
		<p class="text-xs text-gray-500 mt-1">Minimum probability threshold, 0 = disabled</p>
	</div>

	<!-- Max Tokens -->
	<div>
		<div class="flex justify-between items-center mb-2">
			<label class="text-sm font-medium text-gray-700">Max Tokens</label>
			<span class="text-sm text-gray-600 font-mono">{params.maxTokens}</span>
		</div>
		<input
			type="range"
			min="100"
			max="2000"
			step="50"
			bind:value={params.maxTokens}
			class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
		/>
		<p class="text-xs text-gray-500 mt-1">Maximum tokens to generate</p>
	</div>
</div>
