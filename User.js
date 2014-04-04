/**
 * Created by Zachary on 4/4/2014.
 */
/**
 * Created by Zachary on 3/1/14.
 */

User = function(game,board){
    this.xOrigin = 0;
    this.yOrigin = 0;
    this.xVelocity = 50;
    this.yVelocity = 40;
    this.gravity = 9.8;
    this.isHooked = false;
    this.angularVelocity = 0;
    this.game = game;
    this.board = board;
    this.sprite = null;
    this.cursors = null;
    this.isKeyDown = false;
    this.closestPositionX = 0;
    this.closestPositionY = 0;
    this.xPosition = 0;
    this.yPosition = 0;
    this.hookArmRadius = 0;
    this.hookArmAngle = 0;
};

User.prototype = {
    preload: function(){
        this.game.load.image('user','images/user.png');
    },
    create: function(){
        this.sprite = game.add.sprite(0,-32,'user');
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.sprite.body.bounce.setTo(0.00000001, 0.00000001);
        this.sprite.body.collideWorldBounds = false;
        this.setPosition(0,150);
    },
    update: function(){
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
        if(this.yPosition > 400)
            this.reset();
        if(this.isHooked)
            this.moveHooked();
        else
            this.moveUnhooked();
    },
    moveHooked: function(){
        var aAForG = (Math.cos(this.hookArmAngle / 57.29) * this.gravity);
        this.angularVelocity -= aAForG * this.board.elapsedTime;
        this.hookArmAngle += (this.angularVelocity * this.board.elapsedTime);
        this.setPositionToNewArmAngle();
        console.log("Moving HOoked");
    },
    moveUnhooked: function(){
        this.yVelocity -= this.gravity * this.board.elapsedTime;
        this.moveBy(this.xVelocity * this.board.elapsedTime, this.yVelocity * this.board.elapsedTime);
        console.log("Moving Unhooked");
    },
    setPosition: function(x,y){
        this.sprite.x = 350 - 32;
        this.sprite.y = y - this.yOrigin;
        this.xPosition = x;
        this.board.userPosition = x + this.xOrigin;
        this.yPosition = y;
    },
    moveBy: function(xMove,yMove){
        this.setPosition(this.xPosition + xMove,this.yPosition - yMove);
    },
    snag: function(){
        console.log("Snagging");
        this.findClosestHook();
        this.findAngularVelocity();
        this.isHooked = true;
    },
    release: function(){
        console.log("Releasing");
        this.isHooked = false;
        var totalVelocity = Math.abs(this.hookArmRadius * this.angularVelocity)/50;
        var sign = this.angularVelocity > 0 ? 1 : this.angularVelocity == 0 ? 0 : -1;
        var releaseAngle = this.hookArmAngle + (sign * 90);
        this.xVelocity = Math.cos(releaseAngle / 57.29) * totalVelocity;
        this.yVelocity = Math.sin(releaseAngle / 57.29) * totalVelocity;
        console.log("Hook Arm Angle: " + this.hookArmAngle + " Hook Arm Radius: " + this.hookArmRadius + " Angular Velocity: " + this.angularVelocity + " Release Angle: " + releaseAngle + " Release X Velocity: " + this.xVelocity + " Release Y Velocity: " + this.yVelocity);
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
            var tempDistance = this.getDistance(this.board.hooks[x].xPosition,this.board.hooks[x].yPosition,this.xPosition,this.yPosition);
            if(tempDistance < shortestDistance){
                shortestDistance = tempDistance;
                this.closestPositionX = this.board.hooks[x].xPosition;
                this.closestPositionY = this.board.hooks[x].yPosition;
                this.hookArmRadius = tempDistance;
                this.hookArmAngle = Math.atan((this.board.hooks[x].yPosition - this.yPosition)/(this.xPosition - this.board.hooks[x].xPosition)) * 57.29;
            }
        }
        console.log("Angle: " + this.hookArmAngle + " Radius: " + this.hookArmRadius);
        if(this.hookArmAngle > 0){ //This is horrible code I know...
            if(this.xPosition - this.closestPositionX < 0)
                this.hookArmAngle += 180;
        }
        else{
            if(this.xPosition - this.closestPositionX > 0)
                this.hookArmAngle += 360;
            else
                this.hookArmAngle += 180;
        }
        console.log("Angle: " + this.hookArmAngle + " Radius: " + this.hookArmRadius);
    },
    getDistance: function(x1,y1,x2,y2){
        var deltaX = x2 - x1;
        var deltaY = y2 = y1;
        return Math.sqrt(Math.pow(deltaX,2) + Math.pow(deltaY,2));
    },
    setPositionToNewArmAngle: function(){
        var tempX = (Math.cos(this.hookArmAngle / 57.29) * this.hookArmRadius) + this.closestPositionX;
        var tempY = (-1 * (Math.sin(this.hookArmAngle / 57.29) * this.hookArmRadius)) + this.closestPositionY;
        this.setPosition(tempX,tempY);
    },
    reset: function(){
        this.setPosition(0,150);
        this.xOrigin = 0;
        this.yOrigin = 0;
        this.xVelocity = 50;
        this.yVelocity = 40;
        this.isHooked = false;
        this.angularVelocity = 0;
        this.closestPositionX = 0;
        this.closestPositionY = 0;
        this.xPosition = 0;
        this.yPosition = 0;
        this.hookArmRadius = 0;
        this.hookArmAngle = 0;
    }
}