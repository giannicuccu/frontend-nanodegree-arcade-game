 
 // Game variables
 let speedlevel = 150;              // the starting speedlevel of enemies
 let firstLoad = true;              // 
 let gameState = 'readyToStart';    // 
 let winningScore = 100;            // the amount to reach the next level
 let allEnemies = [];               // anemies array
 let collectibles = [];             // gems, key, hearth array
 let maxEnemies = 3;                // the maximun number of enemies
 let level = 1;                     // starting level
 let startTime = Date.now();        // the starting time
 


/**
 * @constructor
 * @description utility for add and remove overlay messages
 */
const MessageManager = function(){
    
    /**
 * @description Set static overlay message
 * @param {message} string
 * @param {flashMsg} boolean}
 */
    this.setMessage = function(message, flashMsg = false){
        this.msg = message;
        
    }

/**
 * @description Set temporized overlay message    // used for levelUp messages
 * @param {message} string
 * @param {flashMsg} boolean}
 */
   this.setFlashMessage = function(message, flashMsg = true){
        this.msg = message;
        this.flashMsg = flashMsg;
    }

    // message render function
    this.render = function(){
        if(this.msg){
        ctx.textAlign = "center";
        ctx.strokeStyle = '#FFA500';
        ctx.font="50px Bungee";
        ctx.strokeText(this.msg[0],252,260);
        ctx.fillText(this.msg[0],252,260);
        ctx.font="22px Bungee";
        ctx.fillText(this.msg[1],252,285);
        ctx.strokeText(this.msg[1],252,285);
        ctx.font="18px Bungee";
        ctx.fillText(this.msg[2],252,330);
        ctx.font="20px monospace";
        ctx.textAlign = "left";
        }

        // remove  temporized message after 1500 ms
        if(this.flashMsg){
            setTimeout(() => {               
                messageManager.setMessage(['','',''])
              }, 1500);
              this.flashMsg = false;
        }


    }
}


 /**
 * @constructor
 * @description Utility to manage gameplay
 */
 const GameManager = function(){

    // Invoked at Enter keypress to start/restart the game
    this.start = function(){
        if( gameState === 'readyToStart' || gameState === 'levelUp' || gameState === 'gameOver' ){
            firstLoad = false;
            allEnemies = [];
            collectibles = [];
            myEnemy = new Enemy();
            gameState === 'gameOver'?(level = 1, player = new Player()):false; // Reinstantiate player after gamover
            gameState != 'levelUp'? messageManager.setMessage(['','','']):false; // Hide start and gameover messages
            allEnemies.push(myEnemy);
            gameState = 'running';
            
        }
        
    }
    
    // Invoked at gameover
     this.gameOver = function(){

         sfx.gameOver.play();
         allEnemies = [];
         collectibles = [];
         speedlevel = 150;
         gameState = 'gameOver';
         messageManager.setMessage(['GAME OVER',
                                    'LEVEL:'+level+' - SCORE:'+player.score,
                                    'Press Enter to start a new game']);
         winningScore = 100;
         
     }

     // Invoked at level update 
     this.levelUp = function(){

        sfx.win.play();
        allEnemies = [];
        collectibles = [];
        player.capabilities = [];
        gameState = 'levelUp';
        winningScore += 100;
        speedlevel += 50;
        level++;
        messageManager.setFlashMessage(['LEVEL UP',
                                        'LEVEL: '+level,
                                        '']);
        this.start();
    }
 


 /**
 * @description Update player health, score and capabilities.
 * @param {collectible} object The object collected by the player.
 */
    this.evaluateCollectible = function(collectible){

        switch (collectible.name) {
            case 'gem':
                player.score += collectibles[0].value;
                sfx.pick.play();                
                break;

            case 'key':
                player.capabilities.push(collectibles[0].power);
                sfx.hasKey.play();
                break;

            case 'heart':
                player.health++;
                player.healthLevel = '❤'.repeat(player.health) 
                sfx.pick.play(); 
                break;
        
            default:
            break;
        }

        collectibles = []; // Empty the collectible array
    }


 /**
 * @description Handle game start after the first load
 * or after gameOver.
 * @param {keyCode} string The key pressed by the user
 */
    this.handleInput = function(keyCode){
       switch (keyCode) {
           case 'start':
               this.start();
               break;

        //   TODO: add pause function
        //    case 'pause':
        //        this.pause();
        //    break;
       
           default:
               break;
       }

    }
 }


/**
 * @constructor
 * @description Game sounds utility
 */
 const Soundfx = function (){
     // soundFx from https://freesound.org
     this.pick =  new Audio('sfx/pick.mp3');
     this.collision = new Audio('sfx/toink.mp3');
     this.win = new Audio('sfx/win.mp3');
     //this.buzz = new Audio('sfx/buzz.mp3'); // unused sound
     this.hasKey = new Audio('sfx/haskey.mp3');
     this.gameOver = new Audio('sfx/game-over.mp3');
     }

    


/**
 * @constructor
 * @description utility for positioning object in the grid
 *  Tracks = horizontal rows (trackNumber 0 is the top row).
 *  Columns = vertical rows  (colNumber 0 is the leftmost column).
 *  TrackValue and colValue are used to set the pixel position 
 *  of player/enemies and gems into the grid.
  */
 const GridManager = function(){
    this.tracks = {
        0:{trackNumber:0, trackValue:-20},
        1:{trackNumber:1, trackValue: 68},
        2:{trackNumber:2, trackValue:151},
        3:{trackNumber:3, trackValue:234},
        4:{trackNumber:4, trackValue:317},
        5:{trackNumber:5, trackValue:400}
       };

    this.columns = {
        0:{colNumber:0,colValue:0},
        1:{colNumber:1,colValue:101},
        2:{colNumber:2,colValue:202},
        3:{colNumber:3,colValue:303},
        4:{colNumber:4,colValue:404}
    };

         /**
 * @description invoked by enemies, player and collectibles to positioning itself on the grid
 * @param {min} string minimum row number
 * @param {max} string minimum row number
 * @return {randomtrack} a random track (a grid row between the params range)
  */ 
    this.assigntrack = function(min=1,max=3){
        this.randomtrack = this.tracks[Math.floor(Math.random() * (max - min + 1)) + min];
        return this.randomtrack ;
       };


/**
 * @description invoked by enemies, player and collectibles to positioning itself on the grid
 * @param {min} string minimum row number
 * @param {max} string minimum row number
 * @return {randomtrack} a random track (a grid row between the params range)
  */
    this.assignCol = function(min=0,max=4){        
        this.randomcol = this.columns[Math.floor(Math.random() * (max - min + 1)) + min] ;
        return this.randomcol;
   };

 }


/**
 * @constructor
 * @description Represents the enemy
 */
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.speedfactor = Math.floor(Math.random() * (180 - 140 + 1)) + 140;
    this.number = allEnemies.length || 0;
    this.track = gridManager.assigntrack();
    this.y = this.track.trackValue;   
    };

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.


// Enemy player collision function
// horizontal collision area is reduced 20px at left and 40 at right
if ( player.x+20 < this.x + 101   && 
     player.x-40 + 101  > this.x  &&
	 player.y === this.track.trackValue ) {
            player.enemyCollision();
    }

    // update enemy position or reposition it if they move off the rightmost col
    this.x < 505? this.x += this.speedfactor * dt: this.restart();  
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


/**
 * @description reposition the enemy instance out of the canvas, before the leftmost column.
 * The first instance of Enemy controls other enemies creation
 * The second instance of Enemy controls collectibile creation
 * 
  */
Enemy.prototype.restart = function() { 

    this.track = gridManager.assigntrack();
    this.y = this.track.trackValue;
    this.speedfactor = speedlevel + Math.floor(Math.random() * (70 - 10 + 1)) + 10; // add random amount to the default speed
    
    let currentTrack = this.track.trackNumber;
    let currentNumber = this.number;

    // try to avoid enemy overlapping in the same row
    if (allEnemies.find(function (enemy) {
        return enemy.track.trackNumber === currentTrack && enemy.number != currentNumber
    })) {
        this.x = -303;

    } else { 
        this.x = -101; }
    
    // draw the enemy sprite
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    
    // add enemy (below maxEnemies value)
    this.number === 0 && allEnemies.length <= maxEnemies-1 ? this.addEnemy()  : false;
    
    // instantiate collectibiles
    if(this.number === 1  && collectibles.length === 0){        
        if(player.score >= winningScore && !player.capabilities.includes('hasKey')){
            collectibles.push(new Key())
        }else{
            player.health===1? collectibles.push(new Heart()):collectibles.push(new Gem())
        }
     }
     
};

/**
 * @description instantiate new enemy with a random delay
 */
Enemy.prototype.addEnemy = function(){
    let delay = Math.floor(Math.random() * (4500 - 1250 + 1)) + 1250
    setTimeout(() => {
      let enemy = new Enemy();
        gameState === 'running'? allEnemies.push(enemy): false;
    }, delay);
}




// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

/**
 * @constructor
 * @description Represents the player
 */
const Player = function(){
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 400;
    this.health = 3;             // this holds current player health level
    this.speedfactor = 600;
    this.repositioning = false;  // setting this to true disable collision detection
    this.score = 0;
    this.capabilities = [];
    this.healthLevel = '❤❤❤'; // used just for display health level in the UI

}

Player.prototype.update = function(dt){
    // update player sprite while it holds a key
    this.capabilities.includes('hasKey')? this.sprite = 'images/char-boy-key.png':this.sprite = 'images/char-boy.png';
    
    // if player enters the top row and have the key increase game level
    if(this.y < 0 && this.capabilities.includes('hasKey')){
        
        this.repositioning = true;
        gameManager.levelUp();
       
    }

        // if player have no health game over
    if(this.health <= 0 && gameState != 'gameOver'){
        
        this.repositioning = true;
        gameManager.gameOver();
        
    }
    
    //TODO: I need  to fix this bad  animation workaround :-
    // animate the player while returns to starting position
    if (this.repositioning == true) {
        if (this.y <= 400 && this.x >= 222) {
            (this.y += this.speedfactor * dt, this.x -= this.speedfactor * dt)
        } else if (this.y <= 400 && this.x < 192) {
            (this.y += this.speedfactor * dt, this.x += this.speedfactor * dt)
        } else if (this.y <= 400 && this.x === 202) {
            (this.y += this.speedfactor * dt)
        }
        else {
            this.repositioning = false,
                player.reset()
        }
    }

    // player collectible collision
    if (this.repositioning === false && collectibles.length ){
        if (this.x === collectibles[0].x && this.y === collectibles[0].y){
             gameManager.evaluateCollectible(collectibles[0]);

            }
    }


}

// enemy collision 
Player.prototype.enemyCollision = function(){
    sfx.collision.play();
    this.health--;
    this.healthLevel = '❤'.repeat(player.health);
    this.repositioning = true;
}

// reposition the player in the starting position
Player.prototype.reset = function(){
    this.x = 202;
    this.y = 400;
}

Player.prototype.render = function(){
     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
     //ctx.fillText(gameState||'',this.x+50,this.y+50);
     this.capabilities.includes('hasKey')?ctx.fillText('reach the river',this.x+50,this.y+50):false;
}


Player.prototype.handleInput = function(keyCode){

    if(gameState === 'running'){
    switch (keyCode) {
        case 'up':
            //this.up(); 
            this.y > -15 ? this.y -= 83: false
            break;
        case 'down': 
            this.y < 400 ? this.y += 83: false;
            break;
        case 'left': 
            //this.left();
            this.x > 0? this.x -= 101: false;
            break;
        case 'right':
            //this.right();
            this.x < 402? this.x += 101: false;
            break;
        default:
            break;
    }
}

}


/**
 * @constructor
 * @description General parent class for gems, key and hearth
 */
const Collectible = function(){
    this.track = gridManager.assigntrack(1,3);
    this.column = gridManager.assignCol();
    this.x = this.column.colValue
    this.y = this.track.trackValue;
    this.sprite = '';
    this.value = 0;
    this.power = '';
    }

Collectible.prototype.render = function(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    
Collectible.prototype.update = function(){
     // noop
    }


/**
 * @constructor
 * @description Gem class, inherits from Collectible class 
 */
const Gem = function(){
        Collectible.call(this);
        this.name = 'gem';
        // switch Gem color and value according to column position
        // gems with more value are posiitoned to the left
        if(this.column.colNumber === 0){
            this.sprite = 'images/Gem-Orange-small.png' ;
            this.value = 50;
        }else if(this.column.colNumber === 1 || this.column.colNumber === 2){
            this.sprite = 'images/Gem-Blue-small.png' ;
            this.value = 20;
        }else{
            this.sprite = 'images/Gem-Green-small.png' ;
            this.value = 10;
        }
        
    }
    
Gem.prototype = Object.create(Collectible.prototype);
Gem.prototype.constructor = Gem;



/**
 * @constructor
 * @description Key class, inherits from Collectible class 
 */
const Key = function(){
        Collectible.call(this);
        this.name = 'key';
        this.column = gridManager.assignCol(0,-1); // Keys are always in the leftmost column
        this.x = this.column.colValue;
        this.sprite = 'images/Key-small.png'; 
        this.power = 'hasKey';
    }
    
Key.prototype = Object.create(Collectible.prototype);
Key.prototype.constructor = Key;



/**
 * @constructor
 * @description Heart class, inherits from Collectible class 
 */
const Heart = function(){
        Collectible.call(this);
        this.name = 'heart';
        this.column = gridManager.assignCol(0,-1); // Hearts are always in the leftmost column
        this.x = this.column.colValue;
        this.sprite = 'images/Heart-small.png'; 
        this.power = 'addHealth';
    }
    
Heart.prototype = Object.create(Collectible.prototype);
Heart.prototype.constructor = Heart;


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const gameManager = new GameManager();
const gridManager = new GridManager();
const messageManager = new MessageManager();
let sfx = new Soundfx();
let player = new Player();


// display the startup message
if(firstLoad){
    document.addEventListener("DOMContentLoaded", function(event) {
        messageManager.setMessage(['FROGGER','','Press Enter to start']);            
        });        
}

 
    
    // This listens for key presses and sends the keys to your
    // Player.handleInput() method. You don't need to modify this.
    // changed to keydown for speed

    document.addEventListener('keyup', function(e) {
        var allowedKeys = {
            37: 'left',
            38: 'up',
            39: 'right',
            40: 'down'
        };

        var gameKeys ={
            13:'start'
            
        }


        allowedKeys[e.keyCode] ? player.handleInput(allowedKeys[e.keyCode]): false;
        gameKeys[e.keyCode] ? gameManager.handleInput(gameKeys[e.keyCode]): false;
    });

