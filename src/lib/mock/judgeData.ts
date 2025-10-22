import type { JudgeEvaluation, Winner } from '$lib/types';

export function getMockJudgeEvaluations(): JudgeEvaluation[] {
	const winners: Winner[] = ['FOR', 'AGAINST', 'FOR'];

	return [
		{
			judgeNumber: 1,
			winner: winners[0],
			reasoning: `After carefully reviewing both arguments, I find the FOR position more compelling. While both debaters presented their cases with conviction, the FOR side demonstrated stronger empirical backing and addressed counterarguments more effectively. The AGAINST side raised valid concerns but relied too heavily on hypothetical risks without sufficient evidence. The FOR debater's point about mainstream scientific consensus was particularly persuasive. Overall, the FOR position presented a more balanced and evidence-based argument.`
		},
		{
			judgeNumber: 2,
			winner: winners[1],
			reasoning: `I must side with the AGAINST position in this debate. The AGAINST debater effectively highlighted the logical fallacies and unfalsifiable claims made by their opponent. The concern about "it wasn't implemented properly" being used to explain away failures is a legitimate criticism that the FOR side never adequately addressed. Additionally, the AGAINST position rightly emphasized the importance of acknowledging risks and demanding rigorous evidence before accepting major changes. Critical thinking requires skepticism, and the AGAINST debater embodied that principle more effectively.`
		},
		{
			judgeNumber: 3,
			winner: winners[2],
			reasoning: `This was a close debate, but I give the edge to the FOR position. Both debaters made strong points, but the FOR side provided more concrete references to evidence and expert consensus. While the AGAINST debater was right to demand rigorous proof, they didn't sufficiently engage with the actual evidence presented. The accusation of cherry-picking data wasn't substantiated with alternative interpretations of the same data. The FOR position also showed better rhetorical discipline by staying focused on the substantive arguments rather than getting sidetracked by methodological debates. For these reasons, FOR wins this debate.`
		}
	];
}

export function calculateOverallWinner(evaluations: JudgeEvaluation[]): Winner {
	const votes = { FOR: 0, AGAINST: 0, TIE: 0 };

	evaluations.forEach(evaluation => {
		votes[evaluation.winner]++;
	});

	if (votes.FOR > votes.AGAINST) return 'FOR';
	if (votes.AGAINST > votes.FOR) return 'AGAINST';
	return 'TIE';
}
