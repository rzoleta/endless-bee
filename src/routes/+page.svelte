<script lang="ts">
  import { onMount } from 'svelte';
  import Honeycomb from '$lib/components/Honeycomb.svelte';
  import GuessInput from '$lib/components/GuessInput.svelte';
  import Controls from '$lib/components/Controls.svelte';
  import FoundWords from '$lib/components/FoundWords.svelte';
  import ScoreBar from '$lib/components/ScoreBar.svelte';
  import GameHistory from '$lib/components/GameHistory.svelte';
  import { game } from '$lib/game/store.svelte';
  import ThemeToggle from '$lib/components/ThemeToggle.svelte';
  import { Button } from '$lib/components/ui/button';

  let pressedLetter = $state<string | null>(null);
  let pressedTimer: ReturnType<typeof setTimeout> | null = null;

  const feedbackColorClasses: Record<string, string> = {
    success:
      'bg-[color:var(--game-feedback-success-bg)] text-[color:var(--game-feedback-success-fg)]',
    pangram: 'bg-[#f7da21] text-[#5e4a00]',
    error: 'bg-[color:var(--game-feedback-error-bg)] text-[color:var(--game-feedback-error-fg)]',
    info: 'bg-[color:var(--game-feedback-error-bg)] text-[color:var(--game-feedback-error-fg)]',
  };

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
</script>

<svelte:head>
  <title>Endless Bee — Free Unlimited Spelling Bee Game</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-5 pb-16 pt-6 text-[color:var(--game-fg)]">
  <header
    class="mb-3 flex items-center justify-between border-b border-[color:var(--game-border-light)] pb-4 lg:mb-6"
  >
    <div class="flex items-center gap-2">
      <span class="text-2xl">🐝</span>
      <h1 class="m-0 text-2xl font-bold tracking-tight">Endless Bee</h1>
    </div>
    <div class="flex items-center gap-2">
      <Button variant="outline" size="pill" onclick={() => game.newGame()}>New Game</Button>
      <ThemeToggle />
      <Button
        variant="outline"
        class="rounded-full"
        aria-label="View source on GitHub"
        href="https://github.com/rzoleta/endless-bee"
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg role="img" viewBox="0 0 24 24" class="size-4 fill-current" aria-hidden="true">
          <path
            d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
          />
        </svg>
      </Button>
    </div>
  </header>

  <div class="flex flex-col gap-8 lg:grid lg:grid-cols-[70%_30%]">
    <!-- Game column -->
    <div>
      {#if game.puzzle}
        <section class="flex flex-col items-center gap-4">
          <div class="flex h-9 w-full items-center justify-center">
            {#if game.feedback}
              {#key game.feedback.id}
                <div
                  class="animate-[feedback-pop_280ms_ease-out] rounded-[6px] px-4 py-[0.4rem] text-[0.95rem] font-bold {feedbackColorClasses[
                    game.feedback.kind
                  ] ?? ''}"
                >
                  {game.feedback.message}
                  {#if game.feedback.score}
                    <span class="ml-[0.4rem] font-extrabold text-[color:var(--game-fg)]"
                      >+{game.feedback.score}</span
                    >
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

          <div class="flex w-full justify-center py-2">
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

        <section class="mt-6">
          <ScoreBar
            score={game.score}
            currentRankIndex={game.rank?.currentIndex ?? 0}
            currentRankName={game.rank?.current.name ?? 'Beginner'}
            isComplete={game.isComplete}
          />
        </section>

        <section class="mt-4">
          <FoundWords
            words={game.foundWords}
            total={game.puzzle.validWords.length}
            puzzleLetters={game.puzzle.letters}
          />
          <div class="mt-2 text-right text-[0.85rem] text-[color:var(--game-muted)]">
            <span>
              Pangrams: <strong>{game.progress.pangramsFound}</strong> / {game.progress
                .pangramsTotal}
            </span>
          </div>
        </section>
      {:else}
        <div class="py-16 text-center text-[color:var(--game-muted)]">Loading puzzle…</div>
      {/if}
    </div>

    <!-- History sidebar -->
    <div class="lg:border-l lg:border-[color:var(--game-border-light)] lg:pl-8">
      <GameHistory />
    </div>
  </div>
</div>
