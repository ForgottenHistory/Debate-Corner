import { FEATHERLESS_API_KEY, OPENROUTER_API_KEY } from '$env/static/private';

const FEATHERLESS_BASE_URL = 'https://api.featherless.ai/v1';
const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export type Provider = 'featherless' | 'openrouter';

function getProviderConfig(provider: Provider) {
	if (provider === 'openrouter') {
		return {
			baseUrl: OPENROUTER_BASE_URL,
			apiKey: OPENROUTER_API_KEY,
			headers: {
				'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
				'HTTP-Referer': 'https://debate-corner.app',
				'X-Title': 'Debate Corner'
			}
		};
	}
	return {
		baseUrl: FEATHERLESS_BASE_URL,
		apiKey: FEATHERLESS_API_KEY,
		headers: {
			'Authorization': `Bearer ${FEATHERLESS_API_KEY}`
		}
	};
}

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
	provider?: Provider;
}

/**
 * Fetch available models from the specified provider
 */
export async function fetchModels(provider: Provider = 'featherless'): Promise<FeatherlessModel[]> {
	try {
		const config = getProviderConfig(provider);
		const response = await fetch(`${config.baseUrl}/models`, {
			headers: config.headers
		});

		if (!response.ok) {
			console.error(`Failed to fetch models from ${provider}:`, response.status);
			return [];
		}

		const data = await response.json();
		return data.data || [];
	} catch (error) {
		console.error(`Error fetching models from ${provider}:`, error);
		return [];
	}
}

/**
 * Generate a chat completion (non-streaming)
 */
export async function generateChatCompletion(options: GenerateOptions): Promise<string> {
	const provider = options.provider ?? 'featherless';
	const config = getProviderConfig(provider);

	try {
		const response = await fetch(`${config.baseUrl}/chat/completions`, {
			method: 'POST',
			headers: {
				...config.headers,
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
			console.error(`Failed to generate completion on ${provider}:`, response.status, error);
			throw new Error(`API request failed: ${response.status}`);
		}

		const data = await response.json();
		return data.choices?.[0]?.message?.content || '';
	} catch (error) {
		console.error(`Error generating completion on ${provider}:`, error);
		throw error;
	}
}

/**
 * Stream a chat completion
 */
export async function streamChatCompletion(
	options: GenerateOptions
): Promise<ReadableStream<Uint8Array>> {
	const provider = options.provider ?? 'featherless';
	const config = getProviderConfig(provider);

	const response = await fetch(`${config.baseUrl}/chat/completions`, {
		method: 'POST',
		headers: {
			...config.headers,
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
		console.error(`Failed to stream completion on ${provider}:`, response.status, error);
		throw new Error(`API request failed: ${response.status}`);
	}

	if (!response.body) {
		throw new Error('Response body is null');
	}

	return response.body;
}
