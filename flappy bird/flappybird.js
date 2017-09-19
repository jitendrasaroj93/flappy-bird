


var myGamePiece,
	myObstacles = [];

var myScore;

var btnUp,
	btnDown,
	btnLeft,
	btnRight;

function gameStart(){
	myGameArea.start(400,500);

	myGamePiece = new component(30,30,0,150,"red","");
	//myObstacles = new component(200, 10, 450, 10, "green"); 

	btnUp = new component(30,30,235,310,"blue","^");
	btnDown = new component(30,30,235,370,"blue","v");
	btnLeft = new component(30,30,205,340,"purple","<");
	btnRight =  new component(30,30,265,340,"purple",">");

	myScore = new component("30px", "Consolas", 280, 40,"black", "text");

}



var myGameArea = {
	canvas : document.createElement("canvas"),
	start: function(height,width){
		this.canvas.height = height;
		this.canvas.width = width;
		this.context = this.canvas.getContext("2d");
		document.getElementById("flappy_game_area").appendChild(this.canvas);


		this.interval = setInterval(updateGameArea, 20);
		this.frameNo =0;

		window.addEventListener("keydown",function(e){
			myGameArea.keys = (myGameArea.keys || []);
			myGameArea.keys[e.keyCode] = true;
		})
		window.addEventListener("keyup",function(e){
			myGameArea.keys = (myGameArea.keys || []);
			myGameArea.keys[e.keyCode] = false;
		})


		// for move controller in game
		window.addEventListener('mousedown', function (e) {
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
        })
        window.addEventListener('mouseup', function (e) {
            myGameArea.x = false;
            myGameArea.y = false;
        })
        window.addEventListener('touchstart', function (e) {
            myGameArea.x = e.pageX;
            myGameArea.y = e.pageY;
        })
        window.addEventListener('touchend', function (e) {
            myGameArea.x = false;
            myGameArea.y = false;
        })
	},
	clear : function(){
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height);
	},
	stop : function(){
		clearInterval(this.interval);
	},
	resume : function(){
		clearInterval(this.interval);
		this.interval = setInterval(updateGameArea, 20);
	},
	pauseGame : function(){
		clearInterval(this.interval);
	},
	restart : function(){
		this.stop();
		this.clear();
		myObstacles.length = 0;	
		gameStart();
	}
}

function component(height,width,x,y,color,type){
	this.type = type;
	this.height = height;
	this.width = width;
	this.x = x;
	this.y = y;
	this.speedX = 0;
	this.speedY = 0;
	
	this.update =  function(){
		ctx = myGameArea.context;
		if (this.type == "text") {
	      ctx.font = this.width + " " + this.height;
	      ctx.fillStyle = color;
	      ctx.fillText(this.text, this.x, this.y);
	    } else {
	        ctx.fillStyle = color;
			ctx.fillRect(this.x,this.y,this.width, this.height);
			ctx.font = "16px Arial";
			ctx.fillStyle = "#fff";
			ctx.fillText(type,this.x+10,this.y+20);
	    }
	}

	this.newPos = function(){
		this.x += this.speedX;
		this.y += this.speedY;
	}

	this.clicked = function(){
		var myLeft = this.x,
			myRight = this.x + (this.width),
			myTop = this.y,
			myBottom = this.y + (this.height);

		var clicked = true;

		if ((myBottom < myGameArea.y) || (myTop > myGameArea.y)
         || (myRight < myGameArea.x) || (myLeft > myGameArea.x)) {
            clicked = false;
        }
        return clicked;
	}

	this.crashedWith = function(obstacle){
		var myLeft = this.x,
			myRight = this.x + (this.width),
			myTop =  this.y,
			myBottom = this.y + (this.height);

		var obstacleLeft = obstacle.x,
			obstacleRight = obstacle.x + (obstacle.width),
			obstacleTop =  obstacle.y,
			obstacleBottom =  obstacle.y + (obstacle.height);

		var crash = true;
		if(myLeft > obstacleRight || myRight < obstacleLeft || myTop > obstacleBottom || myBottom < obstacleTop){
			crash = false;
		}
		return crash;
	}
}

function everyInterval(interval){
	if((myGameArea.frameNo / interval) % 1 ==0){return true;}
	return false;
}	

function moveUp(){
	myGamePiece.speedY -= 1;
}

function moveDown(){
	myGamePiece.speedY +=1;
}

function moveLeft(){
	myGamePiece.speedX -= 1;
}

function moveRight(){
	myGamePiece.speedX += 1;
}

function stopMove(){
	myGamePiece.speedX = 0;
	myGamePiece.speedY = 0;
}

function updateGameArea(){
	var x,height,gap,minGap,maxGap,minHeight,maxHeight;
	for (i = 0; i < myObstacles.length; i += 1) {
        if(myGamePiece.crashedWith(myObstacles[i])){
			myGameArea.stop();
			return;
		}
    }
	
		myGameArea.clear();

		myGameArea.frameNo += 1;
	    if (myGameArea.frameNo == 1 || everyInterval(150)) {
	        x = myGameArea.canvas.width;

	        minHeight = 50;
	        maxHeight = 250;
	        height = Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);

	        minGap = 40;
	        maxGap = 100;
	        gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
			myObstacles.push(new component(height, 10, x, 0,"green",""));
	        myObstacles.push(new component(300-height-gap, 10, x, height + gap,"green",""));
	    }
	    for (i = 0; i < myObstacles.length; i += 1) {
	        myObstacles[i].x += -1;
	        myObstacles[i].update();
	    }

			//for key navigations
			myGamePiece.speedX = 0;
			myGamePiece.speedY = 0;
			if (myGameArea.keys && myGameArea.keys[37]) {myGamePiece.speedX = -1; }
		    if (myGameArea.keys && myGameArea.keys[39]) {myGamePiece.speedX = 1; }
		    if (myGameArea.keys && myGameArea.keys[38]) {myGamePiece.speedY = -1; }
		    if (myGameArea.keys && myGameArea.keys[40]) {myGamePiece.speedY = 1; }

			if (myGameArea.x && myGameArea.y) {
		        if (btnUp.clicked()) {
		            myGamePiece.y -= 1;
		        }
		        if (btnDown.clicked()) {
		            myGamePiece.y += 1;
		        }
		        if (btnLeft.clicked()) {
		            myGamePiece.x += -1;
		        }
		        if (btnRight.clicked()) {
		            myGamePiece.x += 1;
		        }
		    }

			btnUp.update();
			btnDown.update();
			btnLeft.update();
			btnRight.update();

			myScore.text = "SCORE: " + myGameArea.frameNo;
    		myScore.update();

			myGamePiece.newPos();
			myGamePiece.update();	
		
}

window.onload = gameStart;
