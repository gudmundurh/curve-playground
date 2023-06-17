<script lang="ts">
	import SvgRenderer from "./SvgRenderer.svelte";
	import { CubicScene, QuadraticScene  } from "./scenes";
    
    const scene = new CubicScene();
    //const scene = new QuadraticScene();
</script>

<svelte:head>
    <title>Curve Playground</title>
</svelte:head>

<SvgRenderer {scene} />

    