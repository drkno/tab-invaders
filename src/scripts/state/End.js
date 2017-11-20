define(['module/HUD'],function(HUD){
    var _game = null,
        _nextState = null;

    var _End = {
        create: function(){
            HUD.createTitle('Game Over');
            HUD.createSubTitle('You murdered ' + 5 + ' tabs.');
        }
    }

    return{
        init: function(game,nextState){
            _game = game;
            _nextState = nextState;
        },
        getEndState: function(){
            return (_End);
        }
    }
})
