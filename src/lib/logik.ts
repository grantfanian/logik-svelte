export class GameRow {
	sequence: number[];

	guessed: number[] = Array(4).fill(null);
	rating: number[] = Array(4).fill(null);
	win = false;

	constructor(sequence: number[]) {
		this.sequence = sequence;
	}

	guess(pos: number, guess: number) {
		this.guessed[pos] = guess;
	}

	rate() {
		const result: number[][] = [];
		// const Object* result, created Object is mutable :)

		const counts = this.sequence.reduce(
			(cnt: { [key: number]: number }, cur) => ((cnt[cur] = cnt[cur] + 1 || 1), cnt),
			{}
		);

		for (const [i, c] of this.guessed.entries()) {
			for (const [index, color] of this.sequence.entries()) {
				// debugger;
				if (c == color) {
					if (!result[c]) {
						result[c] = [];
					}
					// reduce-count of the actual non-empty array fields
					if (result[c].reduce((a, v) => a + ~~(!!v || v === 0), 0) < counts[c]) {
						result[c][i] = 1;
						if (i == index) {
							result[c][i] = 2;
							break;
						}
					} else if (i == index) {
						// this may be unwanted
						const last1 = result[c].lastIndexOf(1);
						if (last1 >= 0) {
							//@ts-expect-error inner for this function so `number` is not guaranteed
							result[c][last1] = undefined;
							result[c][i] = 2;
						}
					}
				}
			}
		}

		/*
		seq:		0,		0,	1,	2
		guess:		2,		1,	1,	2
		
		(score values 1 for red/black, 2 for white)

		result:	1:	 , (1=>2),	 ,	 
				2:	 ,		 ,	 ,	2
		
		res:		2,		2,	 ,	 
		*/

		const res = result
			// merge the per-color rating arrays
			.reduce((a, v) => {
				v.forEach((e, i) => e && (a[i] = e));
				return a;
			}, [])
			.filter((v) => !!v); // compact the result - `!!` for not returning a `number`

		res.push(...Array(4 - res.length).fill(null));
		this.rating = res;
	}
}

export class Game {
	currentField = 0;
	sequence: number[] = Array(4).fill(null);
	rows: GameRow[] = [];
	win = false;
	lose = false;
	bootstrap = true; // is there an alternative to these funny state bools?

	COLORS = ['#5e5', '#55e', '#e55', '#e5d', '#555', '#ee5'];

	constructor(sequence?: number[]) {
		if (sequence) {
			this.sequence = sequence;
		} else {
			this.bootstrap = true;
		}
	}

	setCurrent(pos: number) {
		/* when `pos` > 3, move `currentField` to the next position */
		if (pos > 3) {
			if (this.currentField < 3) {
				this.currentField++;
			} else {
				this.currentField = 0;
			}
		} else {
			this.currentField = pos;
		}
	}

	guess(color: number) {
		console.log(`guess field ${this.currentField} as ${color}`);
		if (this.bootstrap) {
			this.sequence[this.currentField] = color;
			this.setCurrent(4);
		} else if (!this.bootstrap) {
			this.rows[this.rows.length - 1].guess(this.currentField, color);
			this.setCurrent(4);
		}
	}

	isGuessed = (f: number[]) =>
		f != null ? [...Array(4).keys()].every((v) => !!f[v] || f[v] === 0) : false;

	checkWin = (rating: number[]) => rating.reduce((a, v) => a + v) == 8;

	submit() {
		if (this.bootstrap) {
			this.currentField = 0;
			this.newRow();
			this.bootstrap = false;
		} else {
			this.rows[this.rows.length - 1].rate();
			this.win ||= this.checkWin(this.rows[this.rows.length - 1].rating);
			if (!this.win) {
				this.lose ||= !(this.rows.length < 15);
				if (!this.lose) {
					this.newRow();
					this.currentField = 0;
				}
			}
		}
	}
	newRow() {
		this.rows.push(new GameRow(this.sequence));
	}
}
