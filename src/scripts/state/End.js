class End {
    constructor (game, nextState, hud) {
        this._game = game;
        this._nextState = nextState;
        this._hud = hud;
    }

    create () {
        this._hud.createTitle('Game Over');
        this._hud.createSubTitle('You murdered ' + 5 + ' tabs.');
    }
}

define([], () => End);
