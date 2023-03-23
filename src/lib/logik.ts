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
		console.log(counts);

		for (const [i, c] of this.guessed.entries()) {
			for (const [index, color] of this.sequence.entries()) {
				// debugger;
				if (c == color) {
					if (!result[c]) {
						result[c] = [];
					}
					console.log(
						c,
						result[c].filter((v) => !!(v + 1)).length,
						result[c].reduce((a, v) => a + (v + 1 ? 1 : 0), 0)
					);
					if (result[c].filter((v) => !!(v + 1)).length < counts[c]) {
						result[c][i] = 1;
						// // eslint-disable-next-line no-debugger
						// debugger;
						console.log(result, i, index);
						if (i == index) {
							result[c][i] = 2;
							break;
						}
					} else if (i == index) {
						const firstone = result[c].indexOf(1);
						if (firstone >= 0) {
							result[c][firstone] = 2;
						}
					}
				}
			}
		}
		console.log('result', result);
		const res = result
			.reduce((a, v) => {
				v.forEach((e, i) => e && (a[i] = e));
				return a;
			}, [])
			.filter((v) => v != null);
		res.push(...Array(4 - res.length).fill(null));
		console.log(res);
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
		console.log(this);
	}

	setCurrent(pos: number) {
		// ain't got no operator overloading
		if (pos > 3) {
			if (this.currentField < 3) {
				this.currentField++;
			}
		} else {
			this.currentField = pos;
		}
	}

	guess(color: number) {
		if (this.bootstrap) {
			this.sequence[this.currentField] = color;
			console.log(this.currentField, color);
			this.setCurrent(4);
		} else if (!this.bootstrap) {
			this.rows[this.rows.length - 1].guess(this.currentField, color);
			console.log(this.currentField, color);
			this.setCurrent(4);
		}
	}

	isGuessed = (f: number[]) =>
		f != null ? [...Array(4).keys()].every((v) => !!f[v] || f[v] === 0) : false;
	checkWin = (rating: number[]) => rating.reduce((a, v) => a + v) == 8;
	submit() {
		// TODO: dispatch event for a field error
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
