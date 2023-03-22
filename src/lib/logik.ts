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
				if (c == color) {
					if (!result[c]) {
						result[c] = [];
					}
					if (result[c].length < counts[c]) {
						result[c][i] = 1;
						// eslint-disable-next-line no-debugger
						debugger;
						if (i == index) {
							result[c][i] = 2;
							break;
						}
					}
				}
			}
		}
		console.log(result);
		const res = result
			.reduce((a, v) => {
				v.forEach((e, i) => e && (a[i] = e));
				return a;
			}, [])
			.filter((v) => v != null);
		res.push(...Array(4 - res.length).fill(null));
		console.log(res);
		/* console.log(result);
		let res = Object.entries(result)
			.map((kv) => [+kv[0], kv[1]])
			//@ts-expect-error pointless generic `number | number[]`: it can't be `number`
			.sort((a, b) => a[1][0] - b[1][0]);

		console.log(res);

		//@ts-expect-error pointless generic `number | number[]`: it can't be `number`
		res = res.map((v) => v[1][1]);
		res.push(...Array(4 - res.length).fill(null));

		console.log(res);

		//@ts-expect-error pointless generic `number | number[]`: it can't be `number`
		this.rating = res;
		this.win = this.checkWin(this.rating); */
	}
	checkWin = (rating: number[]) => rating.filter((v) => v == 2).length == 4;
	// less obscure than reduce-sum without losing performance with len 4
}

export class Game {
	currentField = 0;
	sequence: number[] = Array(4).fill(null);
	rows: GameRow[] = [];
	win = false;
	lose = false;
	bootstrap = true; // alternative to these funny bool states exists?

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
		// TODO: dispatch errors on wrong inputs
		if (this.bootstrap /* && !this.sequence.includes(color) */) {
			this.sequence[this.currentField] = color;
			console.log(this.currentField, color);
			this.setCurrent(4);
		} else if (!this.bootstrap /*  && !this.rows[this.rows.length - 1].guessed.includes(color) */) {
			this.rows[this.rows.length - 1].guess(this.currentField, color);
			console.log(this.currentField, color);
			this.setCurrent(4);
		}
	}

	isGuessed(field: number[]): boolean {
		return [...Array(4).keys()].every((v) => !!field[v] || field[v] === 0);
	}

	submit() {
		if (this.bootstrap) {
			this.currentField = 0;
			this.newRow();
			this.bootstrap = false;
		} else {
			this.rows[this.rows.length - 1].rate();
			this.win ||= this.rows[this.rows.length - 1].win;
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
