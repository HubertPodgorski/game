var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 640;


var puzzleSize = 32;
var snakeHeadArray = [
        './build/img/head1.png',
        './build/img/head2.png',
        './build/img/head3.png'
    ];

var snake = {
        x: 64,
        y: 64,
        head: 0,
        direction: 'right',
        speed: 200,
        length: 3,
        level: 1,
        velocity: 10,
        array: []
    };
var mouthInterval;
var apple = {
        x: 32,
        y: 32,
        type: 'red',
        count: 0,
        visible: false
    };
var score = 0;
var keyDown = false;
var headTooHigh = false;
var keyClick = {};
var puzzleCount = (canvas.width / puzzleSize) * (canvas.height / puzzleSize);
var puzzleWidthAmount = canvas.width / puzzleSize;
var puzzleHeightAmount = canvas.height / puzzleSize;
var snakeHead0 = new Image();
    snakeHead0.ready = false;
    snakeHead0.onload = checkReady;
    snakeHead0.src = snakeHeadArray[0];

var snakeHead1 = new Image();
    snakeHead1.ready = false;
    snakeHead1.onload = checkReady;
    snakeHead1.src = snakeHeadArray[1];

var snakeHead2 = new Image();
    snakeHead2.ready = false;
    snakeHead2.onload = checkReady;
    snakeHead2.src = snakeHeadArray[2];

var appleRed = new Image();
    appleRed.ready = false;
    appleRed.onload = checkReady;
    appleRed.src = `./build/img/appleRed.png`;

var appleGolden = new Image();
    appleGolden.ready = false;
    appleGolden.onload = checkReady;
    appleGolden.src = `./build/img/appleGolden.png`;

document.addEventListener('keydown', function(event) {
    if(!keyDown) {
        keyClick[event.keyCode] = true;
        changeDirection(keyClick);
        keyDown = true;
    }
}, false);

document.addEventListener('keyup', function(event) {
    delete keyClick[event.keyCode];
    keyDown = false;
}, false)

function changeDirection(key) {
    clearInterval(mouthInterval);
    if(37 in key) {
        if(snake.x >= (2 * puzzleSize)) {
            snake.direction = 'left';
            // mouthInterval = setInterval(function(){ moveMouth()}, snake.speed);
        }
    }
    if(38 in key) {
        if(snake.y >= (2 * puzzleSize)) {
            snake.direction = 'top';
            // mouthInterval = setInterval(function(){ moveMouth()}, snake.speed);
        }
    }
    if(39 in key) {
        if(snake.x < (canvas.width - (2 * puzzleSize))) {
            snake.direction = 'right';
            // mouthInterval = setInterval(function(){ moveMouth()}, snake.speed);
        }
    }
    if(40 in key) {
        if(snake.y < (canvas.height - (2 * puzzleSize))) {
            snake.direction = 'down';
            // mouthInterval = setInterval(function(){ moveMouth()}, snake.speed);
        }
    }
    render();
}

function moveSnake() {
    if(snake.direction === 'right') {
        if(snake.x < (canvas.width - (2* puzzleSize))) {
            snake.x += puzzleSize;
        } else {
            // clearInterval(mouthInterval);
        }
    } else if (snake.direction === 'down') {
        if(snake.y < (canvas.height - (2 * puzzleSize))) {
            snake.y += puzzleSize;
        } else {
            // clearInterval(mouthInterval);
        }
    } else if (snake.direction === 'left') {
        if(snake.x > puzzleSize) {
            snake.x -= puzzleSize;
        } else {
            // clearInterval(mouthInterval);
        }
    } else if (snake.direction === 'top') {
        if(snake.y > puzzleSize) {
            snake.y -= puzzleSize;
        } else {
            // clearInterval(mouthInterval);
        }
    }
    render();
}

function prepareSnake() {
    for(let i = snake.length; i > 0; i--) {
        snake.array.push({
            x: i * puzzleSize,
            y: 2 * puzzleSize
        });
    }

    console.log(snake.array);
}

function initiate() {
    prepareSnake();
}

initiate();

function checkReady() {
    this.ready = true;
    playgame();
}

function playgame() {
    render();
    requestAnimationFrame(playgame);
}

function renderApple() {
    if(!apple.visible) {
        apple.x = randomNumGenerator(18) * puzzleSize;
        apple.y = randomNumGenerator(18) * puzzleSize;
        apple.visible = true;
        apple.count++
        if(apple.count < 5) {
            apple.type = 'red';
        } else if (apple.count = 5){
            apple.type = 'golden';
            apple.count = 0;
        }
    }
}

function renderSnakeHead() {
    snake.array.forEach((bodyPos) => {
        context.drawImage(
            snakeHead0,
            bodyPos.x,
            bodyPos.y,
            puzzleSize,
            puzzleSize
        );
    })
    // if(snake.head <= 0) {
    //     context.drawImage(
    //         snakeHead0,
    //         snake.x,
    //         snake.y,
    //         puzzleSize,
    //         puzzleSize
    //     );
    // } else if(snake.head >= 2) {
    //     context.drawImage(
    //         snakeHead2,
    //         snake.x,
    //         snake.y,
    //         puzzleSize,
    //         puzzleSize
    //     );
    // } else {
    //     context.drawImage(
    //         snakeHead1,
    //         snake.x,
    //         snake.y,
    //         puzzleSize,
    //         puzzleSize
    //     );
    // }
}

function moveMouth() {
    if(!headTooHigh) {
        snake.head++;
        snake.head >= 2? headTooHigh = true: null;
    } else {
        snake.head--;
        snake.head <= 0? headTooHigh = false: null;
    }
    render();
}

function render() {

    context.fillStyle = '#d3d3d3';
    context.fillRect(puzzleSize, puzzleSize, canvas.width - (2 * puzzleSize) , canvas.height - (2 * puzzleSize));

    context.font = '20px Verdana';
    context.fillStyle = 'black';
    context.fillText(`Score: ${score}`, puzzleSize, canvas.height - puzzleSize);
    context.fillText(`Level: ${snake.level}`, puzzleSize * 5, canvas.height - puzzleSize);
    context.fillText(`Speed: ${snake.speed}`, puzzleSize * 10, canvas.height - puzzleSize);
    
    //Apple Collision

    if(snake.x === apple.x && snake.y === apple.y) {
        if(apple.type == 'red') {
            score += 100 * snake.level;
            snake.length++;
        } else if (apple.type == 'golden') {
            score += 250 * snake.level;
            snake.speed -= snake.velocity;
            snake.level++;
            snake.length++;
        }
        apple.visible = false;
    }

    renderApple();

    if(apple.visible) {
        if(apple.type === 'red') {
            context.drawImage(
                appleRed,
                apple.x,
                apple.y,
                puzzleSize,
                puzzleSize
            );
        } else if(apple.type === 'golden') {
            context.drawImage(
                appleGolden,
                apple.x,
                apple.y,
                puzzleSize,
                puzzleSize
            );
        }
    }

    renderSnakeHead();

    context.fillStyle = 'yellow';
    context.fillRect(snake.x - 1, snake.y - 1, 2, 2);

    context.fillStyle = 'blue';
    context.fillRect(apple.x - 1, apple.y - 1, 2, 2);

}

function randomNumGenerator(n) {
    return Math.floor(Math.random() * n) + 1;
}

var snakeInterval = setInterval(moveSnake, snake.speed);
// mouthInterval = setInterval(function(){ moveMouth()},snake.speed);

document.body.appendChild(canvas);
