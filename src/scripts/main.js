'use strict';

require(['state/Load', 'state/Start', 'state/Play', 'state/End', 'module/HUD', 'module/Player', 'module/ImageLoader', 'lib/phaser.min'], (Load, Start, Play, End, HUD, Player, TabImageLoader) => {
    const game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');

    const ld = new TabImageLoader();
    const tabImages = ld.getImages();

    setTimeout(async() => {
        game.load.spritesheet('invader', 'img/tab32x32x4.png', 32, 32);
        game.load.spritesheet('kaboom', 'img/explode.png', 128, 128);
        game.load.image('ship', 'img/player.png');
        game.load.image('bullet', 'img/bullet.png');
        game.load.image('enemyBullet', 'img/enemy-bullet.png');

        const images = await tabImages;
        for (let i = 0; i < images.length; i++) {
            game.load.image(`tab-${i}`, images[i]);
        }

        game.load.start();

        const hud = new HUD(game);
        const player = new Player(game);

        const load = new Load(game, 'Start');
        const start = new Start(game, 'Play', hud);
        const play = new Play(game, 'End', player);
        const end = new End(game, 'Play', hud);

        game.state.add('Load', load);
        game.state.add('Start', start);
        game.state.add('Play', play);
        game.state.add('End', end);

        game.state.start('Load');
    }, 100);
});
