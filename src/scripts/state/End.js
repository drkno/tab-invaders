define(['module/HUD'], HUD => {
    class End {
        constructor (game, nextState) {
            this._game = game;
            this._nextState = nextState;
        }

        create () {
            HUD.createTitle('Game Over');
            HUD.createSubTitle('You murdered ' + 5 + ' tabs.');
        }
    }
    return End;
})
