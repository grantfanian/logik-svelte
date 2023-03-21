export const prerender = true;
// adapter-static is also used

export const csr = false;

import { Game } from '$lib/logik';

import type { PageLoad } from './$types';

export const load = (async () => {
	return {
		game: new Game([1, 2, 3, 4])
	};
}) satisfies PageLoad;
import App from './App.svelte';

const app = new App({
	target: document.body,
	props: {}
});
