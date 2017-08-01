var canvas = document.createElement('canvas');
var context = canvas.getContext('2d');
canvas.width = 640;
canvas.height = 640;

var snakeHeadArray = [
        './build/img/head1.png',
        './build/img/head2.png',
        './build/img/head3.png'
    ];
var player = {
        x: 64,
        y: 64,
        headPosition: 0,
        direction: 'down'
    };

var puzzleSize = 32;
var score = 0;
var keyDown = false;
var headTooHigh = false;

var keyClick = {};
document.addEventListener('keydown', function(event) {
    moveMouth();
    snakeHead.src = getSnakeHead(player.headPosition);
    if(!keyDown) {
        keyClick[event.keyCode] = true;
        move(keyClick);
        keyDown = true;
    }
}, false);

function moveMouth() {
    if(!headTooHigh) {
        player.headPosition++;
        player.headPosition >= 2? headTooHigh = true: null;
    } else {
        player.headPosition--;
        player.headPosition <= 0? headTooHigh = false: null;
    }
}

document.addEventListener('keyup', function(event) {
    delete keyClick[event.keyCode];
    keyDown = false;
}, false)

var snakeHead = new Image();
    snakeHead.ready = false;
    snakeHead.onload = checkReady;
    snakeHead.src = getSnakeHead(player.headPosition);

function move(key) {
    if(37 in key) {
        if(player.x >= puzzleSize) {
            player.x -= puzzleSize;
            player.direction = 'left';   
        }
    }
    if(38 in key) {
        if(player.y >= puzzleSize) {
            player.y -= puzzleSize;
            player.direction = 'top';
        }
    }
    if(39 in key) {
        if(player.x < (canvas.width - puzzleSize)) {
            player.x += puzzleSize;
            player.direction = 'right';
        }
    }
    if(40 in key) {
        if(player.y < (canvas.height - puzzleSize)) {
            player.y += puzzleSize;
            player.direction = 'down';
        }
    }
    render();
}

function getSnakeHead(position) {
    return snakeHeadArray[position];
}

function checkReady() {
    this.ready = true;
    playgame();
}

function playgame() {
    render();
}

function render() {
    context.fillStyle = '#d3d3d3';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(
        snakeHead,
        player.x,
        player.y,
        puzzleSize,
        puzzleSize
    );
    context.font = '20px Verdana';
    context.fillStyle = 'black';
    context.fillText(`Score: ${score}`, 0, 20);
}

document.body.appendChild(canvas);
