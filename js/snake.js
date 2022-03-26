canvas = document.getElementById("myCanvas");
ctx = canvas.getContext("2d");
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
window.onresize = function(){
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
    grid_x_size = canvas.width/10;
    grid_y_size = canvas.height/10;
}
grid_x_size = canvas.width/10;
grid_y_size = canvas.height/10;

//variables
var score = 0;
var speed = 100;
var snake_array = [];
var snake_x = 3;
var snake_y = 3;
var snake_x_speed = 10;
var snake_last_x_speed = 10;
var snake_y_speed = 0;
var snake_last_y_speed = 10;
var food_x = 0;
var food_y = 0;
var food_x_speed = 0;
var food_y_speed = 0;
var game_over = false;

//functions
function init() {
  snake_array = [{x: Math.round(Math.random() * (grid_x_size - 1)), y: Math.round(Math.random() * (grid_y_size - 1))}];
  snake_x = 3;
  snake_y = 3;
  snake_x_speed = 1;
  snake_last_x_speed = 1;
  snake_y_speed = 0;
  snake_last_y_speed = 0;
  food_x = Math.round(Math.random() * (grid_x_size - 1));
  food_y = Math.round(Math.random() * (grid_y_size - 1));
  food_x_speed = 0;
  food_y_speed = 0;
  score = 0;
  game_over = false;
  document.getElementById("score").innerHTML = "0";
  try {
  clearInterval(game_loop);
  } catch(err) {
  }
  document.onkeydown = function(){};
  game_loop = setInterval(paint, speed);
}

function paint() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "black";
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
  //draw snake
  for (var i = 0; i < snake_array.length; i++) {
    ctx.fillStyle = "green";
    ctx.fillRect(snake_array[i].x*10, snake_array[i].y*10, 10, 10);
    ctx.strokeStyle = "darkgreen";
    ctx.strokeRect(snake_array[i].x*10, snake_array[i].y*10, 10, 10);
  }
  //draw food
  ctx.fillStyle = "red";
  ctx.fillRect(food_x*10, food_y*10, 10, 10);
  ctx.strokeStyle = "darkred";
  ctx.strokeRect(food_x*10, food_y*10, 10, 10);

  //move snake
  for (var i = snake_array.length - 1; i > 0; i--) {
    snake_array[i].x = snake_array[i-1].x;
    snake_array[i].y = snake_array[i-1].y;
  }
    snake_array[0].x += snake_x_speed;
    snake_array[0].y += snake_y_speed;
    snake_last_x_speed = snake_x_speed;
    snake_last_y_speed = snake_y_speed;

  //collision with border
  if (
    snake_array[0].x < -1 ||
    snake_array[0].x > grid_x_size ||
    snake_array[0].y < -1 ||
    snake_array[0].y > grid_y_size
  ) {
    game_over = true;
  }

  //collision with self
  for (var i = 1; i < snake_array.length; i++) {
    if (
      snake_array[0].x == snake_array[i].x &&
      snake_array[0].y == snake_array[i].y
    ) {
      console.log(i);
      console.log(snake_array);
      console.log(snake_x_speed);
      console.log(snake_y_speed);
      game_over = true;
    }
  }

  //collision with food
  if (snake_array[0].x == food_x && snake_array[0].y == food_y) {
    score++;
    document.getElementById("score").innerHTML = score;
    //increase and decrease score font size and change color with a transition
    document.getElementById("score").style.transition = "all 0.5s ease-in-out";
    document.getElementById("score").style.fontSize = "100px";
    document.getElementById("score").style.color = "red";
    setTimeout(function(){
      document.getElementById("score").style.fontSize = "50px";
      document.getElementById("score").style.color = "white";
    }, 500);
    snake_array.push({x: snake_array[snake_array.length-1].x, y: snake_array[snake_array.length-1].y});
    food_x = Math.round(Math.random() * (grid_x_size - 1));
    food_y = Math.round(Math.random() * (grid_y_size - 1));
  }
  //move food
  food_x += food_x_speed;
  food_y += food_y_speed;

  if (game_over) {
    clearInterval(game_loop);
    //display game over screen
    //it must be centered
    ctx.fillStyle = "black";
    ctx.font = "30px 'Press Start 2P'";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2 - 45);
    ctx.fillText("SCORE: " + score, canvas.width/2, canvas.height/2 - 15);
    //reset game on next keypress and tell user what key to press
    ctx.fillText("Press ENTER", canvas.width/2, canvas.height/2 + 15);
    ctx.fillText("to continue.", canvas.width/2, canvas.height/2 + 45);
    document.onkeydown = function(e) {
      if (e.keyCode == 13) {
        init();
      }
    }
  }
}

function keyPush(event) {
  switch (event.keyCode) {
    case 37:
    if (snake_last_x_speed == 0) {
        snake_x_speed = -1;
        snake_y_speed = 0;
    }
      break;
    case 38:
    if (snake_last_y_speed == 0) {
      snake_x_speed = 0;
      snake_y_speed = -1;
    }
      break;
    case 39:
    if (snake_last_x_speed == 0) {
      snake_x_speed = 1;
      snake_y_speed = 0;
    }
      break;
    case 40:
    if (snake_last_y_speed == 0) {
      snake_x_speed = 0;
      snake_y_speed = 1;
    }
      break;
  }
}

//initialize
init();

//start game
document.addEventListener("keydown", keyPush);
