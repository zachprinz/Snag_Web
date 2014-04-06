/**
 * Created by Zachary on 3/1/14.
 */

Board = function(game){
    this.game = game;
    this.previousTime = 0;
    this.hooks = [];
	this.leftWall = null;
	this.rightWall = null;
    this.numberOfHooks = 0;
	this.userPosition = 0;
	this.boardScale = 1.4 ;
	this.userScore = 0;
}

Board.prototype = {
    preload: function(){
        game.load.image('background','images/board.png');
        game.load.image('blank','images/blank.png');
    	this.game.load.image('hook','images/hook.png');
		this.game.load.image('wall','images/wall.png');
    	game.load.image('ground','images/ground.png');
		game.load.image('score','images/score.png');
    },
    create: function(){
        this.sprite = game.add.sprite(0,0,'background');
		this.leftWall = new Wall(this.game,this);
		this.rightWall = new Wall(this.game,this);
		this.leftWall.create(-300,0);
		this.rightWall.create(1800,0);
        this.groundSprite = game.add.sprite(0,350,'ground');
		this.groundSprite.body.collideWorldBounds = false;
		this.groundSprite.body.immovable = true;
        this.previousTime = (this.game.time.time / 100);
        this.hooks[this.numberOfHooks] = new Hook(this.game,this);
        this.hooks[this.numberOfHooks].create(300,100);
        this.numberOfHooks++;
		this.hooks[this.numberOfHooks] = new Hook(this.game,this);
        this.hooks[this.numberOfHooks].create(900,100);
        this.numberOfHooks++;
		this.hooks[this.numberOfHooks] = new Hook(this.game,this);
        this.hooks[this.numberOfHooks].create(1500,100);
        this.numberOfHooks++;
		this.scoreSprite = game.add.sprite(0,12,'score');
		this.scoreLabelString = "0";
		this.style = {font: "30px Arial",fill: "#dad6cb", align: "left"};
        this.score = game.add.text(75,11,this.scoreLabelString,this.style);

    },
    update: function(){
	    if(this.scoreLabelString != this.userScore){
            this.scoreLabelString = this.userScore;
            this.score.setText(this.scoreLabelString);
        }
        this.elapsedTime = (this.game.time.time / 100) - this.previousTime;
        this.previousTime = (this.game.time.time / 100);
		this.scale(this.boardScale);
		for(var x  = 0; x < this.numberOfHooks; x++){
			this.hooks[x].scale(this.boardScale);
			this.hooks[x].update();
		}
		this.leftWall.scale(this.boardScale);
		this.rightWall.scale(this.boardScale);
		this.leftWall.update();
		this.rightWall.update();
    },
	scale: function(newScale){
		this.groundSprite.scale.setTo(1,1/newScale);
		this.groundSprite.y = 400 - (50/newScale);
	}
}
