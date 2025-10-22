<script lang="ts">
	import { onMount } from 'svelte';
	import type { Settings } from '$lib/types';
	import ModelSelector from '$lib/components/ModelSelector.svelte';
	import { modelsStore } from '$lib/stores/models';

	const defaultSettings: Settings = {
		debater1Model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
		debater2Model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
		judge1Model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
		judge2Model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
		judge3Model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
		responseLength: 'medium'
	};

	let settings = $state<Settings>(defaultSettings);
	let saveMessage = $state('');

	onMount(async () => {
		// Fetch models once when page loads
		await modelsStore.fetch();

		// Load saved settings
		const stored = localStorage.getItem('debateSettings');
		if (stored) {
			try {
				const parsed = JSON.parse(stored);
				// Merge with defaults to handle any missing fields
				settings = { ...defaultSettings, ...parsed };
			} catch (e) {
				console.error('Failed to parse settings:', e);
			}
		}
	});

	function saveSettings() {
		localStorage.setItem('debateSettings', JSON.stringify(settings));
		saveMessage = 'Settings saved successfully!';
		setTimeout(() => {
			saveMessage = '';
		}, 3000);
	}
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4">
	<div class="max-w-3xl mx-auto">
		<div class="bg-white rounded-lg shadow-lg p-8">
			<div class="flex items-center justify-between mb-8">
				<h1 class="text-3xl font-bold text-gray-900">Settings</h1>
				<a
					href="/"
					class="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
				>
					← Back to Debate
				</a>
			</div>

			<p class="text-gray-600 mb-8">
				Configure the AI models for debaters and judges. These settings will be used for all
				debates.
			</p>

			<div class="space-y-8">
				<!-- Debaters Section -->
				<div>
					<h2 class="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Debaters</h2>
					<p class="text-sm text-gray-600 mb-4">
						Personalities are randomly assigned at the start of each debate.
						<a href="/personalities" class="text-blue-600 hover:underline">View personalities</a>
					</p>
					<div class="space-y-4">
						<ModelSelector
							label="Debater 1 (FOR)"
							bind:value={settings.debater1Model}
							onchange={() => {}}
						/>
						<ModelSelector
							label="Debater 2 (AGAINST)"
							bind:value={settings.debater2Model}
							onchange={() => {}}
						/>
					</div>
				</div>

				<!-- Response Length Section -->
				<div>
					<h2 class="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">
						Response Length
					</h2>
					<div class="space-y-3">
						<p class="text-sm text-gray-600">
							Control how long debater responses should be
						</p>
						<div class="flex gap-3">
							<label class="flex-1">
								<input
									type="radio"
									name="responseLength"
									value="short"
									bind:group={settings.responseLength}
									class="sr-only peer"
								/>
								<div
									class="cursor-pointer border-2 border-gray-300 rounded-lg p-4 text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:border-blue-400 transition-colors"
								>
									<div class="font-semibold text-gray-900">Short</div>
									<div class="text-xs text-gray-600 mt-1">75-150 words</div>
								</div>
							</label>
							<label class="flex-1">
								<input
									type="radio"
									name="responseLength"
									value="medium"
									bind:group={settings.responseLength}
									class="sr-only peer"
								/>
								<div
									class="cursor-pointer border-2 border-gray-300 rounded-lg p-4 text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:border-blue-400 transition-colors"
								>
									<div class="font-semibold text-gray-900">Medium</div>
									<div class="text-xs text-gray-600 mt-1">150-250 words</div>
								</div>
							</label>
							<label class="flex-1">
								<input
									type="radio"
									name="responseLength"
									value="long"
									bind:group={settings.responseLength}
									class="sr-only peer"
								/>
								<div
									class="cursor-pointer border-2 border-gray-300 rounded-lg p-4 text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:border-blue-400 transition-colors"
								>
									<div class="font-semibold text-gray-900">Long</div>
									<div class="text-xs text-gray-600 mt-1">250-400 words</div>
								</div>
							</label>
						</div>
					</div>
				</div>

				<!-- Judges Section -->
				<div>
					<h2 class="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b">Judges</h2>
					<div class="space-y-4">
						<ModelSelector
							label="Judge 1"
							bind:value={settings.judge1Model}
							onchange={() => {}}
						/>
						<ModelSelector
							label="Judge 2"
							bind:value={settings.judge2Model}
							onchange={() => {}}
						/>
						<ModelSelector
							label="Judge 3"
							bind:value={settings.judge3Model}
							onchange={() => {}}
						/>
					</div>
				</div>
			</div>

			<!-- Save Button -->
			<div class="mt-8 pt-6 border-t">
				<button
					onclick={saveSettings}
					class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
				>
					Save Settings
				</button>

				{#if saveMessage}
					<div class="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center">
						{saveMessage}
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>
