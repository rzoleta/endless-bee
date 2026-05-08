import { computeWordScore } from './scoring';
import { getPangramCandidates, getValidWords } from './dictionary';

export interface Puzzle {
	/** All 7 unique letters of the puzzle (lowercase). The required letter is included here. */
	letters: string[];
	/** The required (center) letter. */
	requiredLetter: string;
	/** The 6 outer letters. */
	outerLetters: string[];
	/** Set of all valid guess words for this puzzle. */
	validWords: string[];
	/** Set of pangrams (words using all 7 letters). */
	pangrams: string[];
	/** Total puzzle score (sum of scores of all valid words). */
	maxScore: number;
}

const MIN_WORDS = 15;
const MAX_ATTEMPTS = 50;

function shuffle<T>(arr: T[]): T[] {
	const a = [...arr];
	for (let i = a.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[a[i], a[j]] = [a[j], a[i]];
	}
	return a;
}

/**
 * Find all dictionary words that:
 *  - have length >= 4
 *  - contain the required letter
 *  - only use letters from the given 7-letter set (no 's' if excluded by candidate generation)
 */
export function findValidWords(letters: Set<string>, requiredLetter: string): string[] {
	const result: string[] = [];
	const all = getValidWords();
	for (const word of all) {
		if (!word.includes(requiredLetter)) continue;
		let valid = true;
		for (let i = 0; i < word.length; i++) {
			if (!letters.has(word[i])) {
				valid = false;
				break;
			}
		}
		if (valid) result.push(word);
	}
	return result;
}

/** Generate a new random puzzle. */
export function generatePuzzle(): Puzzle {
	const candidates = getPangramCandidates();
	if (candidates.length === 0) {
		throw new Error('No pangram candidates available in dictionary');
	}

	for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
		const pangram = candidates[Math.floor(Math.random() * candidates.length)];
		const letters = Array.from(new Set(pangram));
		// Pick a required letter — bias slightly toward common letters by random pick.
		const requiredLetter = letters[Math.floor(Math.random() * letters.length)];
		const letterSet = new Set(letters);
		const validWords = findValidWords(letterSet, requiredLetter);

		if (validWords.length < MIN_WORDS) continue;

		// Compute pangrams
		const pangrams = validWords.filter((w) => {
			const u = new Set(w);
			if (u.size !== 7) return false;
			for (const l of letters) if (!u.has(l)) return false;
			return true;
		});

		if (pangrams.length === 0) continue;

		const maxScore = validWords.reduce((sum, w) => sum + computeWordScore(w, letters), 0);

		const outerLetters = shuffle(letters.filter((l) => l !== requiredLetter));

		return {
			letters,
			requiredLetter,
			outerLetters,
			validWords,
			pangrams,
			maxScore
		};
	}

	throw new Error('Failed to generate a valid puzzle after max attempts');
}

/** Rebuild a full Puzzle from stored letters without randomness. */
export function reconstructPuzzle(letters: string[], requiredLetter: string): Puzzle {
	const letterSet = new Set(letters);
	const validWords = findValidWords(letterSet, requiredLetter);
	const pangrams = validWords.filter((w) => isPangram(w, letters));
	const maxScore = validWords.reduce((sum, w) => sum + computeWordScore(w, letters), 0);
	const outerLetters = letters.filter((l) => l !== requiredLetter);
	return { letters, requiredLetter, outerLetters, validWords, pangrams, maxScore };
}

/** Reshuffles only the outer letters. */
export function shuffleOuter(puzzle: Puzzle): Puzzle {
	return { ...puzzle, outerLetters: shuffle(puzzle.outerLetters) };
}

/** Check if a word is a pangram for this puzzle. */
export function isPangram(word: string, letters: string[]): boolean {
	const u = new Set(word);
	if (u.size !== letters.length) return false;
	for (const l of letters) if (!u.has(l)) return false;
	return true;
}
