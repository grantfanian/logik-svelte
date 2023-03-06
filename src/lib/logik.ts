const COLORS = [
    "#55ee55",
    "#5555ee",
    "#ee5555",
    "#ee55dd",
    "#555555",
    "#eeee55",
  ];
  
  class Game {
    private sequence;
    private guessed: number[] = [];
  
    constructor(sequence: number[]) {
      this.sequence = sequence;
    }
  
    guess(pos: number, guess: number) {
      this.guessed[pos] = guess;
    }
  
    rate(): number[] {
      let result: number[] = [];
      console.log(this.sequence, this.guessed)
      for (const [i, c] of this.guessed.entries()) {
        let rating = 0;
        for (const [index, color] of this.sequence.entries()) {
          if (c == color) {
            rating = 1;
            if (i == index) {
              rating = 2;
              break;
            }
          }
        }
        console.log(rating)
        rating && result.push(rating);
      }
      game.guessed = [];
      return result;
    }
    static checkWin = (rating: number[]): boolean => rating.filter((v) => { v == 2 }).length == 4;
  }
  

  // test
  let game: any = new Game([1, 2, 3, 4]);
  game.guess(0, 1);
  game.guess(1, 2);
  game.guess(2, 3);
  game.guess(3, 4);
  console.log(game.rate());