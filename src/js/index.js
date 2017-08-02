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
        speed: 4,
        length: 1,
        level: 1,
        velocity: 4
    };

var mouthInterval;
var apple = {
        x: 32,
        y: 32,
        type: 'red',
        count: 0,
        visible: false
    };

var border = {
        x: 0,
        y: 0,
        src: 'corner',
        ready: false,
        count: 0
    };

var grass = {
        x: puzzleSize,
        y: puzzleSize,
        src: 1,
        ready: 0
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

var borderImg = new Image();
    borderImg.ready = false;
    borderImg.onload = checkReady;
    borderImg.src = `./build/img/border/border${border.src}.png`;

var grassImg = new Image();
    grassImg.ready = false;
    grassImg.onload = checkReady;
    grassImg.src = `./build/img/grass/grass${grass.src}.png`;

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

function borderImgChange() {
    borderImg.src = `./build/img/border/border${border.src}.png`;
}

function grassImgChange() {
    grassImg.src = `./build/img/grass/grass${grass.src}.png`;
}

function changeDirection(key) {
    clearInterval(mouthInterval);
    if(37 in key) {
        if(snake.x >= (2 * puzzleSize)) {
            snake.direction = 'left';
            mouthInterval = setInterval(function(){ moveMouth()}, 2000 / snake.speed);
        }
    }
    if(38 in key) {
        if(snake.y >= (2 * puzzleSize)) {
            snake.direction = 'top';
            mouthInterval = setInterval(function(){ moveMouth()}, 2000 / snake.speed);
        }
    }
    if(39 in key) {
        if(snake.x < (canvas.width - (2 * puzzleSize))) {
            snake.direction = 'right';
            mouthInterval = setInterval(function(){ moveMouth()}, 2000 / snake.speed);
        }
    }
    if(40 in key) {
        if(snake.y < (canvas.height - (2 * puzzleSize))) {
            snake.direction = 'down';
            mouthInterval = setInterval(function(){ moveMouth()}, 2000 / snake.speed);
        }
    }
    render();
}

function moveSnake() {
    if(snake.direction === 'right') {
        if(snake.x < (canvas.width - (2* puzzleSize))) {
            snake.x += puzzleSize;
        } else {
            clearInterval(mouthInterval);
        }
    } else if (snake.direction === 'down') {
        if(snake.y < (canvas.height - (2 * puzzleSize))) {
            snake.y += puzzleSize;
        } else {
            clearInterval(mouthInterval);
        }
    } else if (snake.direction === 'left') {
        if(snake.x > puzzleSize) {
            snake.x -= puzzleSize;
        } else {
            clearInterval(mouthInterval);
        }
    } else if (snake.direction === 'top') {
        if(snake.y > puzzleSize) {
            snake.y -= puzzleSize;
        } else {
            clearInterval(mouthInterval);
        }
    }
    render();
}

function checkReady() {
    this.ready = true;
    playgame();
}

function playgame() {
    render();
    requestAnimationFrame(playgame);
}

function renderBorder() {
    var j = 0;
    for(let i = 0; i <= puzzleWidthAmount; i++) {
        border.x = i * puzzleSize;
        border.y = j;
        if(border.x == 0 || border.x == (canvas.width - puzzleCount)) {
            border.src = 'corner';
            borderImgChange();
        } else {
            border.src = randomNumGenerator(6);
            borderImgChange();
        }

        context.drawImage(
            borderImg,
            border.x,
            border.y,
            puzzleSize,
            puzzleSize
        );
    }
}

function renderGrass() {
    for(let i = 1; i <= puzzleWidthAmount - 2; i++) {
        for(let j = 1; j <= puzzleHeightAmount - 2; j++) {
            grass.x = i * puzzleSize;
            grass.y = j * puzzleSize;
            grass.src = randomNumGenerator(6);
            grassImgChange();

            console.log('rendering');

            context.drawImage(
                grassImg,
                grass.x,
                grass.y,
                puzzleSize,
                puzzleSize
            );
        }
    }
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
    if(snake.head <= 0) {
        context.drawImage(
            snakeHead0,
            snake.x,
            snake.y,
            puzzleSize,
            puzzleSize
        );
    } else if(snake.head >= 2) {
        context.drawImage(
            snakeHead2,
            snake.x,
            snake.y,
            puzzleSize,
            puzzleSize
        );
    } else {
        context.drawImage(
            snakeHead1,
            snake.x,
            snake.y,
            puzzleSize,
            puzzleSize
        );
    }
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

    if(!grass.ready) {
        renderGrass();
        grass.ready = 1;
    }

    context.font = '20px Verdana';
    context.fillStyle = 'black';
    context.fillText(`Score: ${score}`, puzzleSize, canvas.height - puzzleSize);
    context.fillText(`Level: ${snake.level}`, puzzleSize * 5, canvas.height - puzzleSize);
    context.fillText(`Speed: ${snake.speed}`, puzzleSize * 10, canvas.height - puzzleSize);
    
    //Collision

    if(snake.x === apple.x && snake.y === apple.y) {
        if(apple.type == 'red') {
            score += 100 * snake.level;
        } else if (apple.type == 'golden') {
            score += 250 * snake.level;
            snake.speed += snake.velocity;
            snake.level++;
        }
        apple.visible = false;
    }

    ///

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

var snakeInterval = setInterval(moveSnake, 3000 / (snake.speed * snake.speed));
mouthInterval = setInterval(function(){ moveMouth()}, 2000 / snake.speed);

document.body.appendChild(canvas);
