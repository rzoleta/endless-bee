<script lang="ts">
	import { onMount } from 'svelte';
	import Honeycomb from '$lib/components/Honeycomb.svelte';
	import GuessInput from '$lib/components/GuessInput.svelte';
	import Controls from '$lib/components/Controls.svelte';
	import FoundWords from '$lib/components/FoundWords.svelte';
	import ScoreBar from '$lib/components/ScoreBar.svelte';
	import { game } from '$lib/game/store.svelte';

	let pressedLetter = $state<string | null>(null);
	let pressedTimer: ReturnType<typeof setTimeout> | null = null;

	function flashLetter(l: string) {
		pressedLetter = l;
		if (pressedTimer) clearTimeout(pressedTimer);
		pressedTimer = setTimeout(() => (pressedLetter = null), 140);
	}

	onMount(() => {
		game.init();

		function handleKey(e: KeyboardEvent) {
			if (e.metaKey || e.ctrlKey || e.altKey) return;
			const key = e.key;
			if (key === 'Enter') {
				e.preventDefault();
				game.submit();
				return;
			}
			if (key === 'Backspace') {
				e.preventDefault();
				game.deleteLetter();
				return;
			}
			if (/^[a-zA-Z]$/.test(key)) {
				e.preventDefault();
				const l = key.toLowerCase();
				game.addLetter(l);
				flashLetter(l);
			}
		}
		window.addEventListener('keydown', handleKey);
		return () => window.removeEventListener('keydown', handleKey);
	});

	function handleHexClick(letter: string) {
		game.addLetter(letter);
		flashLetter(letter);
	}

	function handleNewGame() {
		if (
			game.foundWords.length > 0 &&
			!confirm('Start a new game? Your current progress will be lost.')
		) {
			return;
		}
		game.newGame();
	}
</script>

<svelte:head>
	<title>Endless Bee</title>
</svelte:head>

<div class="page">
	<header class="header">
		<div class="brand">
			<span class="bee">🐝</span>
			<h1>Endless Bee</h1>
		</div>
		<button type="button" class="new-game" onclick={handleNewGame}>New Game</button>
	</header>

	{#if game.puzzle}
		<section class="score-section">
			<ScoreBar
				score={game.score}
				maxScore={game.puzzle.maxScore}
				currentRankIndex={game.rank?.currentIndex ?? 0}
				currentRankName={game.rank?.current.name ?? 'Beginner'}
			/>
		</section>

		<section class="found-section">
			<FoundWords
				words={game.foundWords}
				total={game.puzzle.validWords.length}
				puzzleLetters={game.puzzle.letters}
			/>
			<div class="pangrams-line">
				<span>
					Pangrams: <strong>{game.progress.pangramsFound}</strong> / {game.progress.pangramsTotal}
				</span>
			</div>
		</section>

		<section class="game-area">
			<div class="feedback-wrap">
				{#if game.feedback}
					{#key game.feedback.id}
						<div class="feedback feedback-{game.feedback.kind}">
							{game.feedback.message}
							{#if game.feedback.score}
								<span class="feedback-score">+{game.feedback.score}</span>
							{/if}
						</div>
					{/key}
				{/if}
			</div>

			<GuessInput
				input={game.currentInput}
				requiredLetter={game.puzzle.requiredLetter}
				validLetters={game.puzzle.letters}
			/>

			<div class="honeycomb-wrap">
				<Honeycomb
					requiredLetter={game.puzzle.requiredLetter}
					outerLetters={game.puzzle.outerLetters}
					{pressedLetter}
					onLetterClick={handleHexClick}
				/>
			</div>

			<Controls
				onDelete={() => game.deleteLetter()}
				onShuffle={() => game.shuffle()}
				onEnter={() => game.submit()}
			/>
		</section>
	{:else}
		<div class="loading">Loading puzzle…</div>
	{/if}
</div>

<style>
	:global(html, body) {
		background: #fff;
	}
	.page {
		max-width: 520px;
		margin: 0 auto;
		padding: 1.5rem 1.25rem 4rem;
		font-family:
			'nyt-franklin', 'Helvetica Neue', Helvetica, Arial, system-ui, -apple-system,
			'Segoe UI', sans-serif;
		color: #333;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 1rem;
		border-bottom: 1px solid #eee;
		margin-bottom: 1rem;
	}
	.brand {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}
	.brand h1 {
		font-size: 1.5rem;
		font-weight: 700;
		margin: 0;
		letter-spacing: -0.01em;
	}
	.bee {
		font-size: 1.5rem;
	}
	.new-game {
		font-size: 0.9rem;
		font-weight: 600;
		padding: 0.5rem 1rem;
		border-radius: 9999px;
		border: 1px solid #dcdcdc;
		background: #fff;
		cursor: pointer;
		font-family: inherit;
		color: #333;
		transition: background 120ms ease;
	}
	.new-game:hover {
		background: #f5f5f5;
	}
	.score-section {
		margin-bottom: 1rem;
	}
	.found-section {
		margin-bottom: 1.5rem;
	}
	.pangrams-line {
		margin-top: 0.5rem;
		font-size: 0.85rem;
		color: #666;
		text-align: right;
	}
	.game-area {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	.feedback-wrap {
		height: 2.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		width: 100%;
	}
	.feedback {
		padding: 0.4rem 1rem;
		border-radius: 6px;
		font-weight: 700;
		font-size: 0.95rem;
		animation: feedback-pop 280ms ease-out;
	}
	.feedback-success {
		background: #fff8d8;
		color: #8a6d00;
	}
	.feedback-pangram {
		background: #f7da21;
		color: #5e4a00;
	}
	.feedback-error {
		background: #f1f1f1;
		color: #666;
	}
	.feedback-info {
		background: #f1f1f1;
		color: #666;
	}
	.feedback-score {
		margin-left: 0.4rem;
		font-weight: 800;
		color: #333;
	}
	@keyframes feedback-pop {
		0% {
			opacity: 0;
			transform: translateY(8px) scale(0.95);
		}
		60% {
			transform: translateY(-2px) scale(1.02);
		}
		100% {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}
	.honeycomb-wrap {
		width: 100%;
		display: flex;
		justify-content: center;
		padding: 0.5rem 0;
	}
	.loading {
		text-align: center;
		padding: 4rem 0;
		color: #888;
	}
</style>
