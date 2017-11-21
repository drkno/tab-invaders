class HUD {
    constructor (game) {
        this._game = game;
        this._scoreText = null;
        this._stateText = null;
    }

    createTitle (title) {
        this._stateText = this._game.add.text(this._game.world.centerX, this._game.world.centerY, title, {font: '84px Arial', fill: '#fff'});
        this._stateText.anchor.setTo(0.5, 0.5);
    }

    createSubTitle (title) {
        this._stateText = this._game.add.text(this._game.world.centerX, window.innerHeight - 42, title, {font: '42px Arial', fill: '#ff0'});
        this._stateText.anchor.setTo(0.5, 0.5);
    }
}

define(() => HUD);
