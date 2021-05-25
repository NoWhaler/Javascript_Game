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
  Ця частина відповідає за функціональність мишки                                      
#
  
#
  
#
