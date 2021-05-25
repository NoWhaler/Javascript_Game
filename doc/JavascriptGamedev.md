# Розробка ігор на JavaScript

Сьогодні гру можна створити на будь-якій пристосованій для цього платформі, але JS не виняток.

# Основи HTML, CSS

Один з варіантів розробки - HTML5. Починаючи з 5-й версії специфікації, HTML набув тег <canvas>, який дозволяє створювати контекст для малювання на веб-сторінці.

Структура HTML документа досить проста, так як гра буде повністю візуалізувати в <canvas> елементі. Використовуючи ваш улюблений текстовий редактор, створіть новий HTML документ, збережіть його як index.html в будь-якому зручному місці, і скопіюйте в нього цей код:

  ```html
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project</title>
    <link rel="preconnect" href="https://fonts.gstatic.com"> 
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500&display=swap" rel="stylesheet">  
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <canvas class="canvas" id="canvas1"></canvas>
    <script src="main.js"></script>
</body>
</html>
  ```
  
Ми визначили charset, <title> і якийсь базовий CSS в заголовку. Тіло документа містить елементи <canvas> і <script> - ми будемо візуалізувати гру всередині першого і писати JavaScript код, який управляє грою, в другому. Елемент <canvas> має id рівний canvas1, який дозволяє однозначно відшукати елемент.

```CSS
  body{
    background: black;
}
canvas{  
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 900px;
    height: 600px;
    background: url('ground.png') no-repeat;
    background-size: cover;
    font-family: 'Orbitron', sans-serif;
}
  ```
  У цій частині коду ми задаємо розмір нашого canvas, фон(є можливість використовувати зображення), можемо використовувати різні шрифти.
  
# Основи Canvas
  Щоб мати можливість візуалізувати гру в <canvas> елементі, спочатку ми повинні отримати посилання на цей елемент в коді JavaScript. Додайте наступний код після відкриваючого тега <script>.
  ```js
  const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
  ```
  Таким чином, ми зберігаємо посилання на <canvas> елемент в змінної canvas. Далі ми створюємо змінну ctx для зберігання 2D візуалізації контексту - метод, який використовується для відтворення в Canvas.

  Ми оновлюємо і відображаємо сцени, і потім використовуємо requestAnimationFrame для постановки в чергу наступного циклу.
  ```js
  function animate(){
   
    requestAnimationFrame(animate);
}
  animate();
  ```
# Як створювалась гра?
  Гра, представлена у даному проєкті є аналогом мобільної гри Plants vs Zombie.
  Спочатку, ми розділили наше ігрове поле для розміщення об'єктів на ньому. 
 ```js
  class Cell{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw(){
        if (mouse.x && mouse.y  && collision(this, mouse)){
            ctx.strokeStyle = 'black';
            ctx.strokeRect(this.x, this.y, this.width, this.height)
        }
        
    }
}
  function creategrid(){
    for (let y = cellSize; y < canvas.height; y += cellSize){
        for (let x = 0; x < canvas.width; x += cellSize){
            gameGrid.push(new Cell(x, y));
        }
    }
}
creategrid();
function handleGameGrid(){
    for (let i = 0; i < gameGrid.length; i++){
        gameGrid[i].draw();
    }
}
  ```
 За допомогою цієї частини коду наше поле розділяється на деякі частини, а саме на квадрати, які будуть підсвічуватись при наведені курсору на них. 
  
```js
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
  ```
  Ця частина відповідає за функціональність мишки.                                     
# Створення персонажів
  У даному контексті, ми маємо два види персонажів: захисники та вороги.
```js
class Defender{
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
   ```
  Даний class прописує наших персонажів, а саме іх характеристики. ctx.drawImage - надає різні способи малювання зображення на полотні.  
  ```js
  ctx.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
  ```
dx
                                        
Координата по осі Х, що позначає стартову точку полотна-приймача, в яку буде поміщений верхній лівий кут вихідного image.
                                        
dy
                                        
Координата по осі Y, що позначає стартову точку полотна-приймача, в яку буде поміщений верхній лівий кут вихідного image.
                                        
dWidth
                                        
Ширина зображення, отриманого з вихідного image. Ця опція дозволяє масштабувати зображення по ширині. Якщо опція не задана, зображення не буде масштабувати.
                                        
dHeight
                                        
Висота зображення, отриманого з вихідного image. Ця опція дозволяє масштабувати зображення по висоті. Якщо опція не задана, зображення не буде масштабувати.
                                        
sx
                                        
Координата по осі X верхнього лівого кута фрагмента, який буде вирізаний з зображення-джерела і поміщений в контекст-приймач.
                                        
sy
                                        
Координата по осі Y верхнього лівого кута фрагмента, який буде вирізаний з зображення-джерела і поміщений в контекст-приймач.
                                        
sWidth
                                        
Ширина фрагмента, який буде вирізаний з зображення джерела і поміщений в контекст-приймач. Якщо не задана, фрагмент від точки, заданої sx і sy до правого нижнього кута джерела буде цілком скопійований в контекст-приймач.
                                        
sHeight
                                        
Висота фрагмента, який буде вирізаний з зображення джерела і поміщений в контекст-приймач.
                                        
За допомогою нижче наведенего коду ми завантажуємо зображення.
  ```js
const defender1 = new Image();
defender1.src = 'defender1.png'
const defender2 = new Image();
defender2.src = 'defender2.png'
  ```
  Потвторюємо цей фаргмент коду і для створення ворогів.
# Снаряд та ресурси
Як же саме відбувається колізія між ворогами та снарядами, які в них потрапляють? Наш снаряд представлений у вигляді каміння(його зображення завантажуємо за допомогою вище наведенего коду з попереднього пункту), який знімає певну кількість здоров`я персонажу. При нанесенні певного урона нашому ворогу, снаряд пропадає або, якщо виходить за межі игрового поля).
  ```js
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
```
#
