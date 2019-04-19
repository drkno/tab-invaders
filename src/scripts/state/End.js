import browser from 'webextension-polyfill';
import { getSetting, updateSetting } from '../options.js';
import sleep from '../util/sleep.js';

class End {
    constructor (game, nextState, hud) {
        this._game = game;
        this._nextState = nextState;
        this._hud = hud;
    }

    async _renderRestartMessage() {
        this._game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(() => {
            this._game.tabsDestroyed = 0;
            this._game.state.start(this._nextState);
        });
        this._hud.createMinorTitle2('Press space play again.');
    }

    async _renderCloseTimer() {
        const secondsBeforeClose = await getSetting('closeTimeout', 4);
        for (let i = secondsBeforeClose; i > 0; i--) {
            this._hud.createMinorTitle2(`Closing game in ${i} second${i === 1 ? '' : 's'}...`);
            await sleep(1000);
        }
        const tab = await browser.tabs.getCurrent();
        await browser.tabs.remove(tab.id);
    }

    async _renderGameOver(tabs, highScore) {
        this._hud.createTitle('Game Over');
        this._hud.createSubTitle(`You destroyed ${tabs} tab${tabs === 1 ? '' : 's'}.`);
        this._hud.createMinorTitle(`High score: ${highScore}`);
    }

    async _getHighScore(tabs) {
        let highScore = await getSetting('highScore', 0);
        if (highScore < tabs) {
            highScore = await updateSetting('highScore', tabs);
        }
        return highScore;
    }

    async create () {
        const highScore = await this._getHighScore(this._game.tabsDestroyed);
        const autoClose = await getSetting('autoCloseOnComplete', true);

        await this._renderGameOver(this._game.tabsDestroyed, highScore);
        if (autoClose) {
            await this._renderCloseTimer();
        }
        else {
            await this._renderRestartMessage();
        }
    }
}

export default End;
