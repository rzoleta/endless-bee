<script lang="ts">
	interface Props {
		input: string;
		requiredLetter: string;
		validLetters: string[];
	}

	let { input, requiredLetter, validLetters }: Props = $props();

	const validSet = $derived(new Set(validLetters));
</script>

<div class="guess-input" aria-live="polite">
	{#if input.length === 0}
		<span class="cursor" aria-hidden="true"></span>
	{:else}
		{#each input.split('') as ch, i (i + ch)}
			<span
				class="char"
				class:required={ch === requiredLetter}
				class:invalid={!validSet.has(ch)}>{ch.toUpperCase()}</span
			>
		{/each}
		<span class="cursor" aria-hidden="true"></span>
	{/if}
</div>

<style>
	.guess-input {
		min-height: 2.5rem;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: clamp(1.4rem, 3.5vw, 1.9rem);
		font-weight: 700;
		letter-spacing: 0.02em;
		color: var(--game-fg);
		font-family:
			'nyt-franklin', 'Helvetica Neue', Helvetica, Arial, system-ui, -apple-system,
			'Segoe UI', sans-serif;
		text-transform: uppercase;
	}
	.char.required {
		color: #f7c800;
	}
	.char.invalid {
		color: var(--game-invalid);
	}
	.cursor {
		display: inline-block;
		width: 2px;
		height: 1.5em;
		background: #f7c800;
		margin-left: 1px;
		animation: blink 1s steps(1) infinite;
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
</style>
