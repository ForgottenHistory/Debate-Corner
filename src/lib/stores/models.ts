import { writable } from 'svelte/store';

interface FeatherlessModel {
	id: string;
	owned_by: string;
}

function createModelsStore() {
	const { subscribe, set } = writable<FeatherlessModel[]>([]);
	let loading = writable(false);
	let loaded = false;

	return {
		subscribe,
		loading: { subscribe: loading.subscribe },
		async fetch() {
			if (loaded) return; // Don't fetch again if already loaded

			loading.set(true);
			try {
				const response = await fetch('/api/models');
				if (response.ok) {
					const models = await response.json();
					set(models);
					loaded = true;
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
