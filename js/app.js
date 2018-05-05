 
 let speedlevel = 180;

 const GameManager = function(){ 
    this.playerPosition = [];
    this.enemyPositions = [];
 }

 const Sfx = function (){
     this.pick =  new Audio('sfx/pick.mp3');
     this.collision =  new Audio('sfx/toink.mp3');
     this.win = new Audio('sfx/win.mp3');
     this.buzz = new Audio('sfx/buzz.mp3');
     }

    let sfx = new Sfx();

    


 


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
let gridManager = new GridManager();

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.speedfactor = Math.floor(Math.random() * (180 - 140 + 1)) + 140;
    this.sprite = 'images/enemy-bug-2.png';
    this.number = allEnemies.length || 0;
    this.track = gridManager.assigntrack();
    let currentTrack = this.track.trackNumber;
    let currentNumber = this.number;

    

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
    this.speedfactor = ++speedlevel + Math.floor(Math.random() * (50 - 10 + 1)) + 10;
        
    let currentTrack = this.track.trackNumber;
    let currentNumber = this.number;

    if (allEnemies.find(function (enemy) {
        return enemy.track.trackNumber === currentTrack && enemy.number != currentNumber
    })) {
        this.x = -303;

    } else { 
        this.x = -101; }
    
    this.y = this.track.trackValue;
      
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    this.number === 0 && allEnemies.length <= 2? (this.addEnemy())  : false;     
     if(this.number === 0  && collectables.length == 0){
        collectables.push(new Gem())
     }
     
};

Enemy.prototype.addEnemy = function(){
    let delay = Math.floor(Math.random() * (2500 - 50 + 1)) + 50
    setTimeout(() => {
      let enemy = new Enemy();
        allEnemies.push(enemy);   
    }, delay);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.


const Player = function(){
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 400;
    this.speedfactor = 600;
    this.repositioning = false;
    this.score = 0;
    this.capabilities = [];

}

Player.prototype.update = function(dt){
    
    if(this.y < 0 && this.capabilities.includes('hasKey')){    
        sfx.win.play();
        allEnemies = [];
        collectables = [];
        this.repositioning = true;
       // allEnemies.push(new Enemy());       
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

    if (this.repositioning === false && collectables.length ){
        if (this.x === collectables[0].x && this.y === collectables[0].y){
             sfx.pick.play();
             this.score += collectables[0].value
             collectables[0].power.length? this.capabilities.push(collectables[0].power):false;
             collectables = [];
             console.log(this)
            }
    }


}

Player.prototype.reset = function(){
    this.x = 202;
    this.y = 400;
}

Player.prototype.render = function(){
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


Player.prototype.handleInput = function(keyCode){
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
    console.log(this)
}








const Collectable = function(){
    this.column = gridManager.assignCol();
    this.x = this.column.colValue
    this.track = gridManager.assigntrack(2,3);
    this.y = this.track.trackValue;
    this.sprite = '' ;
    this.value = 0;
    this.power = ''; 
    console.log(this) 
    
}

    Collectable.prototype.render = function(){
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    
    Collectable.prototype.update = function(){
        
    }
        
    const Gem = function(){
        Collectable.call(this);
        if(this.column.colNumber === 0){
            player.score >= 250 && !player.capabilities.includes('hasKey') ? (this.sprite = 'images/Key-small.png', this.power = 'hasKey'): this.sprite = 'images/Gem-Orange-small.png' ;
            this.value = 50;
        }else if(this.column.colNumber === 1 || this.column.colNumber === 2){
            this.sprite = 'images/Gem-Blue-small.png' ;
            this.value = 20;
        }else{
            this.sprite = 'images/Gem-Green-small.png' ;
            this.value = 10;
        }
        
    }
    
    Gem.prototype = Object.create(Collectable.prototype);
    Gem.prototype.constructor = Gem;
    
    
    // Now instantiate your objects.
    // Place all enemy objects in an array called allEnemies
    // Place the player object in a variable called player
    
    let allEnemies = [];
    let collectables = [];
    let myEnemy = new Enemy();
    let player = new Player();
    
    allEnemies.push(myEnemy);
        
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
            
            player.handleInput(allowedKeys[e.keyCode]);
        });
    
    
    
    
    