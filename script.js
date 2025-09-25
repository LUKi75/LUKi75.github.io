const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 400,
    width: 20,
    height: 20,
    color: '#3b3b3b',
    speed: 0.8,
    xv: 0,
    yv: 0,
    jumpForce: -12,
    gravity: 0.7,
    isGrounded: false
};

const platforms = [
    { x: 0, y: 520, width: 960, height: 20, color: '#262626' },
    { x: 0, y: 0, width: 20, height: 520, color: '#262626' },
    { x: 940, y: 180, width: 210, height: 15, color: '#5c5c5c' },
    { x: 300, y: 440, width: 100, height: 15, color: '#5c5c5c' },
    { x: 450, y: 360, width: 100, height: 15, color: '#5c5c5c' },
    { x: 600, y: 280, width: 100, height: 15, color: '#5c5c5c' },
    { x: 750, y: 200, width: 210, height: 15, color: '#5c5c5c' }
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
});

document.addEventListener('keyup', (e) => {
    if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
    if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
    if (e.code === 'ArrowUp' || e.code === 'KeyW') keys.up = false;
});

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

function update() {
    // Apply gravity
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

    if (keys.up && player.isGrounded) {
        player.yv = player.jumpForce;
        player.isGrounded = false;
    }

    player.isGrounded = false;
    platforms.forEach(platform => {
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

    if (player.x < 0) {
        player.x = 0;
        player.xv = 0;
    }
    if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
        player.xv = 0;
    }
    if (player.y < 0) {
        player.y = 0;
        player.yv = 0;
    }
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.yv = 0;
        player.isGrounded = true;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

gameLoop();
