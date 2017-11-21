class Explosions {
    constructor (quantity, type, game) {
        this._game = game;
        this._explosions = _game.add.group();
        this._explosions.createMultiple(quantity, type);
        for (let explosion of this._explosions) {
            exploison.anchor.x = 0.5;
            exploison.anchor.y = 0.5;
            exploison.animations.add(type);
        }
    }

    getExplosionGroup () {
        return this._explosions;
    }
}

define(() => Explosions);
