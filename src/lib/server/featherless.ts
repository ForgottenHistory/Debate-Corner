import { FEATHERLESS_API_KEY } from '$env/static/private';

const FEATHERLESS_BASE_URL = 'https://api.featherless.ai/v1';

export interface FeatherlessModel {
	id: string;
	object: string;
	created: number;
	owned_by: string;
}

export interface ChatMessage {
	role: 'system' | 'user' | 'assistant';
	content: string;
}

export interface GenerateOptions {
	model: string;
	messages: ChatMessage[];
	temperature?: number;
	max_tokens?: number;
	top_p?: number;
	top_k?: number;
	frequency_penalty?: number;
	presence_penalty?: number;
	repetition_penalty?: number;
	min_p?: number;
}

/**
 * Fetch available models from Featherless API
 */
export async function fetchModels(): Promise<FeatherlessModel[]> {
	try {
		const response = await fetch(`${FEATHERLESS_BASE_URL}/models`, {
			headers: {
				Authorization: `Bearer ${FEATHERLESS_API_KEY}`
			}
		});

		if (!response.ok) {
			console.error('Failed to fetch models:', response.status);
			return [];
		}

		const data = await response.json();
		return data.data || [];
	} catch (error) {
		console.error('Error fetching models:', error);
		return [];
	}
}

/**
 * Generate a chat completion using Featherless API (non-streaming)
 */
export async function generateChatCompletion(options: GenerateOptions): Promise<string> {
	try {
		const response = await fetch(`${FEATHERLESS_BASE_URL}/chat/completions`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${FEATHERLESS_API_KEY}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: options.model,
				messages: options.messages,
				temperature: options.temperature ?? 0.8,
				max_tokens: options.max_tokens ?? 800,
				...(options.top_p !== undefined && { top_p: options.top_p }),
				...(options.top_k !== undefined && { top_k: options.top_k }),
				...(options.frequency_penalty !== undefined && { frequency_penalty: options.frequency_penalty }),
				...(options.presence_penalty !== undefined && { presence_penalty: options.presence_penalty }),
				...(options.repetition_penalty !== undefined && { repetition_penalty: options.repetition_penalty }),
				...(options.min_p !== undefined && { min_p: options.min_p })
			})
		});

		if (!response.ok) {
			const error = await response.text();
			console.error('Failed to generate completion:', response.status, error);
			throw new Error(`API request failed: ${response.status}`);
		}

		const data = await response.json();
		return data.choices?.[0]?.message?.content || '';
	} catch (error) {
		console.error('Error generating completion:', error);
		throw error;
	}
}

/**
 * Stream a chat completion using Featherless API
 */
export async function streamChatCompletion(
	options: GenerateOptions
): Promise<ReadableStream<Uint8Array>> {
	const response = await fetch(`${FEATHERLESS_BASE_URL}/chat/completions`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${FEATHERLESS_API_KEY}`,
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			model: options.model,
			messages: options.messages,
			temperature: options.temperature ?? 0.8,
			max_tokens: options.max_tokens ?? 800,
			stream: true,
			...(options.top_p !== undefined && { top_p: options.top_p }),
			...(options.top_k !== undefined && { top_k: options.top_k }),
			...(options.frequency_penalty !== undefined && { frequency_penalty: options.frequency_penalty }),
			...(options.presence_penalty !== undefined && { presence_penalty: options.presence_penalty }),
			...(options.repetition_penalty !== undefined && { repetition_penalty: options.repetition_penalty }),
			...(options.min_p !== undefined && { min_p: options.min_p })
		})
	});

	if (!response.ok) {
		const error = await response.text();
		console.error('Failed to stream completion:', response.status, error);
		throw new Error(`API request failed: ${response.status}`);
	}

	if (!response.body) {
		throw new Error('Response body is null');
	}

	return response.body;
}
