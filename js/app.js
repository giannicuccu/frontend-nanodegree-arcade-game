 
 let speedlevel = 150;
 let firstLoad = true;
 let gameState = 'readyToStart';
 let winningScore = 100;
 let allEnemies = [];
 let collectibles = [];
 let maxEnemies = 3;
 let level = 1;
 let startTime = Date.now();
 

// const MessageManager = function(){
    
//     this.printMessage = function(msg='hit enter to start'){
//         console.log('OK');
//         ctx.font="40px Georgia";
//         ctx.fillText('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',0,0);
        
//         //console.log('fatto');
//     }
// }

//const messageManager = new MessageManager();

 const GameManager = function(){
    

    this.start = function(){
        
        if( gameState === 'readyToStart' || gameState === 'gameOver' ){
            firstLoad = false;
            allEnemies = [];
            collectibles = [];
            myEnemy = new Enemy();
            gameState === 'gameOver'?(level = 1, player = new Player()):false;    
            allEnemies.push(myEnemy);
            gameState = 'running';

        }
    }
    
     this.gameOver = function(){
         
         //console.log('gameover FUNCTION');
         sfx.gameOver.play();
         allEnemies = [];
         collectibles = [];
         speedlevel = 150;
         gameState = 'gameOver';         
         //alert('GAME OVER - YOU REACHED LEVEL: '+level+' - YOUR SCORE: '+player.score)         ;
         winningScore = 100;
         
     }
 
     this.win = function(){
         //gameState = 'win';
         //console.log('WIN FUNCTION');
         sfx.win.play();
         allEnemies = [];
         collectibles = [];
         player.capabilities = [];
         gameState = 'readyToStart';
         winningScore += 100;
         level++;
        //  alert('LEVEL '+level)
         this.start();
     }

    this.evaluateCollectible = function(collectible){
        //console.log(collectible);
        switch (collectible.name) {
            case 'gem':
                player.score += collectibles[0].value;
                sfx.pick.play();                
            break;
            
            case 'key':
                player.capabilities.push(collectibles[0].power);
                sfx.hasKey.play();
            break

            case 'heart':
                player.health++;
                player.healthLevel = '❤'.repeat(player.health)
                sfx.pick.play(); 
            break
        
            default:
                break;
        }
        // collectibles[0].power.length?( player.capabilities.push(collectibles[0].power),sfx.hasKey.play()): sfx.pick.play();
        // player.score += collectibles[0].value
        collectibles = [];
    }


    this.handleInput = function(keyCode){
       switch (keyCode) {
           case 'start':
               this.start();
               break;

         //   TODO: add pause function
        //    case 'pause':
        //        this.pause();
        //        break;
       
           default:
               break;
       }

    }
 }

 const gameManager = new GameManager();



 const Soundfx = function (){
     // soundFx from https://freesound.org
     this.pick =  new Audio('sfx/pick.mp3');
     this.collision = new Audio('sfx/toink.mp3');
     this.win = new Audio('sfx/win.mp3');
     this.buzz = new Audio('sfx/buzz.mp3');
     this.hasKey = new Audio('sfx/haskey.mp3');
     this.gameOver = new Audio('sfx/game-over.mp3');
     }

    let sfx = new Soundfx();

    


 


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

    this.assigntrack = function(min=1,max=3){
        this.randomtrack = this.tracks[Math.floor(Math.random() * (max - min + 1)) + min];
        return this.randomtrack ;
       };

    this.assignCol = function(min=0,max=4){        
        this.randomcol = this.columns[Math.floor(Math.random() * (max - min + 1)) + min] ;
        return this.randomcol;
   };

 }

// instantiate gridmanager
const gridManager = new GridManager();

// Enemies our player must avoid
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

if (player.x+20 < this.x + 101  && 
    player.x-40 + 101  > this.x  &&
	player.y === this.track.trackValue ) {    
        sfx.collision.play();
        player.health--;
        player.healthLevel = '❤'.repeat(player.health);
        player.repositioning = true;
    }

    this.x < 505? this.x += this.speedfactor * dt: this.restart();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    
};


Enemy.prototype.restart = function() { 
        
    this.track = gridManager.assigntrack();
    this.y = this.track.trackValue;
    this.speedfactor = ++speedlevel + Math.floor(Math.random() * (70 - 10 + 1)) + 10;        
    
    let currentTrack = this.track.trackNumber;
    let currentNumber = this.number;
    if (allEnemies.find(function (enemy) {
        return enemy.track.trackNumber === currentTrack && enemy.number != currentNumber
    })) {
        this.x = -303;

    } else { 
        this.x = -101; }
    
      
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

    this.number === 0 && allEnemies.length <= maxEnemies-1 ? this.addEnemy()  : false;
    
    if(this.number === 1  && collectibles.length === 0){        
        if(player.score >= winningScore && !player.capabilities.includes('hasKey')){
            collectibles.push(new Key())
        }else{
            player.health===1? collectibles.push(new Heart()):collectibles.push(new Gem())
        }
     }
     
};

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


const Player = function(){
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 400;
    this.health = 3;
    this.speedfactor = 600;
    this.repositioning = false;
    this.score = 0;
    this.capabilities = [];
    this.healthLevel = '❤❤❤';

}

Player.prototype.update = function(dt){

    this.capabilities.includes('hasKey')? this.sprite = 'images/char-boy-key.png':this.sprite = 'images/char-boy.png';
    
    if(this.y < 0 && this.capabilities.includes('hasKey')){
        //console.log(gameState);
        this.repositioning = true;
        gameManager.win();
       
    }

    if(this.health <= 0 && gameState != 'gameOver'){
        //console.log(gameState);
        this.repositioning = true;
        gameManager.gameOver();
        
    }
    
    //TODO: i need  to fix this weird animation workaround :-
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

    if (this.repositioning === false && collectibles.length ){
        if (this.x === collectibles[0].x && this.y === collectibles[0].y){
             gameManager.evaluateCollectible(collectibles[0]);

            }
    }


}

Player.prototype.reset = function(){
    this.x = 202;
    this.y = 400;
}

Player.prototype.render = function(){
     ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
     ctx.fillText(gameState||'',this.x+50,this.y+50);
}


Player.prototype.handleInput = function(keyCode){

    if(gameState === 'running'){
    switch (keyCode) {
        case 'up':            
            //this.up(); 
            this.y > -15 ? this.y -= 83: false           
            break;
        case 'down': 
        //this.down();
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
    //console.log(this)
}








const Collectible = function(){
    this.track = gridManager.assigntrack(1,3);
    this.column = gridManager.assignCol();
    this.x = this.column.colValue
    this.y = this.track.trackValue;
    this.sprite = '' ;
    this.value = 0;
    this.power = ''; 
    //console.log(this) 
    
}

    Collectible.prototype.render = function(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    
    Collectible.prototype.update = function(){
        
    }
        
    const Gem = function(){
        Collectible.call(this);
        this.name = 'gem';
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


    const Key = function(){
        Collectible.call(this);
        this.name = 'key';
        this.column = gridManager.assignCol(0,-1);
        this.x = this.column.colValue;
        this.sprite = 'images/Key-small.png'; 
        this.power = 'hasKey';
    }
    
    Key.prototype = Object.create(Collectible.prototype);
    Key.prototype.constructor = Key;

    const Heart = function(){
        Collectible.call(this);
        this.name = 'heart';
        this.column = gridManager.assignCol(0,-1);
        this.x = this.column.colValue;
        this.sprite = 'images/Heart-small.png'; 
        this.power = 'addHealth';
    }
    
    Heart.prototype = Object.create(Collectible.prototype);
    Heart.prototype.constructor = Heart;
    
    
    // Now instantiate your objects.
    // Place all enemy objects in an array called allEnemies
    // Place the player object in a variable called player
    

    if(firstLoad){
        console.log(firstLoad)
       
        //alert('COLLECT GEMS, GET A KEY AND PUT THE KEY IN THE CHEST')
    }else{
    // let allEnemies = [];
    // let collectibles = [];
    let myEnemy = new Enemy();
    let player = new Player();    
    allEnemies.push(myEnemy);
}

    // let allEnemies = [];
    // let collectibles = [];
    let player = new Player();
        
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

            // console.log(allowedKeys[e.keyCode]);
            // console.log(gameKeys[e.keyCode]);
            
            allowedKeys[e.keyCode] ? player.handleInput(allowedKeys[e.keyCode]): false;
            gameKeys[e.keyCode] ? gameManager.handleInput(gameKeys[e.keyCode]): false;
        });

        // window.addEventListener("load", function(event) {
        //     console.log("All resources finished loading!");
        //     messageManager.printMessage();
        //   });
    
    
    
    
    