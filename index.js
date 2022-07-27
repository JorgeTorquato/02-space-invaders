const scoreEl = document.querySelector('#scoreEl');
console.log(scoreEl);
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
const spaceInvadersSound = new Audio('./Music/spaceinvaders1.mp3');
const gameOverSound = new Audio('./Music/gameOver.mp3');
const deathSound = new Audio('./Music/explosion.mp3');
const invaderKilledSound = new Audio('./Music/invaderkilled.mp3');
canvas.width = innerWidth;
canvas.height = innerHeight;

document.body.addEventListener('keydown', function () {
  spaceInvadersSound.play();
});

// Player Character
class Player {
  constructor() {
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.rotation = 0;
    this.opacity = 1;
    const image = new Image();
    image.src = './img/spaceship.png';
    image.onload = () => {
      const scale = 0.15;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: canvas.width / 2 - this.width / 2,
        y: canvas.height - this.height - 20,
      };
    };
  }

  draw() {
    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)
    if (this.image) {
      c.save();
      c.globalAlpha = this.opacity;
      c.translate(
        player.position.x + player.width / 2,
        player.position.y + player.height / 2
      );
      c.rotate(this.rotation);

      c.translate(
        -player.position.x - player.width / 2,
        -player.position.y - player.height / 2
      );

      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
      c.restore();
    }
  }

  update() {
    if (this.image) {
      this.draw();
      this.position.x += this.velocity.x;
    }
  }
}

// Player's Projectiles
class Projectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = 4;
  }
  draw() {
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = 'red';
    c.fill();
    c.closePath();
  }

  // movement
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
// Particles Class

class Particle {
  constructor({ position, velocity, radius, color, fades }) {
    this.position = position;
    this.velocity = velocity;
    this.radius = radius;
    this.color = color;
    this.opacity = 1;
    this.fades = fades;
  }
  draw() {
    c.save();
    c.globalAlpha = this.opacity;
    c.beginPath();
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    c.fillStyle = this.color;
    c.fill();
    c.closePath();
    c.restore();
  }

  // movement
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.fades) this.opacity -= 0.01;
  }
}
// Invader projectiles
class InvaderProjectile {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 3;
    this.height = 10;
  }
  draw() {
    c.fillStyle = 'yellow';
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  // movement
  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
  }
}
// Invader Character
class Invader {
  constructor({ position }) {
    this.velocity = {
      x: 0,
      y: 0,
    };

    const image = new Image();
    image.src = './img/invader.png';
    image.onload = () => {
      const scale = 1;
      this.image = image;
      this.width = image.width * scale;
      this.height = image.height * scale;
      this.position = {
        x: position.x,
        y: position.y,
      };
    };
  }

  draw() {
    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)
    if (this.image) {
      c.drawImage(
        this.image,
        this.position.x,
        this.position.y,
        this.width,
        this.height
      );
    }
  }

  update({ velocity }) {
    if (this.image) {
      this.draw();
      this.position.x += velocity.x;
      this.position.y += velocity.y;
    }
  }
  // Invaders shooting
  shoot(invaderProjectiles) {
    invaderProjectiles.push(
      new InvaderProjectile({
        position: {
          x: this.position.x + this.width / 2,
          y: this.position.y + this.height,
        },
        velocity: {
          x: 0,
          y: 5,
        },
      })
    );
  }
}

// Invaders Grid
class Grid {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
    };
    this.velocity = {
      x: 3,
      y: 0,
    };
    this.invaders = [];
    const columns = Math.floor(Math.random() * 10 + 5);
    const rows = Math.floor(Math.random() * 5 + 2);
    // Grid width
    this.width = columns * 30;
    for (let x = 0; x < columns; x++) {
      for (let y = 0; y < rows; y++) {
        this.invaders.push(
          new Invader({
            position: {
              x: x * 30,
              y: y * 30,
            },
          })
        );
      }
    }
  }

  // Making invaders bound on the right and left walls
  update() {
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.velocity.y = 0;
    if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
      this.velocity.x = -this.velocity.x;
      this.velocity.y = 30;
    }
  }
}
const player = new Player();
const projectiles = [];
const grids = [];
const invaderProjectiles = [];
const particles = [];
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  space: {
    pressed: false,
  },
};
player.draw();

let frames = 0;
let randomInterval = Math.floor(Math.random() * 500 + 500);
let game = {
  over: false,
  active: true,
};
let score = 0;
// Stars Background reusing the code for Particles
for (let i = 0; i < 100; i++) {
  particles.push(
    new Particle({
      position: {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
      },
      velocity: {
        x: 0,
        y: 0.3,
      },
      radius: Math.random() * 2,
      color: 'white',
    })
  );
}

// Explosion after Projectiles hit player/enemy, & particles creation
function createParticles({ object, color, fades }) {
  for (let i = 0; i < 15; i++) {
    particles.push(
      new Particle({
        position: {
          x: object.position.x + object.width / 2,
          y: object.position.y + object.height / 2,
        },
        velocity: {
          x: (Math.random() - 0.5) * 2,
          y: (Math.random() - 0.5) * 2,
        },
        radius: Math.random() * 3,
        color: color || '#BAA0DE',
        fades: true,
      })
    );
  }
}

// animation
function animate() {
  if (!game.active) return;

  requestAnimationFrame(animate);
  c.fillStyle = 'black';
  c.fillRect(0, 0, canvas.width, canvas.height);

  player.update();
  particles.forEach((particle, i) => {
    if (particle.position.y - particle.radius >= canvas.height) {
      particle.position.x = Math.random() * canvas.width;
      particle.position.y = -particle.radius;
    }
    if (particle.opacity <= 0) {
      setTimeout(() => {
        particles.splice(i, 1);
      }, 0);
    } else {
      particle.update();
    }
  });

  // Invaders Shooting Rendering
  invaderProjectiles.forEach((invaderProjectile, index) => {
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
      canvas.height
    ) {
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
      }, 0);
    } else invaderProjectile.update();
    // invaders' projectiles collision

    // Projectile hit player, particles explosion,
    if (
      invaderProjectile.position.y + invaderProjectile.height >=
        player.position.y &&
      invaderProjectile.position.x + invaderProjectile.width >=
        player.position.x &&
      invaderProjectile.position.x <= player.position.x + player.width
    ) {
      // GAME OVER
      setTimeout(() => {
        invaderProjectiles.splice(index, 1);
        player.opacity = 0;
        game.over = true;
      }, 0);

      setTimeout(() => {
        game.active = false;
        spaceInvadersSound.pause();
        gameOverSound.play();
      }, 2000);

      deathSound.play();
      createParticles({
        object: player,
        color: 'white',
        fades: true,
      });
    }
  });

  // Player's Projectiles animation
  projectiles.forEach((projectile, index) => {
    if (projectile.position.y + projectile.radius <= 0) {
      // setTimeout to prevent projectile flashing bug
      setTimeout(() => {
        projectiles.splice(index, 1);
      }, 0);
    } else {
      projectile.update();
    }
  });
  grids.forEach((grid, gridIndex) => {
    grid.update();

    // Spawning invaders' projectiles
    if (frames % 200 === 0 && grid.invaders.length > 0) {
      grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(
        invaderProjectiles
      );
    }

    grid.invaders.forEach((invader, i) => {
      invader.update({ velocity: grid.velocity });
      // Killing invaders

      projectiles.forEach((projectile, j) => {
        // Collision detection
        if (
          projectile.position.y - projectile.radius <=
            invader.position.y + invader.height &&
          // left and right side of the invader
          projectile.position.x + projectile.radius >= invader.position.x &&
          projectile.position.x - projectile.radius <=
            invader.position.x + invader.width &&
          // top of projectile and bottom of invader
          projectile.position.y + projectile.radius >= invader.position.y
        ) {
          setTimeout(() => {
            // finding the correct invader
            const invaderFound = grid.invaders.find((invader2) => {
              return invader2 === invader;
            });
            // finding the correct projectile
            const projectileFound = projectiles.find((projectile2) => {
              return projectile2 === projectile;
            });
            //  Removing the correct invader and projectile
            if (invaderFound && projectileFound) {
              score += 100;
              scoreEl.innerHTML = score;
              // dynamic score labels
              const scoreLabel = document.createElement('label');
              scoreLabel.innerHTML = 100;
              scoreLabel.style.position = 'absolute';
              scoreLabel.style.color = 'white';
              scoreLabel.style.top = invader.position.y + 'px';
              scoreLabel.style.left = invader.position.x + 'px';
              scoreLabel.style.userSelect = 'none';

              document.querySelector('#parentDiv').appendChild(scoreLabel);
              // Gsap
              gsap.to(scoreLabel, {
                opacity: 0,
                y: -30,
                duration: 0.75,
                onComplete: () => {
                  document.querySelector('#parentDiv').removeChild(scoreLabel);
                },
              });
              // Particles
              createParticles({
                object: invader,
                fades: true,
              });
              invaderKilledSound.play();
              grid.invaders.splice(i, 1);
              projectiles.splice(j, 1);
              // new grid width after eliminating an invader
              if (grid.invaders.length > 0) {
                const firstInvader = grid.invaders[0];
                const lastInvader = grid.invaders[grid.invaders.length - 1];
                grid.width =
                  lastInvader.position.x -
                  firstInvader.position.x +
                  lastInvader.width;
                grid.position.x = firstInvader.position.x;
              } else {
                // removing unnecessary data/garbage-collection
                grids.splice(gridIndex, 1);
              }
            }
          }, 0);
        }
      });
    });
  });
  if (keys.a.pressed && player.position.x >= 0) {
    player.velocity.x = -7;
    player.rotation = -0.15;
  } else if (
    keys.d.pressed &&
    player.position.x + player.width <= canvas.width
  ) {
    player.velocity.x = 7;
    player.rotation = 0.15;
  } else {
    player.velocity.x = 0;
    player.rotation = 0;
  }
  // spawning new grids of enemies
  if (frames % randomInterval === 0) {
    grids.push(new Grid());
    randomInterval = Math.floor(Math.random() * 500 + 500);
    frames = 0;
  }

  frames++;
}
animate();
addEventListener('keydown', ({ key }) => {
  if (game.over) return;
  switch (key) {
    case 'a':
      keys.a.pressed = true;
      break;
    case 'd':
      keys.d.pressed = true;
      break;
    case ' ':
      projectiles.push(
        new Projectile({
          position: {
            x: player.position.x + player.width / 2,
            y: player.position.y,
          },
          velocity: {
            x: 0,
            y: -10,
          },
        })
      );

      break;
  }
});
addEventListener('keyup', ({ key }) => {
  switch (key) {
    case 'a':
      keys.a.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
    case ' ':
      break;
  }
});
