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
	class="found-words"
	class:expanded
	aria-expanded={expanded}
	onclick={() => (expanded = !expanded)}
>
	<div class="header">
		<span class="count">
			{words.length === 0 ? 'You have not found any words yet' : `You have found ${words.length} of ${total} words`}
		</span>
		<ChevronDown class="chev" size={18} />
	</div>
	{#if !expanded}
		<div class="preview">
			{#if preview}
				{#each sorted.slice(-5).reverse() as w, i (w)}
					<span class="preview-word" class:pangram={isPangram(w, puzzleLetters)}
						>{w}{i < Math.min(4, sorted.length - 1) ? ',' : ''}</span
					>
				{/each}
			{/if}
		</div>
	{:else}
		<div class="grid">
			{#each sorted as w (w)}
				<span class="word" class:pangram={isPangram(w, puzzleLetters)}>{w}</span>
			{/each}
		</div>
	{/if}
</button>

<style>
	.found-words {
		width: 100%;
		text-align: left;
		background: var(--game-bg);
		border: 1px solid var(--game-border);
		border-radius: 6px;
		padding: 0.75rem 1rem;
		cursor: pointer;
		font-family:
			'nyt-franklin', 'Helvetica Neue', Helvetica, Arial, system-ui, -apple-system,
			'Segoe UI', sans-serif;
	}
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 0.5rem;
	}
	.count {
		font-size: 0.95rem;
		color: var(--game-muted);
	}
	.found-words :global(.chev) {
		transition: transform 200ms ease;
		color: var(--game-muted);
	}
	.found-words.expanded :global(.chev) {
		transform: rotate(180deg);
	}
	.preview {
		margin-top: 0.5rem;
		font-size: 0.95rem;
		color: var(--game-fg);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.preview-word {
		text-transform: capitalize;
		margin-right: 0.4rem;
	}
	.preview-word.pangram {
		color: #f7c800;
		font-weight: 700;
	}
	.grid {
		margin-top: 0.75rem;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
		gap: 0.4rem 0.75rem;
		max-height: 280px;
		overflow-y: auto;
		padding-top: 0.5rem;
		border-top: 1px solid var(--game-border-light);
	}
	.word {
		text-transform: capitalize;
		font-size: 0.95rem;
		color: var(--game-fg);
		padding: 0.2rem 0;
		border-bottom: 1px solid var(--game-border-light);
	}
	.word.pangram {
		color: var(--game-pangram-word);
		font-weight: 700;
	}
</style>
