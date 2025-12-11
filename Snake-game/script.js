const board = document.querySelector('.board');
const blockHeight = 50;
const blockWidth = 50;

let startButton = document.querySelector('.btn-start');
let restartButton = document.querySelector('.btn-restart');
let modal = document.querySelector('.modal');
let startGameModal = document.querySelector('.start-game');
let restartGameModal = document.querySelector('.game-over');

const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');

let highScore = localStorage.getItem('highScore') || 0;
highScoreElement.textContent = highScore;
let score = 0;
let time = `00:00`;


const col = Math.floor(board.clientWidth/ blockWidth);
const row = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;
let timeIntervalId = null;
let food = {x:Math.floor(Math.random()*row), y: Math.floor(Math.random()*col)};

let blocks = [];
let snake = [{
    x:1, y:3
}
];
let direction = 'down'; 


for(let rows=0; rows<row; rows++){
    for(let cols=0; cols<col; cols++){
        const block = document.createElement('div');
        block.classList.add('block');
        board.append(block);
        blocks[`${rows}-${cols}`] = block;
    }
}

function render(){
    let head = null;

    blocks[`${food.x}-${food.y}`].classList.add('food');

    if (direction === 'left') {
        head = { x: snake[0].x, y: snake[0].y - 1}
    } else if( direction === 'right'){
        head = { x: snake[0].x, y: snake[0].y +1}
    } else if( direction === 'up'){
        head = { x: snake[0].x - 1, y: snake[0].y};
    } else if( direction === 'down'){
        head = { x: snake[0].x + 1, y: snake[0].y};
    }
    
    if (head.x < 0 || head.x>row || head.y<0 || head.y> col){
        clearInterval(intervalId);
        modal.style.display = 'flex';
        startGameModal.style.display = 'none';
        helpModal.style.display = 'none';
        restartGameModal.style.display = 'flex';
    }

    if(head.x == food.x && head.y == food.y){
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food = {
            x:Math.floor(Math.random()*row), y: Math.floor(Math.random()*col)
        }
        score += 10;
        scoreElement.textContent = score;
        if(score>highScore){
            localStorage.setItem('highScore', score.toString());
        }
        snake.unshift(head);
    }

    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.remove('fill')
    })  
    
    snake.unshift(head);
    snake.pop();

    snake.forEach(segment=>{
        blocks[`${segment.x}-${segment.y}`].classList.add('fill')
    })

}



function restartGame(){
    blocks[`${food.x}-${food.y}`].classList.remove('food');
    scoreElement.textContent = 0;
    highScore = localStorage.getItem('highScore');
    highScoreElement.textContent = highScore;
    timeElement.textContent = `00:00`;
    time = `00:00`;
    pausedTime = `00:00`;

    snake = [{x:1, y:3}];
    direction = 'right';
    food = {x:Math.floor(Math.random()*row), y: Math.floor(Math.random()*col)};
    intervalId = setInterval(()=>{
        render();
      },400)
}


addEventListener("keydown", (event) =>{
    if(event.key == "ArrowUp"){
        direction = "up";
    } else if(event.key == "ArrowDown"){
        direction = "down";
    } else if(event.key == "ArrowRight"){
        direction = "right";
    } else {
        direction = "left";
    }
} )

startButton.addEventListener('click', ()=>{
    modal.style.display = 'none';
    intervalId = setInterval(()=>{
       render();
    },400) 
    timeIntervalId = setInterval(()=>{
        let [min, sec] = time.split(":").map(Number);

        if(sec == 59){
            min += 1;
            sec = 0;
        } else{
            sec += 1;
        }

        time = `${min}:${sec}`;
        timeElement.textContent = time;
    }, 1000)
})

restartButton.addEventListener('click', ()=>{
    modal.style.display = 'none';
    restartGame();
})




// Logic for Pause-Resume
let pauseButton = document.querySelector('.pause-btn');
let resumeButton = document.querySelector('.resume-btn');

function pauseGame(){
    clearInterval(intervalId);
    clearInterval(timeIntervalId);
    pauseButton.style.display = 'none';
    resumeButton.style.display = 'flex';
}

function resumeGame(){
    intervalId = setInterval(()=>{
        render();
    }, 400)

    timeIntervalId = setInterval(()=>{
      let [min, sec] = time.split(':').map(Number);

      if(sec==59){
        min +=1;
        sec = 0;
      } else{
        sec += 1;
      }

      time = `${min}:${sec}`;
      timeElement.textContent = time;
    },1000)

    pauseButton.style.display = 'flex';
    resumeButton.style.display = 'none';
}

pauseButton.addEventListener('click',()=>{
    pauseGame();
    
})

resumeButton.addEventListener('click', ()=>{
    resumeGame();
})







let help = document.querySelector('.help-btn');
let helpButton = document.querySelector('.cross-help-btn');
let helpModal = document.querySelector('.help-modal');

function showHelp(){
       modal.style.display = 'flex';
       startGameModal.style.display = 'none';
       restartGameModal.style.display = 'none';
       helpModal.style.display = 'flex';
       pauseGame();
       
}

help.addEventListener('click', ()=>{
    showHelp();
})

helpButton.addEventListener('click',()=>{
    modal.style.display = 'none';
    resumeGame();
})

// let modal = document.querySelector('.modal');
// modal.style.display = 'none';