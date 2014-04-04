/**
 * Created by Zachary on 4/4/2014.
 */
/**
 * Created by Zachary on 3/1/14.
 */

Board = function(game){
    this.game = game;
    this.frameTime = 0;
    this.previousTime = 0;
    this.hooks = [];
    this.numberOfHooks = 0;
    this.userPosition = 0;
}

Board.prototype = {
    preload: function(){
        game.load.image('background','images/board.png');
        game.load.image('blank','images/blank.png');
        this.game.load.image('hook','images/hook.png');
    },
    create: function(){
        this.sprite = game.add.sprite(0,0,'background');
        this.previousTime = (this.game.time.time / 100);
        this.hooks[this.numberOfHooks] = new Hook(this.game,this);
        this.hooks[this.numberOfHooks].create(300,200);
        this.numberOfHooks++;
        this.hooks[this.numberOfHooks] = new Hook(this.game,this);
        this.hooks[this.numberOfHooks].create(1100,200);
        this.numberOfHooks++;
        this.hooks[this.numberOfHooks] = new Hook(this.game,this);
        this.hooks[this.numberOfHooks].create(1900,200);
        this.numberOfHooks++;
    },
    update: function(){
        this.elapsedTime = (this.game.time.time / 100) - this.previousTime;
        this.previousTime = (this.game.time.time / 100);
        for(var x  = 0; x < this.numberOfHooks; x++){
            this.hooks[x].update();
        }
    },
    updateBlocks: function(){

    },
    move: function(){

    }
}
