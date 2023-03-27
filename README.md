# logik-svelte

an implementation of the [Mastermind](https://en.wikipedia.org/wiki/Mastermind_(board_game)) game in SvelteKit (on Node), aiming for good UX.

This is my first project in svelte.

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
- controls: the player may guess the controls, yet placing a guide somewhere would be very nice
- animations: UI will feel more natural with more animations
- layout: cleaner layout, consistent between game states
- CI build to gh-pages using adapter-static