/**
 * Feedback triage (the "brain"). Classifies a piece of feedback content into a
 * signal type and a sentiment.
 *
 * The default provider is a dependency-free heuristic so triage works without
 * any external service. A hosted provider (e.g. an LLM router) can be swapped in
 * later by replacing `heuristicTriage` at its call sites.
 */

import type { SignalType } from "./signal";

type Sentiment = "positive" | "neutral" | "negative";

interface TriageResult {
  type: SignalType;
  sentiment: Sentiment;
}

/** Extra context that can override content-based classification. */
interface TriageOptions {
  /** Force the `review` type (the content came from a review platform). */
  isReview?: boolean;
}

const BUG_PATTERN =
  /\b(bug|broken|breaks?|crash\w*|error|errors|fail\w*|throws?|doesn'?t work|not working|won'?t|can'?t|cannot)\b/i;
const PRAISE_PATTERN =
  /\b(love|great|awesome|amazing|excellent|fantastic|wonderful|thank you|thanks|nice work|well done)\b/i;
const QUESTION_PATTERN =
  /(\?|\b(how|why|what|when|where|which|can i|is it possible|do you)\b)/i;

const NEGATIVE_PATTERN =
  /\b(hate|broken|crash\w*|terrible|awful|bad|worse|worst|useless|frustrat\w*|annoying|disappoint\w*|error|fail\w*|slow|buggy)\b/i;
const POSITIVE_PATTERN =
  /\b(love|great|awesome|amazing|excellent|good|nice|perfect|fantastic|wonderful|thank you|thanks)\b/i;

const classifyType = (content: string): SignalType => {
  if (BUG_PATTERN.test(content)) return "bug";
  if (PRAISE_PATTERN.test(content)) return "praise";
  if (QUESTION_PATTERN.test(content)) return "question";
  return "feedback";
};

const classifySentiment = (content: string): Sentiment => {
  if (NEGATIVE_PATTERN.test(content)) return "negative";
  if (POSITIVE_PATTERN.test(content)) return "positive";
  return "neutral";
};

/**
 * Default dependency-free triage provider. Review-platform content is typed as
 * `review` (its sentiment is still classified from the words); everything else
 * is classified from the content.
 */
export const heuristicTriage = (
  content: string,
  opts: TriageOptions = {},
): TriageResult => ({
  type: opts.isReview ? "review" : classifyType(content),
  sentiment: classifySentiment(content),
});
