<script lang="ts">
	import SvgRenderer from './SvgRenderer.svelte';
	import { CubicScene, QuadraticScene } from './scenes';
	import type { Scene } from './shapes';

	let scene: Scene = new CubicScene();
</script>

<svelte:head>
	<title>Curve Playground</title>
</svelte:head>

<div class="with-sidebar">
	<div class="sidebar stack">
		<h2>Scene</h2>
		<button on:click={() => (scene = new CubicScene())}>Cubic</button>
		<button on:click={() => (scene = new QuadraticScene())}>Quadratic</button>
	</div>
	<SvgRenderer {scene} />
</div>
