class Aliens {
    constructor (configuration, game, hud) {
        this._game = game;
        this._hud = hud;
        this._alienGroup = this._game.add.group();
        this._scoreValue = configuration.scoreValue;
        this._firingTime = configuration.firingTime;
        this._minBulletSpeed = configuration.minBulletSpeed;
        this._maxBulletSpeed = configuration.maxBulletSpeed;
        this._bulletSpeed = this._minBulletSpeed;
        this._tabCount = 0;
        this._easing = configuration.easing;
        this._tween = null;
        this._bulletGroup = null;
        this._explosionGroup = null;
        this._livingAlien = [];
        this._randomAlienIndex = null;
        this._shootingEvent = null;
        this._playerShip = null;

        this._alienGroup.enableBody = true;
        this._alienGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this._createAlienGroup();
    }

    _queryTabs () {
        return new Promise(resolve => chrome.tabs.query({ pinned: false }, tabs => resolve(tabs)));
    }

    async _createAlienGroup () {
        const tabs = await this._queryTabs();
        this._tabCount = tabs.length;
        const aliensPerWidth = ((window.innerWidth / 48) / 2) | 0;

        let j = 0;
        let k = 0;
        while (k < this._tabCount) {
            for (let i = 0; i < aliensPerWidth && k < this._tabCount; i++, k++) {
                const alien = this._alienGroup.create(i * 48, j * 50, `tab-${k}`);
                alien.tabId = tabs[k].id && tabs[k].id !== chrome.tabs.TAB_ID_NONE ? tabs[k].id : null;
                alien.anchor.setTo(0.5, 0.5);
                alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
                alien.play('fly');
                alien.body.moves = false;
            }
            j++;
        }

        this._alienGroup.x = 100;
        this._alienGroup.y = 50;

        this._tween = this._game.add.tween(this._alienGroup).to({x: window.innerWidth - 48 * Math.min(this._tabCount, aliensPerWidth)},
            2 * window.innerWidth, this._easing, true, 0, 1000, true);
    }

    _fireBullet () {
        const bullet = this._bulletGroup.getFirstExists(false);
        this._livingAlien = [];

        this._alienGroup.forEachAlive(alien => {
            this._livingAlien.push(alien);
        });

        if (bullet && this._livingAlien.length > 0) {
            bullet.checkWorldBounds = true;
            this._randomAlienIndex = this._game.rnd.integerInRange(0, this._livingAlien.length);
            const shooter = this._livingAlien[this._randomAlienIndex];

            if (shooter) {
                bullet.reset(shooter.body.x, shooter.body.y);
                this._game.physics.arcade.moveToObject(bullet, this._playerShip, this._bulletSpeed);
            }
        }
        else if (this._livingAlien.length == 0){
            this._game.state.start('End');
        }
    }

    _collisionHandler (bullet, alien) {
        const diff = (this._maxBulletSpeed - this._minBulletSpeed) / this._tabCount;
        this._bulletSpeed += diff;
        this._game.tabsDestroyed.push(alien.tabId);
        this._hud.createMinorTitle(`Tabs: ${this._game.tabsDestroyed.length}`);
        alien.kill();
        bullet.kill();
        const explosion = this._explosionGroup.getFirstExists(false);
        if (explosion) {
            explosion.reset(alien.body.x, alien.body.y);
            explosion.play('kaboom', 30, false, true);
        }
    }

    setBulletGroup (bullets) {
        this._bulletGroup = bullets.getBulletGroup();
    }

    getBulletGroup () {
        return this._bulletGroup;
    }

    setExplosionGroup (explosions) {
        this._explosionGroup = explosions.getExplosionGroup();
    }

    startShooting () {
        this._shootingEvent = this._game.time.events.loop(this._firingTime, this._fireBullet, this);
    }

    stopShooting () {
        this._game.time.events.remove(this._shootingEvent);
    }

    createOverLap (bulletGroup) {
        this._game.physics.arcade.overlap(bulletGroup, this._alienGroup, this._collisionHandler, null, this);
    }

    getAlienGroup () {
        return this._alienGroup;
    }

    setPlayerShip (playerShip) {
        this._playerShip = playerShip;
    }
}
define([], () => Aliens);
