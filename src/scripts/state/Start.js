class Start {
    constructor (game, nextState, hud) {
        this._game = game;
        this._nextState = nextState;
        this._hud = hud;
    }

    create () {
        this._hud.createTitle('Press spacebar to begin');
        this._game.physics.startSystem(Phaser.Physics.ARCADE);

        this._game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(() => {
            this._game.state.start(this._nextState);
        });
    }
}

define([], () => Start);
