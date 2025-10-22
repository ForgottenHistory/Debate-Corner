<script lang="ts">
	import type { DebateStage, DebateTurn, JudgeEvaluation, Winner, Settings, Position, Personality } from '$lib/types';
	import { calculateOverallWinner } from '$lib/mock/judgeData';
	import { personalities } from '$lib/personalities';
	import DebateSetup from '$lib/components/DebateSetup.svelte';
	import DebateStageComponent from '$lib/components/DebateStage.svelte';
	import JudgeResults from '$lib/components/JudgeResults.svelte';

	let currentStage = $state<DebateStage>('setup');
	let topic = $state('');
	let currentTurns = $state<DebateTurn[]>([]);
	let judges = $state<JudgeEvaluation[]>([]);
	let finalWinner = $state<Winner>('TIE');
	let turnIndex = $state(0);
	let isGenerating = $state(false);
	let debater1Personality = $state<Personality>('honest');
	let debater2Personality = $state<Personality>('honest');

	// Define the debate sequence
	const debateSequence: Array<{ position: Position; type: 'opening' | 'rebuttal'; round?: number }> =
		[
			{ position: 'FOR', type: 'opening' },
			{ position: 'AGAINST', type: 'opening' },
			{ position: 'FOR', type: 'rebuttal', round: 1 },
			{ position: 'AGAINST', type: 'rebuttal', round: 1 },
			{ position: 'FOR', type: 'rebuttal', round: 2 },
			{ position: 'AGAINST', type: 'rebuttal', round: 2 }
		];

	function getSettings(): Settings {
		const stored = localStorage.getItem('debateSettings');
		if (stored) {
			return JSON.parse(stored);
		}
		// Default settings
		return {
			debater1Model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
			debater2Model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
			judge1Model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
			judge2Model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
			judge3Model: 'meta-llama/Meta-Llama-3.1-8B-Instruct',
			responseLength: 'medium'
		};
	}

	function getRandomPersonality(): Personality {
		const personalityKeys = Object.keys(personalities) as Personality[];
		return personalityKeys[Math.floor(Math.random() * personalityKeys.length)];
	}

	function startDebate(newTopic: string) {
		topic = newTopic;
		currentTurns = [];
		turnIndex = 0;
		currentStage = 'opening';

		// Randomly assign personalities
		debater1Personality = getRandomPersonality();
		debater2Personality = getRandomPersonality();

		console.log(`Debate started! FOR: ${debater1Personality}, AGAINST: ${debater2Personality}`);
	}

	async function nextTurn() {
		if (turnIndex >= debateSequence.length || isGenerating) return;

		isGenerating = true;

		const settings = getSettings();
		const currentTurnDef = debateSequence[turnIndex];
		const model =
			currentTurnDef.position === 'FOR' ? settings.debater1Model : settings.debater2Model;
		const personality =
			currentTurnDef.position === 'FOR' ? debater1Personality : debater2Personality;

		// Create a placeholder turn that we'll update as content streams in
		const newTurn: DebateTurn = {
			position: currentTurnDef.position,
			type: currentTurnDef.type,
			round: currentTurnDef.round,
			content: '',
			timestamp: new Date()
		};

		currentTurns = [...currentTurns, newTurn];
		const currentTurnIndex = currentTurns.length - 1;

		try {
			const response = await fetch('/api/debate/stream', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					model,
					position: currentTurnDef.position,
					topic,
					debateHistory: currentTurns.slice(0, -1), // Exclude the placeholder
					turnType: currentTurnDef.type,
					round: currentTurnDef.round,
					responseLength: settings.responseLength,
					personality
				})
			});

			if (!response.ok) {
				throw new Error('Failed to generate response');
			}

			const reader = response.body?.getReader();
			const decoder = new TextDecoder();

			if (!reader) throw new Error('No response body');

			while (true) {
				const { done, value } = await reader.read();
				if (done) break;

				const chunk = decoder.decode(value);
				const lines = chunk.split('\n');

				for (const line of lines) {
					if (line.startsWith('data: ')) {
						const jsonString = line.slice(6);
						try {
							// Parse JSON to preserve newlines and special characters
							const content = JSON.parse(jsonString);
							// Update the turn content incrementally
							currentTurns[currentTurnIndex].content += content;
							currentTurns = [...currentTurns]; // Trigger reactivity
						} catch (e) {
							// Skip invalid JSON
						}
					}
				}
			}

			turnIndex++;
		} catch (error) {
			console.error('Error generating turn:', error);
			alert('Failed to generate debate response. Please try again.');
			// Remove the failed turn
			currentTurns = currentTurns.slice(0, -1);
		} finally {
			isGenerating = false;
		}
	}

	async function showResults() {
		isGenerating = true;
		currentStage = 'judging';

		const settings = getSettings();
		const judgeModels = [settings.judge1Model, settings.judge2Model, settings.judge3Model];

		try {
			// Generate evaluations from all 3 judges SEQUENTIALLY (Featherless has concurrency limit)
			judges = [];
			const usedJudgePersonalities: string[] = [];

			for (let i = 0; i < judgeModels.length; i++) {
				const model = judgeModels[i];

				const response = await fetch('/api/judge', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						model,
						topic,
						debateHistory: currentTurns,
						usedPersonalities: usedJudgePersonalities
					})
				});

				if (!response.ok) {
					const errorData = await response.json();
					console.error(`Judge ${i + 1} error:`, errorData);
					throw new Error(`Judge ${i + 1} failed to evaluate`);
				}

				const data = await response.json();

				judges = [
					...judges,
					{
						judgeNumber: i + 1,
						winner: data.winner as Winner,
						reasoning: data.reasoning,
						personality: data.personality
					}
				];

				// Track which personalities we've used
				if (data.personality) {
					usedJudgePersonalities.push(data.personality);
				}
			}

			finalWinner = calculateOverallWinner(judges);
			currentStage = 'results';
		} catch (error) {
			console.error('Error generating judge evaluations:', error);
			alert('Failed to generate judge evaluations. Please try again.');
			currentStage = 'opening';
		} finally {
			isGenerating = false;
		}
	}

	function reset() {
		currentStage = 'setup';
		topic = '';
		currentTurns = [];
		judges = [];
		finalWinner = 'TIE';
		turnIndex = 0;
	}
</script>

<div class="min-h-screen bg-gray-50 py-8 px-4">
	<div class="max-w-7xl mx-auto">
		{#if currentStage === 'setup'}
			<DebateSetup onstart={startDebate} />
		{:else if currentStage === 'opening' || currentStage === 'round1' || currentStage === 'round2'}
			<DebateStageComponent
				{topic}
				turns={currentTurns}
			/>

			<div class="mt-6 flex justify-center gap-4">
				{#if turnIndex < debateSequence.length}
					<button
						onclick={nextTurn}
						disabled={isGenerating}
						class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{isGenerating ? 'Generating...' : 'Next Turn'}
					</button>
				{:else}
					<button
						onclick={showResults}
						class="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
					>
						View Judge Results
					</button>
				{/if}
			</div>
		{:else if currentStage === 'judging'}
			<div class="flex flex-col items-center justify-center py-20">
				<div
					class="animate-spin h-12 w-12 border-4 border-purple-600 border-t-transparent rounded-full mb-4"
				></div>
				<h2 class="text-2xl font-bold text-gray-900 mb-2">Judges are deliberating...</h2>
				<p class="text-gray-600">Evaluating the debate and determining the winner</p>
			</div>
		{:else if currentStage === 'results'}
			<JudgeResults
				evaluations={judges}
				{finalWinner}
				onreset={reset}
				{topic}
				turns={currentTurns}
				debater1Personality={debater1Personality}
				debater2Personality={debater2Personality}
			/>
		{/if}
	</div>
</div>
