<script lang="ts">
	import SvgRenderer from "./SvgRenderer.svelte";
	import { Scene } from "./curves";
    
    const scene = new Scene();
</script>

<SvgRenderer {scene} />

