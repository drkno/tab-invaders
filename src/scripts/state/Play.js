/**
 * Created by stryker on 2014.03.22..
 */
define(['module/Player','module/Aliens','module/Bullets','module/Explosions','module/HUD'],function(Player,Aliens,Bullets,Explosions,HUD){
    var _game = null,
        _nextState = null;

    var aliens = null;

    //Playing State
    var _Play = {
        create: function(){

            //Setting up Player
            var playerConfiguration = {
                health: 1,
                lives: 1,
                score: 0,
                firingTime: 300,
                bulletSpeed: 500
            };

            Player.create(playerConfiguration);
            Player.setBulletGroup(Bullets.create(10,'bullet',100));
            Player.setExplosionGroup(Explosions.create(1,'kaboom'));

            //Setting up Aliens
            var alienConfiguration = {
                rows:4,
                cols:10,
                scoreValue:10,
                firingTime:200,
                bulletSpeed:200,
                health: 100,
                easing: Phaser.Easing.Linear.None
            };

            aliens = Aliens.create(alienConfiguration);
            aliens.setBulletGroup(Bullets.create(30,'enemyBullet',10));
            aliens.setExplosionGroup(Explosions.create(5,'kaboom'));
            Aliens.setPlayerShip(Player.getPlayerShip());

            Player.setAliensAndAlienGroup(aliens);

            //They start shoting, shooting is triggered by a time loop
            Player.startShooting();
            aliens.startShooting();
        },
        update: function(){
            Player.update();

            //Setting up the collision handling
            aliens.createOverLap(Player.getBulletGroup());
            Player.createOverLap(aliens.getBulletGroup());
        }
    }

    return{
        init: function(game,nextState){
            _game = game;
            _nextState = nextState;
        },
        getPlayState: function(){
            return(_Play);
        }
    }
})
