<script lang="ts">
	import { onMount } from 'svelte';
	import type { Settings, LLMParameters } from '$lib/types';
	import ModelSelector from '$lib/components/ModelSelector.svelte';
	import LLMParametersControl from '$lib/components/LLMParametersControl.svelte';
	import { modelsStore } from '$lib/stores/models';

	const defaultLLMParams: LLMParameters = {
		temperature: 0.8,
		topP: 1.0,
		topK: -1,
		frequencyPenalty: 0.0,
		presencePenalty: 0.0,
		repetitionPenalty: 1.0,
		minP: 0.0,
		maxTokens: 800
	};

	const defaultSettings: Settings = {
		provider: 'featherless',
		debater1Model: '',
		debater2Model: '',
		judge1Model: '',
		judge2Model: '',
		judge3Model: '',
		responseLength: 'medium',
		debater1Params: { ...defaultLLMParams },
		debater2Params: { ...defaultLLMParams },
		judge1Params: { ...defaultLLMParams, maxTokens: 400 },
		judge2Params: { ...defaultLLMParams, maxTokens: 400 },
		judge3Params: { ...defaultLLMParams, maxTokens: 400 }
	};

	let settings = $state<Settings>(defaultSettings);
	let saveMessage = $state('');

	// Collapsible state for each section
	let debater1Expanded = $state(false);
	let debater2Expanded = $state(false);
	let judge1Expanded = $state(false);
	let judge2Expanded = $state(false);
	let judge3Expanded = $state(false);

	onMount(async () => {
		// Load saved settings first
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

		// Fetch models for the selected provider
		await modelsStore.fetch(settings.provider);

		// Set default models if none selected
		const unsubscribe = modelsStore.subscribe(models => {
			if (models.length > 0) {
				const firstModel = models[0].id;
				if (!settings.debater1Model) settings.debater1Model = firstModel;
				if (!settings.debater2Model) settings.debater2Model = firstModel;
				if (!settings.judge1Model) settings.judge1Model = firstModel;
				if (!settings.judge2Model) settings.judge2Model = firstModel;
				if (!settings.judge3Model) settings.judge3Model = firstModel;
			}
		});

		return () => unsubscribe();
	});

	// Refetch models when provider changes
	async function handleProviderChange() {
		await modelsStore.fetch(settings.provider);

		// Reset models to first available when provider changes
		const unsubscribe = modelsStore.subscribe(models => {
			if (models.length > 0) {
				const firstModel = models[0].id;
				settings.debater1Model = firstModel;
				settings.debater2Model = firstModel;
				settings.judge1Model = firstModel;
				settings.judge2Model = firstModel;
				settings.judge3Model = firstModel;
				unsubscribe();
			}
		});
	}

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

			<div class="space-y-6">
				<!-- Provider Selection Section -->
				<div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<h2 class="text-lg font-semibold text-gray-800 mb-3">LLM Provider</h2>
					<p class="text-sm text-gray-600 mb-3">
						Choose which API provider to use for accessing language models
					</p>
					<div class="flex gap-3">
						<label class="flex-1">
							<input
								type="radio"
								name="provider"
								value="featherless"
								bind:group={settings.provider}
								onchange={handleProviderChange}
								class="sr-only peer"
							/>
							<div
								class="cursor-pointer border-2 border-gray-300 rounded-lg p-4 peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:border-blue-400 transition-colors"
							>
								<div class="font-semibold text-gray-900">Featherless AI</div>
								<div class="text-xs text-gray-600 mt-1">Open-source models, subscription</div>
							</div>
						</label>
						<label class="flex-1">
							<input
								type="radio"
								name="provider"
								value="openrouter"
								bind:group={settings.provider}
								onchange={handleProviderChange}
								class="sr-only peer"
							/>
							<div
								class="cursor-pointer border-2 border-gray-300 rounded-lg p-4 peer-checked:border-blue-600 peer-checked:bg-blue-50 hover:border-blue-400 transition-colors"
							>
								<div class="font-semibold text-gray-900">OpenRouter</div>
								<div class="text-xs text-gray-600 mt-1">Hundreds of models, pay-per-use</div>
							</div>
						</label>
					</div>
				</div>

				<!-- Response Length Section -->
				<div class="bg-gray-50 p-4 rounded-lg border border-gray-200">
					<h2 class="text-lg font-semibold text-gray-800 mb-3">Response Length</h2>
					<p class="text-sm text-gray-600 mb-3">
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

				<!-- Debater 1 -->
				<div class="border border-gray-200 rounded-lg overflow-hidden">
					<button
						onclick={() => (debater1Expanded = !debater1Expanded)}
						class="w-full bg-gradient-to-r from-blue-50 to-blue-100 p-4 flex justify-between items-center hover:from-blue-100 hover:to-blue-150 transition-colors"
					>
						<div class="flex items-center gap-3">
							<span class="text-2xl">⚖️</span>
							<h2 class="text-lg font-semibold text-gray-800">Debater 1 (FOR)</h2>
						</div>
						<svg
							class="w-5 h-5 text-gray-600 transition-transform"
							class:rotate-180={debater1Expanded}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					{#if debater1Expanded}
						<div class="p-4 space-y-4 bg-white">
							<ModelSelector
								label="Model"
								bind:value={settings.debater1Model}
								onchange={() => {}}
							/>
							<div class="pt-2 border-t">
								<h3 class="text-sm font-semibold text-gray-700 mb-3">LLM Parameters</h3>
								<LLMParametersControl bind:params={settings.debater1Params} label="Debater 1" />
							</div>
						</div>
					{/if}
				</div>

				<!-- Debater 2 -->
				<div class="border border-gray-200 rounded-lg overflow-hidden">
					<button
						onclick={() => (debater2Expanded = !debater2Expanded)}
						class="w-full bg-gradient-to-r from-red-50 to-red-100 p-4 flex justify-between items-center hover:from-red-100 hover:to-red-150 transition-colors"
					>
						<div class="flex items-center gap-3">
							<span class="text-2xl">⚖️</span>
							<h2 class="text-lg font-semibold text-gray-800">Debater 2 (AGAINST)</h2>
						</div>
						<svg
							class="w-5 h-5 text-gray-600 transition-transform"
							class:rotate-180={debater2Expanded}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					{#if debater2Expanded}
						<div class="p-4 space-y-4 bg-white">
							<ModelSelector
								label="Model"
								bind:value={settings.debater2Model}
								onchange={() => {}}
							/>
							<div class="pt-2 border-t">
								<h3 class="text-sm font-semibold text-gray-700 mb-3">LLM Parameters</h3>
								<LLMParametersControl bind:params={settings.debater2Params} label="Debater 2" />
							</div>
						</div>
					{/if}
				</div>

				<!-- Judge 1 -->
				<div class="border border-gray-200 rounded-lg overflow-hidden">
					<button
						onclick={() => (judge1Expanded = !judge1Expanded)}
						class="w-full bg-gradient-to-r from-purple-50 to-purple-100 p-4 flex justify-between items-center hover:from-purple-100 hover:to-purple-150 transition-colors"
					>
						<div class="flex items-center gap-3">
							<span class="text-2xl">⚖️</span>
							<h2 class="text-lg font-semibold text-gray-800">Judge 1</h2>
						</div>
						<svg
							class="w-5 h-5 text-gray-600 transition-transform"
							class:rotate-180={judge1Expanded}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					{#if judge1Expanded}
						<div class="p-4 space-y-4 bg-white">
							<ModelSelector
								label="Model"
								bind:value={settings.judge1Model}
								onchange={() => {}}
							/>
							<div class="pt-2 border-t">
								<h3 class="text-sm font-semibold text-gray-700 mb-3">LLM Parameters</h3>
								<LLMParametersControl bind:params={settings.judge1Params} label="Judge 1" />
							</div>
						</div>
					{/if}
				</div>

				<!-- Judge 2 -->
				<div class="border border-gray-200 rounded-lg overflow-hidden">
					<button
						onclick={() => (judge2Expanded = !judge2Expanded)}
						class="w-full bg-gradient-to-r from-purple-50 to-purple-100 p-4 flex justify-between items-center hover:from-purple-100 hover:to-purple-150 transition-colors"
					>
						<div class="flex items-center gap-3">
							<span class="text-2xl">⚖️</span>
							<h2 class="text-lg font-semibold text-gray-800">Judge 2</h2>
						</div>
						<svg
							class="w-5 h-5 text-gray-600 transition-transform"
							class:rotate-180={judge2Expanded}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					{#if judge2Expanded}
						<div class="p-4 space-y-4 bg-white">
							<ModelSelector
								label="Model"
								bind:value={settings.judge2Model}
								onchange={() => {}}
							/>
							<div class="pt-2 border-t">
								<h3 class="text-sm font-semibold text-gray-700 mb-3">LLM Parameters</h3>
								<LLMParametersControl bind:params={settings.judge2Params} label="Judge 2" />
							</div>
						</div>
					{/if}
				</div>

				<!-- Judge 3 -->
				<div class="border border-gray-200 rounded-lg overflow-hidden">
					<button
						onclick={() => (judge3Expanded = !judge3Expanded)}
						class="w-full bg-gradient-to-r from-purple-50 to-purple-100 p-4 flex justify-between items-center hover:from-purple-100 hover:to-purple-150 transition-colors"
					>
						<div class="flex items-center gap-3">
							<span class="text-2xl">⚖️</span>
							<h2 class="text-lg font-semibold text-gray-800">Judge 3</h2>
						</div>
						<svg
							class="w-5 h-5 text-gray-600 transition-transform"
							class:rotate-180={judge3Expanded}
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
						</svg>
					</button>
					{#if judge3Expanded}
						<div class="p-4 space-y-4 bg-white">
							<ModelSelector
								label="Model"
								bind:value={settings.judge3Model}
								onchange={() => {}}
							/>
							<div class="pt-2 border-t">
								<h3 class="text-sm font-semibold text-gray-700 mb-3">LLM Parameters</h3>
								<LLMParametersControl bind:params={settings.judge3Params} label="Judge 3" />
							</div>
						</div>
					{/if}
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
