$(function() {
  var Q = window.Q = Quintus()
                     .include('Input,Sprites,Scenes,UI,Touch,Audio')
					.enableSound()
					.setup()
					.controls().touch();

  Q.input.keyboardControls();
  Q.input.touchControls({ 
            controls:  [ ['left','<' ],[],[],[],['right','>' ] ]
  });

 
  
  Q.Sprite.extend("Paddle", {     // extend Sprite class to create Q.Paddle subclass
    init: function(p) {
      this._super(p, {
        sheet: 'paddle',
        speed: 200,
        x: 0,
      });
      this.p.x = Q.width/2 - this.p.w/2;
      this.p.y = Q.height - this.p.h;
      if(Q.input.keypad.size) {
        this.p.y -= Q.input.keypad.size + this.p.h;
      }
    },

    step: function(dt) {
if(Q.inputs['left']) {
this.p.x -= dt * this.p.speed;
} else if(Q.inputs['right']) {
this.p.x += dt * this.p.speed;
}
if(this.p.x < 30) {
this.p.x = 30;
} else if(this.p.x > Q.width - this.p.w+30) {
this.p.x = Q.width - this.p.w +30;
}
// this._super(dt); // no need for this call anymore
}// end of steop
});

  Q.Sprite.extend("Ball", {
    init: function() {
      this._super({
        sheet: 'ball',
        speed: 200,
        dx: 1,
        dy: -1,
      });
      this.p.y = Q.height / 2 - this.p.h;
      this.p.x = Q.width / 2 + this.p.w / 2;
	  
	  this.on('hit', this, 'collision');  // Listen for hit event and call the collision method
	  
	  this.on('step', function(dt) {      // On every step, call this anonymous function
		  var p = this.p;
		  Q.stage().collide(this);   // tell stage to run collisions on this sprite

		  p.x += p.dx * p.speed * dt;
		  p.y += p.dy * p.speed * dt;

		  if(p.x < 0) { 
			p.x = 0;
			p.dx = 1;
		  } else if(p.x > Q.width - p.w) { 
			p.dx = -1;
			p.x = Q.width - p.w;
		  }

		  if(p.y < 0) {
			p.y = 0;
			p.dy = 1;
		  } else if(p.y > Q.height) { 
			Q.stageScene('loseGame');
		  }
	  });
    },
	
	collision: function(col) {                // collision method
		if (col.obj.isA("Paddle")) {
//			alert("collision with paddle");
			this.p.dy = -1;
		} else if (col.obj.isA("Block")) {
//			alert("collision with block");
			col.obj.destroy();
			this.p.dy *= -1;
			Q.stage().trigger('removeBlock');
		}
	}
  });

  Q.Sprite.extend("Block", {
    init: function(props) {
      this._super(_(props).extend({ sheet: 'block'}));
      this.on('collision',function(ball) { 
        this.destroy();
        ball.p.dy *= -1;
        Q.stage().trigger('removeBlock');
      });
    }
  });

//  Q.load(['blockbreak.png','blockbreak.json'], function() {
// Q.load(['blockbreak.png','blockbreak.json'], function() {
Q.load(['blockbreak.png','happy.mp3', 'powerup.mp3','recover.mp3','powerdown.mp3'], function() {
// Q.compileSheets('blockbreak.png','blockbreak.json');
Q.audio.play('happy.mp3',{ loop: true });
Q.sheet("ball", "blockbreak.png", { tilew: 20, tileh: 20, sy: 0, sx: 0 });
Q.sheet("block", "blockbreak.png", { tilew: 40, tileh: 20, sy: 20, sx: 0 });
Q.sheet("paddle", "blockbreak.png", { tilew: 60, tileh: 20, sy: 40, sx: 0 });
Q.scene('title', new Q.Scene(function(stage) { // title

var container = stage.insert(new Q.UI.Container({
      fill: "gray",
      border: 5,
      shadow: 10,
      shadowColor: "rgba(0,0,0,0.5)",
     // y: 50,
     // x: Q.width/2 
	  
	  x: Q.width/2,
y: Q.height/2
    }));
	
	var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                           label: "Start" }))

button.on("click",function() {
    Q.clearStages();
    Q.stageScene('game');
	Q.audio.stop("happy.mp3");
  });


stage.insert(new Q.UI.Text({
label: "Brick Break\n\n\n ",
color: "white",
size:30,
y: Q.height * 1/3,
 x: Q.width/2
//Q.clearStages();
//Q.stageScene('game');
}));
/*stage.insert(new Q.Paddle({
//label: " Destroy the blocks by using the\n\n arrow keys or mouse to control the paddle",
//color: "white",
//size:15,
x: Q.width/2,
y: Q.height/2
//Q.clearStages();
//Q.stageScene('game');
}));
stage.insert(new Q.Ball({
//label: " Destroy the blocks by using the\n\n arrow keys or mouse to control the paddle",
//color: "white",
//size:15,
//if(this.y < Q.height){
//Q.stageScene('title');
//}
x: 50,
y: 50
//Q.clearStages();
//Q.stageScene('game');
}));

*/


stage.insert(new Q.UI.Text({
label: " Destroy the blocks by using the arrow\n\n keys or mouse to control the paddle",
color: "blue",
size:14,
x: Q.width/2,
y: Q.height* 2/3
//Q.clearStages();
//Q.stageScene('game');
}));
// stage.insert(new Q.Button

 


})); // end of title


Q.scene('winGame', new Q.Scene(function(stage) {
stage.insert(new Q.Paddle({
//label: " Destroy the blocks by using the\n\n arrow keys or mouse to control the paddle",
//color: "white",
//size:15,
x: Q.width/2,
y: Q.height/2
//Q.clearStages();
//Q.stageScene('game');
}));
stage.insert(new Q.Ball({
//label: " Destroy the blocks by using the\n\n arrow keys or mouse to control the paddle",
//color: "white",
//size:15,
//if(this.y < Q.height){
//Q.stageScene('title');
//}
x: 50,
y: 50
//Q.clearStages();
//Q.stageScene('game');
}));

var container = stage.insert(new Q.UI.Container({
      fill: "gray",
      border: 5,
      shadow: 10,
      shadowColor: "rgba(0,0,0,0.5)",
     // y: 50,
     // x: Q.width/2 
	  
	  x: Q.width/2,
y: Q.height/2
    }));
	
	var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                           label: "Play again" }))

button.on("click",function() {
    Q.clearStages();
    Q.stageScene('title');
  });




stage.insert(new Q.UI.Text({
label: " You Win\n\n Let the ball drop to play again",
color: "white",
size:15,
x: Q.width/2,
y: Q.height* 2/3
//Q.clearStages();
//Q.stageScene('game');
}));
// stage.insert(new Q.Button
})); // end of winGame
Q.scene('loseGame', new Q.Scene(function(stage) {

/*
stage.insert(new Q.Paddle({
//label: " Destroy the blocks by using the\n\n arrow keys or mouse to control the paddle",
//color: "white",
//size:15,
x: Q.width/2,
y: Q.height/2
//Q.clearStages();
//Q.stageScene('game');
}));
stage.insert(new Q.Ball({
//label: " Destroy the blocks by using the\n\n arrow keys or mouse to control the paddle",
//color: "white",
//size:15,
//if(this.y < Q.height){
//Q.stageScene('title');
//}
x: 50,
y: 50
//Q.clearStages();
//Q.stageScene('game');
}));
*/
var container = stage.insert(new Q.UI.Container({
      fill: "gray",
      border: 5,
      shadow: 10,
      shadowColor: "rgba(0,0,0,0.5)",
     // y: 50,
     // x: Q.width/2 
	  
	  x: Q.width/2,
y: Q.height/2
    }));
	
	var button = container.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                           label: "Play again" }))

button.on("click",function() {
    Q.clearStages();
    Q.stageScene('title');
  });




stage.insert(new Q.UI.Text({
label: " You lose",
color: "white",
size:15,
x: Q.width/2,
y: Q.height* 2/3
//Q.clearStages();
//Q.stageScene('game');
}));
// stage.insert(new Q.Button
})); // end of winGame
Q.scene('UI', function(stage){
Q.state.set({ points: 0, lives: 3});
UiCoins.innerHTML = "Points: " + Q.state.get("coins");
UiLives.innerHTML = "Livers: " + Q.state.get("lives");
Q.state.on("change.coins",this, function() {
UiCoins.innerHTML = "Coins: " + Q.state.get("coins");
});
Q.state.on("change.lives",this, function() {
UiLives.innerHTML = "Lives: " + Q.state.get("lives");
});
});
//setTimeout(function(){Q.clearStages(),Q.stageScene('game')}, 5000);
//setTimeout(Q.stageScene('test'),3000);
Q.scene('game',new Q.Scene(function(stage) {
lives = 3;
points = 0;
stage.insert(new Q.UI.Text({
label: "Lives: " + lives,
color: "white",
size:15,
x: Q.width-35,
y: Q.height * 1/50
//Q.clearStages();
//Q.stageScene('game');
}));
stage.insert(new Q.UI.Text({
label: "Points: " + points,
color: "white",
size:15,
x: 35,
y: Q.height * 1/50
//Q.clearStages();
//Q.stageScene('game');
}));
stage.insert(new Q.Paddle());
stage.insert(new Q.Ball());
//stage.insert(new Q.UI.Text({
// label: "Here's a label\nin a container",
// color: "white",
//x: 200,
//y: 200
//Q.clearStages();
//Q.stageScene('game');
// }));
var blockCount=0;
for(var x=0;x<2;x++) {
for(var y=0;y<2;y++) {
stage.insert(new Q.Block({ x: x*50+30, y: y*30+35 }));
blockCount++;
}
}
stage.on('removeBlock',function() {
blockCount--;
if(blockCount == 0) {
Q.stageScene('winGame');
}
});
}));// end q.scene
//Q.stageScene('game');
Q.stageScene('title');
}); // end load
});// end block break