define([], () => {
    class Player {
        constructor (game, hud) {
            this._game = game;
            this._hud = hud;
            this._firingTime = null;
            this._ship = null;
            this._cursors = null;
            this._spacebar = null;
            this._bulletGroup = null;
            this._bullet = null;
            this._explosionGroup = null;
            this._alienGroup = null;
            this._aliens = null;
            this._shootingEnabled = null;
            this._bulletSpeed = null;
            this._directions = {A: null, D: null};
        }

        create (configuration) {
            this._hud.createMinorTitle('Tabs: 0');
            this._ship = this._game.add.sprite(window.innerWidth / 2, window.innerHeight, 'ship');
            this._ship.anchor.setTo(0.5, 0.5);
            this._game.physics.enable(this._ship, Phaser.Physics.ARCADE);
            this._ship.body.collideWorldBounds = true;
            this._firingTime = configuration.firingTime;
            this._bulletSpeed = configuration.bulletSpeed;
            this._cursors = this._game.input.keyboard.createCursorKeys();
            this._directions.A = this._game.input.keyboard.addKey(Phaser.Keyboard.A);
            this._directions.D = this._game.input.keyboard.addKey(Phaser.Keyboard.D);
            this._spacebar = this._game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        }

        _fireBullet () {
            if (!this._shootingEnabled) {
                return;
            }
            this._bullet = this._bulletGroup.getFirstExists(false);

            if (this._bullet) {
                this._bullet.checkWorldBounds = true;
                this._bullet.reset(this._ship.x, this._ship.y + 8);
                this._bullet.body.velocity.y = -this._bulletSpeed;
            }
        }

        _collisionHandler (ship, bullet) {
            ship.kill();
            bullet.kill();
            this.stopShooting();
            const explosion = this._explosionGroup.getFirstExists(false);
            explosion.reset(this._ship.body.x, this._ship.body.y);
            explosion.play('kaboom', 30, false, true);
            setTimeout(() => this._game.state.start('End'), 1000);
        }

        update () {
            this._ship.body.velocity.setTo(0, 0);
            if (this._spacebar.justDown) {
                this._fireBullet();
            }
            if (this._cursors.left.isDown || this._directions.A) {
                this._ship.body.velocity.x = -200;
            }
            else if (this._cursors.right.isDown || this._directions.D) {
                this._ship.body.velocity.x = 200;
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
            this._shootingEnabled = true;
        }

        stopShooting () {
            this._shootingEnabled = false;
        }

        getPlayerShip () {
            return this._ship;
        }

        createOverLap (bulletGroup) {
            this._game.physics.arcade.overlap(this._ship, bulletGroup, this._collisionHandler, null, this);
        }

        setAliensAndAlienGroup (aliens) {
            this._aliens = aliens;
            this._alienGroup = aliens.getAlienGroup();
        }
    }
    return Player;
});
