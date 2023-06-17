<script lang="ts">
	import type { Point } from './shapes';

	export let point: Point;
	export let label: undefined | string = undefined;
	export let color: string;

	$: x = point.x;
	$: y = point.y;
</script>

<circle cx={x} cy={y} r="1" fill={color} style="pointer-events: none" />

<g transform="matrix(1, 0, 0, -1, 0, 0)">
	{#if label}
		<text {x} y={-y} dx={2} dy={-2} fill={color} font-size="0.5rem">{label}</text>
	{/if}
</g>
