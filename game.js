const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let gravity = 0.5;
let friction = 0.8;
let keys = {};

let player = {
  x: 50,
  y: 300,
  width: 30,
  height: 30,
  color: 'red',
  dx: 0,
  dy: 0,
  speed: 3,
  jumpForce: 10,
  jumping: false
};

let platforms = [
  { x: 0, y: 350, width: 800, height: 50 },
  { x: 200, y: 300, width: 100, height: 10 },
  { x: 400, y: 250, width: 100, height: 10 },
  { x: 600, y: 200, width: 100, height: 10 }
];

let flag = { x: 720, y: 160, width: 20, height: 40 };

function drawRect(obj) {
  ctx.fillStyle = obj.color || 'black';
  ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

function updatePlayer() {
  // Horizontal movement
  if (keys['ArrowRight'] || keys['d']) player.dx = player.speed;
  else if (keys['ArrowLeft'] || keys['a']) player.dx = -player.speed;
  else player.dx = 0;

  // Jumping
  if ((keys['ArrowUp'] || keys['w']) && !player.jumping) {
    player.dy = -player.jumpForce;
    player.jumping = true;
  }

  player.dy += gravity;
  player.x += player.dx;
  player.y += player.dy;

  // Simple floor/platform collision
  player.jumping = true; // Assume jumping unless proven otherwise

  platforms.forEach(p => {
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y + player.height <= p.y &&
      player.y + player.height + player.dy >= p.y
    ) {
      player.y = p.y - player.height;
      player.dy = 0;
      player.jumping = false;
    }
  });

  // Win condition
  if (
    player.x < flag.x + flag.width &&
    player.x + player.width > flag.x &&
    player.y < flag.y + flag.height &&
    player.y + player.height > flag.y
  ) {
    alert('🎉 You win!');
    player.x = 50;
    player.y = 300;
    player.dy = 0;
  }

  // Boundaries
  if (player.y > canvas.height) {
    player.x = 50;
    player.y = 300;
    player.dy = 0;
  }
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  updatePlayer();
  drawRect(player);

  platforms.forEach(p => drawRect({ ...p, color: 'green' }));
  drawRect({ ...flag, color: 'yellow' });

  requestAnimationFrame(gameLoop);
}

document.addEventListener('keydown', e => {
  keys[e.key] = true;
});
document.addEventListener('keyup', e => {
  keys[e.key] = false;
});

gameLoop();
