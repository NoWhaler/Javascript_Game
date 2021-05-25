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
  asdasdasdsad
  

