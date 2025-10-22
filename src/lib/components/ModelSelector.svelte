<script lang="ts">
	import { modelsStore } from '$lib/stores/models';

	interface Props {
		label: string;
		value: string;
		onchange: (value: string) => void;
	}

	let { label, value = $bindable(), onchange }: Props = $props();

	let isOpen = $state(false);
	let searchQuery = $state('');
	let currentPage = $state(0);
	const itemsPerPage = 10;

	const models = $derived($modelsStore);
	const isLoading = $derived($modelsStore.loading);

	const filteredModels = $derived.by(() => {
		if (!searchQuery.trim()) return models;
		const query = searchQuery.toLowerCase();
		return models.filter((model) => model.id.toLowerCase().includes(query));
	});

	const paginatedModels = $derived.by(() => {
		const start = currentPage * itemsPerPage;
		return filteredModels.slice(start, start + itemsPerPage);
	});

	const totalPages = $derived(Math.ceil(filteredModels.length / itemsPerPage));

	const selectedModelName = $derived(models.find((m) => m.id === value)?.id || value || 'Select a model');

	function nextPage() {
		if (currentPage < totalPages - 1) {
			currentPage++;
		}
	}

	function prevPage() {
		if (currentPage > 0) {
			currentPage--;
		}
	}

	function selectModel(modelId: string) {
		value = modelId;
		onchange(modelId);
		isOpen = false;
		searchQuery = '';
		currentPage = 0;
	}

	function toggleDropdown() {
		isOpen = !isOpen;
		if (!isOpen) {
			searchQuery = '';
			currentPage = 0;
		}
	}

	$effect(() => {
		// Reset to first page when search changes
		currentPage = 0;
	});
</script>

<div class="flex flex-col gap-2 relative">
	<label for={label} class="text-sm font-medium text-gray-700">
		{label}
	</label>

	<button
		type="button"
		onclick={toggleDropdown}
		class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-left text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex items-center justify-between"
		disabled={isLoading}
	>
		<span class="truncate">
			{isLoading ? 'Loading models...' : selectedModelName}
		</span>
		<svg
			class="w-5 h-5 text-gray-400 transition-transform {isOpen ? 'rotate-180' : ''}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if isOpen}
		<div
			class="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 flex flex-col"
		>
			<!-- Search Bar -->
			<div class="p-3 border-b border-gray-200">
				<input
					type="text"
					bind:value={searchQuery}
					placeholder="Search models..."
					class="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
				/>
			</div>

			<!-- Model List -->
			<div class="flex-1 overflow-y-auto">
				{#each paginatedModels as model}
					<button
						type="button"
						onclick={() => selectModel(model.id)}
						class="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
					>
						<div class="text-sm font-medium text-gray-900 break-words">{model.id}</div>
						{#if model.owned_by}
							<div class="text-xs text-gray-500">{model.owned_by}</div>
						{/if}
					</button>
				{/each}

				{#if paginatedModels.length === 0}
					<div class="px-4 py-8 text-center text-gray-500">
						{#if searchQuery}
							No models found matching "{searchQuery}"
						{:else}
							No models available
						{/if}
					</div>
				{/if}
			</div>

			<!-- Pagination -->
			{#if totalPages > 1}
				<div class="flex items-center justify-between p-3 border-t border-gray-200 text-sm">
					<button
						type="button"
						onclick={prevPage}
						disabled={currentPage === 0}
						class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						Previous
					</button>
					<span class="text-gray-600">
						Page {currentPage + 1} of {totalPages}
					</span>
					<button
						type="button"
						onclick={nextPage}
						disabled={currentPage >= totalPages - 1}
						class="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
					>
						Next
					</button>
				</div>
			{/if}
		</div>
	{/if}
</div>

{#if isOpen}
	<button
		type="button"
		class="fixed inset-0 z-40"
		onclick={() => {
			isOpen = false;
			searchQuery = '';
			currentPage = 0;
		}}
		tabindex="-1"
	></button>
{/if}
