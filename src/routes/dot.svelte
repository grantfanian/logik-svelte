<script>
    // @ts-nocheck
	export let color;
    let clazz = "";
    export {clazz as class}
</script>
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" class="{clazz}"><circle cx="50" cy="50" r="50" style="filter:opacity({color?"100%":"5%"});" fill={color||'#fff'}></svg>
