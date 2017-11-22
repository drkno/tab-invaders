class End {
    constructor (game, nextState, hud) {
        this._game = game;
        this._nextState = nextState;
        this._hud = hud;
        this._interval = null;
        this._count = 4;
    }

    create () {
        this._hud.createTitle('Game Over');
        this._hud.createSubTitle(`You murdered ${this._game.tabsDestroyed} tab${this._game.tabsDestroyed === 1 ? '' : 's'}.`);

        chrome.storage.sync.get('highScore', highScore => {
            if (!highScore || highScore < this._game.tabsDestroyed) {
                chrome.storage.sync.set({highScore: this._game.tabsDestroyed}, () => {});
                highScore = this._game.tabsDestroyed;
            }
            this._hud.createMinorTitle(`High score: ${highScore}`);

            this._interval = setInterval(() => {
                this._hud.createMinorTitle2(`Closing tabs in ${--this._count}...`);
                if (this._count === 0) {
                    clearInterval(this._interval);
                }
            }, 1000);
        });

        setTimeout(() => {

        }, 2000);
    }
}

define([], () => End);
