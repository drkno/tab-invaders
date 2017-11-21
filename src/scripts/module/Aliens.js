define(['module/HUD'], HUD => {
    class Aliens {
        constructor (configuration, game) {
            this._game = game;
            this._alienGroup = this._game.add.group();
            this._scoreValue = configuration.scoreValue;
            this._firingTime = configuration.firingTime;
            this._bulletSpeed = configuration.bulletSpeed;
            this._health = configuration.health;
            this._easing = configuration.easing;
            this._alien = null;
            this._tween = null;
            this._bulletGroup = null;
            this._bullet = null;
            this._explosionGroup = null;
            this._livingAlien = [];
            this._randomAlienIndex = null;
            this._shooter = null;
            this._shootingEvent = null;
            this._playerShip = null;

            this._alienGroup.enableBody = true;
            this._alienGroup.physicsBodyType = Phaser.Physics.ARCADE;
            this._createAlienGroup();
        }

        _createAlienGroupImpl (tabs) {
            const tabCount = tabs.length,
                aliensPerWidth = ((window.innerWidth / 48) / 2) | 0;

            let j = 0;
            let k = 0;
            while (k < tabCount) {
                for (let i = 0; i < aliensPerWidth, k < tabCount; i++, k++) {
                    this._alien = this._alienGroup.create(i * 48, j * 50, 'invader');

                    //custome properties
                    this._alien.health = this._health;
                    this._alien.myScore = this._scoreValue;

                    this._alien.anchor.setTo(0.5, 0.5);
                    this._alien.animations.add('fly', [ 0, 1, 2, 3 ], 20, true);
                    this._alien.play('fly');
                    this._alien.body.moves = false;
                }
                j++;
            }

            this._alienGroup.x = 100;
            this._alienGroup.y = 50;

            //  All this does is basically start the invaders moving.
            this._tween = this._game.add.tween(this._alienGroup).to( { x: window.innerWidth - 48 * Math.min(tabCount, aliensPerWidth)}, 2 * window.innerWidth, this._easing, true, 0, 1000, true);
        }

        _createAlienGroup () {
            if (!!window.chrome) {
                chrome.tabs.query({
                     pinned: false
                }, tabs => {
                    this._createAlienGroupImpl(tabs);
                });
            }
            else {
                console.log('chrome was undefined');
                this._createAlienGroupImpl([1,2,3,4,5,6,7,8]);
            }
        }

        _fireBullet () {
            this._bullet = this._bulletGroup.getFirstExists(false);
            this._livingAlien = [];

            this._alienGroup.forEachAlive(alien => {
                this._livingAlien.push(alien);
            });

            if (this._bullet && this._livingAlien.length > 0) {
                this._bullet.checkWorldBounds = true;
                this._randomAlienIndex = this._game.rnd.integerInRange(0, this._livingAlien.length);
                this._shooter = this._livingAlien[this._randomAlienIndex];

                if (this._shooter) {
                    this._bullet.reset(this._shooter.body.x, this._shooter.body.y);
                    this._game.physics.arcade.moveToObject(this._bullet, this._playerShip, this._bulletSpeed);
                }
            }
            else if (this._livingAlien.length == 0){
                this._game.state.start('End');
            }
        }

        _collisionHandler (bullet, alien) {
            alien.kill();
            bullet.kill();
            const explosion = this._explosionGroup.getFirstExists(false);
            explosion.reset(alien.body.x, alien.body.y);
            explosion.play('kaboom', 30, false, true);
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
    return Aliens;
});
