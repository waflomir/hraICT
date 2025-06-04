const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gravity = 0.5;
const keys = {};

const player = {
  x: 50,
  y: 300,
  width: 30,
  height: 30,
  dx: 0,
  dy: 0,
  speed: 3,
  jumpForce: 10
};

// Define levels
const levels = [
  {
    platforms: [
      { x: 0, y: 350, width: 800, height: 50 },
      { x: 200, y: 300, width: 100, height: 10 },
      { x: 400, y: 250, width: 100, height: 10 },
      { x: 600, y: 200, width: 100, height: 10 }
    ],
    flag: { x: 720, y: 160, width: 20, height: 40 }
  },
  {
    platforms: [
      { x: 0, y: 350, width: 800, height: 50 },
      { x: 100, y: 280, width: 100, height: 10 },
      { x: 250, y: 220, width: 100, height: 10 },
      { x: 400, y: 160, width: 100, height: 10 },
      { x: 550, y: 100, width: 100, height: 10 }
    ],
    flag: { x: 670, y: 60, width: 20, height: 40 }
  }
];

let currentLevel = 0;

function drawRect(obj) {
  ctx.fillStyle = obj.color || 'black';
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function isOnGround(player, platforms) {
  return platforms.some(p =>
    player.x + player.width > p.x &&
    player.x < p.x + p.width &&
    player.y + player.height >= p.y &&
    player.y + player.height <= p.y + 5
  );
}

function loadLevel(index) {
  currentLevel = index;
  player.x = 50;
  player.y = 300;
  player.dy = 0;
}

function updatePlayer() {
  const level = levels[currentLevel];
  const platforms = level.platforms;
  const flag = level.flag;

  player.dx = 0;
  if (keys['ArrowRight'] || keys['d']) player.dx = player.speed;
  if (keys['ArrowLeft'] || keys['a']) player.dx = -player.speed;

  if ((keys['ArrowUp'] || keys[' ']) && isOnGround(player, platforms)) {
    player.dy = -player.jumpForce;
  }

  player.dy += gravity;
  player.x += player.dx;
  player.y += player.dy;

  // Platform collision
  platforms.forEach(p => {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y + player.height <= p.y + player.dy &&
      player.y + player.height + player.dy >= p.y
    ) {
      player.y = p.y - player.height;
      player.dy = 0;
    }
  });

  // Flag collision with fixed level check
  if (
    player.x < flag.x + flag.width &&
    player.x + player.width > flag.x &&
    player.y < flag.y + flag.height &&
    player.y + player.height > flag.y
  ) {
    if (currentLevel < levels.length - 1) {
      loadLevel(currentLevel + 1);
    } else {
      alert('🎉 You beat all levels!');
      loadLevel(0); // Restart from level 1
    }
  }

  // Fall off screen
  if (player.y > canvas.height) {
    loadLevel(currentLevel); // Reset current level
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const level = levels[currentLevel];
  updatePlayer();
  drawRect({ ...player, color: 'red' });

  level.platforms.forEach(p => drawRect({ ...p, color: 'green' }));
  drawRect({ ...level.flag, color: 'yellow' });

  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => keys[e.key] = true);
document.addEventListener('keyup', e => keys[e.key] = false);

loadLevel(0);
gameLoop();
