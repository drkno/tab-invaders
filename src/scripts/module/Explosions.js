class Explosions {
    constructor (quantity, type, game) {
        this._explosions = game.add.group();
        this._explosions.createMultiple(quantity, type).forEach(explosion => {
            explosion.anchor.x = 0.5;
            explosion.anchor.y = 0.5;
            explosion.animations.add(type);
        });
    }

    getExplosionGroup () {
        return this._explosions;
    }
}

export default Explosions;
