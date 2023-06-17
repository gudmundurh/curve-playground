<script lang="ts">
	import SvgDraggablePoint from './SvgDraggablePoint.svelte';
	import SvgLine from './SvgLine.svelte';
	import SvgPoint from './SvgPoint.svelte';
	import type { Point, Scene } from './shapes';

	export let scene: Scene;

	let t = 0;
	let zoom = 5;

	const colors = ['red', 'blue', 'green', 'magenta', 'orange', 'olive', 'brown'];
	let playing = false;
	let animiationStart = 0;

	const playPause = () => {
		playing = !playing;

		if (playing) {
			animiationStart = Date.now();
			requestAnimationFrame(runAnimation);
		}
	};

	const runAnimation = () => {
		if (!playing) return;

		const time = Date.now() - animiationStart;

		t = (time % 7500) / 7500;

		requestAnimationFrame(runAnimation);
	};

	// matrix: [a, b, c, d, e, f]
	// x_new = a x_old + c y_old + e
	// y_new = b x_old + d y_old + f

	$: matrix = [zoom * 1, 0, 0, zoom * -1, 10, 400];

	// reverse IF b == zero and c == zero:
	// 		x_new = a x_old + e
	// 		y_new = + d y_old + f
	// gives
	// 		x_old = (x_new - e) / a
	//		y_old = (y_new - f) / d

	const convertScreenToScene = (x: number, y: number) => {
		return {
			x: (x - matrix[4]) / matrix[0],
			y: (y - matrix[5]) / matrix[3]
		};
	};

	const movePoint = (ev: MouseEvent) => {
		if (!movingPoint) return;

		console.log('move point', movingPoint.label, ev.offsetX, ev.detail.y);
		const { x, y } = convertScreenToScene(ev.offsetX, ev.offsetY);

		movingPoint.update(x, y);
		scene = scene;
	};

	let movingPoint: Point | null = null;

	const startMove = (point: Point) => {
		movingPoint = point;
	};
	const stopMove = (point: Point) => {
		movingPoint = null;
	};
</script>

<div class="container">
	<div class="controls">
		t = <input type="range" min="0" step="0.01" max="1" bind:value={t} style="width: 300px" />
		zoom = <input type="number" min="0.25" step="0.25" max="6" bind:value={zoom} />

		<button on:click={playPause}>play/pause</button>
	</div>

	<svg width="100%" height="500" on:mousemove={movePoint}>
		<g transform={`matrix(${matrix.join(',')})`}>
			<!-- <line x1="-1000" x2="1000" y1="0" y2="0" stroke="black" stroke-width=".5" />
			<line x1="0" x2="0" y1="-1000" y2="1000" stroke="black" stroke-width=".5" /> -->

			{#each scene.objects as object, i}
				{#if object.shape === 'dynamicPoint'}
					<SvgPoint point={object.eval(t)} label={object.label} color="#7474ff" />
				{:else if object.shape === 'point'}
					<SvgDraggablePoint
						on:mousedown={() => startMove(object)}
						on:mouseup={() => stopMove(object)}
						point={object}
						label={object.label}
						color={colors[i % colors.length]}
					/>
				{:else if object.shape === 'dynamicLine'}
					<SvgLine start={object.start.eval(t)} end={object.end.eval(t)} color="#7474ff" />
				{:else if object.shape === 'path'}
					<path d={object.path} stroke="#000" fill="transparent" />
				{:else if object.shape === 'dynamicPath'}
					<path d={object.eval(t)} stroke="#fff" fill="transparent" />
				{/if}
			{/each}
		</g>
	</svg>

	<div class="controls">
		{#each scene.objects as object, i}
			{#if object.shape === 'point'}
				<span>
					<span style:background-color={colors[i % colors.length]} class="dot" />
					{object.label}
					{object.x}
					{object.y}
				</span>
			{/if}
		{/each}
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background: #000;
	}

	.controls {
		flex-grow: 0;
	}

	svg {
		flex: 1;
	}
</style>
