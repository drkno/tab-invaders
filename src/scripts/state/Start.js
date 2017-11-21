define(['module/HUD'], HUD => {
    class Start {
        constructor (game, nextState) {
            this._game = game;
            this._nextState = nextState;
        }

        create () {
            HUD.createTitle('Press spacebar to begin');
            this._game.physics.startSystem(Phaser.Physics.ARCADE);

            this._game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(() => {
                this._game.state.start(this._nextState);
            });
        }
    }
    return Start;
});
