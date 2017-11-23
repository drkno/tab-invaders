class HUD {
    constructor (game) {
        this._game = game;
        this._titleText = null;
        this._subtitleText = null;
        this._minorTitle = null;
        this._minorTitle2 = null;
    }

    createTitle (title) {
        this._titleText = this._game.add.text(this._game.world.centerX, this._game.world.centerY, title, {
            font: '84px Arial',
            fill: 'black',
            stroke: '#ff0',
            strokeThickness: 4
        });
        this._titleText.anchor.setTo(0.5, 0.5);
    }

    createSubTitle (title) {
        this._subtitleText = this._game.add.text(this._game.world.centerX, window.innerHeight - 42, title, {font: '42px Arial', fill: '#ff0'});
        this._subtitleText.anchor.setTo(0.5, 0.5);
    }

    createMinorTitle (title) {
        if (this._minorTitle) {
            this._minorTitle.destroy();
        }
        this._minorTitle = this._game.add.text(0, 0, title, {font: '20px Arial', fill: '#aaa'});
        this._minorTitle.anchor.setTo(0, 0);
    }

    createMinorTitle2 (title) {
        if (this._minorTitle2) {
            this._minorTitle2.destroy();
        }
        this._minorTitle2 = this._game.add.text(this._game.world.centerX, this._game.world.centerY + 42, title, {font: '20px Arial', fill: '#aaa'});
        this._minorTitle2.anchor.setTo(0.5, 0);
    }
}

define(() => HUD);
