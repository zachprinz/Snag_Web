/**
 * Created by Zachary on 3/1/14.
 */
Hook = function(game,board){
    this.game = game;
    this.board = board;
    this.sprite = null;
	this.xWorldPosition;
	this.yWorldPosition;
};

Hook.prototype = {
    preload: function(){
    	
    },
    create: function(x,y){
    	this.sprite = game.add.sprite(x,y,'hook');
    	this.xWorldPosition = this.sprite.x;
    	this.yWorldPosition = this.sprite.y;
    },
    update: function(){

    },
	scale: function(newScale){
        var distanceToCenter = this.xWorldPosition - this.board.userPosition;
		var newDistanceToCenter = distanceToCenter / newScale;
		var distanceToGround = 400 - this.yWorldPosition;
		var newDistanceToGround = distanceToGround / newScale;
		this.sprite.x = 350 + newDistanceToCenter;
		this.sprite.y = 400 - newDistanceToGround;
		this.sprite.scale.setTo(1/newScale,1/newScale);
	}
}