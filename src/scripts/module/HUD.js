define(function(){
    var _game = null,
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
        },
        createSubTitle: title => {
            _stateText = _game.add.text(_game.world.centerX, window.innerHeight - 42, title, {font: '42px Arial', fill: '#ff0'});
            _stateText.anchor.setTo(0.5, 0.5);
        }
    }
});
