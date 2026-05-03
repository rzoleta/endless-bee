import { browser } from '$app/environment';
import { generatePuzzle, isPangram, shuffleOuter, type Puzzle } from './puzzle';
import { computeTotalScore, computeWordScore, getRank } from './scoring';
import { getValidWordSet } from './dictionary';

const STORAGE_KEY = 'endless-bee-state-v1';

interface PersistedState {
	puzzle: Puzzle;
	foundWords: string[];
}

export type FeedbackKind = 'success' | 'pangram' | 'error' | 'info';

export interface Feedback {
	id: number;
	message: string;
	kind: FeedbackKind;
	score?: number;
}

class GameStore {
	puzzle = $state<Puzzle | null>(null);
	foundWords = $state<string[]>([]);
	currentInput = $state<string>('');
	feedback = $state<Feedback | null>(null);
	private feedbackTimer: ReturnType<typeof setTimeout> | null = null;
	private feedbackId = 0;

	score = $derived(this.puzzle ? computeTotalScore(this.foundWords, this.puzzle.letters) : 0);
	rank = $derived(this.puzzle ? getRank(this.score, this.puzzle.maxScore) : null);
	progress = $derived(
		this.puzzle
			? {
					found: this.foundWords.length,
					total: this.puzzle.validWords.length,
					pangramsFound: this.foundWords.filter((w) => this.puzzle && isPangram(w, this.puzzle.letters)).length,
					pangramsTotal: this.puzzle.pangrams.length
			  }
			: { found: 0, total: 0, pangramsFound: 0, pangramsTotal: 0 }
	);

	init() {
		if (!browser) return;
		const restored = this.loadFromStorage();
		if (restored) {
			this.puzzle = restored.puzzle;
			this.foundWords = restored.foundWords;
		} else {
			this.newGame();
		}
	}

	newGame() {
		this.puzzle = generatePuzzle();
		this.foundWords = [];
		this.currentInput = '';
		this.persist();
	}

	shuffle() {
		if (!this.puzzle) return;
		this.puzzle = shuffleOuter(this.puzzle);
	}

	addLetter(letter: string) {
		if (!this.puzzle) return;
		const l = letter.toLowerCase();
		if (!/^[a-z]$/.test(l)) return;
		if (this.currentInput.length >= 25) return;
		this.currentInput += l;
	}

	deleteLetter() {
		this.currentInput = this.currentInput.slice(0, -1);
	}

	clearInput() {
		this.currentInput = '';
	}

	submit() {
		if (!this.puzzle) return;
		const word = this.currentInput.toLowerCase().trim();
		if (word.length === 0) return;

		if (word.length < 4) {
			this.showFeedback('Too short', 'error');
			return;
		}
		if (!word.includes(this.puzzle.requiredLetter)) {
			this.showFeedback('Missing center letter', 'error');
			return;
		}
		const letterSet = new Set(this.puzzle.letters);
		for (const ch of word) {
			if (!letterSet.has(ch)) {
				this.showFeedback('Bad letters', 'error');
				return;
			}
		}
		if (this.foundWords.includes(word)) {
			this.showFeedback('Already found', 'info');
			this.clearInput();
			return;
		}
		// Validate against the dictionary set (catches edge cases too)
		if (!getValidWordSet().has(word)) {
			this.showFeedback('Not in word list', 'error');
			return;
		}
		// Final check against the precomputed valid words for this puzzle
		if (!this.puzzle.validWords.includes(word)) {
			this.showFeedback('Not in word list', 'error');
			return;
		}

		const score = computeWordScore(word, this.puzzle.letters);
		const pangram = isPangram(word, this.puzzle.letters);
		this.foundWords = [...this.foundWords, word];
		this.clearInput();
		this.persist();

		if (pangram) {
			this.showFeedback('Pangram!', 'pangram', score);
		} else if (word.length >= 7) {
			this.showFeedback('Awesome!', 'success', score);
		} else if (word.length >= 6) {
			this.showFeedback('Great!', 'success', score);
		} else if (word.length >= 5) {
			this.showFeedback('Nice!', 'success', score);
		} else {
			this.showFeedback('Good!', 'success', score);
		}
	}

	private showFeedback(message: string, kind: FeedbackKind, score?: number) {
		this.feedbackId += 1;
		const id = this.feedbackId;
		this.feedback = { id, message, kind, score };
		if (this.feedbackTimer) clearTimeout(this.feedbackTimer);
		this.feedbackTimer = setTimeout(() => {
			if (this.feedback?.id === id) this.feedback = null;
		}, 1500);
	}

	private persist() {
		if (!browser || !this.puzzle) return;
		try {
			const state: PersistedState = {
				puzzle: this.puzzle,
				foundWords: this.foundWords
			};
			localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
		} catch {
			// ignore storage errors
		}
	}

	private loadFromStorage(): PersistedState | null {
		if (!browser) return null;
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (!raw) return null;
			const parsed = JSON.parse(raw) as PersistedState;
			if (!parsed.puzzle || !Array.isArray(parsed.foundWords)) return null;
			// Basic shape check
			if (!Array.isArray(parsed.puzzle.letters) || parsed.puzzle.letters.length !== 7) return null;
			return parsed;
		} catch {
			return null;
		}
	}
}

export const game = new GameStore();
