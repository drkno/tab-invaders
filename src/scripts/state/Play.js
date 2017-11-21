define(['module/Player','module/Aliens','module/Bullets','module/Explosions','module/HUD'], (Player, Aliens, Bullets, Explosions, HUD) => {
    class Play {
        constructor (game, nextState) {
            this._game = game;
            this._nextState = nextState;
            this._aliens = null;
        }

        create () {
            const playerConfiguration = {
                health: 1,
                lives: 1,
                score: 0,
                firingTime: 300,
                bulletSpeed: 500
            };

            Player.create(playerConfiguration);
            Player.setBulletGroup(Bullets.create(10,'bullet',100));
            Player.setExplosionGroup(Explosions.create(1,'kaboom'));

            const alienConfiguration = {
                rows:4,
                cols:10,
                scoreValue:10,
                firingTime:200,
                bulletSpeed:200,
                health: 100,
                easing: Phaser.Easing.Linear.None
            };

            const aliens = new Aliens(this._game);
            this._aliens = aliens.create(alienConfiguration);
            this._aliens.setBulletGroup(Bullets.create(30,'enemyBullet',10));
            this._aliens.setExplosionGroup(Explosions.create(5,'kaboom'));
            aliens.setPlayerShip(Player.getPlayerShip());

            Player.setAliensAndAlienGroup(this._aliens);

            //They start shoting, shooting is triggered by a time loop
            Player.startShooting();
            this._aliens.startShooting();
        }

        update () {
            Player.update();
            this._aliens.createOverLap(Player.getBulletGroup());
            Player.createOverLap(this._aliens.getBulletGroup());
        }
    }
    return Play;
});
