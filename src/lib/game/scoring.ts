import { isPangram } from './puzzle';

export interface RankTier {
  name: string;
  /** Absolute point threshold to reach this rank. */
  threshold: number;
}

export const GENIUS_THRESHOLD = 150;

/**
 * Fixed point thresholds, NYT-inspired but absolute (not % of max).
 * Queen Bee is not here — it's awarded for finding every valid word.
 */
export const RANK_TIERS: RankTier[] = [
  { name: 'Beginner', threshold: 0 },
  { name: 'Good Start', threshold: 5 },
  { name: 'Moving Up', threshold: 15 },
  { name: 'Good', threshold: 30 },
  { name: 'Solid', threshold: 50 },
  { name: 'Nice', threshold: 75 },
  { name: 'Great', threshold: 100 },
  { name: 'Amazing', threshold: 125 },
  { name: 'Genius', threshold: GENIUS_THRESHOLD },
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

/** Returns the rank info for a current score using absolute point thresholds. */
export function getRank(score: number): {
  current: RankTier;
  next: RankTier | null;
  currentIndex: number;
  progressInTier: number; // 0-1 progress to next tier
} {
  let currentIndex = 0;
  for (let i = 0; i < RANK_TIERS.length; i++) {
    if (score >= RANK_TIERS[i].threshold) {
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
    progressInTier = span > 0 ? (score - current.threshold) / span : 1;
    progressInTier = Math.max(0, Math.min(1, progressInTier));
  }
  return { current, next, currentIndex, progressInTier };
}
