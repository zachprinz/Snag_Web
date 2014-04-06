/**
 * Created by Zachary on 3/1/14.
 */

User = function(game,board){
	this.xOrigin = 0;
	this.xVelocity = 50;
	this.yVelocity = 40;
	this.gravity = 9.8;
	this.isHooked = false;
	this.angularVelocity = 0;
    this.game = game;
    this.board = board;
    this.sprite = null;
    this.isKeyDown = false;
    this.closestPositionX = 0;
    this.closestPositionY = 0;
	this.xWorldPosition;
	this.yWorldPosition;
    this.hookArmRadius = 0;
    this.hookArmAngle = 0;
	this.canMove = true;
	this.line = null;
	this.closestPos = 0;
    this.canDrawLine = false;
};

User.prototype = {
    preload: function(){
        this.game.load.image('user','images/user.png');
		this.game.load.audio('die','sfx/die.wav');
        this.game.load.audio('jump','sfx/jump.wav');
        this.game.load.audio('point','sfx/point.wav');
        this.game.load.audio('hit','sfx/hit.wav');
    },
    create: function(){
        this.sprite = game.add.sprite(0,-32,'user');
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.sprite.body.bounce.setTo(0.00000001, 0.00000001);
        this.sprite.body.collideWorldBounds = false;
		this.sprite.body.allowGravity = false;
		this.sprite.body.immovable = false;
        this.setWorldPosition(0,150);
		this.line = new Phaser.Line();
		this.dieSound = game.add.audio('die');
        this.jumpSound = game.add.audio('jump');
        this.hitSound = game.add.audio('hit');
    },
    update: function(){
		if(this.sprite.y < 200)
			this.board.boardScale = (Math.abs(this.yWorldPosition - 100) + 400)/400;
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
        	else if(this.isHooked)
        		this.release();
        }
        else if(!game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && this.isKeyDown)
    		this.isKeyDown = false;
    },
    move: function(){
    	this.hookArmAngle = this.hookArmAngle % 360;
		if(this.canMove){
			if(this.yWorldPosition > 700)
				this.reset();
			if(this.isHooked)
				this.moveHooked();
			else
				this.moveUnhooked();
		}
		else{
			this.reset();
		}
    },
    moveHooked: function(){
    	var aAForG = (Math.cos(this.hookArmAngle / 57.29) * this.gravity);
		this.angularVelocity -= aAForG * this.board.elapsedTime;
    	this.hookArmAngle += (this.angularVelocity * this.board.elapsedTime);
    	this.setPositionToNewArmAngle();
    	console.log("Moving HOoked");
		this.line.fromSprite(this.sprite,this.board.hooks[this.closestPos].sprite);
        this.canDrawLine = true;
    },
    moveUnhooked: function(){
    	this.yVelocity -= this.gravity * this.board.elapsedTime;
    	this.moveBy(this.xVelocity * this.board.elapsedTime, this.yVelocity * this.board.elapsedTime);
    	console.log("Moving Unhooked");
    },
    setWorldPosition: function(x,y){
    	this.sprite.x = 350 - 32;
		//this.xScreenPosition = 350 - 32;
		this.yWorldPosition = y;
		this.sprite.y = 400 - ((400 - this.yWorldPosition) / this.board.boardScale);
		//this.yScreenPosition = this.sprite.y;
		this.board.userPosition = x + this.xOrigin;
		this.board.userPositionY = this.sprite.y;
		this.xWorldPosition = x;
		console.log("User Y: " + this.yWorldPosition);
    },
    moveBy: function(xMove,yMove){
    	this.setWorldPosition(this.xWorldPosition + xMove,this.yWorldPosition - yMove);
    },
    snag: function(){
    	console.log("Snagging");
    	this.findClosestHook();
    	this.findAngularVelocity();
    	this.isHooked = true;
		this.line.renderable = true;
		this.board.userScore++;
		if(!this.hitSound.isPlaying)
			this.hitSound.play();
    },
    release: function(){
		this.line.renderable = false;
    	console.log("Releasing");
    	this.isHooked = false;
    	var totalVelocity = Math.abs(this.hookArmRadius * this.angularVelocity)/50;
    	var sign = this.angularVelocity > 0 ? 1 : this.angularVelocity == 0 ? 0 : -1;
    	var releaseAngle = this.hookArmAngle + (sign * 90);
    	this.xVelocity = Math.cos(releaseAngle / 57.29) * totalVelocity;
    	this.yVelocity = Math.sin(releaseAngle / 57.29) * totalVelocity;
    	console.log("Hook Arm Angle: " + this.hookArmAngle + " Hook Arm Radius: " + this.hookArmRadius + " Angular Velocity: " + this.angularVelocity + " Release Angle: " + releaseAngle + " Release X Velocity: " + this.xVelocity + " Release Y Velocity: " + this.yVelocity);
		if(!this.jumpSound.isPlaying)
            this.jumpSound.play();
        this.canDrawLine = false;
	},
    findAngularVelocity: function(){
    	var tempX = ((0.5 * Math.sin(this.hookArmAngle / 57.29)+0.5) * this.xVelocity);
    	var tempY = ((0.5 * Math.cos(this.hookArmAngle / 57.29)+0.5) * this.yVelocity);
    	var tempTotal = Math.sqrt(Math.pow(tempX,2) + Math.pow(tempY,2));
    	if(this.xVelocity == 0)
    		this.xVelocity = 1;
    	this.angularVelocity = (tempTotal / this.hookArmRadius) * (tempX / Math.abs(tempX));
    	this.xVelocity = tempX;
    	this.yVelocity = tempY;
    },
    findClosestHook: function(){
    	var shortestDistance = 9999;
    	for(var x = 0; x < this.board.numberOfHooks; x++){
    		var tempDistance = this.getDistance(this.board.hooks[x].xWorldPosition,this.board.hooks[x].yWorldPosition,this.xWorldPosition,this.yWorldPosition);
    		if(tempDistance < shortestDistance){
    			shortestDistance = tempDistance;
    			this.closestPositionX = this.board.hooks[x].xWorldPosition;
    			this.closestPositionY = this.board.hooks[x].yWorldPosition;
    			this.hookArmRadius = tempDistance;
    			this.hookArmAngle = Math.atan((this.board.hooks[x].yWorldPosition - this.yWorldPosition)/(this.xWorldPosition - this.board.hooks[x].xWorldPosition)) * 57.29;
				this.closestPos = x;
    		}
    	}
		console.log("Angle: " + this.hookArmAngle + " Radius: " + this.hookArmRadius);
		if(this.hookArmAngle > 0){ //This is horrible code I know...
			if(this.xWorldPosition - this.closestPositionX < 0)
				this.hookArmAngle += 180;
		}
		else{
			if(this.xWorldPosition - this.closestPositionX > 0)
				this.hookArmAngle += 360;
			else
				this.hookArmAngle += 180;
		}
		console.log("Angle: " + this.hookArmAngle + " Radius: " + this.hookArmRadius);
    },
    getDistance: function(x1,y1,x2,y2){
    	var deltaX = x2 - x1;
    	var deltaY = y1;
    	return Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));
    },
    setPositionToNewArmAngle: function(){
    	var tempX = (Math.cos(this.hookArmAngle / 57.29) * this.hookArmRadius) + this.closestPositionX;
    	var tempY = (-1 * (Math.sin(this.hookArmAngle / 57.29) * this.hookArmRadius)) + this.closestPositionY;
    	this.setWorldPosition(tempX,tempY);
    },
    reset: function(){
        this.setWorldPosition(0,150);
    	this.xOrigin = 0;
    	this.xVelocity = 50;
    	this.yVelocity = 40;
    	this.isHooked = false;
    	this.angularVelocity = 0;
        this.closestPositionX = 0;
        this.closestPositionY = 0;
        this.xWorldPosition = 0;
        this.yWorldPosition = 0;
        this.hookArmRadius = 0;
        this.hookArmAngle = 0;
		this.canMove = true;
		this.board.boardScale = 1.4;
		this.board.userScore = 0;
		this.dieSound.play();
    },
	checkCollisions: function(){
		this.game.physics.collide(this.sprite,this.board.groundSprite,this.collisionHandler,null,this);
		this.game.physics.collide(this.sprite,this.board.leftWall.sprite,this.collisionHandler,null,this);
		this.game.physics.collide(this.sprite,this.board.rightWall.sprite,this.collisionHandler,null,this);
		this.sprite.x = this.sprite.body.x;
		this.sprite.y = this.sprite.body.y;
	},
	collisionHandler: function(){
		this.canMove = false;
	},
	scale: function(newScale){
		this.sprite.scale.setTo(1/newScale,1/newScale);
		this.sprite.body.updateBounds(1/newScale,1/newScale);
		var distanceToGround = 400 - this.yWorldPosition;
		var newDistanceToGround = distanceToGround / newScale;
		this.sprite.y = 400 - newDistanceToGround;
	}
}