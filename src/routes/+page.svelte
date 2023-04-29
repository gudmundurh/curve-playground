<script lang="ts">
	import SvgRenderer from "./SvgRenderer.svelte";
	import { Scene } from "./curves";
    
    const scene = new Scene();
</script>

<svelte:head>
    <title>Curve Playground</title>
</svelte:head>

<SvgRenderer {scene} />

