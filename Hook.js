Hook = function(game,board){
    this.game = game;
    this.board = board;
    this.sprite = null;
    this.worldPosition = new Vec2(0,0);
};

Hook.prototype = {
    create: function(x,y){
    	this.sprite = game.add.sprite(x,y,'hook');
    	this.worldPosition.x = this.sprite.x;
    	this.worldPosition.y = this.sprite.y;
    },
    update: function(newScale){
        this.scale(newScale);
    },
	scale: function(newScale){
        var distanceToCenter = this.worldPosition.x - this.board.userPosition;
		var newDistanceToCenter = distanceToCenter / newScale;
		var distanceToGround = 400 - this.worldPosition.y;
		var newDistanceToGround = distanceToGround / newScale;
		this.sprite.x = 350 + newDistanceToCenter;
		this.sprite.y = 400 - newDistanceToGround;
		this.sprite.scale.setTo(1/newScale,1/newScale);
	}
}