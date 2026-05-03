import wordList from 'an-array-of-english-words';

let _validWords: string[] | null = null;
let _validWordSet: Set<string> | null = null;
let _pangramCandidates: string[] | null = null;

/**
 * Returns the cached list of "playable" words: lowercase, length >= 4, only a-z chars.
 */
export function getValidWords(): string[] {
	if (_validWords) return _validWords;
	const words = (wordList as string[]).filter((w) => w.length >= 4 && /^[a-z]+$/.test(w));
	_validWords = words;
	return words;
}

export function getValidWordSet(): Set<string> {
	if (_validWordSet) return _validWordSet;
	_validWordSet = new Set(getValidWords());
	return _validWordSet;
}

/**
 * Pangram candidates: words with exactly 7 unique letters and no 's' (NYT-style).
 * The 's' exclusion prevents trivial plurals dominating puzzles.
 */
export function getPangramCandidates(): string[] {
	if (_pangramCandidates) return _pangramCandidates;
	_pangramCandidates = getValidWords().filter((w) => {
		if (w.includes('s')) return false;
		const unique = new Set(w);
		return unique.size === 7;
	});
	return _pangramCandidates;
}

/**
 * Returns the set of unique letters in a word.
 */
export function uniqueLetters(word: string): Set<string> {
	return new Set(word);
}
