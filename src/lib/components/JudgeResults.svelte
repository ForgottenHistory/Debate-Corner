<script lang="ts">
	import type { JudgeEvaluation, Winner, DebateTurn } from '$lib/types';

	interface Props {
		evaluations: JudgeEvaluation[];
		finalWinner: Winner;
		onreset: () => void;
		topic: string;
		turns: DebateTurn[];
		debater1Personality: string;
		debater2Personality: string;
	}

	let { evaluations, finalWinner, onreset, topic, turns, debater1Personality, debater2Personality }: Props = $props();

	function getWinnerColor(winner: Winner): string {
		if (winner === 'FOR') return 'text-blue-600 bg-blue-100';
		if (winner === 'AGAINST') return 'text-red-600 bg-red-100';
		return 'text-gray-600 bg-gray-100';
	}

	function getFinalWinnerColor(winner: Winner): string {
		if (winner === 'FOR') return 'bg-blue-600';
		if (winner === 'AGAINST') return 'bg-red-600';
		return 'bg-gray-600';
	}

	function formatDebateTranscript(): string {
		let text = `DEBATE TRANSCRIPT\n`;
		text += `${'='.repeat(80)}\n\n`;
		text += `Topic: ${topic}\n\n`;
		text += `FOR (${debater1Personality})\n`;
		text += `AGAINST (${debater2Personality})\n\n`;
		text += `${'='.repeat(80)}\n\n`;

		turns.forEach((turn) => {
			const turnLabel = turn.type === 'opening'
				? 'OPENING STATEMENT'
				: `ROUND ${turn.round} REBUTTAL`;

			text += `${turn.position} - ${turnLabel}\n`;
			text += `${'-'.repeat(80)}\n`;
			text += `${turn.content}\n\n\n`;
		});

		return text;
	}

	function formatJudgeOpinions(): string {
		let text = `JUDGE EVALUATIONS\n`;
		text += `${'='.repeat(80)}\n\n`;
		text += `Topic: ${topic}\n\n`;
		text += `Final Winner: ${finalWinner}\n\n`;
		text += `${'='.repeat(80)}\n\n`;

		evaluations.forEach((evaluation) => {
			text += `JUDGE ${evaluation.judgeNumber}`;
			if (evaluation.personality) {
				text += ` (${evaluation.personality})`;
			}
			text += `\n`;
			text += `${'-'.repeat(80)}\n`;
			text += `Winner: ${evaluation.winner}\n\n`;
			text += `Reasoning:\n${evaluation.reasoning}\n\n\n`;
		});

		return text;
	}

	function formatEverything(): string {
		return formatDebateTranscript() + '\n\n' + formatJudgeOpinions();
	}

	function downloadText(content: string, filename: string) {
		const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}

	function exportDebate() {
		const content = formatDebateTranscript();
		const sanitizedTopic = topic.replace(/[^a-z0-9]/gi, '_').toLowerCase();
		downloadText(content, `debate_${sanitizedTopic}.txt`);
	}

	function exportJudges() {
		const content = formatJudgeOpinions();
		const sanitizedTopic = topic.replace(/[^a-z0-9]/gi, '_').toLowerCase();
		downloadText(content, `judges_${sanitizedTopic}.txt`);
	}

	function exportEverything() {
		const content = formatEverything();
		const sanitizedTopic = topic.replace(/[^a-z0-9]/gi, '_').toLowerCase();
		downloadText(content, `full_debate_${sanitizedTopic}.txt`);
	}
</script>

<div class="space-y-6">
	<!-- Final Winner Announcement -->
	<div class="{getFinalWinnerColor(finalWinner)} text-white rounded-lg shadow-lg p-8 text-center">
		<h2 class="text-3xl font-bold mb-2">Debate Complete!</h2>
		<p class="text-xl">
			{#if finalWinner === 'TIE'}
				The debate ended in a tie!
			{:else}
				Winner: <span class="font-bold">{finalWinner}</span>
			{/if}
		</p>
	</div>

	<!-- Individual Judge Evaluations -->
	<div class="bg-white rounded-lg shadow-lg p-6">
		<div class="flex items-center justify-between mb-6">
			<h3 class="text-2xl font-bold text-gray-900">Judge Evaluations</h3>

			<!-- Export Buttons -->
			<div class="flex gap-2">
				<button
					onclick={exportDebate}
					class="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold py-2 px-4 rounded transition-colors"
				>
					Export Debate
				</button>
				<button
					onclick={exportJudges}
					class="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 px-4 rounded transition-colors"
				>
					Export Judges
				</button>
				<button
					onclick={exportEverything}
					class="bg-purple-500 hover:bg-purple-600 text-white text-sm font-semibold py-2 px-4 rounded transition-colors"
				>
					Export All
				</button>
			</div>
		</div>

		<div class="grid gap-6">
			{#each evaluations as evaluation}
				<div class="border border-gray-200 rounded-lg p-5">
					<div class="flex items-center justify-between mb-3">
						<div>
							<h4 class="text-lg font-semibold text-gray-800">
								Judge {evaluation.judgeNumber}
							</h4>
							{#if evaluation.personality}
								<p class="text-sm text-gray-500 italic">{evaluation.personality}</p>
							{/if}
						</div>
						<span
							class="{getWinnerColor(evaluation.winner)} px-3 py-1 rounded-full text-sm font-semibold"
						>
							{evaluation.winner}
						</span>
					</div>
					<p class="text-gray-700 leading-relaxed">{evaluation.reasoning}</p>
				</div>
			{/each}
		</div>
	</div>

	<!-- Reset Button -->
	<div class="flex justify-center">
		<button
			onclick={onreset}
			class="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
		>
			Start New Debate
		</button>
	</div>
</div>
