<script lang="ts">
	import SvgRenderer from "./SvgRenderer.svelte";
	import { CubicScene, QScene } from "./curves";
    
    const scene = new CubicScene();
</script>

<svelte:head>
    <title>Curve Playground</title>
</svelte:head>

<SvgRenderer {scene} />

