Board = function(game){
    this.preloadImages = ['background','blank','hook','wall','user','ground','score'];
    this.preloadSFX = ['point','jump','die','hit'];
    this.numberOfHooks = this.numberOfWalls = this.userPosition = this.userScore = this.previousTime = 0;
    this.boardScale = 1.4;
    this.game = game;
    this.hooks = [];
    this.walls = [];
}

Board.prototype = {
    preload: function(){
        this.preloadImages.forEach(function(x){game.load.image(x,'images/' + x + ".png")});
        this.preloadSFX.forEach(function(x){game.load.audio(x,'sfx/' + x + '.wav')});
    },
    create: function(){
        this.sprite = game.add.sprite(0,0,'background');
        this.groundSprite = game.add.sprite(0,350,'ground');
		this.groundSprite.body.collideWorldBounds = false;
		this.groundSprite.body.immovable = true;
        this.previousTime = (this.game.time.time / 100);
        for(var x = 0; x < 3; x++){ //Can instantiate from XML later.
            this.hooks[x] = new Hook(this.game,this,300 + (x*600),100);
            this.numberOfHooks++;
        }
        for(var x = 0; x < 2; x++){ //Can instantiate from XML later.
            this.walls[x] = new Wall(this.game,this,-300 + (x*2100),0);
            this.numberOfWalls++;
        }
		this.scoreSprite = game.add.sprite(0,12,'score');
		this.scoreLabelString = "0";
		this.style = {font: "30px Arial",fill: "#dad6cb", align: "left"};
        this.score = game.add.text(75,11,this.scoreLabelString,this.style);

    },
    update: function(){
        this.score.setText(this.userScore);
        this.elapsedTime = (this.game.time.time / 100) - this.previousTime;
        this.previousTime = (this.game.time.time / 100); //Too bad game.time.elapsed is deprecated.
		this.scale(this.boardScale);
    },
	scale: function(newScale){
        for(var x  = 0; x < this.numberOfHooks; x++){
            this.hooks[x].update(this.boardScale);
        }
        for(var x  = 0; x < this.numberOfWalls; x++){
            this.walls[x].update(this.boardScale);
        }
        this.groundSprite.scale.setTo(1,1/newScale);
        this.groundSprite.y = 400 - (50/newScale);
	}
}