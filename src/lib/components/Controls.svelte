<script lang="ts">
	import RotateCcw from '@lucide/svelte/icons/rotate-ccw';

	interface Props {
		onDelete?: () => void;
		onShuffle?: () => void;
		onEnter?: () => void;
	}

	let { onDelete, onShuffle, onEnter }: Props = $props();
</script>

<div class="controls">
	<button type="button" class="ctrl-btn" onclick={() => onDelete?.()}>Delete</button>
	<button
		type="button"
		class="ctrl-btn icon-btn"
		aria-label="Shuffle letters"
		onclick={() => onShuffle?.()}
	>
		<RotateCcw size={18} />
	</button>
	<button type="button" class="ctrl-btn" onclick={() => onEnter?.()}>Enter</button>
</div>

<style>
	.controls {
		display: flex;
		gap: 1rem;
		justify-content: center;
		margin-top: 1.5rem;
		flex-wrap: wrap;
	}
	.ctrl-btn {
		min-width: 5.5rem;
		height: 3rem;
		border-radius: 9999px;
		border: 1px solid var(--game-border);
		background: var(--game-bg);
		font-weight: 600;
		font-size: 1rem;
		color: var(--game-fg);
		cursor: pointer;
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.4rem;
		transition: background 120ms ease, border-color 120ms ease, transform 80ms ease;
		font-family:
			'nyt-franklin', 'Helvetica Neue', Helvetica, Arial, system-ui, -apple-system,
			'Segoe UI', sans-serif;
	}
	.ctrl-btn:hover {
		background: var(--game-hover);
	}
	.ctrl-btn:active {
		transform: scale(0.97);
	}
	.icon-btn {
		min-width: 3rem;
		width: 3rem;
		padding: 0;
	}
</style>
