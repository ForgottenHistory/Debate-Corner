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

export interface Settings {
	debater1Model: string;
	debater2Model: string;
	judge1Model: string;
	judge2Model: string;
	judge3Model: string;
	responseLength: ResponseLength;
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
