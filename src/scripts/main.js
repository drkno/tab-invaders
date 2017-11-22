'use strict';

require(['state/Load', 'state/Start', 'state/Play', 'state/End', 'module/HUD', 'module/Player', 'lib/phaser.min'], (Load, Start, Play, End, HUD, Player) => {
    const game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');
    const hud = new HUD(game);
    const player = new Player(game, hud);

    game.state.add('Load', new Load(game, 'Start', hud));
    game.state.add('Start', new Start(game, 'Play', hud));
    game.state.add('Play', new Play(game, 'End', player, hud));
    game.state.add('End', new End(game, 'Play', hud));

    game.state.start('Load');
});
