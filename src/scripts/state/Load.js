class Load {
    constructor(game, nextStage) {
        this._game = game;
        this._nextStage = nextStage;
    }

    create () {
        this._game.state.start(this._nextStage);
    }
}

define([], () => Load);
