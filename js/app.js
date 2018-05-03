
 let speedfactor = 120;

 const GameManager = function(){
 
    this.playerPosition = [];
    this.enemyPositions = [];
    


 }

 const TrackManager = function(){
    this.tracks = {
        0:{trackNumber:0, trackValue:-20},
        1:{trackNumber:1, trackValue: 68},
        2:{trackNumber:2, trackValue:151},
        3:{trackNumber:3, trackValue:234},
        4:{trackNumber:4, trackValue:317},
        5:{trackNumber:5, trackValue:400}
       };

       //this.randomtrack = this.tracks[Math.floor((Math.random() * 5) + 1)] ;

       this.activeEnemyTracks = new Set();
       this.assigntrack = function(){
            this.randomtrack = this.tracks[Math.floor((Math.random() * 3) + 1)] ;
            //this.activeEnemyTracks.push(this.randomtrack)
            return this.randomtrack ;

       }
 }
// instantiate trackmanager
 let trackManager = new TrackManager();

// Enemies our player must avoid

var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.speedfactor = Math.floor((Math.random() * 260) + 200);
    this.number = allEnemies.length || 0;
    this.track = trackManager.assigntrack();
    let currentTrack = this.track.trackNumber;
    let currentNumber = this.number;
    if(allEnemies.find(function(enemy){
        // console.log(currentTrack)
      return  enemy.track.trackNumber === currentTrack && enemy.number != currentNumber;
    })){
        
        this.x = -202;
        // console.log('enemy in track '+currentTrack);
        //debugger
        
    }else{this.x = -101;}
    this.y = this.track.trackValue;
    
     
    // this.x = -101;
    // this.y = this.track.trackValue;
    
    this.sprite = 'images/enemy-bug-2.png';
    // trackManager.activeEnemyTracks.add(this.track.trackNumber);
    
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

if (player.x+20 < this.x + 101  && player.x-40 + 101  > this.x &&
	player.y === this.track.trackValue) {
    console.log('collision');
    //debugger;
    player.repositioning = true;
}

    this.x < 505? this.x += this.speedfactor * dt: this.restart();
       
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    
};


Enemy.prototype.restart = function() { 
    
    //trackManager.activeEnemyTracks.delete(this.track.trackNumber);
    this.track = trackManager.assigntrack();
    this.speedfactor += Math.floor((Math.random() * 4) + 2);
    
    let currentTrack = this.track.trackNumber;
    let currentNumber = this.number;

    if (allEnemies.find(function (enemy) {
        return enemy.track.trackNumber === currentTrack && enemy.number != currentNumber
    })) {
        this.x = -202;

    } else { 
        this.x = -101; }
    
    this.y = this.track.trackValue;
      
    //trackManager.activeEnemyTracks.add(this.track.trackNumber);

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    // console.log('reposition');
    // //allEnemies.push(new Enemy());
    
    //  console.log ('number >>>>> '+this.number);
     this.number === 0 && allEnemies.length <= 2? (this.addEnemy())  : false;
     
};

Enemy.prototype.addEnemy = function(){
    let delay = Math.floor((Math.random() * 1500) + 500)
    setTimeout(() => {
      let add = new Enemy();
        allEnemies.push(add);   
    }, delay);
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.








// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player



const Player = function(){
    this.sprite = 'images/char-boy.png';
    this.x = 202;
    this.y = 400;
    this.speedfactor = 600;
    this.repositioning = false;
}

Player.prototype.update = function(dt){
    // this.up    = _ => this.y > -15 ? this.y -= 83: false;
    // this.down  = _ => this.y < 400 ? this.y += 83: false;
    // this.left  = _ => this.x > 0? this.x -= 101: false;
    // this.right = _ => this.x < 402? this.x += 101: false;
    //this.y += 10 * dt
    //console.log(this.repositioning)
    if(this.y < 0){
    //     for (enemy of allEnemies){
    //     //enemy.speedfactor = 0;
    // }
        //this.repositioning = true
        console.log('WIN');
        allEnemies = [];
        this.repositioning = true;
        allEnemies.push(new Enemy());

        //this.repositioning = true;
    }
    
    //TODO: try to fix this annimation workaround
    if(this.repositioning == true ){
        if(this.y <= 400 && this.x >=222){
            (this.y += this.speedfactor * dt, this.x -= this.speedfactor * dt)
        }else if(this.y <= 400 && this.x <192){
            (this.y += this.speedfactor * dt,this.x += this.speedfactor * dt)
        }else if(this.y <= 400 && this.x ===202){
            (this.y += this.speedfactor * dt)
        }        
        else{this.repositioning = false, player.reset()}       
    }

}

Player.prototype.reset = function(){
    // this.x = 202;
    // this.speedfactor = 5;

    // while(this.y <= 400){
    //     //console.log(this.y);
    //     this.y += this.speedfactor * dt
    //     //console.log (this.y)
    // }
    
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

// let player = {
    //     update: function(){},
    //     render: function(){},
    //     handleInput: function(){}
    // };
    
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
    
    let allEnemies = [];
    let myEnemy = new Enemy();
    let player = new Player();
    allEnemies.push(myEnemy);