<script lang="ts">
	import SvgRenderer from './SvgRenderer.svelte';
	import { CubicScene, CssCubicScene } from './curves/cubic';
	import { QuadraticScene } from './curves/quadratic';
	import type { Scene } from './shapes';

	const scenes = [
		{ name: 'Cubic', scene: () => new CubicScene() },
		{ name: 'Quadratic', scene: () => new QuadraticScene() },
		{ name: 'CSS ease', scene: () => new CssCubicScene(0.25, 0.1, 0.25, 1) },
		{ name: 'CSS ease-in', scene: () => new CssCubicScene(0.42, 0, 1, 1) },
		{ name: 'CSS ease-out', scene: () => new CssCubicScene(0, 0, 0.58, 1) },
		{ name: 'CSS ease-in-out', scene: () => new CssCubicScene(0.42, 0, 0.58, 1) },
	];

	let activeIndex = 0;
	let scene: Scene = scenes[0].scene();

	const selectScene = (index: number) => {
		activeIndex = index;
		scene = scenes[index].scene();
	};
</script>

<svelte:head>
	<title>Curve Playground</title>
</svelte:head>

<div class="with-sidebar">
	<div class="sidebar stack">
		<h2>Scene</h2>
		{#each scenes as { name }, i}
			<button class:active={i === activeIndex} on:click={() => selectScene(i)}>{name}</button>
		{/each}
	</div>
	<SvgRenderer {scene} />
</div>

<style>
	button.active {
		background: var(--highlight-hover);
		outline: 1px solid var(--highlight);
		outline-offset: 2px;
	}
</style>
