<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import type { Point } from './shapes';

	export let point: Point;
	export let label: undefined | string = undefined;
	export let color: string;

	$: x = point.x;
	$: y = point.y;

	$: moving = false;
</script>

<circle
	cx={x}
	cy={y}
	r="2"
	fill={moving ? 'black' : color}
	on:mousedown
	on:mouseup
/>

<g transform="matrix(1, 0, 0, -1, 0, 0)">
	{#if label}
		<text {x} y={-y} dx={2} dy={-2} fill={moving ? 'black' : color}
		 style="font-size: 0.25em"
			>{label}</text
		>
	{/if}
</g>
