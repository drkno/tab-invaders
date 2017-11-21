class HUD {
    constructor (game) {
        this._game = game;
        this._scoreText = null;
        this._stateText = null;
    }

    createTitle (title) {
        _stateText = _game.add.text(_game.world.centerX, _game.world.centerY, title, {font: '84px Arial', fill: '#fff'});
        _stateText.anchor.setTo(0.5, 0.5);
    }

    createSubTitle (title) {
        _stateText = _game.add.text(_game.world.centerX, window.innerHeight - 42, title, {font: '42px Arial', fill: '#ff0'});
        _stateText.anchor.setTo(0.5, 0.5);
    }
}

define(() => HUD);
