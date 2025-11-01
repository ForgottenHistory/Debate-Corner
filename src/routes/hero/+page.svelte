<!-- GitHub hero banner: 1280x640px (2:1 ratio) -->
<div class="w-screen h-screen flex items-center justify-center bg-gray-900 overflow-hidden">
	<div class="relative" style="width: 1280px; height: 640px;">
		<!-- Gradient Background -->
		<div class="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-red-600"></div>

		<!-- Animated circles decoration -->
		<div class="absolute top-20 left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
		<div class="absolute bottom-20 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>

		<!-- Content -->
		<div class="absolute inset-0 z-20 flex flex-col items-center justify-center">
			<div class="text-center w-full px-16">
				<!-- Main Title -->
				<h1 class="font-black" style="font-size: 80px; text-shadow: 3px 3px 8px rgba(0, 0, 0, 0.2); letter-spacing: -0.02em; line-height: 1; margin-bottom: 50px;">
					<span style="color: #2563eb;">AI</span>
					<span class="text-gray-900"> Debate </span>
					<span style="color: #dc2626;">Arena</span>
				</h1>

				<!-- Tech stack -->
				<div class="flex justify-center gap-4 text-gray-700 text-xl font-medium">
					<span>SvelteKit 5</span>
					<span style="color: #2563eb;">•</span>
					<span>TypeScript</span>
					<span style="color: #dc2626;">•</span>
					<span>Tailwind CSS</span>
					<span style="color: #2563eb;">•</span>
					<span>Featherless AI</span>
					<span style="color: #dc2626;">•</span>
					<span>OpenRouter</span>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Remove default body margins for perfect sizing */
	:global(body) {
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>
