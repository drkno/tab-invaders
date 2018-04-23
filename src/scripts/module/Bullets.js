class Bullets {
    constructor (quantity, type, damage, game) {
        this._bulletGroup = game.add.group();
        this._bulletGroup.enableBody = true;
        this._bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;
        this._bulletGroup.createMultiple(quantity, type);
        this._bulletGroup.setAll('anchor.x', 0.5);
        this._bulletGroup.setAll('anchor.y', 1);
        this._bulletGroup.setAll('outOfBoundsKill', true);
        this._bulletGroup.setAll('bulletDamage', damage);
    }

    getBulletGroup () {
        return this._bulletGroup;
    }
}

export default Bullets;
