'use strict';

const combineImages = (a, b) => {
    return new Promise(resolve => {
        const c = document.createElement('canvas');
        const ctx = c.getContext("2d");

        const imageObj1 = new Image();
        imageObj1.src = a;
        imageObj1.onload = () => {
            ctx.drawImage(imageObj1, 0, 0, 328, 526);

            const imageObj2 = new Image();
            imageObj2.src = b;
            imageObj2.onload = () => {
                ctx.drawImage(imageObj2, 15, 85, 300, 300);
                resolve(c.toDataURL("image/png"));
            };
        };
    });
};

require(['state/Load', 'state/Start', 'state/Play', 'state/End', 'module/HUD', 'module/Player', 'lib/TabFavIconHelper', 'lib/phaser.min'], (Load, Start, Play, End, HUD, Player, Helper) => {
    const game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');

    chrome.tabs.query({
         pinned: false
    }, async(tabs) => {

        for (let tab of tabs) {
            try {
                const hlp = await Helper.getEffectiveURL(tab);
                const res = await combineImages('img/tab32x32x4.png', hlp);
                console.log(res);
            }
            catch (e) {
                console.log('No Icon');
            }
        }


    });

    // setTimeout(() => {
    //     game.load.spritesheet('invader', 'img/tab32x32x4.png', 32, 32);
    //     game.load.spritesheet('kaboom', 'img/explode.png', 128, 128);
    //     game.load.image('ship', 'img/player.png');
    //     game.load.image('bullet', 'img/bullet.png');
    //     game.load.image('enemyBullet', 'img/enemy-bullet.png');
    //     game.load.start();
    //
    //     const hud = new HUD(game);
    //     const player = new Player(game);
    //
    //     const load = new Load(game, 'Start');
    //     const start = new Start(game, 'Play', hud);
    //     const play = new Play(game, 'End', player);
    //     const end = new End(game, 'Play', hud);
    //
    //     game.state.add('Load', load);
    //     game.state.add('Start', start);
    //     game.state.add('Play', play);
    //     game.state.add('End', end);
    //
    //     game.state.start('Load');
    // }, 100);
});
