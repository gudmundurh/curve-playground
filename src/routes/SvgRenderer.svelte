<script lang="ts">
	export let scene: Scene;

	let t = 0;

	const colors = ['red', 'blue', 'green', 'magenta', 'orange', 'olive', 'brown'];
</script>

<div class="container">
	<div class="controls">
		t: <input type="number" min="0" step="0.05" max="1" bind:value={t} />
	</div>

	<svg width="100%" height="500">
		<g transform="scale(3) translate(10, 100) matrix(1, 0, 0, -1, 0, 0)">
			<line x1="-1000" x2="1000" y1="0" y2="0" stroke="black" stroke-width=".5" />
			<line x1="0" x2="0" y1="-1000" y2="1000" stroke="black" stroke-width=".5" />

			{#each scene.objects as object, i}
				{#if object.shape === 'dynamicPoint'}
					{@const point = object.eval(t)}
					{@const x = point.x}
					{@const y = point.y}

					<circle cx={x} cy={y} r="2" fill={colors[i % colors.length]} />
					<g transform="matrix(1, 0, 0, -1, 0, 0)">
						<text
							{x}
							y={-y}
							dx={2}
							dy={-2}
							fill={colors[i % colors.length]}
							style="font-size: 0.5em">{object.label}</text
						>
					</g>
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
