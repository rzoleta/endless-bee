<script lang="ts">
  interface Props {
    input: string;
    requiredLetter: string;
    validLetters: string[];
  }

  let { input, requiredLetter, validLetters }: Props = $props();

  const validSet = $derived(new Set(validLetters));

  function charClass(ch: string): string {
    if (ch === requiredLetter) return 'text-[#f7c800]';
    if (!validSet.has(ch)) return 'text-[color:var(--game-invalid)]';
    return 'text-[color:var(--game-fg)]';
  }
</script>

<div
  class="flex min-h-10 items-center justify-center text-[1.9rem] font-bold uppercase tracking-[0.02em] text-[color:var(--game-fg)]"
  aria-live="polite"
>
  {#if input.length === 0}
    <span
      class="ml-[1px] inline-block h-[1.5em] w-[2px] animate-[blink_1s_steps(1)_infinite] bg-[#f7c800]"
      aria-hidden="true"
    ></span>
  {:else}
    {#each input.split('') as ch, i (i + ch)}
      <span class={charClass(ch)}>{ch.toUpperCase()}</span>
    {/each}
    <span
      class="ml-[1px] inline-block h-[1.5em] w-[2px] animate-[blink_1s_steps(1)_infinite] bg-[#f7c800]"
      aria-hidden="true"
    ></span>
  {/if}
</div>
