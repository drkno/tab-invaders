define(['module/ImageLoader'], TabImageLoader => {
    class Load {
        constructor(game, nextStage, hud) {
            this._game = game;
            this._nextStage = nextStage;
            this._hud = hud;
        }

        async create () {
            this._hud.createTitle('Loading...');
            this._game.tabsDestroyed = 0;

            const ld = new TabImageLoader();
            const tabImages = ld.getImages();

            this._game.load.spritesheet('kaboom', 'img/explode.png', 128, 128);
            this._game.load.image('ship', 'img/player.png');
            this._game.load.image('bullet', 'img/bullet.png');
            this._game.load.image('enemyBullet', 'img/enemy-bullet.png');

            const images = await tabImages;
            for (let i = 0; i < images.length; i++) {
                this._game.load.image(`tab-${i}`, images[i]);
            }
            this._game.load.start();

            this._game.state.start(this._nextStage);
        }
    }
    return Load;
});
