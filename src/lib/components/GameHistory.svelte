<script lang="ts">
  import { game, type GameRecord } from '$lib/game/store.svelte';
  import { computeTotalScore, getRank } from '$lib/game/scoring';

  function formatDate(ts: number): string {
    return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function recordScore(record: GameRecord): number {
    return computeTotalScore(record.foundWords, record.letters);
  }

  function recordRank(record: GameRecord): string {
    return getRank(recordScore(record), record.maxScore).current.name;
  }

  function percentage(record: GameRecord): number {
    if (record.totalWords === 0) return 0;
    return Math.round((record.foundWords.length / record.totalWords) * 100);
  }

  function lettersDisplay(record: GameRecord): { letter: string; isCenter: boolean }[] {
    return record.letters.map((l) => ({ letter: l.toUpperCase(), isCenter: l === record.requiredLetter }));
  }
</script>

<aside class="flex flex-col gap-1">
  <h2 class="mb-2 text-sm font-semibold uppercase tracking-wider text-[color:var(--game-muted)]">
    History
  </h2>

  {#if game.games.length === 0}
    <p class="text-sm text-[color:var(--game-muted)]">No games yet.</p>
  {:else}
    {#each game.games as record (record.id)}
      {@const isActive = record.id === game.activeGameId}
      <button
        onclick={() => game.loadGame(record.id)}
        class="w-full rounded-lg border px-3 py-2.5 text-left transition-colors
          {isActive
            ? 'border-[#f7da21] bg-[#f7da21]/10'
            : 'border-[color:var(--game-border-light)] hover:border-[#f7da21]/50 hover:bg-[#f7da21]/5'}"
      >
        <div class="mb-1 flex items-center justify-between gap-2">
          <span class="text-xs text-[color:var(--game-muted)]">{formatDate(record.createdAt)}</span>
          <div class="flex items-center gap-1">
            <span class="text-xs font-medium text-[color:var(--game-muted)]">{recordRank(record)}</span>
            {#if record.completedAt}
              <span title="Queen Bee!">👑</span>
            {/if}
          </div>
        </div>

        <div class="mb-1 flex flex-wrap gap-0.5">
          {#each lettersDisplay(record) as { letter, isCenter }}
            <span
              class="text-xs font-bold
                {isCenter ? 'text-[#f7da21]' : 'text-[color:var(--game-fg)]'}"
            >{letter}</span>
          {/each}
        </div>

        <div class="text-xs text-[color:var(--game-muted)]">
          {record.foundWords.length}/{record.totalWords} words
          ({percentage(record)}%)
        </div>
      </button>
    {/each}
  {/if}
</aside>
