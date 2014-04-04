/**
 * Created by Zachary on 4/4/2014.
 */
/**
 * Created by Zachary on 3/1/14.
 */
Hook = function(game,board){
    this.game = game;
    this.board = board;
    this.sprite = null;
    this.xPosition = 0;
    this.yPosition = 0;
};

Hook.prototype = {
    preload: function(){

    },
    create: function(x,y){
        this.sprite = game.add.sprite(x,y,'hook');
        this.xPosition = this.sprite.x;
        this.yPosition = this.sprite.y;
    },
    update: function(){
        this.sprite.x = 350 + this.xPosition - this.board.userPosition;
    }
}