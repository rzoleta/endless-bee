<script lang="ts">
  import { RANK_TIERS, GENIUS_THRESHOLD } from '$lib/game/scoring';

  interface Props {
    score: number;
    currentRankIndex: number;
    currentRankName: string;
    isComplete: boolean;
  }

  let { score, currentRankIndex, currentRankName, isComplete }: Props = $props();

  const tierFraction = $derived(currentRankIndex / (RANK_TIERS.length - 1));

  function dotClass(i: number): string {
    if (i === currentRankIndex) {
      return 'size-7 bg-[#f7c800] flex items-center justify-center text-[#333] font-bold text-[0.85rem] z-[2]';
    }
    return `size-[10px] ${i < currentRankIndex ? 'bg-[#f7c800]' : 'bg-[color:var(--game-border)]'}`;
  }
</script>

<div class="flex items-center gap-4 py-2">
  <div class="min-w-[6.5rem] text-base font-bold text-[color:var(--game-fg)]">
    {#if isComplete}
      👑 Queen Bee
    {:else}
      {currentRankName}
    {/if}
  </div>
  <div class="relative h-6 flex-1" aria-hidden="true">
    <div
      class="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 bg-[color:var(--game-border)]"
    ></div>
    {#each RANK_TIERS as _tier, i (i)}
      <div
        class="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-200 {dotClass(
          i,
        )}"
        style="left: {(i / (RANK_TIERS.length - 1)) * 100}%;"
      >
        {#if i === currentRankIndex}
          <span class="leading-none">{score}</span>
        {/if}
      </div>
    {/each}
    <div
      class="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 bg-[#f7c800] [transition:width_250ms_ease]"
      style="width: {tierFraction * 100}%;"
    ></div>
  </div>
  <div class="min-w-[4rem] text-right text-[0.85rem] text-[color:var(--game-muted)]">
    {GENIUS_THRESHOLD} pts
  </div>
</div>
