import { writable } from 'svelte/store';
import type { Provider } from '$lib/types';

interface FeatherlessModel {
	id: string;
	owned_by: string;
}

function createModelsStore() {
	const { subscribe, set } = writable<FeatherlessModel[]>([]);
	let loading = writable(false);
	let currentProvider: Provider | null = null;

	return {
		subscribe,
		loading: { subscribe: loading.subscribe },
		async fetch(provider: Provider = 'featherless') {
			// Re-fetch if provider changed
			if (currentProvider === provider) return;

			currentProvider = provider;
			loading.set(true);
			try {
				const response = await fetch(`/api/models?provider=${provider}`);
				if (response.ok) {
					const models = await response.json();
					set(models);
				}
			} catch (error) {
				console.error('Failed to fetch models:', error);
			} finally {
				loading.set(false);
			}
		}
	};
}

export const modelsStore = createModelsStore();
