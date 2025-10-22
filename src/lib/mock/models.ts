import type { Model } from '$lib/types';

export const mockModels: Model[] = [
	{
		id: 'gpt-4-turbo',
		name: 'GPT-4 Turbo',
		provider: 'OpenAI'
	},
	{
		id: 'gpt-3.5-turbo',
		name: 'GPT-3.5 Turbo',
		provider: 'OpenAI'
	},
	{
		id: 'claude-3-opus',
		name: 'Claude 3 Opus',
		provider: 'Anthropic'
	},
	{
		id: 'claude-3-sonnet',
		name: 'Claude 3 Sonnet',
		provider: 'Anthropic'
	},
	{
		id: 'claude-3-haiku',
		name: 'Claude 3 Haiku',
		provider: 'Anthropic'
	},
	{
		id: 'mixtral-8x7b',
		name: 'Mixtral 8x7B',
		provider: 'Mistral'
	},
	{
		id: 'llama-3-70b',
		name: 'Llama 3 70B',
		provider: 'Meta'
	},
	{
		id: 'gemini-pro',
		name: 'Gemini Pro',
		provider: 'Google'
	}
];
