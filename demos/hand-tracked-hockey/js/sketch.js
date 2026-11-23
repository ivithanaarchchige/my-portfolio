// Static adaptation of the original ml5.js and p5play sketch.
// Webcam tracking preserves the two index fingers as paddle controls.
const WIDTH = 1000;
const HEIGHT = 550;
const GOAL = 148;
const PADDLE_RADIUS = 42;
const PUCK_RADIUS = 40;
const keys = new Set();
const pointers = new Map();
const players = [
  { x: 210, y: HEIGHT / 2, vx: 0, vy: 0, score: 0, color: '#2764dd', side: 'Blue' },
  { x: WIDTH - 210, y: HEIGHT / 2, vx: 0, vy: 0, score: 0, color: '#df4244', side: 'Red' },
];
const puck = { x: WIDTH / 2, y: HEIGHT / 2, vx: 0, vy: 0 };
const capturedKeys = new Set(['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright']);
let winner;
let video;
let handPose;
let fingertips = [];
let status;

function setup() {
  const board = createCanvas(WIDTH, HEIGHT).elt;
  board.tabIndex = 0;
  board.setAttribute('aria-label', 'Air hockey game board');
  board.addEventListener('pointerdown', event => {
    board.focus();
    const point = pointerPosition(board, event);
    const player = players[Number(point.x > WIDTH / 2)];
    if (![...pointers.values()].some(active => active.player === player)) {
      pointers.set(event.pointerId, { ...point, player });
      board.setPointerCapture(event.pointerId);
    }
  });
  board.addEventListener('pointermove', event => {
    const active = pointers.get(event.pointerId);
    if (active) Object.assign(active, pointerPosition(board, event));
  });
  board.addEventListener('lostpointercapture', event => pointers.delete(event.pointerId));

  window.addEventListener('keydown', event => {
    const key = event.key.toLowerCase();
    if (capturedKeys.has(key)) {
      keys.add(key);
      event.preventDefault();
    }
  });
  window.addEventListener('keyup', event => keys.delete(event.key.toLowerCase()));
  window.addEventListener('blur', () => keys.clear());
  window.addEventListener('pagehide', stopCamera);
  status = document.getElementById('status');
  document.getElementById('camera').addEventListener('click', toggleCamera);
  document.getElementById('serve').addEventListener('click', () => {
    players.forEach((player, index) => Object.assign(player, {
      x: index === 0 ? 210 : WIDTH - 210,
      y: HEIGHT / 2,
      vx: 0,
      vy: 0,
      score: 0,
    }));
    keys.clear();
    pointers.clear();
    winner = undefined;
    resetPuck();
    status.textContent = 'New match started.';
    board.focus();
  });
  board.focus({ preventScroll: true });
}

function pointerPosition(board, event) {
  const rect = board.getBoundingClientRect();
  return { x: (event.clientX - rect.left) * WIDTH / rect.width, y: (event.clientY - rect.top) * HEIGHT / rect.height };
}

function draw() {
  if (!winner) {
    movePaddle(players[0], 0, 'w', 'a', 's', 'd');
    movePaddle(players[1], 1, 'arrowup', 'arrowleft', 'arrowdown', 'arrowright');
    movePuck();
  }

  background('#232d42');
  if (video?.readyState >= 2) {
    push();
    translate(WIDTH, 0);
    scale(-1, 1);
    drawingContext.drawImage(video, 0, 0, WIDTH, HEIGHT);
    pop();
    fill(20, 30, 55, 120);
    noStroke();
    rect(0, 0, WIDTH, HEIGHT);
  }
  drawRink();

  for (const player of players) {
    stroke('#ffffff');
    strokeWeight(3);
    fill(player.color);
    circle(player.x, player.y, PADDLE_RADIUS * 2);
    noStroke();
    fill('#ffffff');
    textAlign(CENTER, CENTER);
    textSize(48);
    text(player.score, player === players[0] ? 108 : WIDTH - 108, 53);
  }
  noStroke();
  fill('#f9db82');
  circle(puck.x, puck.y, PUCK_RADIUS * 2);
  if (winner) {
    fill('#151822');
    rect(0, HEIGHT / 2 - 52, WIDTH, 104);
    textAlign(CENTER, CENTER);
    textSize(47);
    fill('white');
    text(winner.side + ' wins!', WIDTH / 2, HEIGHT / 2);
  }
}

function drawRink() {
  noFill();
  stroke('#a0b1ce');
  strokeWeight(3);
  line(WIDTH / 2, 2, WIDTH / 2, HEIGHT - 2);
  circle(WIDTH / 2, HEIGHT / 2, 140);
  line(0, 2, WIDTH, 2);
  line(0, HEIGHT - 2, WIDTH, HEIGHT - 2);
  for (const x of [2, WIDTH - 2]) {
    line(x, 2, x, HEIGHT / 2 - GOAL / 2);
    line(x, HEIGHT / 2 + GOAL / 2, x, HEIGHT - 2);
    strokeWeight(8);
    stroke(x === 2 ? '#5da2ff' : '#ff8d8d');
    line(x, HEIGHT / 2 - GOAL / 2, x, HEIGHT / 2 + GOAL / 2);
    strokeWeight(3);
    stroke('#a0b1ce');
  }
}

function movePaddle(player, index, up, left, down, right) {
  const oldX = player.x;
  const oldY = player.y;
  const active = [...pointers.values()].find(pointer => pointer.player === player);
  const target = active || (fingertips.length === 2 ? fingertips[index] : undefined);
  if (target) {
    player.x = lerp(player.x, target.x, 0.22);
    player.y = lerp(player.y, target.y, 0.22);
  } else {
    player.x += (Number(keys.has(right)) - Number(keys.has(left))) * 10;
    player.y += (Number(keys.has(down)) - Number(keys.has(up))) * 10;
  }
  player.x = constrain(player.x, index * WIDTH / 2 + PADDLE_RADIUS, (index + 1) * WIDTH / 2 - PADDLE_RADIUS);
  player.y = constrain(player.y, PADDLE_RADIUS, HEIGHT - PADDLE_RADIUS);
  player.vx = player.x - oldX;
  player.vy = player.y - oldY;
}

function movePuck() {
  puck.x += puck.vx;
  puck.y += puck.vy;
  puck.vx *= 0.996;
  puck.vy *= 0.996;

  for (const player of players) {
    const dx = puck.x - player.x;
    const dy = puck.y - player.y;
    const distance = Math.hypot(dx, dy);
    if (distance <= 0 || distance >= PADDLE_RADIUS + PUCK_RADIUS) continue;

    const nx = dx / distance;
    const ny = dy / distance;
    puck.x = player.x + nx * (PADDLE_RADIUS + PUCK_RADIUS);
    puck.y = player.y + ny * (PADDLE_RADIUS + PUCK_RADIUS);
    const approach = (puck.vx - player.vx) * nx + (puck.vy - player.vy) * ny;
    if (approach < 0) {
      puck.vx = constrain(puck.vx - approach * 1.8 * nx, -24, 24);
      puck.vy = constrain(puck.vy - approach * 1.8 * ny, -24, 24);
    }
  }

  if (puck.y <= PUCK_RADIUS || puck.y >= HEIGHT - PUCK_RADIUS) {
    puck.y = constrain(puck.y, PUCK_RADIUS, HEIGHT - PUCK_RADIUS);
    puck.vy *= -0.98;
  }
  if (puck.x <= PUCK_RADIUS || puck.x >= WIDTH - PUCK_RADIUS) {
    const inGoal = abs(puck.y - HEIGHT / 2) < GOAL / 2;
    if (inGoal) {
      const player = players[Number(puck.x < WIDTH / 2)];
      player.score++;
      if (player.score === 6) winner = player;
      status.textContent = winner ? winner.side + ' wins!' : player.side + ' scores!';
      resetPuck();
    } else {
      puck.x = constrain(puck.x, PUCK_RADIUS, WIDTH - PUCK_RADIUS);
      puck.vx *= -0.98;
    }
  }
}

function resetPuck() {
  Object.assign(puck, { x: WIDTH / 2, y: HEIGHT / 2, vx: 0, vy: 0 });
}

function loadTrackingLibrary() {
  if (window.ml5) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/ml5@1/dist/ml5.min.js';
    const timeout = setTimeout(() => {
      script.remove();
      reject(new Error('Tracking download timed out.'));
    }, 18000);
    script.onload = () => { clearTimeout(timeout); resolve(); };
    script.onerror = () => { clearTimeout(timeout); script.remove(); reject(new Error('Tracking download failed.')); };
    document.head.append(script);
  });
}

async function toggleCamera(event) {
  const button = event.currentTarget;
  if (video) {
    stopCamera();
    status.textContent = 'Camera off. Use keyboard or touch controls.';
    return;
  }
  button.disabled = true;
  status.textContent = 'Loading hand tracking…';
  try {
    if (!navigator.mediaDevices?.getUserMedia) throw new Error('Camera needs HTTPS.');
    await loadTrackingLibrary();
    handPose = await ml5.handPose({ maxHands: 2 });
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    video = document.createElement('video');
    video.playsInline = true;
    video.muted = true;
    video.srcObject = stream;
    await video.play();
    stream.getVideoTracks().forEach(track => track.addEventListener('ended', () => {
      stopCamera();
      status.textContent = 'Camera disconnected. Use keyboard or touch controls.';
    }));
    handPose.detectStart(video, results => {
      if (!video) return;
      fingertips = results.map(result => ({
        x: (1 - result.index_finger_tip.x / video.videoWidth) * WIDTH,
        y: result.index_finger_tip.y / video.videoHeight * HEIGHT,
      })).sort((left, right) => left.x - right.x);
    });
    button.setAttribute('aria-pressed', 'true');
    button.textContent = 'Turn camera off';
    status.textContent = 'Hold one index finger on each side of the rink.';
  } catch {
    stopCamera();
    status.textContent = 'Camera tracking is unavailable. Use the keyboard or touch.';
  } finally {
    button.disabled = false;
  }
}

function stopCamera() {
  handPose?.detectStop?.();
  if (video?.srcObject) {
    video.srcObject.getTracks().forEach(track => track.stop());
    video.srcObject = null;
  }
  video = undefined;
  fingertips = [];
  const button = document.getElementById('camera');
  button.setAttribute('aria-pressed', 'false');
  button.textContent = 'Camera';
}
