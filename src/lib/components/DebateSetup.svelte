<script lang="ts">
	import { personalities } from '$lib/personalities';
	import type { Personality } from '$lib/types';

	interface Props {
		onstart: (topic: string, debater1Personality: string, debater2Personality: string) => void;
	}

	let { onstart }: Props = $props();

	let topic = $state('');
	let debater1Personality = $state<string>('random');
	let debater2Personality = $state<string>('random');

	// Get personality keys for the dropdown
	const personalityKeys = Object.keys(personalities);
	const personalityOptions = [
		{ key: 'random', name: 'Random' },
		...personalityKeys.map(key => ({ key, name: personalities[key].name }))
	];

	function handleSubmit(e: Event) {
		e.preventDefault();
		if (topic.trim()) {
			onstart(topic.trim(), debater1Personality, debater2Personality);
		}
	}
</script>

<div class="max-w-2xl mx-auto">
	<div class="bg-white rounded-lg shadow-lg p-8">
		<h1 class="text-3xl font-bold text-gray-900 mb-2">AI Debate Arena</h1>
		<p class="text-gray-600 mb-8">
			Watch two AI models debate any topic. Set your debate topic below to begin.
		</p>

		<form onsubmit={handleSubmit} class="space-y-6">
			<div>
				<label for="topic" class="block text-sm font-medium text-gray-700 mb-2">
					Debate Topic
				</label>
				<input
					type="text"
					id="topic"
					bind:value={topic}
					placeholder="e.g., Universal Basic Income is beneficial for society"
					class="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
					required
				/>
			</div>

			<div class="grid grid-cols-2 gap-4">
				<div>
					<label for="debater1" class="block text-sm font-medium text-gray-700 mb-2">
						Debater 1 (FOR) Personality
					</label>
					<select
						id="debater1"
						bind:value={debater1Personality}
						class="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
					>
						{#each personalityOptions as option}
							<option value={option.key}>{option.name}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="debater2" class="block text-sm font-medium text-gray-700 mb-2">
						Debater 2 (AGAINST) Personality
					</label>
					<select
						id="debater2"
						bind:value={debater2Personality}
						class="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
					>
						{#each personalityOptions as option}
							<option value={option.key}>{option.name}</option>
						{/each}
					</select>
				</div>
			</div>

			<button
				type="submit"
				class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
			>
				Start Debate
			</button>
		</form>

		<div class="mt-6 pt-6 border-t border-gray-200">
			<p class="text-sm text-gray-600 text-center">
				Configure AI models in
				<a href="/settings" class="text-blue-600 hover:underline">Settings</a>
			</p>
		</div>
	</div>
</div>
