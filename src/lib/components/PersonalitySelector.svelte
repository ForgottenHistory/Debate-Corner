<script lang="ts">
	import { personalities } from '$lib/personalities';
	import type { Personality } from '$lib/types';

	interface Props {
		label: string;
		value: Personality;
	}

	let { label, value = $bindable() }: Props = $props();

	const personalityList = Object.entries(personalities).map(([key, config]) => ({
		id: key as Personality,
		name: config.name,
		description: config.description
	}));
</script>

<div class="flex flex-col gap-2">
	<label class="text-sm font-medium text-gray-700">{label}</label>
	<select
		bind:value
		class="block w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
	>
		{#each personalityList as personality}
			<option value={personality.id}>
				{personality.name} - {personality.description}
			</option>
		{/each}
	</select>
</div>
