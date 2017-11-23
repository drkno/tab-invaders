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
        this._hud.createSubTitle(`You destroyed ${this._game.tabsDestroyed} tab${this._game.tabsDestroyed === 1 ? '' : 's'}.`);

        chrome.storage.sync.get('highScore', highScore => {
            console.log(highScore);
            if (!highScore || highScore < this._game.tabsDestroyed) {
                chrome.storage.sync.set({highScore: this._game.tabsDestroyed}, () => {});
                highScore = this._game.tabsDestroyed;
            }
            this._hud.createMinorTitle(`High score: ${highScore}`);

            this._interval = setInterval(() => {
                this._hud.createMinorTitle2(`Closing game in ${--this._count}...`);
                if (this._count === 0) {
                    clearInterval(this._interval);
                    chrome.tabs.getCurrent(tab => {
                        chrome.tabs.remove(tab.id, () => {});
                    });
                }
            }, 1000);
        });
    }
}

define([], () => End);
