import { Aliens, Bullets, Explosions } from '../module';
import { settings } from '../util';

class Play {
    constructor (game, nextState, player, hud) {
        this._game = game;
        this._nextState = nextState;
        this._player = player;
        this._hud = hud;
        this._aliens = null;
        this._loadComplete = false;
    }

    async create () {
        const playerConfiguration = {
            firingTime: 300,
            bulletSpeed: 500
        };

        await this._player.create(playerConfiguration);
        this._player.setBulletGroup(new Bullets(10, 'bullet', 100, this._game));
        this._player.setExplosionGroup(new Explosions(1, 'kaboom', this._game));

        const alienConfiguration = {
            firingTime: 200,
            minBulletSpeed: 200,
            maxBulletSpeed: 600,
            easing: Phaser.Easing.Linear.None
        };

        this._aliens = new Aliens(alienConfiguration, this._game, this._hud);
        this._aliens.setBulletGroup(new Bullets(30, 'enemyBullet', 10, this._game));
        this._aliens.setExplosionGroup(new Explosions(5, 'kaboom', this._game));
        this._aliens.setPlayerShip(this._player.getPlayerShip());

        this._player.setAliensAndAlienGroup(this._aliens);

        this._player.startShooting();
        this._aliens.startShooting();
        this._loadComplete = true;

        const currentPlayCount = await settings.playCount();
        settings.playCount(currentPlayCount + 1);
    }

    update () {
        if (!this._loadComplete) {
            return;
        }
        this._player.update();
        this._aliens.createOverLap(this._player.getBulletGroup());
        this._player.createOverLap(this._aliens.getBulletGroup());
    }
}

export default Play;
