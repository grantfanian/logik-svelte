export class GameRow {
	private sequence: number[];

	guessed: number[] = Array(4).fill(null);
	rating: number[] = Array(4).fill(null);
	win = false;

	constructor(sequence: number[]) {
		/*
	// define a fake-const sequence field on the instance
	Object.defineProperty(this, 'sequence', {
		value: sequence,
		writable: false,
		enumerable: true,
		configurable: true
	});
	// simplified away 
	*/
		this.sequence = sequence;
	}

	guess(pos: number, guess: number) {
		this.guessed[pos] = guess;
	}

	/* rate() {
	let result: number[] = [];

	// calm down it's here
	console.log(this.sequence, this.guessed);

	// order depends on order on guessed, this may be unjust
	for (const [i, c] of this.guessed.entries()) {
		let rating = [0,0];
		for (const [index, color] of this.sequence.entries()) {
			if (c == color) {
				rating = [index,1];
				if (i == index) {
					rating = [index,2];
					break;
				}
			}
		}
		console.log(rating);

		result[rating[0]] = result[rating[0]] > rating[1] ? result[rating[0]] : rating[1];
		console.log(result);
	}
	result = result.filter((v) => v != 0);
	this.rating = result.fill(0, result.length, 4);
	this.win = this.checkWin(this.rating);
}
*/
	rate() {
		const result: number[][] = [];
		// const Object* result while created Object is modifiable :)

		for (const [i, c] of this.guessed.entries()) {
			for (const [index, color] of this.sequence.entries()) {
				if (c == color) {
					if ((result[c] ?? [null, 0])[1] < 1) {
						result[c] = [i, 1];
					}
					if (i == index) {
						result[c] = [i, 2];
						break;
					}
				}
			}
		}
		console.log(result);
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
		this.win = this.checkWin(this.rating);
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
		if (this.bootstrap) {
			this.sequence[this.currentField] = color;
			console.log(this.currentField, color);
			this.setCurrent(4);
		} else {
			this.rows[this.rows.length - 1].guess(this.currentField, color);
			console.log(this.currentField, color);
			this.setCurrent(4);
		}
	}

	isGuessed(field: number[]): boolean {
		return [...Array(4).keys()].every((v) => !!field[v]);
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
				this.lose ||= !(this.rows.length < 16);
				this.newRow();
				this.currentField = 0;
			}
		}
	}
	newRow() {
		this.rows.push(new GameRow(this.sequence));
	}
}
