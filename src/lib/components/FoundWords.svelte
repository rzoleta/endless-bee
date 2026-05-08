<script lang="ts">
  import ChevronDown from '@lucide/svelte/icons/chevron-down';
  import { isPangram } from '$lib/game/puzzle';

  interface Props {
    words: string[];
    total: number;
    puzzleLetters: string[];
  }

  let { words, total, puzzleLetters }: Props = $props();
  let expanded = $state(false);

  const sorted = $derived([...words].sort());
  const preview = $derived(sorted.slice(-5).reverse().join('  '));
</script>

<button
  type="button"
  class="w-full cursor-pointer rounded-[6px] border border-[color:var(--game-border)] bg-[color:var(--game-bg)] px-4 py-3 text-left"
  aria-expanded={expanded}
  onclick={() => (expanded = !expanded)}
>
  <div class="flex items-center justify-between gap-2">
    <span class="text-[0.95rem] text-[color:var(--game-muted)]">
      {words.length === 0
        ? 'You have not found any words yet'
        : `You have found ${words.length} of ${total} words`}
    </span>
    <ChevronDown
      class="shrink-0 text-[color:var(--game-muted)] transition-transform duration-200 {expanded
        ? 'rotate-180'
        : ''}"
      size={18}
    />
  </div>
  {#if !expanded}
    <div
      class="mt-2 overflow-hidden text-ellipsis whitespace-nowrap text-[0.95rem] text-[color:var(--game-fg)]"
    >
      {#if preview}
        {#each sorted.slice(-5).reverse() as w, i (w)}
          <span
            class="mr-[0.4rem] capitalize {isPangram(w, puzzleLetters)
              ? 'font-bold text-[#f7c800]'
              : ''}">{w}{i < Math.min(4, sorted.length - 1) ? ',' : ''}</span
          >
        {/each}
      {/if}
    </div>
  {:else}
    <div
      class="mt-3 grid max-h-[280px] grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-x-3 gap-y-[0.4rem] overflow-y-auto border-t border-[color:var(--game-border-light)] pt-2"
    >
      {#each sorted as w (w)}
        <span
          class="capitalize border-b border-[color:var(--game-border-light)] py-[0.2rem] text-[0.95rem] {isPangram(
            w,
            puzzleLetters,
          )
            ? 'font-bold text-[color:var(--game-pangram-word)]'
            : 'text-[color:var(--game-fg)]'}">{w}</span
        >
      {/each}
    </div>
  {/if}
</button>
