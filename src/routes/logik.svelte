<script lang="ts">
	import { Game } from '$lib/logik';
	import Dot from './dot.svelte';
	let game = new Game();

	const handleKeyboard = (e: KeyboardEvent) => {
		if (e.code == 'Backspace') {
			if (!game.bootstrap) {
				// @ts-ignore
				game.rows[game.rows.length - 1].guess(game.currentField, null);
			} else {
				// @ts-ignore
				game.sequence[game.currentField] = null;
			}
			game.currentField = game.currentField > 0 ? game.currentField - 1 : 0;
		} else if (!e.repeat) {
			const clr = 'ASDFGH'.indexOf(e.code.slice(3)[0]);
			if (clr >= 0) {
				document.querySelectorAll<HTMLElement>('.input--dot')[clr]?.click();
			} else {
				switch (e.code) {
					case 'ArrowLeft': {
						game.currentField = game.currentField > 0 ? game.currentField - 1 : 3;
						break;
					}
					case 'ArrowRight': {
						game.currentField = game.currentField < 3 ? game.currentField + 1 : 0;
						break;
					}
					case 'Escape': {
						game.rows[game.rows.length - 1].guessed = Array(4).fill(null);
						game.currentField = 0;
						break;
					}
					case 'Enter': {
						const e = document.querySelector<HTMLElement>('.submit.btn');
						if (e && window.getComputedStyle(e).visibility == 'visible') {
							e.click();
						}
						break;
					}
				}
			}
		}
	};
</script>

<svelte:window on:keydown|preventDefault={handleKeyboard} />

<ol type="1" class="game">
	{#if !game.bootstrap}
		{#each Object.entries(game.rows) as [rowindex, row]}
			<li class="gamerow" data-number={+rowindex + 1}>
				<div class="rating">
					{#each row.rating as ratedot}
						<div class="dot rating--dot">
							<Dot color={[null, '#e00', '#dff'][ratedot]} />
						</div>
					{/each}
				</div>
				<div class="guess">
					{#each Object.entries(row.guessed) as [i, guessdot]}
						{#if +rowindex == game.rows.length - 1}
							<button
								class="dot guess--dot active {+i == game.currentField ? 'selected-dot' : ''}"
								on:click={() => {
									game.setCurrent(+i);
									game.currentField = game.currentField;
								}}
							>
								<Dot color={game.COLORS[guessdot] || null} />
							</button>
						{:else}
							<button class="dot guess--dot">
								<Dot color={game.COLORS[guessdot] || null} />
							</button>
						{/if}
					{/each}
				</div>
				{#if +rowindex == game.rows.length - 1 && !game.win && !game.lose}
					<button
						class="submit btn active {game.isGuessed(row.guessed) ? 'anim-visibility' : ''}"
						on:click={() => {
							game.submit();
							game.rows[game.rows.length - 1] = game.rows[game.rows.length - 1];
							game.rows[game.rows.length - 2] = game.rows[game.rows.length - 2];
							game.win = game.win;
							game.lose = game.lose;
							window.scrollTo(0, document.body.scrollHeight);
						}}
					>
						Try it!
					</button>
				{/if}
			</li>
		{/each}
	{:else}
		<li class="gamecaption">Type a color sequence<br />(keys A..H)</li>
		<li class="gamerow" data-bootstrap>
			<div class="guess">
				{#each Object.entries(game.sequence) as [i, seqdot]}
					<button
						class="dot guess--dot active {+i == game.currentField ? 'selected-dot' : ''}"
						on:click={() => {
							game.setCurrent(+i);
							game.currentField = game.currentField;
						}}
					>
						<Dot color={game.COLORS[seqdot] || null} />
					</button>
				{/each}
			</div>
			<button
				class="submit btn active {game.bootstrap && game.isGuessed(game.sequence)
					? 'anim-visibility'
					: ''}"
				on:click={() => {
					game.submit();
					game.bootstrap = game.bootstrap;
					game.rows = game.rows;
					window.scrollTo(0, document.body.scrollHeight);
				}}
			>
				Let's go!
			</button>
		</li>
	{/if}
	{#if !(game.win || game.lose) || game.bootstrap}
		<li class="input">
			<div class="input--btns">
				{#each Object.entries(game.COLORS) as [i, c]}
					<button
						class="dot input--dot active"
						on:click={() => {
							game.guess(+i);
							if (game.rows[game.rows.length - 1]) {
								game.rows[game.rows.length - 1] = game.rows[game.rows.length - 1];
							} else {
								game.sequence = game.sequence;
							}
						}}
					>
						<Dot color={c} />
					</button>
				{/each}
			</div>

			<div class="break" />
			<div class="count-left {game.bootstrap ? '' : 'anim-visibility'}">
				{16 - game.rows.length}<br /><small>guesses left</small>
			</div>
		</li>
	{:else}
		<li class="congratulations {game.win ? 'win' : 'lose'} anim-visibility">
			{game.win ? 'Victory!' : 'Game over'}
			<button
				class="tryagain btn active"
				on:click={() => {
					game = new Game();
					game = game;
				}}>Try again</button
			>
		</li>
	{/if}
</ol>

<style lang="scss">
	ol,
	li,
	button {
		all: unset;
	}
	button {
		display: block;
	}

	.game {
		font-size: 1rem;
		font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
			Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
		display: flex;
		align-items: flex-start;
		flex-direction: column;
	}
	.game > * {
		overflow-anchor: none;
	}

	.gamecaption {
		margin-top: 2em;
		display: block;
		font-size: 2em;
	}

	.gamerow {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		margin-top: 1em;
		gap: 1em;

		.dot {
			display: inline-block;
			border-radius: 50%;
		}

		&:nth-last-child(2) {
			margin-top: 7em;

			.rating {
				position: relative;
				transform: translateY(-100%);
			}

			.dot {
				&:not(.selected-dot) {
					position: relative;
					z-index: 1;
				}

				&.selected-dot {
					position: relative;
					z-index: 0;
					box-shadow: 0 0 3em 1em #ee5;
				}
			}
		}
	}

	.gamerow:not([data-bootstrap])::before {
		content: attr(data-number) '.';
		font-size: inherit;
		width: 2em;
	}

	.rating,
	.guess,
	.input--btns {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
	}
	.rating {
		$size: 2em;
		width: $size * 2 + 0.5 * 2;
		transition: transform 0.1s;

		.rating--dot {
			width: $size;
			height: $size;
		}
	}
	.count-left {
		display: block;
		transition: visibility 0.5s;
		visibility: hidden; // initial
		margin-top: 0.25em;

		font-size: 1.5em;
		text-align: right;

		small {
			font-size: 0.75em;
		}
	}
	.guess {
		$size: 4em;
		height: $size;

		.dot.guess--dot {
			border: 1px solid #222;
			width: $size;
			height: $size;
		}
	}
	.input {
		margin-top: 2em;
		overflow-anchor: auto;
		align-self: flex-end;
		$size: 4em;
		height: $size;
		margin-bottom: 2em;
		.input--btns {
			display: flex;
			height: $size;
			.input--dot {
				width: $size;
				height: $size;
			}
		}
	}
	.congratulations {
		display: flex;
		flex-direction: column;
		align-items: center;
		align-self: center;
		font-size: 4em;
	}
	.btn {
		padding: 0.25rem 1rem 0.5rem 1rem;
		background-color: #33a;
		border-radius: 0.5rem;
	}

	.submit {
		visibility: hidden;
		opacity: 0;
		transition: opacity 0.5s ease;
		font-size: 2em;
	}

	.anim-visibility {
		visibility: visible;
		opacity: 1;
	}
	.active {
		cursor: pointer;
	}
	.break {
		flex-basis: 100%;
	}
</style>
