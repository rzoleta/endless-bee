<script lang="ts">
	import { RANK_TIERS } from '$lib/game/scoring';

	interface Props {
		score: number;
		maxScore: number;
		currentRankIndex: number;
		currentRankName: string;
	}

	let { score, maxScore, currentRankIndex, currentRankName }: Props = $props();

	// We compute a 0..1 fraction of progress along the bar based on tier index.
	const tierFraction = $derived(currentRankIndex / (RANK_TIERS.length - 1));
</script>

<div class="score-bar">
	<div class="rank">{currentRankName}</div>
	<div class="bar" aria-hidden="true">
		<div class="line"></div>
		{#each RANK_TIERS as _tier, i (i)}
			<div
				class="dot"
				class:active={i <= currentRankIndex}
				class:current={i === currentRankIndex}
				style="left: {(i / (RANK_TIERS.length - 1)) * 100}%;"
			>
				{#if i === currentRankIndex}
					<span class="dot-score">{score}</span>
				{/if}
			</div>
		{/each}
		<div class="fill" style="width: {tierFraction * 100}%;"></div>
	</div>
	<div class="meta">
		<span>{score} pts</span>
		<span class="muted">of {maxScore}</span>
	</div>
</div>

<style>
	.score-bar {
		display: flex;
		align-items: center;
		gap: 1rem;
		padding: 0.5rem 0;
		font-family:
			'nyt-franklin', 'Helvetica Neue', Helvetica, Arial, system-ui, -apple-system,
			'Segoe UI', sans-serif;
	}
	.rank {
		font-weight: 700;
		font-size: 1rem;
		color: var(--game-fg);
		min-width: 6.5rem;
	}
	.bar {
		position: relative;
		flex: 1;
		height: 1.5rem;
	}
	.line {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 2px;
		background: var(--game-border);
		transform: translateY(-50%);
	}
	.fill {
		position: absolute;
		top: 50%;
		left: 0;
		height: 2px;
		background: #f7c800;
		transform: translateY(-50%);
		transition: width 250ms ease;
	}
	.dot {
		position: absolute;
		top: 50%;
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--game-border);
		transform: translate(-50%, -50%);
		transition: background 200ms ease;
	}
	.dot.active {
		background: #f7c800;
	}
	.dot.current {
		width: 28px;
		height: 28px;
		background: #f7c800;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #333;
		font-weight: 700;
		font-size: 0.85rem;
		z-index: 2;
	}
	.dot-score {
		line-height: 1;
	}
	.meta {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		font-size: 0.85rem;
		color: var(--game-muted);
		min-width: 4.5rem;
	}
	.muted {
		color: var(--game-muted-2);
		font-size: 0.75rem;
	}
</style>
