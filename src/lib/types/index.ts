export interface Model {
	id: string;
	name: string;
	provider: string;
}

export type ResponseLength = 'short' | 'medium' | 'long';

export type Personality =
	| 'honest'
	| 'manipulative'
	| 'academic'
	| 'strawman'
	| 'emotional'
	| 'pedantic'
	| 'ignorant'
	| 'zealot';

export interface LLMParameters {
	temperature: number; // [0, 2] - Lower = deterministic, Higher = random, 0 = greedy
	topP: number; // (0, 1] - Cumulative probability of top tokens, 1 = all tokens
	topK: number; // -1 = all tokens, or positive integer to limit
	frequencyPenalty: number; // Penalizes based on frequency (> 0 = new tokens, < 0 = repetition)
	presencePenalty: number; // Penalizes based on presence (> 0 = new tokens, < 0 = repetition)
	repetitionPenalty: number; // Penalizes based on appearance (> 1 = new tokens, < 1 = repetition)
	minP: number; // [0, 1] - Minimum probability relative to most likely token, 0 = disabled
	maxTokens: number; // Maximum tokens to generate
}

export type Provider = 'featherless' | 'openrouter';

export interface Settings {
	provider: Provider;
	debater1Model: string;
	debater2Model: string;
	judge1Model: string;
	judge2Model: string;
	judge3Model: string;
	responseLength: ResponseLength;
	// Agent-specific LLM Parameters
	debater1Params: LLMParameters;
	debater2Params: LLMParameters;
	judge1Params: LLMParameters;
	judge2Params: LLMParameters;
	judge3Params: LLMParameters;
}

export type Position = 'FOR' | 'AGAINST';

export type TurnType = 'opening' | 'rebuttal';

export interface DebateTurn {
	position: Position;
	type: TurnType;
	round?: number;
	content: string;
	timestamp: Date;
}

export type Winner = 'FOR' | 'AGAINST' | 'TIE';

export interface JudgeEvaluation {
	judgeNumber: number;
	winner: Winner;
	reasoning: string;
	personality?: string;
}

export interface Debate {
	topic: string;
	turns: DebateTurn[];
	judges?: JudgeEvaluation[];
	finalWinner?: Winner;
}

export type DebateStage = 'setup' | 'opening' | 'round1' | 'round2' | 'judging' | 'results';
