<script lang="ts">
	interface Props {
		letter: string;
		center?: boolean;
		pressed?: boolean;
		onclick?: () => void;
	}

	let { letter, center = false, pressed = false, onclick }: Props = $props();
</script>

<button
	type="button"
	class="hex-btn"
	class:center
	class:pressed
	aria-label={`Letter ${letter.toUpperCase()}${center ? ' (required)' : ''}`}
	onclick={() => onclick?.()}
>
	<svg viewBox="0 0 120 103.92" class="hex-svg" aria-hidden="true">
		<!-- Flat-top hex: flat edges at top and bottom, points on left/right -->
		<polygon
			points="30,0 90,0 120,51.96 90,103.92 30,103.92 0,51.96"
			class="hex-shape"
		/>
	</svg>
	<span class="hex-letter">{letter.toUpperCase()}</span>
</button>

<style>
	.hex-btn {
		position: relative;
		width: 100%;
		aspect-ratio: 120 / 103.92;
		background: transparent;
		border: 0;
		padding: 0;
		cursor: pointer;
		display: block;
		transition: transform 80ms ease-out;
		-webkit-tap-highlight-color: transparent;
	}
	.hex-btn:hover {
		transform: scale(1.02);
	}
	.hex-btn.pressed {
		transform: scale(0.92);
	}
	.hex-btn:active {
		transform: scale(0.94);
	}
	.hex-svg {
		width: 100%;
		height: 100%;
		display: block;
		/* Slight inset so adjacent hexes have a visible gap (NYT-style). */
		transform: scale(0.92);
		transform-origin: center;
	}
	.hex-shape {
		fill: var(--game-hex);
		transition: fill 120ms ease;
	}
	.hex-btn.center .hex-shape {
		fill: #f7da21;
	}
	.hex-btn.pressed .hex-shape {
		fill: var(--game-hex-pressed);
	}
	.hex-btn.center.pressed .hex-shape {
		fill: #e7c800;
	}
	.hex-letter {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: clamp(1.4rem, 4vw, 2rem);
		color: var(--game-fg);
		pointer-events: none;
		user-select: none;
		font-family:
			'nyt-franklin', 'Helvetica Neue', Helvetica, Arial, system-ui, -apple-system,
			'Segoe UI', sans-serif;
		letter-spacing: 0.02em;
	}
</style>
