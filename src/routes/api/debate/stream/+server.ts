import { streamChatCompletion } from '$lib/server/featherless';
import { getPersonalityPrompt } from '$lib/personalities';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const {
			model,
			position,
			topic,
			debateHistory,
			turnType,
			round,
			responseLength,
			personality,
			provider = 'featherless',
			// LLM parameters with defaults
			temperature = 0.8,
			maxTokens = 800,
			topP,
			topK,
			frequencyPenalty,
			presencePenalty,
			repetitionPenalty,
			minP
		} = await request.json();

		// Map response length to strict guidelines
		const lengthConfigs: Record<string, { words: string; instruction: string }> = {
			short: {
				words: '75-150 words',
				instruction:
					'You MUST keep your response between 75-150 words. This is a strict requirement. Be concise and focus only on your strongest points.'
			},
			medium: {
				words: '150-250 words',
				instruction:
					'You MUST keep your response between 150-250 words. This is a strict requirement. Be thorough but concise.'
			},
			long: {
				words: '250-400 words',
				instruction:
					'You MUST keep your response between 250-400 words. This is a strict requirement. Provide detailed arguments with supporting evidence.'
			}
		};

		const lengthConfig = lengthConfigs[responseLength] || lengthConfigs.medium;
		const personalityPrompt = getPersonalityPrompt(personality);

		// Build the system prompt
		const systemPrompt = `You are participating in a formal debate. You are arguing ${position} the proposition: "${topic}".

${position === 'FOR' ? 'Your role is to argue in favor of this proposition. Present strong arguments, evidence, and reasoning that support this position.' : 'Your role is to argue against this proposition. Present strong counterarguments, evidence, and reasoning that oppose this position.'}

PERSONALITY & DEBATE STYLE:
${personalityPrompt}

CRITICAL LENGTH REQUIREMENT:
${lengthConfig.instruction}

Guidelines:
- Keep formalities brief - avoid lengthy greetings or meta-commentary
- Focus on substance: present your arguments and evidence clearly
- Be persuasive and use logical reasoning
- Cite examples and evidence when possible
- Address counterarguments effectively
- Keep your response focused and well-structured
- Be respectful but assertive
- NEVER use emojis - keep all text clean and professional
- STRICTLY adhere to the ${lengthConfig.words} word limit above

${turnType === 'opening' ? 'This is your OPENING STATEMENT. Your opponent has NOT spoken yet. Present YOUR OWN arguments and reasoning. DO NOT reference or predict what your opponent will say - they haven\'t spoken yet!' : `This is Round ${round}. NOW you can respond to your opponent's actual arguments from their previous statement. Reference what they actually said and counter their specific points.`}`;

		// Build conversation history
		const messages = [{ role: 'system' as const, content: systemPrompt }];

		if (debateHistory && debateHistory.length > 0) {
			debateHistory.forEach((turn: any) => {
				messages.push({
					role: turn.position === position ? 'assistant' : 'user',
					content: turn.content
				});
			});
		}

		messages.push({
			role: 'user' as const,
			content:
				turnType === 'opening'
					? 'Present your opening statement.'
					: 'Present your rebuttal and further arguments.'
		});

		// Get the streaming response
		const stream = await streamChatCompletion({
			model,
			messages,
			temperature,
			max_tokens: maxTokens,
			provider,
			...(topP !== undefined && { top_p: topP }),
			...(topK !== undefined && { top_k: topK }),
			...(frequencyPenalty !== undefined && { frequency_penalty: frequencyPenalty }),
			...(presencePenalty !== undefined && { presence_penalty: presencePenalty }),
			...(repetitionPenalty !== undefined && { repetition_penalty: repetitionPenalty }),
			...(minP !== undefined && { min_p: minP })
		});

		// Create a ReadableStream that parses SSE and extracts content
		const transformedStream = new ReadableStream({
			async start(controller) {
				const reader = stream.getReader();
				const decoder = new TextDecoder();
				let buffer = '';

				try {
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;

						buffer += decoder.decode(value, { stream: true });
						const lines = buffer.split('\n');
						buffer = lines.pop() || '';

						for (const line of lines) {
							if (line.startsWith('data: ')) {
								const data = line.slice(6);
								if (data === '[DONE]') continue;

								try {
									const parsed = JSON.parse(data);
									const content = parsed.choices?.[0]?.delta?.content;
									if (content) {
										// Send content as JSON to preserve special characters including newlines
										controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(content)}\n\n`));
									}
								} catch (e) {
									// Skip invalid JSON
								}
							}
						}
					}
					controller.close();
				} catch (error) {
					controller.error(error);
				}
			}
		});

		return new Response(transformedStream, {
			headers: {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive'
			}
		});
	} catch (error) {
		console.error('Error streaming debate response:', error);
		return new Response(JSON.stringify({ error: 'Failed to stream debate response' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};
