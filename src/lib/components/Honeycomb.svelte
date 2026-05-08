<script lang="ts">
	import Hexagon from './Hexagon.svelte';

	interface Props {
		requiredLetter: string;
		outerLetters: string[];
		pressedLetter?: string | null;
		onLetterClick?: (letter: string) => void;
	}

	let { requiredLetter, outerLetters, pressedLetter = null, onLetterClick }: Props = $props();

	/* Flat-top hex tile is W=120, H=103.92.
	   Container is built around 3 columns and 3 rows of half-hex steps.
	   Total container width  = 3W                           = 360
	   Total container height = 2H + H                       = 311.76 (top + center + bottom rows)
	     - center row at y = H = 103.92
	     - upper/lower diagonal rows at y = H/2 and y = 3H/2 (i.e. 51.96 and 155.88), top/bottom at 0 and 2H
	   Each cell is positioned by its CENTER as a percentage of these dimensions.
	   Cell size: 120 wide of 360 = 33.33% width of container.
	   We use absolute positioning with `left/top` as %.
	*/
	const TOTAL_W = 360;
	const TOTAL_H = 311.76;
	const W = 120;
	const H = 103.92;

	function pct(value: number, total: number): string {
		return `${(value / total) * 100}%`;
	}

	// Six outer positions: top, top-right, bottom-right, bottom, bottom-left, top-left
	// Center of container at (TOTAL_W/2, TOTAL_H/2) = (180, 155.88)
	const cx = TOTAL_W / 2;
	const cy = TOTAL_H / 2;
	const outerPositions = [
		{ x: cx, y: cy - H }, // top
		{ x: cx + (W * 3) / 4, y: cy - H / 2 }, // top-right
		{ x: cx + (W * 3) / 4, y: cy + H / 2 }, // bottom-right
		{ x: cx, y: cy + H }, // bottom
		{ x: cx - (W * 3) / 4, y: cy + H / 2 }, // bottom-left
		{ x: cx - (W * 3) / 4, y: cy - H / 2 } // top-left
	];

	const cellWPct = (W / TOTAL_W) * 100; // ~33.33%
</script>

<div class="relative mx-auto w-[min(360px,88vw)] [aspect-ratio:360/311.76]">
	<div
		class="absolute -translate-x-1/2 -translate-y-1/2 [aspect-ratio:120/103.92]"
		style="width: {cellWPct}%; left: {pct(cx, TOTAL_W)}; top: {pct(cy, TOTAL_H)};"
	>
		<Hexagon
			letter={requiredLetter}
			center
			pressed={pressedLetter === requiredLetter}
			onclick={() => onLetterClick?.(requiredLetter)}
		/>
	</div>
	{#each outerLetters as letter, i (letter)}
		<div
			class="absolute -translate-x-1/2 -translate-y-1/2 [aspect-ratio:120/103.92]"
			style="width: {cellWPct}%; left: {pct(outerPositions[i].x, TOTAL_W)}; top: {pct(outerPositions[i].y, TOTAL_H)};"
		>
			<Hexagon
				{letter}
				pressed={pressedLetter === letter}
				onclick={() => onLetterClick?.(letter)}
			/>
		</div>
	{/each}
</div>
