# logik-svelte

an implementation of the [Mastermind](https://en.wikipedia.org/wiki/Mastermind_(board_game)) game in SvelteKit (on Node), aiming for good UX.

This is my first project in svelte.

## the game
### keybindings

| key            | action                                                     |
| -------------- | ---------------------------------------------------------- |
| A..H on QWERTY | guess a color (corrseponding to order in UI selection row) |
| Backspace      | reset a dot under the cursor; move the cursor backwards    |
| Enter          | submit the sequence/guess if possible                      |
| Esc            | reset the current field                                    |
| P              | reset the game state completely                            |

### rating 
red dot means a guessed color exists in the sequence.

white dot means a guessed color exists in the sequence and is on the same position as a guessed value.

### rules
you win if the guess matches the original sequence, so, if all the dots in the rating are white.

you lose after 15 consecutive non-winning attempts.

the sequences and guesses can contain duplicates. empty fields are not allowed, though.  
when rating, a dot is given only if a corresponding duplicate exists in the original sequence.  

sequence contains two yellows, guess contains three --> two dots are given in the rating for guessed yellows.  

the rating is done left-to-right.  
some behavior is described in the comment here: [lib/logik.ts:52](https://github.com/grantfanian/logik-svelte/blob/master/src/lib/logik.ts#L52).  
### gameplay
the game greets you with the initial sequence input screenn.  
here you can input the sequence the player will try to guess using buttons on the bottom row or [keys](#keybindings). submit it with the Enter key or the appearing button.  

after that, the guessing screen opens.  
you can input the guess the same way as the sequence and submit it.  
on submission, your guess will be rated according to the [rules](#rules) mentioned above.  
rating results in colored dots appearing left to the guess row, representing fulfilled [rating conditions](#rating) stated above.  
old guesses remain available for reference.  

if you neither win nor lose, another row appends to the end and you can guess again.

at a win/lose you're given the choice to reset the game and play again.

## running
fetch dependencies with npm: 
```shell
$ npm install
```

and then

```shell
$ npm run build
$ npm run preview
```

or for development:
```shell
$ npm run dev
```

## missing features / TODO
- IMPORTANT feature: initialize the game with random values
- `logik.svelte` likely isn't an independed component yet
- easy mode: use recent guesses to suggest the player what the dot can't be
- custom rules?
- animations: UI will feel more natural with more animations
- layout: cleaner layout, consistent between game states
- CI build to gh-pages using adapter-static