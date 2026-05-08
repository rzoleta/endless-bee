<script lang="ts">
  interface Props {
    letter: string;
    center?: boolean;
    pressed?: boolean;
    onclick?: () => void;
  }

  let { letter, center = false, pressed = false, onclick }: Props = $props();

  const hexFill = $derived(
    center && pressed
      ? '#e7c800'
      : center
        ? '#f7da21'
        : pressed
          ? 'var(--game-hex-pressed)'
          : 'var(--game-hex)',
  );
</script>

<button
  type="button"
  class="relative block w-full cursor-pointer touch-manipulation border-0 bg-transparent p-0 [aspect-ratio:120/103.92] [transition:transform_80ms_ease-out] active:scale-[0.94] {pressed
    ? 'scale-[0.92]'
    : 'hover:scale-[1.02]'}"
  aria-label={`Letter ${letter.toUpperCase()}${center ? ' (required)' : ''}`}
  style="-webkit-tap-highlight-color: transparent;"
  onclick={() => onclick?.()}
>
  <svg viewBox="0 0 120 103.92" class="block h-full w-full scale-[0.92]" aria-hidden="true">
    <polygon
      points="30,0 90,0 120,51.96 90,103.92 30,103.92 0,51.96"
      style="fill: {hexFill}; transition: fill 120ms ease;"
    />
  </svg>
  <span
    class="pointer-events-none absolute inset-0 flex select-none items-center justify-center text-[2rem] font-bold tracking-[0.02em] text-[color:var(--game-fg)] {center
      ? 'dark:text-black'
      : ''}"
  >
    {letter.toUpperCase()}
  </span>
</button>
