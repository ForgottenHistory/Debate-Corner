export interface PersonalityConfig {
	name: string;
	description: string;
	systemPromptAddition: string;
}

// Dynamically import all personality JSON files
const personalityModules = import.meta.glob('./*.json', { eager: true });

export const personalities: Record<string, PersonalityConfig> = {};

// Load all personalities from JSON files
for (const path in personalityModules) {
	const fileName = path.replace('./', '').replace('.json', '');
	const module = personalityModules[path] as { default: PersonalityConfig };
	personalities[fileName] = module.default;
}

export function getPersonalityPrompt(personality: string): string {
	return personalities[personality]?.systemPromptAddition || personalities.honest?.systemPromptAddition || '';
}
