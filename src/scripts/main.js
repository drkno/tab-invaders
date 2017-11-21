require(['state/Load','state/Start','state/Play','state/End','lib/phaser.min'], (Load,Start,Play,End) => {
    const _game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');

    _game.load.spritesheet('invader', 'img/tab32x32x4.png', 32, 32);
    _game.load.spritesheet('kaboom', 'img/explode.png', 128, 128);
    _game.load.image('ship', 'img/player.png');
    _game.load.image('bullet', 'img/bullet.png');
    _game.load.image('enemyBullet', 'img/enemy-bullet.png');

    _game.state.add('Load', new Load(_game, 'Start'));
    _game.state.add('Start', new Start(_game, 'Play'));
    _game.state.add('Play', new Play(_game, 'End'));
    _game.state.add('End', new End(_game, 'Play'));

    _game.state.start('Load');
});
