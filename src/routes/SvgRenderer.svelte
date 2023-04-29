<script lang="ts">
	import SvgLine from './SvgLine.svelte';
	import SvgPoint from './SvgPoint.svelte';
	import type { Scene } from './curves';

	export let scene: Scene;

	let t = 0.5;

	const colors = ['red', 'blue', 'green', 'magenta', 'orange', 'olive', 'brown'];
</script>

<div class="container">
	<div class="controls">
		t = <input type="number" min="0" step="0.05" max="1" bind:value={t} />
	</div>

	<svg width="100%" height="500">
		<g transform="scale(3) translate(10, 100) matrix(1, 0, 0, -1, 0, 0)">
			<line x1="-1000" x2="1000" y1="0" y2="0" stroke="black" stroke-width=".5" />
			<line x1="0" x2="0" y1="-1000" y2="1000" stroke="black" stroke-width=".5" />

			{#each scene.objects as object, i}
				{#if object.shape === 'dynamicPoint'}
					<SvgPoint point={object.eval(t)} label={object.label} color={colors[i % colors.length]} />
				{:else if object.shape === 'point'}
					<SvgPoint point={object} label={object.label} color={colors[i % colors.length]} />
				{:else if object.shape === 'dynamicLine'}
					<SvgLine start={object.start.eval(t)} end={object.end.eval(t)} color="#666" />
				{:else if object.shape === 'path'}
					<path d={object.path} stroke="#000" fill="transparent" 
                    />
                    <!-- style:stroke-dasharray="1000"
                    style:stroke-dashoffset={(1-t) * 1000}  -->
				{/if}
			{/each}
		</g>
	</svg>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
	}

	.controls {
		background: #333;
		color: #fff;
		padding: 1rem;
		flex-grow: 0;
	}

	.controls input {
		background: #444;
		border: 1px solid #999;
		color: #fff;
	}

	svg {
		flex: 1;
	}
</style>