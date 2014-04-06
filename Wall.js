/**
 * Created by Zachary on 3/1/14.
 */
Wall = function(game,board){
    this.game = game;
    this.board = board;
    this.sprite = null;
    this.worldPosition = new Vec2(0,0);
};

Wall.prototype = {
    preload: function(){
    	
    },
    create: function(x,y){
    	this.sprite = game.add.sprite(x,y,'wall');
		this.sprite.body.collideWorldBounds = false;
		this.sprite.body.immovable = true;
    	this.worldPosition.x = this.sprite.x;
    	this.worldPosition.y = this.sprite.y;
    },
    update: function(newScale){
        this.scale(newScale);
    },
	scale: function(newScale){
		var distanceToCenter = this.worldPosition.x - this.board.userPosition;
		var newDistanceToCenter = distanceToCenter / newScale;
		this.sprite.x = 350 + newDistanceToCenter;
		this.sprite.y = 0;
		this.sprite.scale.setTo(1/newScale,1);
		this.sprite.body.updateBounds(1/newScale,1);
	}
}