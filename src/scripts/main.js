require(['state/Load','state/Start','state/Play','state/End','lib/phaser.min'], (Load,Start,Play,End) => {
    const _game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');

    _game.state.add('Load', new Load(_game, 'Start'));
    _game.state.add('Start', new Start(_game, 'Play'));
    _game.state.add('Play', new Play(_game, 'End'));
    _game.state.add('End', new End(_game, 'Play'));

    _game.state.start('Load');
});
