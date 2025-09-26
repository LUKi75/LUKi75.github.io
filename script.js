const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    width: 20,
    height: 20,
    color: '#3b3b3b',
    speed: 0.8,
    xv: 0,
    yv: 0,
    jumpForce: -12,
    gravity: 0.7,
    isGrounded: false,
    levelX: 1,
    levelY: 1
};

const levels = [
    [
        {
            levelPos: '1-1',
            startX: 50,
            startY: 400,
            platforms: [
                { x: 0, y: 520, width: 960, height: 20, color: '#262626' },
                { x: 0, y: 20, width: 20, height: 500, color: '#262626' },
                { x: 0, y: 0, width: 960, height: 20, color: '#262626' },
                { x: 940, y: 140, width: 20, height: 380, color: '#262626' },
                { x: 250, y: 440, width: 100, height: 15, color: '#262626' },
                { x: 400, y: 360, width: 100, height: 15, color: '#262626' },
                { x: 550, y: 280, width: 100, height: 15, color: '#262626' },
                { x: 700, y: 200, width: 100, height: 15, color: '#262626' },
                { x: 850, y: 140, width: 90, height: 15, color: '#262626' }
            ],
            dangers: [
                { x: 380, y: 510, width: 560, height: 10, color: '#ff3333' }
            ]
        },
        {
            levelPos: '1-2',
            startX: 50,
            startY: 50,
            platforms: [
                { x: 0, y: 520, width: 960, height: 20, color: '#262626' },
                { x: 0, y: 140, width: 20, height: 380, color: '#262626' },
                { x: 0, y: 0, width: 960, height: 20, color: '#262626' },
                { x: 940, y: 140, width: 20, height: 380, color: '#262626' },
                { x: 20, y: 140, width: 200, height: 15, color: '#262626' },
                { x: 330, y: 250, width: 50, height: 15, color: '#262626' },
                { x: 100, y: 400, width: 50, height: 15, color: '#262626' },
                { x: 220, y: 330, width: 500, height: 15, color: '#262626' },
                { x: 220, y: 450, width: 50, height: 15, color: '#262626' },
                { x: 380, y: 470, width: 50, height: 15, color: '#262626' }
            ],
            dangers: [
                { x: 220, y: 320, width: 500, height: 10, color: '#ff3333' },
                { x: 20, y: 510, width: 920, height: 10, color: '#ff3333' }
            ]
        }
    ]
];

const keys = {
    left: false,
    right: false,
    up: false
};

document.addEventListener('keydown', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = true;
    if (e.code === 'Space') keys.space = true;
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
    if (e.code === 'Space') keys.space = false;
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    player.yv += player.gravity;
    player.y += player.yv;

    player.x += player.xv;
    player.xv *= 0.85;

    if (keys.left) {
        player.xv -= player.speed;
    }
    if (keys.right) {
        player.xv += player.speed;
    }

    if ((keys.up && player.isGrounded) || keys.space) {
        player.yv = player.jumpForce;
        player.isGrounded = false;
    }

    player.isGrounded = false;
    levels[player.levelY - 1][player.levelX - 1].platforms.forEach(platform => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y < platform.y + platform.height
        ) {
            if (player.yv > 0 && player.y + player.height - player.yv <= platform.y) {
                player.y = platform.y - player.height;
                player.yv = 0;
                player.isGrounded = true;
            }
            else if (player.yv < 0 && player.y - player.yv >= platform.y + platform.height) {
                player.y = platform.y + platform.height;
                player.yv = 0;
            }
	    else if (player.y + player.height >= platform.y + 1) {
	        if (player.xv > 0) {
                    player.x = platform.x - player.width;
                    player.xv = 0;
                }
                else if (player.xv < 0) {
                    player.x = platform.x + platform.width;
                    player.xv = 0;
                }
            }
        }
    });

    levels[player.levelY - 1][player.levelX - 1].dangers.forEach(danger => {
        if (
            player.x < danger.x + danger.width &&
            player.x + player.width > danger.x &&
            player.y + player.height > danger.y &&
            player.y < danger.y + danger.height
        ) {
            reset();
        }
    });

    if (player.x < 0) {
        player.x = canvas.width - player.width;
        player.levelX--;
    }
    if (player.x + player.width > canvas.width) {
        player.x = 0;
        player.levelX++;
    }
    if (player.y < 0) {
        player.y = 0;
        player.levelY++;
    }
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.levelY--;
    }
}

function reset() {
    player.xv = 0;
    player.yv = 0;
    player.x = levels[player.levelY - 1][player.levelX - 1].startX;
    player.y = levels[player.levelY - 1][player.levelX - 1].startY;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    levels[player.levelY - 1][player.levelX - 1].platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    levels[player.levelY - 1][player.levelX - 1].dangers.forEach(danger => {
        ctx.fillStyle = danger.color;
        ctx.fillRect(danger.x, danger.y, danger.width, danger.height);
    });

    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

reset();
gameLoop();
