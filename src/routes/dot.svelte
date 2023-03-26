<script>
	// @ts-nocheck
	export let color;
	let clazz = '';
	export { clazz as class };
</script>

<svg
	viewBox="0 0 100 100"
	xmlns="http://www.w3.org/2000/svg"
	class="svgdot {clazz} {color && 'opaque'}"
	><circle cx="50" cy="50" r="50" style="--color:{color || '#fff'}" /></svg
>

<style lang="scss">
	.svgdot {
		transition: filter 0.2s;
		backdrop-filter: blur(30%);
		filter: opacity(5%);
		> circle {
			transition: fill 0.2s ease;
			fill: var(--color);
		}
	}
	.opaque {
		filter: opacity(100%);
	}
</style>
