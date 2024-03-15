<script lang="ts">
	import { onMount } from 'svelte';
	import SvgDraggablePoint from './SvgDraggablePoint.svelte';
	import SvgLine from './SvgLine.svelte';
	import SvgPoint from './SvgPoint.svelte';
	import type { MoveablePoint, Scene } from './shapes';

	export let scene: Scene;

	let t = 0;
	let zoom = 5;

	const colors = ['#12A8CD', '#E5E50E', '#0EBC79', '#E37834', '#A074C4'];
	let playing = false;
	let animiationStart = 0;
	let svgElement: SVGElement | undefined;
	let svgRootGroup: SVGGraphicsElement | undefined;

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

	let boundingBox = { x: 0, y: 0, width: 0, height: 0 };
	let clientRect = { width: 0, height: 0 };

	const yFactor = -1;

	$: shiftX = clientRect.width / 2 - (boundingBox.width * zoom) / 2 - boundingBox.x * zoom;

	$: shiftY =
		clientRect.height / 2 -
		(yFactor * boundingBox.height * zoom) / 2 -
		yFactor * boundingBox.y * zoom;

	$: matrix = [zoom * 1, 0, 0, zoom * yFactor, shiftX, shiftY];

	const centerSceneOnViewport = () => {
		if (!svgElement || !svgRootGroup) return;
		clientRect = svgElement.getBoundingClientRect();
		boundingBox = svgRootGroup.getBBox();
	};

	$: {
		if (scene && typeof window !== 'undefined') {
			// Schedule update to allow the SVG to be updated prior to centering
			requestAnimationFrame(centerSceneOnViewport);
		}
	}

	onMount(centerSceneOnViewport);

	// reverse IF b == zero and c == zero:
	// 		x_new = a x_old + e
	// 		y_new = + d y_old + f
	// gives
	// 		x_old = (x_new - e) / a
	//		y_old = (y_new - f) / d
	//
	const convertScreenToScene = (x: number, y: number) => {
		return {
			x: (x - matrix[4]) / matrix[0],
			y: (y - matrix[5]) / matrix[3]
		};
	};

	const movePoint = (ev: MouseEvent) => {
		if (!movingPoint) return;

		let { x, y } = convertScreenToScene(ev.offsetX, ev.offsetY);
		x = Math.round(x * 10) / 10;
		y = Math.round(y * 10) / 10;

		movingPoint.update(x, y);
		scene = scene;
	};

	let movingPoint: MoveablePoint | null = null;

	const startMove = (point: MoveablePoint) => {
		movingPoint = point;
	};
	const stopMove = (point: MoveablePoint) => {
		movingPoint = null;
	};
</script>

<div class="container">
	<div class="controls">
		t = <input type="range" min="0" step="0.01" max="1" bind:value={t} style="width: 300px" />
		zoom = <input type="number" min="0.25" step="0.25" max="6" bind:value={zoom} />

		<button on:click={playPause}>play/pause</button>
	</div>

	<svg on:mousemove={movePoint} bind:this={svgElement}>
		{#if svgElement}
			<g transform={`matrix(${matrix.join(',')})`} bind:this={svgRootGroup}>
				<!-- <line x1="-1000" x2="1000" y1="0" y2="0" stroke="black" stroke-width=".5" />
			<line x1="0" x2="0" y1="-1000" y2="1000" stroke="black" stroke-width=".5" /> -->

				{#each scene.objects as object, i}
					{#if object.shape === 'dynamicPoint'}
						<SvgPoint point={object.eval(t)} label={object.label} color="#0278d4" />
					{:else if object.shape === 'point'}
						<SvgPoint point={object} label={object.label} color={colors[i % colors.length]} />
					{:else if object.shape === 'moveablePoint'}
						<SvgDraggablePoint
							on:mousedown={() => startMove(object)}
							on:mouseup={() => stopMove(object)}
							point={object}
							label={object.label}
							color={colors[i % colors.length]}
						/>
					{:else if object.shape === 'dynamicLine'}
						<SvgLine start={object.start.eval(t)} end={object.end.eval(t)} color="#0278d4" />
					{:else if object.shape === 'path'}
						<path d={object.path} stroke="#000" fill="transparent" />
					{:else if object.shape === 'dynamicPath'}
						<path d={object.eval(t)} stroke="#fff" fill="transparent" />
					{/if}
				{/each}
			</g>
		{/if}
	</svg>

	<div class="controls">
		{#each scene.objects as object, i}
			{#if object.shape === 'point' || object.shape === 'moveablePoint'}
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

<svelte:window on:resize={centerSceneOnViewport} />

<style>
	.container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		gap: var(--panel-spacing);
	}

	.controls {
		flex-grow: 0;
		background: var(--bg);
	}

	svg {
		flex: 1;
		background: var(--scene-bg);
	}
</style>
