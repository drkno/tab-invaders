import browser from 'webextension-polyfill';
import { getSetting, updateSetting } from '../options.js';

class End {
    constructor (game, nextState, hud) {
        this._game = game;
        this._nextState = nextState;
        this._hud = hud;
        this._interval = null;
        this._count = 4;
    }

    async create () {
        this._hud.createTitle('Game Over');
        this._hud.createSubTitle(`You destroyed ${this._game.tabsDestroyed} tab${this._game.tabsDestroyed === 1 ? '' : 's'}.`);

        let highScore = await getSetting('highScore');
        if (!highScore || highScore < this._game.tabsDestroyed) {
            await updateSetting('highScore', this._game.tabsDestroyed);
            highScore = this._game.tabsDestroyed;
        }
        this._hud.createMinorTitle(`High score: ${highScore}`);
        this._interval = setInterval(async() => {
            this._hud.createMinorTitle2(`Closing game in ${--this._count}...`);
            if (this._count === 0) {
                clearInterval(this._interval);
                const tab = await browser.tabs.getCurrent();
                await browser.tabs.remove(tab.id);
            }
        }, 1000);
    }
}

export default End;
