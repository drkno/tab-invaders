define(['module/Player','module/Aliens','module/Bullets','module/Explosions','module/HUD'], (Player,Aliens,Bullets,Explosions,HUD) => {
    class Load {
        constructor(game, nextStage) {
            this._game = game;
            this._nextStage = nextStage;
        }

        preload () {
            HUD.init(this._game);
            Player.init(this._game);
            Player.preload();
            const aliens = new Aliens(this._game);
            aliens.preload();
            Bullets.init(this._game);
            Bullets.preload();
            Explosions.init(this._game);
            Explosions.preload();
        }

        create () {
            this._game.state.start(this._nextStage);
        }
    }
    return Load;
});
