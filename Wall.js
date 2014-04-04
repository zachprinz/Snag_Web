/**
 * Created by Zachary on 3/1/14.
 */
Wall = function(game,board){
    this.game = game;
    this.board = board;
    this.sprite = null;
    this.xScreenPosition = 0;
    this.yScreenPosition = 0;
	this.xWorldPosition;
	this.yWorldPosition;
	this.currentScale = 1;
};

Wall.prototype = {
    preload: function(){
    	
    },
    create: function(x,y){
    	this.sprite = game.add.sprite(x,y,'wall');
		this.sprite.body.collideWorldBounds = false;
		this.sprite.body.immovable = true;
    	this.xWorldPosition = this.sprite.x;
    	this.yWorldPosition = this.sprite.y;
    },
    update: function(){
    	//this.sprite.x = 350 + this.xWorldPosition - this.board.userPosition;
		this.xScreenPosition = this.sprite.x;
		this.yScreenPosition = this.board.userPositionY - 500;
    },
	scale: function(newScale){
		var distanceToCenter = this.xWorldPosition - this.board.userPosition;
		var newDistanceToCenter = distanceToCenter / newScale;
		//var distanceToGround = 400 - this.yWorldPosition;
		//var newDistanceToGround = distanceToGround / newScale;
		this.sprite.x = 350 + newDistanceToCenter;
		this.sprite.y = 0;
		this.sprite.scale.setTo(1/newScale,1);
		this.sprite.body.updateBounds(1/newScale,1);
	}
}