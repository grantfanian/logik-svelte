<script lang="ts">
	import { Game } from '$lib/logik';
	import Dot from './dot.svelte';
	let game = new Game(); //new Game([3, 1, 2, 0]);
	// game.newRow();
	$: {
		console.log(game.rows[game.rows.length - 2]);
	}
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
			let clr = 'ASDFGH'.indexOf(e.code.slice(3)[0]);
			if (clr >= 0) {
				// game.guess(clr);
				// game.rows[game.rows.length - 1] = game.rows[game.rows.length - 1];
				document.querySelectorAll<HTMLElement>('.input--dot')[clr]?.click();
			} else {
				switch (e.code) {
					case 'ArrowLeft': {
						game.currentField = game.currentField > 0 ? game.currentField - 1 : 0;
						break;
					}
					case 'ArrowRight': {
						game.currentField = game.currentField < 3 ? game.currentField + 1 : game.currentField;
						break;
					}
					case 'Escape': {
						game.rows[game.rows.length - 1].guessed = Array(4).fill(null);
						game.currentField = 0;
						break;
					}
					case 'Enter': {
						document.querySelector<HTMLElement>('.submit.btn')?.click();
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
			<li class="gamerow">
				<div class="count">{+rowindex + 1}.</div>
				<div class="rating">
					{#each row.rating as ratedot}
						<div class="dot rating--dot">
							<Dot color={[null, '#fff', '#e55'][ratedot]} />
						</div>
					{/each}
				</div>
				<div class="guess">
					<!-- {@debug row} -->
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
							game.bootstrap = game.bootstrap;
						}}
					>
						Try it!
					</button>
					<!-- {@debug game} -->
				{/if}
			</li>
		{/each}
	{:else}
		<li class="gamerow">
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
				}}
			>
				Let's go!
			</button>
		</li>
	{/if}
	{#if !(game.win || game.lose) || game.bootstrap}
		<li class="input">
			<div class="count-left {game.bootstrap ? '' : 'anim-visibility'}">
				{16 - game.rows.length}<br /><small>guesses left</small>
			</div>
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
		</li>
	{:else}
		<li class="congratulations {game.win ? 'win' : 'lose'} anim-visibility">
			{game.win ? 'Victory!' : 'Game over'}
			<button
				class="tryagain btn active"
				on:click={() => {
					game = new Game();
					game = game;
				}}>Try again!</button
			>
			<!-- {@debug game} -->
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
		overflow-y: auto;
	}

	.count {
		display: flex;
		width: 2em;
		font-size: 2em;
		position: relative;
		// transform: translateX(100%);
		align-items: center;
	}
	.count-left {
		display: block;
		visibility: hidden;

		font-size: 1.5em;
		text-align: right;
		small {
			font-size: 1rem;
		}
	}
	.congratulations {
		display: flex;
		flex-direction: column;
		align-items: center;
		font-size: 4em;
	}
	.rating,
	.guess,
	.input {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5em;
	}

	.gamerow {
		display: flex;
		flex-wrap: wrap;
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
					box-shadow: 0 0 1em 0.75em #ee5;
				}
			}
		}
	}

	.rating {
		$size: 2em;
		width: $size * 2 + 0.5 * 2;
		.rating--dot {
			width: $size;
			height: $size;
		}
	}

	.input {
		margin-top: 2em;

		$size: 4em;
		height: $size;
		.input--dot {
			width: $size;
			height: $size;
		}
	}
	.guess {
		$size: 4em;
		height: $size;
		.guess--dot {
			width: $size;
			height: $size;
		}
	}
	.active {
		cursor: pointer;
	}
	.btn {
		padding: 0.25rem 1rem 0.5rem 1rem;
		background-color: #33a;
		border-radius: 0.5rem;
	}
	.submit {
		visibility: hidden;
		font-size: 2em;
	}

	.anim-visibility {
		animation-duration: 0.5s;
		animation-timing-function: linear;
		animation-fill-mode: forwards;
		animation-name: show;
	}
	@keyframes show {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
			visibility: visible;
		}
	}
</style>
