const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 900;
canvas.height = 600;

// global variables
const cellSize = 100;
const cellGap = 3;

let numberOfResources = 500;
let enemiesInterval  = 600;
let frame = 0;
let gameOver = false;
let score = 0;
const winniningScore = 150;
let chosenDefender = 1;

const floatingMessages = [];
const gameGrid = [];
const defenders = [];
const enemies = [];
const enemyPosition = [];   
const projectiles = [];
const resources = [];

// mouse 
const mouse ={
    x: 10,
    y: 10,
    width: 0.1,
    height: 0.1,
    clicked: false
}

canvas.addEventListener('mousedown', function(){
    mouse.clicked = true;    
});
canvas.addEventListener('mouseup', function(){
    mouse.clicked = false;    
});
let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function(e){
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener('mouseleave', function(){
    mouse.x = undefined;
    mouse.y = undefined;
});

// game board
const controlsBar = {
    width: canvas.width,
    height: cellSize,
}
/** 
 * Class representing cells. 
*/
class Cell{
/**
 * @param{number} x - the x value
 * @param{number} y - the y value
 */
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    /**
     * This function makes rectangle black on hover
     */
    draw(){
        if (mouse.x && mouse.y  && collision(this, mouse)){
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height)
        }
        
    }
}
/**
 * This function divides our grid on cells
 */
function creategrid(){
    for (let y = cellSize; y < canvas.height; y += cellSize){
        for (let x = 0; x < canvas.width; x += cellSize){
            gameGrid.push(new Cell(x, y));
        }
    }
}
/**
 * 
 */
creategrid();
/**
 * Draw our gamegrid
 */
function handleGameGrid(){
    for (let i = 0; i < gameGrid.length; i++){
        gameGrid[i].draw();
    }
}
// projectiles
/**
 * Upload projectile sprite image
 */
const projectile1 = new Image();
projectile1.src = 'projectile.png'

/**
 * Class representing projectiles
 */
class Projectile{
    /**
    * @param{number} x - the x value
    * @param{number} y - the y value
    */
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = 25;
        this.height = 25;
        this.power = 15;
        this.speed = 12;
        this.timer = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 100;
        this.spriteHeight = 91;        
    }
    /**
     * This function allows the projectile move x-axis
     */
    update(){
        this.x += this.speed;
    }
    /**
     * This function draws our projectile on canvas and renders the loaded image
     */
    draw(){
        //ctx.fillstyle = 'rgba(0,0,0,0)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 2);
        //ctx.fill();
        ctx.drawImage(projectile1, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}
/** 
 * This function updates and draws projectiles
 * If projectile has collision with enemy decreases enemies health by projectile's power
 * If projectile x coordinate is greater then canvas' width - remove projectile
 */
function handleProjectiles(){
    for(let i = 0; i < projectiles.length; i++){
        projectiles[i].update();
        projectiles[i].draw();

        for (let j = 0; j < enemies.length; j++){
            if (enemies[j] && projectiles[i] && collision(projectiles[i], enemies[j])){
                enemies[j].health -= projectiles[i].power;
                projectiles.splice(i, 1);
                i--;
            }
        }

        if (projectiles[i] && projectiles[i].x > canvas.width){
            projectiles.splice(i, 1);
            i--;            
        }        
    }
}

// defenders
/**
 * Upload defender's sprites images 
 */
const defender1 = new Image();
defender1.src = 'defender1.png'
const defender2 = new Image();
defender2.src = 'defender2.png'
/**
 * Class representing defenders
 */
class Defender{
    /**
    * @param{number} x - the x value
    * @param{number} y - the y value
    */
    constructor(x, y){        
        this.x = x;
        this.y = y;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.shooting = false;
        this.shootNow = false;
        this.health = 100;
        this.projectiles = [];
        this.timer = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 256;
        this.spriteHeight = 187;
        this.minFrame = 0;
        this.maxFrame = 9;
        this.chosenDefender = chosenDefender;
    }
    /**
     * This function draws our defenders on canvas and renders the loaded images
     */
    draw(){
        //ctx.fillStyle = 'blue';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        //ctx.fillStyle = 'green';
        //ctx.font = '30px Orbitron';
        //ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
        if (this.chosenDefender === 1){
            ctx.drawImage(defender1, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }else if(this.chosenDefender === 2){
            ctx.drawImage(defender2, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
        }
       
    }
    /** 
    * This function depending on frames shoot enemies or enter idle state
    * Push projectile from defender if shooting   
    */
    update(){
        if(frame % 12 === 0 ){
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = this.minFrame;
            if (this.frameX === 4   ) this.shootNow = true;            
        } 
        if (this.shooting){
            this.minFrame = 0;
            this.maxFrame = 4;            
        }else{
            this.minFrame = 5;
            this.maxFrame = 9;
        }
        if (!this.shooting){
            this.minFrame = 9;
            this.maxFrame = 9;
        }       

        if (this.shooting && this.shootNow){   
            projectiles.push(new Projectile(this.x + 70, this.y + 50));                
            this.shootNow = false;
        }       
    }
}
 /** 
    * This function updates and draws defenders 
    * If enemy on the row with defender, defender starts shooting
    * If defender has collision with enemy decreases defenders health by damage till 0 hp - removes defender
    */
function handleDefenders(){
    for (let i = 0; i < defenders.length; i++){
        defenders[i].draw();
        defenders[i].update();
        if (enemyPosition.indexOf(defenders[i].y) !== -1){
            defenders[i].shooting = true;
        }else{
            defenders[i].shooting = false;
        }
        for (let j = 0; j < enemies.length; j++){
            if (defenders[i] && collision(defenders[i], enemies[j])){
                enemies[j].movement = 0;
                defenders[i].health -= 1;
            }
            if (defenders[i] && defenders[i].health <= 0){
                defenders.splice(i, 1);
                i--;
                enemies[j].movement = enemies[j].speed;
            }
        } 
    }
}

const card1 = {
    x: 10,
    y: 10,
    width: 70,
    height: 85
}

const card2 = {
    x: 90,
    y: 10,
    width: 70,
    height: 85
}
/** 
* This function depending on defender's cards chooses between defenders
* Draw defender's cards on the left top of the canvas
*/
function chooseDefender(){
    let card1stroke = 'black';
    let card2stroke = 'black';
    if (collision(mouse, card1) && mouse.clicked){
        chosenDefender = 1;
    }else if (collision(mouse, card2) && mouse.clicked){
        chosenDefender = 2;
    }
    if (chosenDefender === 1){
        let card1stroke = 'gold';
        let card2stroke = 'black';

    }else if (chosenDefender === 2){
        let card1stroke = 'black';
        let card2stroke = 'gold';
    }else{
        let card1stroke = 'black';
        let card2stroke = 'black';
    }

    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(0,0,0,0)';
    ctx.fillRect(card1.x, card1.y, card1.width, card1.height);
    ctx.strokeStyle = card1stroke;
    ctx.strokeRect(card1.x, card1.y, card1.width, card1.height);
    ctx.drawImage(defender1, 0, 0, 194, 194, 5, 10, 194/2, 194/2)
    ctx.fillRect(card2.x, card2.y, card2.width, card2.height);    
    ctx.drawImage(defender2, 0, 0, 194, 194, 80, 5, 194/2, 194/2)
    ctx.strokeStyle = card2stroke;
    ctx.strokeRect(card2.x, card2.y, card2.width, card2.height);
}

// Floating messages
/** 
* Class representing floating messages
*/
class floatingMessage {
    /**
    * @param{string} value
    * @param{number} size - the size value
    * @param{string} color - the color value
    * @param{number} x - the x value
    * @param{number} y - the y value
    */
    constructor(value, x, y, size, color){
        this.value = value;
        this.x = x;
        this.y = y;
        this.size = size;
        this.lifespan = 0;
        this.color = color;
        this.opacity = 1;
    }
    /**
    * This function makes our floating messages disappearing depending on opacity
    */
    update(){
        this.y -= 0.3;
        this.lifespan += 1;
        if (this.opacity > 0.03) this.opacity -= 0.03;     
    }
    /**
    * This function draws our messages on canvas
    */
    draw(){
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.font = this.size + 'px Orbitron';
        ctx.fillText(this.value, this.x, this.y);
        ctx.globalAlpha = 1;    
    }
}
/** 
    * This function updates and draws floating images
    * If floating message's lifespan reaches a certain value - removes floating messages 
    */
function handleFloatingMessages(){
    for (let i =0; i < floatingMessages.length; i++){
        floatingMessages[i].update();
        floatingMessages[i].draw();
        if (floatingMessages[i].lifespan >= 50){
            floatingMessages.splice(i, 1);
            i--;
        }
    }
}

// enemies
/**
 * Upload enemies sprites images 
 */
const enemyTypes = [];
const enemy1 = new Image();
enemy1.src = 'enemy1.png';
enemyTypes.push(enemy1);
const enemy2 = new Image();
enemy2.src = 'enemy2.png';
enemyTypes.push(enemy2);
/** 
* Class representing enemies
*/
class Enemy {
    constructor(verticalPosition){
        this.x = canvas.width;
        this.y = verticalPosition;
        this.width = cellSize - cellGap * 2;
        this.height = cellSize - cellGap * 2;
        this.speed = Math.random() * 0.2 + 0.4;
        this.movement = this.speed;
        this.health = 140;
        this.maxHealth = this.health;
        this.enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        this.frameX = 0;
        this.frameY = 0;
        this.minFrame = 0;
        this.maxFrame = 4;
        this.spriteWidth = 256;
        this.spriteHeight = 256;
    }
    /**
    * This function allows enemies move from left to right
    * Settle the amount of frames
    */
    update(){
        this.x -= this.movement;
        if (frame % 10 === 0){
            if (this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = this.minFrame;
        }          
        
    }
    /**
    * This function draws our enemies on canvas and renders the loaded images
    */
    draw(){
        //ctx.fillStyle = "rgba(0, 0, 0, 0)";
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        //ctx.fillStyle = 'black';
        //ctx.font = '30px Orbitron';
        //ctx.fillText(Math.floor(this.health), this.x + 15, this.y + 30);
        //ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
        ctx.drawImage(this.enemyType, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);      
    }
}

/** 
    * This function updates and draws enemies 
    * If enemy reaches certain x coordinates - game overs
    * If enemies die it removes from canvas and we get resources and increase our score
    * Control amount of enemies
    */
function handleEnemies(){
    for (let i = 0; i < enemies.length; i++){
        enemies[i].update();
        enemies[i].draw();
        if (enemies[i].x < -100){
            gameOver = true;
        }
        if (enemies[i].health <= 0){
            let gainedResources = enemies[i].maxHealth/14;
            floatingMessages.push(new floatingMessage('+' + gainedResources, enemies[i].x, enemies[i].y, 30, 'black'));
            floatingMessages.push(new floatingMessage('+' + gainedResources, 430, 50, 30, 'gold'));
            numberOfResources += gainedResources;
            score += gainedResources;
            const findThisIndex = enemyPosition.indexOf(enemies[i].y);
            enemyPosition.splice(findThisIndex, 1);
            enemies.splice(i, 1);
            i--;
        }
    }
    if (frame % enemiesInterval === 0 && score < winniningScore){
        let verticalPosition = Math.floor(Math.random() * 5 + 1) * cellSize + cellGap;
        enemies.push(new Enemy(verticalPosition));
        enemyPosition.push(verticalPosition);    
        if (enemiesInterval > 80) enemiesInterval -= 50;    
    }
}
// resources
/**
 * Upload reource image 
 */
const resource1 = new Image();
resource1.src = 'resource.png';
const amounts = [20, 30, 40];
/** 
* Class representing resources
*/
class Resource{
    constructor(){
        this.x = Math.random() * (canvas.width - cellSize);
        this.y = (Math.floor(Math.random() * 5) + 1) * cellSize + 25;
        this.width = cellSize * 0.6;
        this.height = cellSize * 0.6;
        this.amount = amounts[Math.floor(Math.random() * amounts.length)];
        this.timer = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 85;
        this.spriteHeight = 80;
    }
    /**
    * This function draws our resources on canvas and renders the loaded images
    */
    draw(){
        //ctx.fillStyle = 'yellow';
        //ctx.fillRect(this.x, this.y, this.width, this.height);
        //ctx.fillStyle = 'black';
        //ctx.font = '20px Orbitron';
        //ctx.fillText(this.amount, this.x + 15, this.y + 25);
        ctx.drawImage(resource1, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.width, this.height);
    }
}
/**
    * This function creates our resources on the board 
    * If our mouse has collision with resources add certain amount of resources and image removes 
    */
function handleResources(){
    if (frame % 500 === 0 && score < winniningScore){
        resources.push(new Resource()); 
    }
    for (let i = 0; i < resources.length; i++){
        resources[i].draw();
        if (resources[i] && mouse.x && mouse.y && collision(resources[i], mouse)){
            numberOfResources += resources[i].amount;
            floatingMessages.push(new floatingMessage('+' + resources[i].amount, resources[i].x, resources[i].y, 20, 'black'));
            floatingMessages.push(new floatingMessage('+' + resources[i].amount, 430, 50, 30, 'gold'));
            resources.splice(i, 1);
            i--;
        }
    }
}   

// utilities
/**
* This function shows game status on the canvas
* If we kill all enemies or reach winning score we get "win" message
* If we enemies reach x coordinates we get "lose" message
*/
function handleGameStatus(){
    ctx.fillStyle = 'gold';
    ctx.font = '30px Orbitron';
    ctx.fillText('Resources: ' + numberOfResources, 180, 80);
    ctx.fillText('Score: ' + score, 180, 40);
    if (gameOver){
        ctx.fillStyle = 'black';
        ctx.font = '70px Orbitron';
        ctx.fillText('GAME OVER', 200, 300);
    }
    if (score >= winniningScore && enemies.length === 0){
        ctx.fillStyle = 'black';
        ctx.font = '70px Orbitron';
        ctx.fillText('LEVEL COMPLETE', 130, 300);
        ctx.font = '30px Orbitron';
        ctx.fillText('You win with ' + score + ' points!', 134, 340);
    }
} 

canvas.addEventListener('click', function(){
    const gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap;
    const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;
    if (gridPositionY < cellSize) return;
    for (let i = 0; i < defenders.length; i++){
        if(defenders[i].x === gridPositionX && defenders[i].y === gridPositionY) 
        return;
    }
    let defenderCost = 100;
    if (numberOfResources >= defenderCost){
        defenders.push(new Defender(gridPositionX, gridPositionY));
        numberOfResources -= defenderCost;
    }else{
        floatingMessages.push(new floatingMessage('need more resources', mouse.x, mouse.y, 15, 'red'));
    }
});

/**
 * This function is responsible for the frames and call functions which are responsible for game 
 */
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //ctx.fillStyle = 'blue';
    //ctx.fillRect(0, 0,controlsBar.width, controlsBar.height);    
    handleGameGrid();     
    handleDefenders();
    chooseDefender();
    handleResources();
    handleProjectiles();      
    handleEnemies(); 
    handleGameStatus();         
    handleFloatingMessages(); 
    frame++;
    if (!gameOver) requestAnimationFrame(animate);
}
animate();

/**
 * @param {*} first 
 * @param {*} second 
 * @returns {boolean} if the first object collides with the second one 
 */
function collision(first, second){
    if ( !(first.x > second.x + second.width || 
           first.x + first.width < second.x ||
           first.y > second.y + second.height || 
           first.y + first.height < second.y)
    ) {
        return true;        
    };
};

/**
 * Listens to resize event and change canvas size respectively  
 */
window.addEventListener('resize', function(){
    canvasPosition = canvas.getBoundingClientRect();
})