<script lang="ts">
	import { personalities } from '$lib/personalities';

	const personalityList = Object.entries(personalities).map(([key, config]) => ({
		id: key,
		...config
	}));
</script>

<div class="min-h-screen bg-gray-50 py-12 px-4">
	<div class="max-w-4xl mx-auto">
		<div class="bg-white rounded-lg shadow-lg p-8">
			<div class="flex items-center justify-between mb-8">
				<h1 class="text-3xl font-bold text-gray-900">Debate Personalities</h1>
				<a
					href="/"
					class="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
				>
					← Back to Debate
				</a>
			</div>

			<p class="text-gray-600 mb-8">
				Personalities are randomly assigned to debaters at the start of each debate. You can view and manage personality definitions here.
			</p>

			<div class="space-y-6">
				{#each personalityList as personality}
					<div class="border border-gray-200 rounded-lg p-6">
						<div class="flex items-start justify-between mb-3">
							<div>
								<h3 class="text-xl font-bold text-gray-900">{personality.name}</h3>
								<p class="text-sm text-gray-600 mt-1">{personality.description}</p>
							</div>
						</div>
						<div class="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
							<p class="text-xs font-semibold text-gray-500 uppercase mb-2">System Prompt</p>
							<p class="text-sm text-gray-700 whitespace-pre-wrap">{personality.systemPromptAddition}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
