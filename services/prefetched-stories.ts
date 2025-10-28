
export const prefetchedStories = {
  "Surya, The Sun God": {
    story: `Behold the glorious face of the immortals, which arises in splendor (RV 1.115.1). This is Surya, the great eye of Mitra, of Varuna, and of Agni, who has filled the heavens, the earth, and the vast space between. He is the very soul, the Atma, of all that moves and all that stands still upon the earth (RV 1.115.1).

He ascends, the radiant ornament of the skies (RV 7.63.1), the all-beholding Sun. As he journeys, he measures our days, looking down upon all creatures that have been born (RV 1.50.4). Before his advance, the very stars, like thieves, retreat with their constellations into the night (RV 1.50.2).

He mounts his splendid chariot, drawn by his seven swift, gleaming mares (RV 7.63.4). This divine son of Aditi, Surya, advances upon his path, carried by his radiant horses, to behold all the worlds (RV 1.50.1). He is the all-seeing eye of the cosmos, the guardian who knows all beings, riding forth in his glory (RV 7.63.1).`,
    p5jsCode: `p.setup = () => {
  p.particles = [];
  // The 'chariot' is an emitter that moves across the sky
  p.chariotPos = p.createVector(0, p.height / 3);
  p.chariotSpeed = 1;
  p.colorMode(p.HSB, 360, 100, 100, 100);
  p.noStroke();
};

p.draw = () => {
  // Dark sky, but with a slight trail
  p.background(0, 0, 10, 15);

  // Move the chariot emitter
  p.chariotPos.x += p.chariotSpeed;
  if (p.chariotPos.x > p.width + 200) {
    p.chariotPos.x = -200;
    // Vary the height for the next pass
    p.chariotPos.y = (p.height / 2) * p.noise(p.frameCount * 0.01) + p.height / 4;
  }

  // Emit 7 'mares' (particle systems)
  for (let i = 0; i < 7; i++) {
    let speed = p.random(1, 3);
    let v = p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5));
    v.setMag(speed);
    
    // Add a new particle
    p.particles.push(new p.Particle(
      p.chariotPos.x + p.random(-20, 20),
      p.chariotPos.y + p.random(-20, 20),
      v
    ));
  }

  // Update and display particles
  for (let i = p.particles.length - 1; i >= 0; i--) {
    p.particles[i].update();
    p.particles[i].display();
    if (p.particles[i].isDead()) {
      p.particles.splice(i, 1);
    }
  }

  // The 'Sun' itself - a glowing orb at the chariot's position
  let glowSize = 100;
  for (let r = glowSize; r > 0; r -= 10) {
    p.fill(40, 90, 100, 2); // Faint, large glow
    p.ellipse(p.chariotPos.x, p.chariotPos.y, r * 2, r * 2);
  }
  p.fill(50, 100, 100, 80); // Core
  p.ellipse(p.chariotPos.x, p.chariotPos.y, 40, 40);
};

// Particle class
p.Particle = class {
  constructor(x, y, v) {
    this.pos = p.createVector(x, y);
    this.vel = v.copy();
    this.lifespan = 100; // Opacity
    this.hue = p.random(30, 60); // Oranges and yellows
    this.sat = p.random(80, 100);
    this.bright = 100;
    this.size = p.random(2, 6);
  }

  update() {
    this.pos.add(this.vel);
    this.lifespan -= 1.5;
    this.vel.mult(0.98); // Slow down
  }

  display() {
    p.fill(this.hue, this.sat, this.bright, this.lifespan);
    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }

  isDead() {
    return this.lifespan <= 0;
  }
};

p.windowResized = () => {
  // The canvas is managed by the host, but we can reset the chariot
  p.chariotPos = p.createVector(0, p.height / 3);
};`,
    citations: [
      "RV 1.115.1",
      "RV 7.63.1",
      "RV 1.50.4",
      "RV 1.50.2",
      "RV 7.63.4",
      "RV 1.50.1"
    ]
  }
}
