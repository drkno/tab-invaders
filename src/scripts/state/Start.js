import { Explosions } from '../module';

class Start {
    constructor (game, nextState, hud) {
        this._game = game;
        this._nextState = nextState;
        this._hud = hud;
        this._invader = null;
        this._timeout = null;
        this._explosion = null;
    }

    _random (num) {
        return Math.floor(Math.random() * num);
    }

    blowUpTab (x, y) {
        if (!this._timeout) {
            this._timeout = setTimeout(() => this.blowUpTab(), 2000);
            return;
        }
        if (this._invader) {
            this._explosion.reset(x, y);
            this._explosion.play('kaboom', 30, false, true);
            this._invader.destroy();
        }
        x = this._random(window.innerWidth);
        y = this._random(window.innerHeight);
        this._invader = this._game.add.sprite(x, y, 'invader');
        this._invader.anchor.setTo(0.5, 0.5);
        this._game.physics.enable(this._invader, Phaser.Physics.ARCADE);
        this._invader.body.collideWorldBounds = true;

        this._timeout = setTimeout(() => this.blowUpTab(x, y), 2000);
    }

    create () {
        this._hud.createTitle('Tab-Invaders');
        this._hud.createMinorTitle2('Press space to begin.');
        this._game.physics.startSystem(Phaser.Physics.ARCADE);
        this._explosion = (new Explosions(1, 'kaboom', this._game)).getExplosionGroup().getFirstExists(false);
        this.blowUpTab();

        this._game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.addOnce(() => {
            clearTimeout(this._timeout);
            this._game.state.start(this._nextState);
        });
    }
}

export default Start;
