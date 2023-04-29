<script lang="ts">
	export let scene: Scene;

	let t = 0;

	const colors = ['red', 'blue', 'green', 'magenta', 'orange', 'olive', 'brown'];
</script>

<input type="number" min="0" step="0.05" max="1" bind:value={t} />

<svg width="500" height="500" style:border="1px solid red">
	<g transform="scale(3) translate(10, 100) matrix(1, 0, 0, -1, 0, 0)">
		<line x1="-1000" x2="1000" y1="0" y2="0" stroke="black" stroke-width=".5" />
		<line x1="0" x2="0" y1="-1000" y2="1000" stroke="black" stroke-width=".5" />

		{#each scene.objects as object, i}
			{@const x = typeof object === 'function' ? object(t).x : object.x}
			{@const y = typeof object === 'function' ? object(t).y : object.y}

			<circle cx={x} cy={y} r="2" fill={colors[i % colors.length]} />
			<g transform="matrix(1, 0, 0, -1, 0, 0)">
				<text {x} y={-y} dx={2} dy={-2} fill={colors[i % colors.length]} style="font-size: 0.5em"
					>{object.label}</text
				>
			</g>
		{/each}
	</g>
</svg>
