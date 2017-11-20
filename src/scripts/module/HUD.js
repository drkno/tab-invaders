/**
 * Created by stryker on 2014.03.05..
 */
define(function(){
    //Private variables
    var _game = null,
        _health = null,
        _healthText = null,
        _lives = null,
        _livesText = null,
        _score = null,
        _scoreText = null,
        _stateText = null;

    return{
        init: function(game){
            _game = game;
        },
        preload: function(){
            //_game.load.image('ship', 'assets/img/player.png');
        },
        createTitle: function(title){
            _stateText = _game.add.text(_game.world.centerX, _game.world.centerY, title, {font: '84px Arial', fill: '#fff'});
            _stateText.anchor.setTo(0.5, 0.5);
        }
    }
});
