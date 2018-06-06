import PIXI from 'expose-loader?PIXI!phaser-ce/build/custom/pixi.js';
import p2 from 'expose-loader?p2!phaser-ce/build/custom/p2.js';
import Phaser from 'expose-loader?Phaser!phaser-ce/build/custom/phaser-split.js';
import { Load, Start, Play, End } from './state';
import { HUD, Player } from './module';

export default () => {
    const game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'game');
    const hud = new HUD(game);
    const player = new Player(game, hud);

    game.state.add('Load', new Load(game, 'Start', hud));
    game.state.add('Start', new Start(game, 'Play', hud));
    game.state.add('Play', new Play(game, 'End', player, hud));
    game.state.add('End', new End(game, 'Play', hud));

    game.state.start('Load');
};
