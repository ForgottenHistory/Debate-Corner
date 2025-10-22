import { json } from '@sveltejs/kit';
import { generateChatCompletion } from '$lib/server/featherless';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { model, position, topic, debateHistory, turnType, round } = await request.json();

		// Build the system prompt based on position
		const systemPrompt = `You are participating in a formal debate. You are arguing ${position} the proposition: "${topic}".

${position === 'FOR' ? 'Your role is to argue in favor of this proposition. Present strong arguments, evidence, and reasoning that support this position.' : 'Your role is to argue against this proposition. Present strong counterarguments, evidence, and reasoning that oppose this position.'}

Guidelines:
- Be persuasive and use logical reasoning
- Cite examples and evidence when possible
- Address counterarguments effectively
- Keep your response focused and well-structured
- Aim for 150-250 words
- Be respectful but assertive

${turnType === 'opening' ? 'This is your opening statement. Introduce your main arguments and set the tone for your position.' : `This is Round ${round}. Respond to your opponent's arguments while strengthening your own position.`}`;

		// Build conversation history
		const messages = [
			{ role: 'system' as const, content: systemPrompt }
		];

		// Add debate history for context (for rebuttals)
		if (debateHistory && debateHistory.length > 0) {
			debateHistory.forEach((turn: any) => {
				messages.push({
					role: turn.position === position ? 'assistant' : 'user',
					content: turn.content
				});
			});
		}

		// Add the prompt for this turn
		messages.push({
			role: 'user' as const,
			content: turnType === 'opening'
				? 'Present your opening statement.'
				: 'Present your rebuttal and further arguments.'
		});

		// Generate the response
		const content = await generateChatCompletion({
			model,
			messages,
			temperature: 0.8,
			max_tokens: 800
		});

		return json({ content });
	} catch (error) {
		console.error('Error generating debate response:', error);
		return json({ error: 'Failed to generate debate response' }, { status: 500 });
	}
};
