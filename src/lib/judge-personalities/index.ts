export interface JudgePersonalityConfig {
	name: string;
	description: string;
	systemPromptAddition: string;
}

const judgePersonalityModules = import.meta.glob('./*.json', { eager: true });

export const judgePersonalities: Record<string, JudgePersonalityConfig> = {};

for (const path in judgePersonalityModules) {
	const fileName = path.replace('./', '').replace('.json', '');
	const module = judgePersonalityModules[path] as { default: JudgePersonalityConfig };
	judgePersonalities[fileName] = module.default;
}

export type JudgePersonality = keyof typeof judgePersonalities;
