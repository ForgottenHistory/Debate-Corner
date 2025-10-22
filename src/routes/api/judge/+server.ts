import { json } from '@sveltejs/kit';
import { generateChatCompletion } from '$lib/server/featherless';
import { judgePersonalities, type JudgePersonality } from '$lib/judge-personalities';
import type { RequestHandler } from './$types';

function getRandomJudgePersonality(usedPersonalities: string[]): JudgePersonality {
	const personalityKeys = Object.keys(judgePersonalities) as JudgePersonality[];
	const availablePersonalities = personalityKeys.filter(p => !usedPersonalities.includes(p));

	// If all personalities are used, allow duplicates
	const poolToUse = availablePersonalities.length > 0 ? availablePersonalities : personalityKeys;

	return poolToUse[Math.floor(Math.random() * poolToUse.length)];
}

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { model, topic, debateHistory, usedPersonalities = [] } = await request.json();

		// Randomly assign a judge personality, avoiding duplicates if possible
		const judgePersonality = getRandomJudgePersonality(usedPersonalities);
		const personalityConfig = judgePersonalities[judgePersonality];

		// Build the system prompt for judging
		const systemPrompt = `You are a debate judge tasked with evaluating a formal debate.

JUDGE PERSONALITY:
${personalityConfig.systemPromptAddition}

Debate Topic: "${topic}"

You will review the complete debate transcript and determine:
1. Which side (FOR or AGAINST) presented the stronger case
2. Your reasoning for this decision

Your evaluation should be 100-150 words.

Format your response as:
Winner: [FOR/AGAINST/TIE]
Reasoning: [Your detailed reasoning]`;

		// Build the debate transcript
		let transcript = 'DEBATE TRANSCRIPT:\n\n';
		debateHistory.forEach((turn: any) => {
			const turnLabel = turn.type === 'opening'
				? 'Opening Statement'
				: `Round ${turn.round} Rebuttal`;
			transcript += `${turn.position} - ${turnLabel}:\n${turn.content}\n\n`;
		});

		const messages = [
			{ role: 'system' as const, content: systemPrompt },
			{ role: 'user' as const, content: transcript + '\nPlease provide your evaluation.' }
		];

		// Generate the evaluation
		const content = await generateChatCompletion({
			model,
			messages,
			temperature: 0.7,
			max_tokens: 400
		});

		// Parse the response to extract winner and reasoning
		const winnerMatch = content.match(/Winner:\s*(FOR|AGAINST|TIE)/i);
		const reasoningMatch = content.match(/Reasoning:\s*(.+)/is);

		const winner = winnerMatch ? winnerMatch[1].toUpperCase() : 'TIE';
		const reasoning = reasoningMatch
			? reasoningMatch[1].trim()
			: content.replace(/Winner:\s*(FOR|AGAINST|TIE)/i, '').trim();

		return json({ winner, reasoning, personality: personalityConfig.name });
	} catch (error) {
		console.error('Error generating judge evaluation:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return json({ error: 'Failed to generate judge evaluation', details: errorMessage }, { status: 500 });
	}
};
