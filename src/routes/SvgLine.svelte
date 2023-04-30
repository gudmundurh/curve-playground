<script lang="ts">
	import type { Point } from './shapes';

	export let start: Point;
	export let end: Point;
	export let color: string;
</script>

<line x1={start.x} x2={end.x} y1={start.y} y2={end.y} stroke={color} stroke-width=".5" />
