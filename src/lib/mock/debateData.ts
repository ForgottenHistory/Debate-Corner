import type { DebateTurn } from '$lib/types';

export function getMockDebateTurns(topic: string): DebateTurn[] {
	return [
		// Opening statements
		{
			position: 'FOR',
			type: 'opening',
			content: `Thank you for this opportunity to speak in favor of "${topic}". I believe this position is not only morally sound but also practically beneficial. Throughout this debate, I will demonstrate why embracing this stance leads to better outcomes for individuals, society, and our collective future. The evidence clearly supports this position, and I look forward to presenting a compelling case that will illuminate the strengths of this perspective.`,
			timestamp: new Date()
		},
		{
			position: 'AGAINST',
			type: 'opening',
			content: `I appreciate the chance to present the opposing view on "${topic}". While my opponent may paint an optimistic picture, I will show that this position overlooks critical flaws and potential negative consequences. A thorough examination of the evidence reveals significant concerns that cannot be ignored. I will present a rigorous argument demonstrating why we should reject this proposition and consider alternative approaches that better serve our interests.`,
			timestamp: new Date()
		},
		// Round 1
		{
			position: 'FOR',
			type: 'rebuttal',
			round: 1,
			content: `My opponent raises concerns, but let me address them directly. First, the historical evidence strongly supports this position. We've seen time and again that when societies embrace this approach, positive outcomes follow. The data is clear: implementation of these principles correlates with improved metrics across multiple domains. Furthermore, the theoretical framework underpinning this position is sound and has been validated by experts across various fields. To dismiss these findings would be to ignore decades of careful research and analysis.`,
			timestamp: new Date()
		},
		{
			position: 'AGAINST',
			type: 'rebuttal',
			round: 1,
			content: `While my opponent cites historical evidence, they conveniently ignore the numerous counterexamples where this approach has failed spectacularly. Cherry-picking data points doesn't constitute a rigorous argument. Let's examine the actual track record: implementation costs are consistently underestimated, unintended consequences are routinely dismissed, and the promised benefits often fail to materialize. Additionally, this position relies on assumptions that simply don't hold up under scrutiny. We need to be honest about the limitations and potential downsides rather than presenting an unrealistically rosy picture.`,
			timestamp: new Date()
		},
		// Round 2
		{
			position: 'FOR',
			type: 'rebuttal',
			round: 2,
			content: `My opponent's characterization is misleading. I'm not cherry-picking data—I'm presenting the mainstream scientific consensus. Yes, implementation faces challenges, but that's true of any worthwhile endeavor. The question isn't whether difficulties exist, but whether the benefits outweigh the costs. And on that measure, the answer is unequivocally yes. The failures my opponent mentions often result from incomplete implementation or inadequate commitment, not from flaws in the underlying principle. When properly executed, this approach delivers measurable, significant improvements. That's not optimism—that's evidence-based reasoning.`,
			timestamp: new Date()
		},
		{
			position: 'AGAINST',
			type: 'rebuttal',
			round: 2,
			content: `And there we have it—the classic "it wasn't implemented properly" defense. This is precisely the kind of unfalsifiable reasoning that should concern us. If every failure is attributed to poor execution rather than fundamental problems with the concept itself, we're engaging in motivated reasoning, not objective analysis. The burden of proof lies with those advocating for change, and that burden has not been met. The risks are real, the costs are substantial, and the promised benefits remain largely theoretical. Given this reality, the prudent course is to maintain skepticism and demand far more rigorous evidence before accepting this position.`,
			timestamp: new Date()
		}
	];
}
