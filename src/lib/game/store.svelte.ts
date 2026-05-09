import { browser } from '$app/environment';
import { generatePuzzle, isPangram, reconstructPuzzle, shuffleOuter, type Puzzle } from './puzzle';
import { computeTotalScore, computeWordScore, getRank } from './scoring';
import { getValidWordSet } from './dictionary';
import { track } from '@vercel/analytics';

const STORAGE_KEY = 'endless-bee-state-v2';

export interface GameRecord {
  id: string;
  createdAt: number;
  lastPlayedAt: number;
  letters: string[];
  requiredLetter: string;
  foundWords: string[];
  completedAt: number | null;
  totalWords: number;
  maxScore: number;
}

interface AppState {
  activeGameId: string | null;
  games: GameRecord[];
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
  games = $state<GameRecord[]>([]);
  activeGameId = $state<string | null>(null);

  private feedbackTimer: ReturnType<typeof setTimeout> | null = null;
  private feedbackId = 0;

  score = $derived(this.puzzle ? computeTotalScore(this.foundWords, this.puzzle.letters) : 0);
  rank = $derived(this.puzzle ? getRank(this.score) : null);
  isComplete = $derived(
    this.puzzle !== null && this.foundWords.length === this.puzzle.validWords.length,
  );
  progress = $derived(
    this.puzzle
      ? {
          found: this.foundWords.length,
          total: this.puzzle.validWords.length,
          pangramsFound: this.foundWords.filter(
            (w) => this.puzzle && isPangram(w, this.puzzle.letters),
          ).length,
          pangramsTotal: this.puzzle.pangrams.length,
        }
      : { found: 0, total: 0, pangramsFound: 0, pangramsTotal: 0 },
  );

  init() {
    if (!browser) return;
    const state = this.loadFromStorage();
    if (state && state.games.length > 0) {
      this.games = state.games;
      const record = state.games.find((g) => g.id === state.activeGameId) ?? state.games[0];
      this.activeGameId = record.id;
      this.puzzle = reconstructPuzzle(record.letters, record.requiredLetter);
      this.foundWords = record.foundWords;
    } else {
      this.startNewGameRecord();
    }
  }

  newGame() {
    this.currentInput = '';
    this.startNewGameRecord();
  }

  loadGame(id: string) {
    const record = this.games.find((g) => g.id === id);
    if (!record || record.id === this.activeGameId) return;
    this.activeGameId = id;
    this.puzzle = reconstructPuzzle(record.letters, record.requiredLetter);
    this.foundWords = record.foundWords;
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
    if (!getValidWordSet().has(word)) {
      this.showFeedback('Not in word list', 'error');
      return;
    }
    if (!this.puzzle.validWords.includes(word)) {
      this.showFeedback('Not in word list', 'error');
      return;
    }

    const score = computeWordScore(word, this.puzzle.letters);
    const pangram = isPangram(word, this.puzzle.letters);
    this.foundWords = [...this.foundWords, word];
    this.clearInput();
    this.updateActiveRecord();

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

  private startNewGameRecord() {
    const puzzle = generatePuzzle();
    const record: GameRecord = {
      id: crypto.randomUUID(),
      createdAt: Date.now(),
      lastPlayedAt: Date.now(),
      letters: puzzle.letters,
      requiredLetter: puzzle.requiredLetter,
      foundWords: [],
      completedAt: null,
      totalWords: puzzle.validWords.length,
      maxScore: puzzle.maxScore,
    };
    this.games = [record, ...this.games];
    this.activeGameId = record.id;
    this.puzzle = puzzle;
    this.foundWords = [];
    this.persist();
    track('new_game');
  }

  private updateActiveRecord() {
    if (!this.puzzle || !this.activeGameId) return;
    const now = Date.now();
    const isComplete = this.foundWords.length === this.puzzle.validWords.length;
    this.games = this.games.map((g) => {
      if (g.id !== this.activeGameId) return g;
      return {
        ...g,
        foundWords: this.foundWords,
        lastPlayedAt: now,
        completedAt: isComplete ? (g.completedAt ?? now) : g.completedAt,
      };
    });
    this.persist();
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
    if (!browser) return;
    try {
      const state: AppState = {
        activeGameId: this.activeGameId,
        games: this.games,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore storage errors
    }
  }

  private loadFromStorage(): AppState | null {
    if (!browser) return null;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as AppState;
      if (!Array.isArray(parsed.games)) return null;
      return parsed;
    } catch {
      return null;
    }
  }
}

export const game = new GameStore();
