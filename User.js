User = function(game,board){
    this.board = board;
    this.game = game;
    this.closestPosition = new Vec2(0,0);
    this.worldPosition = new Vec2(0,0);
    this.velocity = new Vec2(50,40);
    this.origin = new Vec2(0,0);
    this.isKeyDown = false;
    this.isHooked = false;
    this.sprite = null;
    this.line = null;
    this.angularVelocity = 0;
    this.hookArmRadius = 0;
    this.hookArmAngle = 0;
	this.closestPos = 0;
    this.gravity = 9.8;
    this.sfx = [];
};

User.prototype = {
    create: function(){
        this.sprite = game.add.sprite(0,-32,'user');
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.sprite.body.bounce.setTo(0.00000001, 0.00000001);
        this.sprite.body.collideWorldBounds = false;
		this.sprite.body.allowGravity = false;
		this.sprite.body.immovable = false;
        this.setWorldPosition(0,150);
		this.line = new Phaser.Line();
        this.sfx['die'] = game.add.audio('die');
        this.sfx['jump'] = game.add.audio('jump');
        this.sfx['hit'] = game.add.audio('hit');
    },
    update: function(){
		if(this.sprite.y < 200)
			this.board.boardScale = (Math.abs(this.worldPosition.y - 100) + 400)/400;
		if(this.board.boardScale < 1.4)
			this.board.boardScale = 1.4;
		this.scale(this.board.boardScale);
		this.checkCollisions();
    	this.checkInput();
    	this.move();
    },
    checkInput: function(){
        if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && !this.isKeyDown){
        	this.isKeyDown = true;
        	if(!this.isHooked)
        		this.snag();
        	else
        		this.release();
        }
        else if(!game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.isKeyDown)
    		this.isKeyDown = false;
    },
    move: function(){
        if(this.isHooked)
            this.moveHooked();
        else
            this.moveUnhooked();
    },
    moveHooked: function(){
        this.hookArmAngle = this.hookArmAngle % 360;
        var aAForG = (Math.cos(this.hookArmAngle / 57.29) * this.gravity);
		this.angularVelocity -= aAForG * this.board.elapsedTime;
    	this.hookArmAngle += (this.angularVelocity * this.board.elapsedTime);
    	this.setPositionToNewArmAngle();
        this.line.fromSprite(this.sprite,this.board.hooks[this.closestPos].sprite);
    },
    moveUnhooked: function(){
    	this.velocity.y -= this.gravity * this.board.elapsedTime;
    	this.moveBy(this.velocity.x * this.board.elapsedTime, this.velocity.y * this.board.elapsedTime);
    },
    setWorldPosition: function(x,y){
        this.worldPosition.set(x,y);
        this.sprite.x = 350 - 32; //The center
		this.sprite.y = 400 - ((400 - y) / this.board.boardScale);
        this.board.userPosition = x + this.origin.x;
    },
    moveBy: function(xMove,yMove){
    	this.setWorldPosition(this.worldPosition.x + xMove,this.worldPosition.y - yMove);
    },
    snag: function(){
    	console.log("Snagging");
    	this.findClosestHook();
    	this.findAngularVelocity();
    	this.isHooked = true;
		this.line.renderable = true;
		this.board.userScore++;
        this.playSFX('hit');
        this.line.fromSprite(this.sprite,this.board.hooks[this.closestPos].sprite);
    },
    release: function(){
		this.line.renderable = false;
    	console.log("Releasing");
    	this.isHooked = false;
    	var totalVelocity = Math.abs(this.hookArmRadius * this.angularVelocity)/50;
    	var sign = this.angularVelocity > 0 ? 1 : this.angularVelocity == 0 ? 0 : -1;
    	var releaseAngle = this.hookArmAngle + (sign * 90);
    	this.velocity.set(Math.cos(releaseAngle / 57.29) * totalVelocity, this.velocity.y = Math.sin(releaseAngle / 57.29) * totalVelocity);
        this.playSFX('jump');
	},
    findAngularVelocity: function(){
    	var tempVelocity = new Vec2((0.5 * Math.sin(this.hookArmAngle / 57.29)+0.5) * this.velocity.x,(0.5 * Math.cos(this.hookArmAngle / 57.29)+0.5) * this.velocity.y);
    	var tempTotal = Math.sqrt(Math.pow(tempVelocity.x,2) + Math.pow(tempVelocity.y,2));
    	this.angularVelocity = (tempTotal / this.hookArmRadius) * (tempVelocity.x / Math.abs(tempVelocity.x));
    	this.velocity.setToVec2(tempVelocity);
    },
    findClosestHook: function(){
    	var shortestDistance = 9999;
    	for(var x = 0; x < this.board.numberOfHooks; x++){
            var tempDistance = this.board.hooks[x].worldPosition.getDistance(this.worldPosition);
    		if(tempDistance < shortestDistance){
    			shortestDistance = tempDistance;
    			this.closestPosition.set(this.board.hooks[x].worldPosition.x,this.board.hooks[x].worldPosition.y);
    			this.hookArmRadius = tempDistance;
    			this.hookArmAngle = Math.atan((this.board.hooks[x].worldPosition.y - this.worldPosition.y)/(this.worldPosition.x - this.board.hooks[x].worldPosition.x)) * 57.29;
				this.closestPos = x;
    		}
    	}
		if(this.hookArmAngle > 0){ //This is horrible code I know...
			if(this.worldPosition.x - this.closestPosition.x < 0)
				this.hookArmAngle += 180;
		}
		else{
			if(this.worldPosition.x - this.closestPosition.x > 0)
				this.hookArmAngle += 360;
			else
				this.hookArmAngle += 180;
		}
    },
    setPositionToNewArmAngle: function(){
    	var tempX = (Math.cos(this.hookArmAngle / 57.29) * this.hookArmRadius) + this.closestPosition.x;
    	var tempY = (-1 * (Math.sin(this.hookArmAngle / 57.29) * this.hookArmRadius)) + this.closestPosition.y;
    	this.setWorldPosition(tempX,tempY);
    },
    reset: function(){
        this.setWorldPosition(20,100);
        this.playSFX('die');
        this.velocity.set(50,40);
        this.board.userScore = 0;
        this.isHooked = false;
    },
	checkCollisions: function(){
		this.game.physics.collide(this.sprite,this.board.groundSprite,this.collisionHandler,null,this);
        for(var x = 0; x < this.board.numberOfWalls; x++){
            this.game.physics.collide(this.sprite,this.board.walls[x].sprite,this.collisionHandler,null,this);
        }
	},
	collisionHandler: function(){
        this.reset();
	},
	scale: function(newScale){
		this.sprite.scale.setTo(1/newScale,1/newScale);
		this.sprite.body.updateBounds(1/newScale,1/newScale);
		var distanceToGround = 400 - this.worldPosition.y;
		var newDistanceToGround = distanceToGround / newScale;
		this.sprite.y = 400 - newDistanceToGround;
	},
    playSFX: function(sfx){
        if(!this.sfx[sfx].isPlaying)
            this.sfx[sfx].play();
    }
}