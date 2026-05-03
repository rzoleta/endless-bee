import { isPangram } from './puzzle';

export interface RankTier {
	name: string;
	/** Threshold as a fraction (0-1) of the maximum possible puzzle score. */
	threshold: number;
}

/**
 * NYT-style rank tiers. Threshold is a fraction of the puzzle's max score.
 */
export const RANK_TIERS: RankTier[] = [
	{ name: 'Beginner', threshold: 0 },
	{ name: 'Good Start', threshold: 0.02 },
	{ name: 'Moving Up', threshold: 0.05 },
	{ name: 'Good', threshold: 0.08 },
	{ name: 'Solid', threshold: 0.15 },
	{ name: 'Nice', threshold: 0.25 },
	{ name: 'Great', threshold: 0.4 },
	{ name: 'Amazing', threshold: 0.5 },
	{ name: 'Genius', threshold: 0.7 },
	{ name: 'Queen Bee', threshold: 1 }
];

/**
 * Score a single word per NYT rules:
 *  - 4-letter word: 1 point
 *  - 5+ letter word: 1 point per letter
 *  - Pangram: +7 bonus
 */
export function computeWordScore(word: string, puzzleLetters: string[]): number {
	let score: number;
	if (word.length === 4) score = 1;
	else score = word.length;
	if (isPangram(word, puzzleLetters)) score += 7;
	return score;
}

export function computeTotalScore(words: string[], puzzleLetters: string[]): number {
	return words.reduce((sum, w) => sum + computeWordScore(w, puzzleLetters), 0);
}

/** Returns the rank info for a current score. */
export function getRank(score: number, maxScore: number): {
	current: RankTier;
	next: RankTier | null;
	currentIndex: number;
	progressInTier: number; // 0-1 progress to next tier
} {
	if (maxScore <= 0) {
		return { current: RANK_TIERS[0], next: RANK_TIERS[1] ?? null, currentIndex: 0, progressInTier: 0 };
	}
	const fraction = score / maxScore;
	let currentIndex = 0;
	for (let i = 0; i < RANK_TIERS.length; i++) {
		if (fraction >= RANK_TIERS[i].threshold) {
			currentIndex = i;
		} else {
			break;
		}
	}
	const current = RANK_TIERS[currentIndex];
	const next = RANK_TIERS[currentIndex + 1] ?? null;
	let progressInTier = 1;
	if (next) {
		const span = next.threshold - current.threshold;
		progressInTier = span > 0 ? (fraction - current.threshold) / span : 1;
		progressInTier = Math.max(0, Math.min(1, progressInTier));
	}
	return { current, next, currentIndex, progressInTier };
}
