define(['module/HUD'], HUD => {
    class Player {
        constructor (game) {
            this._game = game;
            this._health = null;
            this._lives = null;
            this._score = null;
            this._firingTime = null;
            this._ship = null;
            this._cursors = null;
            this._bulletGroup = null;
            this._bullet = null;
            this._explosionGroup = null;
            this._explosion = null;
            this._alienGroup = null;
            this._aliens = null;
            this._shootingEvent = null;
            this._bulletSpeed = null;
        }

        create (configuration) {
            this._ship = this._game.add.sprite(400, 500, 'ship');
            this._ship.anchor.setTo(0.5, 0.5);
            this._game.physics.enable(this._ship, Phaser.Physics.ARCADE);
            this._ship.body.collideWorldBounds = true;
            this._ship.health = configuration.health;
            this._health = configuration.health;
            this._lives = configuration.lives;
            this._score = configuration.score;
            this._firingTime = configuration.firingTime;
            this._bulletSpeed = configuration.bulletSpeed;

            this._cursors = this._game.input.keyboard.createCursorKeys();
        }

        _fireBullet () {
            this._bullet = this._bulletGroup.getFirstExists(false);

            if (this._bullet){
                //_bullet.lifespan = _game.height / (_bulletSpeed/1000);
                this._bullet.checkWorldBounds = true;
                this._bullet.reset(this._ship.x, this._ship.y + 8);
                this._bullet.body.velocity.y = -this._bulletSpeed;
            }
        }

        _collisionHandler (ship, bullet) {
            ship.damage(bullet.bulletDamage);
            bullet.kill();

            //ship lose a life
            if (ship.health <= 0) {
                this.stopShooting();
                this._explosion = this._explosionGroup.getFirstExists(false);
                this._explosion.reset(this._ship.body.x, this._ship.body.y);
                this._explosion.play('kaboom', 30, false, true);
                setTimeout(() => this._game.state.start('End'), 1000);
            }
        }

        update () {
            this._ship.body.velocity.setTo(0, 0);

            if (this._cursors.left.isDown) {
                this._ship.body.velocity.x = -200;
            }
            else if (this._cursors.right.isDown) {
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
            this._shootingEvent = this._game.time.events.loop(this._firingTime, this._fireBullet, this);
        }

        stopShooting () {
            this._game.time.events.remove(this._shootingEvent);
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
