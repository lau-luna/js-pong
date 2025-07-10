var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

let height = c.height;
let width = c.width;

const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

const game = {
    running: false,
};

///     Players
function Jugador(canvasWidth, canvasHeight, xPos, yPos) {
    const playerHeight = canvasHeight / 4;
    return {
        width: canvasWidth / 40,
        height: playerHeight,
        xPos: xPos,
        yPos: yPos,
        velocity: canvasHeight / 100,
        topLimit: 20 + (playerHeight / 2),
        bottomLimit: (canvasHeight - 20) - (playerHeight / 2),
        score: 0
    }
};

// Initialize players
const leftPlayer = Jugador(width, height, 22 + ((width / 40) / 2), height / 2);
const rightPlayer = Jugador(width, height, (width - 22) - ((width / 40) / 2), height / 2);


/// Ball
function Ball(canvasWidth, canvasHeight) {
    return {
        width: canvasWidth / 40,
        height: canvasWidth / 40,
        xPos: canvasWidth / 2,
        yPos: canvasHeight / 2,
        xVel: 0,
        yVel: 0,
        speed: canvasWidth / 225,
    }
};

// Initilize ball
const ball = Ball(width, height);

function startBall() {
    ball.xPos = width / 2;
    ball.yPos = height / 2;
    ball.xVel = 0;
    ball.yVel = 0;
    ball.speed = width / 225;

    setTimeout(() => {
        let angle = Math.random() * (Math.PI / 1.5) - (Math.PI / 3);
        let dir = Math.random() < 0.5 ? -1 : 1;

        ball.xVel = Math.cos(angle) * ball.speed * dir;
        ball.yVel = Math.sin(angle) * ball.speed;
    }, 2000);

    game.running = true;
};

function bounceFromPlayer(player) {
    const relativeInsersectY = player.yPos - ball.yPos;
    const normalized = relativeInsersectY / (player.height / 2);
    const bounceAngle = normalized * (Math.PI / 3);

    const direction = ball.xVel < 0 ? 1 : -1;

    ball.xVel = ball.speed * Math.cos(bounceAngle) * (ball.xVel < 0 ? 1 : -1);
    ball.yVel = ball.speed * -Math.sin(bounceAngle);

    if (direction === 1) {
        ball.xPos = player.xPos + player.width / 2 + ball.width / 2 + 1;
    } else {
        ball.xPos = player.xPos - player.width / 2 - ball.width / 2 - 1;
    }

    ball.speed *= 1.05;
}

function score() {
    // Left Player scores
    if (ball.xPos >= width + ball.width / 2) {
        leftPlayer.score++;
        game.running = false;
        startBall();
    }

    // Left Player scores
    if (ball.xPos <= - ball.width / 2) {
        rightPlayer.score++;
        game.running = false;
        startBall();
    }
}


///     Draw functions
function drawBackground() {
    ctx.fillStyle = "white";
    ctx.fillRect(10, 10, width - 20, height - 20)

    ctx.fillStyle = "black";
    ctx.fillRect(12, 12, width - 24, height - 24);

    ctx.beginPath();
    ctx.setLineDash([10, 5]);
    ctx.moveTo(width / 2, 12);
    ctx.lineTo(width / 2, height - 12);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "white";
    ctx.stroke();
}

function drawPlayer(player) {
    ctx.fillStyle = "white";
    ctx.fillRect(player.xPos - (player.width / 2),
        player.yPos - (player.height / 2),
        player.width,
        player.height
    );
}

function drawBall(ball) {
    ctx.fillStyle = "white";
    ctx.fillRect(ball.xPos - (ball.width / 2),
        ball.yPos - (ball.height / 2),
        ball.width,
        ball.height
    );
}

function drawScore() {
    ctx.fillStyle = "white";
    ctx.font = '32px "cyberpunkWaifus"';
    ctx.textAlign = "center";
    ctx.fillText(leftPlayer.score, width / 2 - width / 4, height / 2 - height / 3);

    ctx.fillText(rightPlayer.score, width / 2 + width / 4, height / 2 - height / 3);
}

///     Key eventListeners
document.addEventListener("keydown", (e) => {
    if (e.key == "w") keys.w = true;
    if (e.key == "s") keys.s = true;

    if (e.key == "ArrowUp") keys.ArrowUp = true;
    if (e.key == "ArrowDown") keys.ArrowDown = true;
});

document.addEventListener("keyup", (e) => {
    if (e.key == "w") keys.w = false;
    if (e.key == "s") keys.s = false;

    if (e.key == "ArrowUp") keys.ArrowUp = false;
    if (e.key == "ArrowDown") keys.ArrowDown = false;
});

document.addEventListener("keydown", (e) => {
    if (e.key == "Enter" && !game.running) {
        game.running = true;
        startBall();
    }
});

// Mouse listeners

c.addEventListener('mouseover', () => {
    c.style.cursor = "pointer";
    c.addEventListener('click', () => {
        if (!game.running) {
            game.running = true;
            startBall();
        }
    });
});


// custom fonts
const font = new FontFace("cyberpunkWaifus", "url(./fonts/CyberpunkWaifus.ttf)");
font.load().then(function (loadedFont) {
    document.fonts.add(loadedFont);
});

const font2 = new FontFace("pixelLife", "url(./fonts/vcr.ttf)");
font2.load().then(function (loadedFont) {
    document.fonts.add(loadedFont);
});

function main() {
    // Siempre ejecutar requestAnimationFrame
    requestAnimationFrame(main);

    // Limpiar canvas
    ctx.fillStyle = "black";
    ctx.clearRect(0, 0, width, height);
    drawBackground();


    if (game.running) {
        // Movimiento
        if (keys.w && leftPlayer.yPos > leftPlayer.topLimit) leftPlayer.yPos -= leftPlayer.velocity;
        if (keys.s && leftPlayer.yPos < leftPlayer.bottomLimit) leftPlayer.yPos += leftPlayer.velocity;

        if (keys.ArrowUp && rightPlayer.yPos > rightPlayer.topLimit) rightPlayer.yPos -= rightPlayer.velocity;
        if (keys.ArrowDown && rightPlayer.yPos < rightPlayer.bottomLimit) rightPlayer.yPos += rightPlayer.velocity;

        ball.xPos += ball.xVel;
        ball.yPos += ball.yVel;

        /// Change ball direction
        // Bounce with rightPlayer
        if (
            ball.xPos + ball.width / 2 >= rightPlayer.xPos - rightPlayer.width / 2 &&
            ball.xPos - ball.width / 2 <= rightPlayer.xPos + rightPlayer.width / 2 &&
            ball.yPos >= rightPlayer.yPos - rightPlayer.height / 2 &&
            ball.yPos <= rightPlayer.yPos + rightPlayer.height / 2
        ) {
            bounceFromPlayer(rightPlayer);
        }

        // Bounce with leftPlayer
        if (
            ball.xPos - ball.width / 2 <= leftPlayer.xPos + leftPlayer.width / 2 &&
            ball.xPos + ball.width / 2 >= leftPlayer.xPos - leftPlayer.width / 2 &&
            ball.yPos >= leftPlayer.yPos - leftPlayer.height / 2 &&
            ball.yPos <= leftPlayer.yPos + leftPlayer.height / 2
        ) {
            bounceFromPlayer(leftPlayer);
        }

        // Bounce with topLimit and bottomLimit
        if (
            ball.yPos <= 20 || ball.yPos >= height - 20
        ) {
            ball.yVel *= -1;
        }

        drawPlayer(leftPlayer);
        drawPlayer(rightPlayer);
        drawBall(ball);
        drawScore();

        score();

    } else {
        ctx.fillStyle = "black";
        ctx.fillRect(width / 2 - width / 4, height / 2 - height / 4, width / 2, height / 2);

        ctx.lineWidth = 2;
        ctx.strokeStyle = "white";
        ctx.setLineDash([10, 5]);
        ctx.strokeRect(width / 2 - width / 4, height / 2 - height / 4, width / 2, height / 2);

        ctx.fillStyle = "white";
        let fontSize = width / 18;
        ctx.font = `${fontSize}px pixelLife`;
        ctx.textAlign = "center";
        ctx.fillText("JS Pong", width / 2, height / 2 - height / 10);

        ctx.fillStyle = "white";
        fontSize = width / 30;
        ctx.font = `${fontSize}px cyberpunkWaifus`;
        ctx.textAlign = "center";
        ctx.fillText("CLICK TO PLAY", width / 2, height / 2 + height / 8);

        ctx.fillStyle = "white";
        fontSize = width / 40;
        ctx.font = `${fontSize}px cyberpunkWaifus`;
        ctx.textAlign = "center";
        ctx.fillText("by lau-luna on github", width / 2 + width / 4, height - height / 16);

        drawPlayer(leftPlayer);
        drawPlayer(rightPlayer);
        drawBall(ball);
    }
}

main();
