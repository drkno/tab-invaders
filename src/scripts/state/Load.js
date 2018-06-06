import browser from 'webextension-polyfill';
import { ImageLoader } from '../module';
import ExplodeImage from '../../img/explode.png';
import InvaderImage from '../../img/icon/icon128.png';
import PlayerImage from '../../img/player.png';
import BulletImage from '../../img/bullet.png';
import EnemyBulletImage from '../../img/enemy-bullet.png';

class Load {
    constructor(game, nextStage, hud) {
        this._game = game;
        this._nextStage = nextStage;
        this._hud = hud;
    }

    async create () {
        this._hud.createMinorTitle2('Loading...');
        this._game.tabsDestroyed = 0;

        const ld = new ImageLoader();
        const tabImages = ld.getImages();

        this._game.load.spritesheet('kaboom', ExplodeImage, 128, 128);
        this._game.load.image('invader', InvaderImage);
        this._game.load.image('ship', PlayerImage);
        this._game.load.image('bullet', BulletImage);
        this._game.load.image('enemyBullet', EnemyBulletImage);

        const images = await tabImages;
        for (let i = 0; i < images.length; i++) {
            this._game.load.image(`tab-${i}`, images[i]);
        }
        this._game.load.start();

        this._game.state.start(this._nextStage);
    }
}

export default Load;
