const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player properties
const player = {
    x: 400,
    y: 500,
    width: 30,
    height: 30,
    color: 'black',
    speed: 1.2,
    xv: 0,
    yv: 0,
    jumpForce: -15,
    gravity: 0.8,
    isGrounded: false
};

// Platform properties
const platforms = [
    { x: 0, y: 600, width: 1280, height: 40, color: '#262626' }, // Ground
    { x: 150, y: 450, width: 100, height: 20, color: '#454545' },
    { x: 350, y: 350, width: 120, height: 20, color: '#454545' },
    { x: 550, y: 250, width: 80, height: 20, color: '#454545' }
];

// Input handling
const keys = {
    left: false,
    right: false,
    up: false
};

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') keys.left = true;
    if (e.key === 'ArrowRight') keys.right = true;
    if (e.key === 'ArrowUp') keys.up = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') keys.left = false;
    if (e.key === 'ArrowRight') keys.right = false;
    if (e.key === 'ArrowUp') keys.up = false;
});

// Game Loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Update game state
function update() {
    // Apply gravity
    player.yv += player.gravity;
    player.y += player.yv;

    player.x += player.xv;
    player.xv *= 0.8;

    // Horizontal movement
    if (keys.left) {
        player.xv -= player.speed;
    }
    if (keys.right) {
        player.xv += player.speed;
    }

    // Jump
    if (keys.up && player.isGrounded) {
        player.yv = player.jumpForce;
        player.isGrounded = false;
    }

    // Collision detection with platforms
    player.isGrounded = false; // Reset grounded status
    platforms.forEach(platform => {
        if (
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y + player.height > platform.y &&
            player.y < platform.y + platform.height
        ) {
            // Collision from top (landing on platform)
            if (player.yv > 0 && player.y + player.height - player.yv <= platform.y) {
                player.y = platform.y - player.height;
                player.yv = 0;
                player.isGrounded = true;
            } 
            // Collision from bottom (hitting head on platform)
            else if (player.yv < 0 && player.y - player.yv >= platform.y + platform.height) {
                player.y = platform.y + platform.height;
                player.yv = 0;
            }
	    if (player.y < 570) {
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

    // Keep player within canvas bounds (simplified)
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.yv = 0;
        player.isGrounded = true;
    }
}

// Draw game elements
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw platforms
    platforms.forEach(platform => {
        ctx.fillStyle = platform.color;
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });

    // Draw player
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Start the game loop
gameLoop();
