<script lang="ts">
	import SvgRenderer from "./SvgRenderer.svelte";
	import { Scene } from "./curves";
    
    const scene = new Scene();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<SvgRenderer {scene} />
