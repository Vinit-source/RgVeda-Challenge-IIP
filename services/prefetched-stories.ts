
import type { CachedStory } from '../types';

// The structure is now { [topicTitle: string]: { [languageCode: string]: Omit<CachedStory, 'language'> } }
export const prefetchedStories: { [key: string]: { [key: string]: Omit<CachedStory, 'language'> } } = {
  "Surya, The Sun God": {
    "en-US": { // English version
      story: `Behold the glorious face of the immortals, which arises in splendor (RV 1.115.1). This is Surya, the great eye of Mitra, of Varuna, and of Agni, who has filled the heavens, the earth, and the vast space between. He is the very soul, the Atma, of all that moves and all that stands still upon the earth (RV 1.115.1).

He ascends, the radiant ornament of the skies (RV 7.63.1), the all-beholding Sun. As he journeys, he measures our days, looking down upon all creatures that have been born (RV 1.50.4). Before his advance, the very stars, like thieves, retreat with their constellations into the night (RV 1.50.2).

He mounts his splendid chariot, drawn by his seven swift, gleaming mares (RV 7.63.4). This divine son of Aditi, Surya, advances upon his path, carried by his radiant horses, to behold all the worlds (RV 1.50.1). He is the all-seeing eye of the cosmos, the guardian who knows all beings, riding forth in his glory (RV 7.63.1).`,
      //       p5jsCode: `p.setup = () => {
      //   p.particles = [];
      //   // The 'chariot' is an emitter that moves across the sky
      //   p.chariotPos = p.createVector(0, p.height / 3);
      //   p.chariotSpeed = 1;
      //   p.colorMode(p.HSB, 360, 100, 100, 100);
      //   p.noStroke();
      // };

      // p.draw = () => {
      //   // Dark sky, but with a slight trail
      //   p.background(0, 0, 10, 15);

      //   // Move the chariot emitter
      //   p.chariotPos.x += p.chariotSpeed;
      //   if (p.chariotPos.x > p.width + 200) {
      //     p.chariotPos.x = -200;
      //     // Vary the height for the next pass
      //     p.chariotPos.y = (p.height / 2) * p.noise(p.frameCount * 0.01) + p.height / 4;
      //   }

      //   // Emit 7 'mares' (particle systems)
      //   for (let i = 0; i < 7; i++) {
      //     let speed = p.random(1, 3);
      //     let v = p.createVector(p.random(-0.5, 0.5), p.random(-0.5, 0.5));
      //     v.setMag(speed);

      //     // Add a new particle
      //     p.particles.push(new p.Particle(
      //       p.chariotPos.x + p.random(-20, 20),
      //       p.chariotPos.y + p.random(-20, 20),
      //       v
      //     ));
      //   }

      //   // Update and display particles
      //   for (let i = p.particles.length - 1; i >= 0; i--) {
      //     p.particles[i].update();
      //     p.particles[i].display();
      //     if (p.particles[i].isDead()) {
      //       p.particles.splice(i, 1);
      //     }
      //   }

      //   // The 'Sun' itself - a glowing orb at the chariot's position
      //   let glowSize = 100;
      //   for (let r = glowSize; r > 0; r -= 10) {
      //     p.fill(40, 90, 100, 2); // Faint, large glow
      //     p.ellipse(p.chariotPos.x, p.chariotPos.y, r * 2, r * 2);
      //   }
      //   p.fill(50, 100, 100, 80); // Core
      //   p.ellipse(p.chariotPos.x, p.chariotPos.y, 40, 40);
      // };

      // // Particle class
      // p.Particle = class {
      //   constructor(x, y, v) {
      //     this.pos = p.createVector(x, y);
      //     this.vel = v.copy();
      //     this.lifespan = 100; // Opacity
      //     this.hue = p.random(30, 60); // Oranges and yellows
      //     this.sat = p.random(80, 100);
      //     this.bright = 100;
      //     this.size = p.random(2, 6);
      //   }

      //   update() {
      //     this.pos.add(this.vel);
      //     this.lifespan -= 1.5;
      //     this.vel.mult(0.98); // Slow down
      //   }

      //   display() {
      //     p.fill(this.hue, this.sat, this.bright, this.lifespan);
      //     p.ellipse(this.pos.x, this.pos.y, this.size, this.size);
      //   }

      //   isDead() {
      //     return this.lifespan <= 0;
      //   }
      // };

      // p.windowResized = () => {
      //   // The canvas is managed by the host, but we can reset the chariot
      //   p.chariotPos = p.createVector(0, p.height / 3);
      // };`,
      p5jsCode: `
        p.setup = () => {
        p.particles = [];
        p.sunPos = p.createVector(p.width / 2, p.height / 2);
        p.colorMode(p.HSB, 360, 100, 100, 100);
        p.noStroke();
      };

      p.draw = () => {
        p.background(230, 70, 15, 20);

        p.sunPos.x = p.width / 2;
        p.sunPos.y = p.height / 2;

        let glowSize = p.min(p.width, p.height) * 0.3;
        for (let r = glowSize; r > 0; r -= 15) {
          p.fill(50, 100, 100, 1.5);
          p.ellipse(p.sunPos.x, p.sunPos.y, r, r);
        }
        p.fill(50, 100, 100, 80);
        p.ellipse(p.sunPos.x, p.sunPos.y, 40, 40);

        let orbitRadius = p.min(p.width, p.height) * 0.2;
        if (orbitRadius < 50) orbitRadius = 50;

        for (let i = 0; i < 7; i++) {
          let angle = p.frameCount * 0.015 + (p.TWO_PI / 7) * i;
          let marePos = p.createVector(
            p.sunPos.x + p.cos(angle) * orbitRadius,
            p.sunPos.y + p.sin(angle) * orbitRadius
          );
          let hue = (20 + (i * 10)) % 50 + 10;

          p.fill(hue, 90, 100, 80);
          p.ellipse(marePos.x, marePos.y, 10, 10);

          for (let j = 0; j < 2; j++) {
            let trailAngle = angle + p.PI + p.random(-0.3, 0.3);
            let v = p5.Vector.fromAngle(trailAngle);
            v.mult(p.random(1, 3));
            
            p.particles.push(new p.Particle(
              marePos.x,
              marePos.y,
              v,
              hue
            ));
          }
        }

        for (let i = p.particles.length - 1; i >= 0; i--) {
          p.particles[i].update();
          p.particles[i].display();
          if (p.particles[i].isDead()) {
            p.particles.splice(i, 1);
          }
        }
      };

      p.Particle = class {
        constructor(x, y, v, hue) {
          this.pos = p.createVector(x, y);
          this.vel = v.copy();
          this.lifespan = 100;
          this.hue = hue + p.random(-5, 5);
          this.sat = p.random(70, 100);
          this.bright = 100;
          this.size = p.random(4, 8);
        }

        update() {
          this.pos.add(this.vel);
          this.lifespan -= 1.8;
          this.size *= 0.97;
          this.vel.mult(0.98);
        }

        display() {
          p.fill(this.hue, this.sat, this.bright, this.lifespan);
          p.ellipse(this.pos.x, this.pos.y, this.size, this.size);
        }

        isDead() {
          return this.lifespan <= 0 || this.size < 0.5;
        }
      };

      p.windowResized = () => {
        p.sunPos = p.createVector(p.width / 2, p.height / 2);
      };
            `,
      citations: [
        "RV 1.115.1",
        "RV 7.63.1",
        "RV 1.50.4",
        "RV 1.50.2",
        "RV 7.63.4",
        "RV 1.50.1"
      ],
      suggestions: [
        "Tell me more about the seven mares.",
        "What is the significance of Surya being the 'Atma'?",
        "Who is Aditi?",
        "Explain the relationship between Surya, Mitra, and Varuna."
      ]
    }
  },
  "Agni, The Fire God": {
  "en-US": {
    "story": "I praise Agni, who is placed at the very front, the chosen priest (`purohitaṁ`) of the sacrifice (RV 1.1.1). He is the divine minister, the invoker, and the one who bestows great treasure (RV 1.1.1). Worthy is he to be praised by the ancient seers, and by the new, for he shall bring the gods here to our offering (RV 1.1.2).\n\nWe choose Agni as our messenger (`dūtaṁ`), the all-knowing, the wise director of this rite (RV 1.12.1). For O Agni, whatever unhindered sacrifice you surround on every side, that offering alone travels to the gods (RV 1.1.4). He is the invoker, wise in thought, true and most brilliantly famed, a god who comes with the gods (RV 1.1.5).\n\nThrough Agni, one obtains wealth and nourishment that grows from day to day, bringing glory and heroic strength (RV 1.1.3). He is the guardian of the sacred law, the radiant one, growing in his own abode.",
    "p5jsCode": "p.setup = () => {\n  p.particles = [];\n  p.stars = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 100; i++) {\n    p.stars.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 3),\n      brightness: p.random(50, 90)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(45, 10, 100, 10);\n\n  for (const star of p.stars) {\n    p.fill(50, 10, star.brightness, p.sin(p.frameCount * 0.01 + star.x) * 10 + 20);\n    p.ellipse(star.x, star.y, star.size, star.size);\n  }\n\n  let center = p.createVector(p.width / 2, p.height / 2);\n  \n  let glowSize = p.min(p.width, p.height) * 0.15;\n  for (let r = glowSize; r > 0; r -= 10) {\n    p.fill(30, 100, 100, 1.5);\n    p.ellipse(center.x, center.y, r * 2, r * 2);\n  }\n  p.fill(35, 90, 100, 70);\n  p.ellipse(center.x, center.y, 20, 20);\n\n  for (let i = 0; i < 5; i++) {\n    p.particles.push(new p.Particle(center.x, center.y));\n  }\n\n  for (let i = p.particles.length - 1; i >= 0; i--) {\n    p.particles[i].update();\n    p.particles[i].display();\n    if (p.particles[i].isDead()) {\n      p.particles.splice(i, 1);\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y) {\n    this.pos = p.createVector(x, y);\n    let angle = p.random(-p.PI * 0.75, -p.PI * 0.25);\n    this.vel = p5.Vector.fromAngle(angle);\n    this.vel.mult(p.random(1, 3));\n    this.vel.add(p.createVector(0, -1)); \n    this.lifespan = 100;\n    this.hue = p.random(10, 50);\n    this.sat = p.random(80, 100);\n    this.size = p.random(5, 10);\n  }\n\n  update() {\n    this.pos.add(this.vel);\n    this.vel.y *= 0.99;\n    this.vel.x *= 0.99;\n    this.lifespan -= 0.8;\n    this.size *= 0.97;\n  }\n\n  display() {\n    p.fill(this.hue, this.sat, 100, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0 || this.pos.y < 0;\n  }\n};\n\np.windowResized = () => {\n  p.stars = [];\n  for (let i = 0; i < 100; i++) {\n    p.stars.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 3),\n      brightness: p.random(50, 90)\n    });\n  }\n};\n",
    "citations": [
      "RV 1.1.1",
      "RV 1.1.2",
      "RV 1.1.3",
      "RV 1.1.4",
      "RV 1.1.5",
      "RV 1.12.1"
    ],
    "suggestions": [
      "Why is Agni called a 'priest' (purohita)?",
      "What does it mean that the sacrifice 'travels to the gods'?",
      "Who are the 'seers of old and new'?",
      "Tell me more about Agni as a messenger."
    ]
  }
},
"Indra, King of Gods": {
  "en-US": {
    "story": "I shall proclaim the heroic deeds of Indra, the first ones which the wielder of the thunderbolt (`vajrī`) performed. He slew the serpent (`ahim`), then he released the waters; he split the bellies of the mountains (RV 1.32.1).\n\nHe slew the serpent who lay upon the mountain, for Tvashtar had fashioned for him the resounding, celestial thunderbolt (`vajraṁ svaryaṁ tatakṣa`). Like lowing cows (`vāśrā iva dhenavaḥ`) rushing forth, the flowing waters descended straight to the sea (RV 1.32.2).\n\nEager, like a bull, he chose the Soma; he drank the pressed draughts (RV 1.32.3). In the exhilaration of this Soma, he performs his mighty works. To him, the King, the singers sing their high song (RV 1.7.1); the priests, O Shatakratu (Indra of a hundred powers), have raised you up, as one raises a bamboo pole (RV 1.10.1).",
    "p5jsCode": "p.setup = () => {\n  p.particles = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 150; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 3.5),\n      brightness: p.random(60, 95)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(220, 5, 98, 10);\n\n  for (const light of p.lights) {\n    p.fill(210, 10, light.brightness, p.sin(p.frameCount * 0.02 + light.x) * 10 + 15);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  let center = p.createVector(p.width / 2, p.height / 2);\n  \n  let pulse = p.sin(p.frameCount * 0.05);\n  let coreSize = 30 + pulse * 5;\n  let glowSize = p.min(p.width, p.height) * 0.15 + pulse * 10;\n\n  for (let r = glowSize; r > 0; r -= 15) {\n    p.fill(60, 80, 100, 1.5); \n    p.ellipse(center.x, center.y, r, r);\n  }\n  p.fill(55, 90, 100, 80);\n  p.ellipse(center.x, center.y, coreSize, coreSize);\n\n  if (p.frameCount % 120 == 0) {\n    let strikeAngle = p.random(p.TWO_PI);\n    let particleCount = p.random(100, 200);\n    \n    for(let i = 0; i < particleCount; i++) {\n      p.particles.push(new p.Particle(center.x, center.y, strikeAngle));\n    }\n  }\n\n  for (let i = p.particles.length - 1; i >= 0; i--) {\n    p.particles[i].update();\n    p.particles[i].display();\n    if (p.particles[i].isDead()) {\n      p.particles[i].splice(i, 1);\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y, angle) {\n    this.pos = p.createVector(x, y);\n    let velAngle = angle + p.randomGaussian(0, 0.15);\n    this.vel = p5.Vector.fromAngle(velAngle);\n    this.vel.mult(p.random(3, 7));\n    this.lifespan = 100;\n    this.hue = p.random(190, 230);\n    this.sat = p.random(70, 100);\n    this.size = p.random(3, 8);\n  }\n\n  update() {\n    this.pos.add(this.vel);\n    this.vel.mult(0.96);\n    this.lifespan -= 1.0;\n    this.size *= 0.98;\n  }\n\n  display() {\n    p.fill(this.hue, this.sat, 90, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0 || this.size < 0.5;\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 150; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 3.5),\n      brightness: p.random(60, 95)\n    });\n  }\n};\n",
    "citations": [
      "RV 1.32.1",
      "RV 1.32.2",
      "RV 1.32.3",
      "RV 1.7.1",
      "RV 1.10.1"
    ],
    "suggestions": [
      "Tell me more about the serpent Ahi or Vritra.",
      "What is Soma and why does Indra drink it?",
      "Who is Tvashtar, who made the thunderbolt?",
      "What are the 'seven rivers' often mentioned with this story?"
    ]
  }
},
"Vayu, Lord of the Wind": {
  "en-US": {
    "story": "O Vayu, beautiful to behold, come! These Soma juices are prepared for you (RV 1.2.1). Come, O Vayu, on your shining chariot, the first to drink, the first to hear our call (RV 1.2.1, 1.134.1). Your chariot is drawn by a thousand horses (`sahasriṇā`), it touches the very sky, and it is as swift as thought (`manojavaḥ`) (RV 8.46.27). You are the breath of the gods, the wind that travels, and we call you to the feast (RV 1.134.1).",
    "p5jsCode": "p.setup = () => {\n  p.particles = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 150; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(0.5, 2),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(200, 10, 99, 10);\n\n  for (const light of p.lights) {\n    p.fill(210, 5, light.brightness, p.sin(p.frameCount * 0.03 + light.x) * 5 + 10);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  let center = p.createVector(p.width / 2, p.height / 2);\n  \n  let pulse = p.abs(p.sin(p.frameCount * 0.04)) * 15;\n  let coreSize = 25 + pulse;\n\n  p.fill(220, 50, 100, 40);\n  p.ellipse(center.x, center.y, coreSize, coreSize);\n\n  for (let i = 0; i < 10; i++) {\n    p.particles.push(new p.Particle(center.x, center.y));\n  }\n\n  for (let i = p.particles.length - 1; i >= 0; i--) {\n    p.particles[i].update();\n    p.particles[i].display();\n    if (p.particles[i].isDead()) {\n      p.particles.splice(i, 1);\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y) {\n    this.pos = p.createVector(x, y);\n    let angle = p.random(p.TWO_PI);\n    this.vel = p5.Vector.fromAngle(angle);\n    this.vel.mult(p.random(2, 6));\n    this.lifespan = 100;\n    this.hue = p.random(190, 230);\n    this.sat = p.random(10, 40);\n    this.size = p.random(2, 5);\n  }\n\n  update() {\n    this.pos.add(this.vel);\n    this.vel.mult(0.97);\n    this.lifespan -= 1.5;\n    this.size *= 0.99;\n  }\n\n  display() {\n    p.fill(this.hue, this.sat, 100, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0 || this.size < 0.2;\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 150; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(0.5, 2),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n",
    "citations": [
      "RV 1.2.1",
      "RV 1.134.1",
      "RV 8.46.27"
    ],
    "suggestions": [
      "Why is Vayu the first to drink the Soma?",
      "Tell me more about his 'swift as thought' chariot.",
      "What is Vayu's relationship with Indra?",
      "Is Vayu the same as the Maruts?"
    ]
  }
}, 
"Varuna, Cosmic Law Keeper": {
  "en-US": {
    "story": "He is the mighty King (`rājā`), Varuna, the sovereign who upholds the fixed laws of the cosmos (RV 1.25.10). The wise one, he sits in his abode, robed in the waters, for universal sovereignty (RV 1.25.11). He knows the path of the birds that fly through the air, and he knows every ship that sails upon the sea (RV 1.25.7). \n\nWith his wisdom, he supports the worlds (RV 7.86.1). The stars that shine in the night sky are his watchful eyes, his spies (`spaśaḥ`), and the wind that blows is his very breath. O great Varuna, we ask you, loosen the bonds of our sins; be merciful to us, O god (RV 1.25.1).",
    "p5jsCode": "p.setup = () => {\n  p.stars = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 200; i++) {\n    p.stars.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(0.5, 2.5),\n      brightness: p.random(70, 100)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(240, 30, 98, 10);\n\n  for (const star of p.stars) {\n    p.fill(250, 10, star.brightness, p.sin(p.frameCount * 0.01 + star.x) * 10 + 15);\n    p.ellipse(star.x, star.y, star.size, star.size);\n  }\n\n  let center = p.createVector(p.width / 2, p.height / 2);\n  \n  let eyeSize = p.min(p.width, p.height) * 0.2;\n  let pupilSize = eyeSize * 0.4 * (p.cos(p.frameCount * 0.02) * 0.1 + 0.9);\n\n  for (let r = eyeSize; r > 0; r -= 10) {\n    p.fill(230, 80, 100, 1);\n    p.ellipse(center.x, center.y, r, r * 0.7);\n  }\n  \n  p.fill(230, 80, 100, 80);\n  p.ellipse(center.x, center.y, eyeSize * 0.9, eyeSize * 0.6);\n\n  p.fill(230, 90, 100, 90);\n  p.ellipse(center.x, center.y, pupilSize, pupilSize * 0.9);\n};\n\np.windowResized = () => {\n  p.stars = [];\n  for (let i = 0; i < 200; i++) {\n    p.stars.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(0.5, 2.5),\n      brightness: p.random(70, 100)\n    });\n  }\n};\n",
    "citations": [
      "RV 1.25.10",
      "RV 1.25.11",
      "RV 1.25.7",
      "RV 7.86.1",
      "RV 1.25.1"
    ],
    "suggestions": [
      "What is 'Rta' (cosmic law)?",
      "Tell me more about Varuna's 'spies'.",
      "Why is Varuna associated with sin and mercy?",
      "What is the relationship between Varuna and Mitra?"
    ]
  }
}, 
"The Maruts, Storm Deities": {
  "en-US": {
    "story": "I sing a high song for the mighty, moving host, the assembly of the Maruts (RV 1.64.1). They are the brilliant sons of Rudra (`rudrasya...sūnavaḥ`), born from the heavens (RV 1.64.2). They are a playful, terrible host, robed in rain (RV 1.37.1). When they travel on their golden chariots, they make the mountains shake and the earth tremble (RV 1.38.1). They are the singers of the storm, thundering across the world, wielding lightning as their spears (RV 1.64.2).",
    "p5jsCode": "p.setup = () => {\n  p.maruts = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 3),\n      brightness: p.random(70, 95)\n    });\n  }\n  \n  let center = p.createVector(p.width / 2, p.height / 2);\n  for(let i = 0; i < 49; i++) {\n    p.maruts.push(new p.Marut(center.x, center.y, i));\n  }\n};\n\np.draw = () => {\n  p.background(50, 5, 99, 10);\n\n  for (const light of p.lights) {\n    p.fill(60, 10, light.brightness, p.sin(p.frameCount * 0.02 + light.y) * 10 + 10);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  let center = p.createVector(p.width / 2, p.height / 2);\n\n  for (let i = p.maruts.length - 1; i >= 0; i--) {\n    p.maruts[i].update(center);\n    p.maruts[i].display();\n  }\n};\n\np.Marut = class {\n  constructor(x, y, index) {\n    this.pos = p.createVector(x + p.random(-50, 50), y + p.random(-50, 50));\n    this.vel = p5.Vector.random2D().mult(p.random(1, 3));\n    this.lifespan = 255;\n    this.hue = p.random(25, 55);\n    this.index = index;\n    this.size = p.random(3, 8);\n  }\n\n  update(center) {\n    let noiseAngle = p.noise(this.pos.x * 0.01, this.pos.y * 0.01, p.frameCount * 0.01) * p.TWO_PI * 4;\n    let noiseVec = p5.Vector.fromAngle(noiseAngle);\n    noiseVec.setMag(0.3);\n    this.vel.add(noiseVec);\n\n    let dirToCenter = p5.Vector.sub(center, this.pos);\n    dirToCenter.setMag(0.05);\n    this.vel.add(dirToCenter);\n    \n    this.vel.limit(4);\n    this.pos.add(this.vel);\n  }\n\n  display() {\n    p.fill(this.hue, 90, 100, 60);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 3),\n      brightness: p.random(70, 95)\n    });\n  }\n  \n  p.maruts = [];\n  let center = p.createVector(p.width / 2, p.height / 2);\n  for(let i = 0; i < 49; i++) {\n    p.maruts.push(new p.Marut(center.x, center.y, i));\n  }\n};\n",
    "citations": [
      "RV 1.64.1",
      "RV 1.64.2",
      "RV 1.37.1",
      "RV 1.38.1"
    ],
    "suggestions": [
      "Who is Rudra, the father of the Maruts?",
      "Why are the Maruts associated with Indra?",
      "What do the 'spotted deer' that pull their chariots represent?",
      "How many Maruts are there?"
    ]
  }
}, 
"Soma, Plant of Immortality": {
  "en-US": {
    "story": "Flow on, O Soma, in your sweetest, most exhilarating stream, pressed for Indra to drink (RV 9.1.1). You are the sage, the poet, pressed by the stones, you open the path for our hymns (RV 9.1.2). This divine one, purifying himself, is sent forth to the feast of the gods (RV 9.7.1).\n\nO purifying Soma, you are the King (`rājā`) and lord of all, the Vritra-slayer, the chief of our rite (RV 1.91.1). Bring to us strength (RV 1.91.2). We have drunk the Soma, we have become immortal (`apāma somamamṛtā abhūma`); we have attained the light, we have found the gods (RV 8.48.3).",
    "p5jsCode": "p.setup = () => {\n  p.particles = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 150; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 2.5),\n      brightness: p.random(70, 100)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(90, 15, 99, 10);\n\n  for (const light of p.lights) {\n    p.fill(80, 5, light.brightness, p.sin(p.frameCount * 0.01 + light.y) * 5 + 10);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  let center = p.createVector(p.width / 2, p.height / 2);\n  \n  let pulse = p.sin(p.frameCount * 0.03);\n  let coreSize = 35 + pulse * 7;\n  let glowSize = p.min(p.width, p.height) * 0.2 + pulse * 10;\n\n  for (let r = glowSize; r > 0; r -= 12) {\n    p.fill(110, 70, 100, 1.5);\n    p.ellipse(center.x, center.y, r, r);\n  }\n  p.fill(100, 80, 100, 85);\n  p.ellipse(center.x, center.y, coreSize, coreSize);\n\n  for (let i = 0; i < 4; i++) {\n    p.particles.push(new p.Particle(center.x, center.y));\n  }\n\n  for (let i = p.particles.length - 1; i >= 0; i--) {\n    p.particles[i].update();\n    p.particles[i].display();\n    if (p.particles[i].isDead()) {\n      p.particles.splice(i, 1);\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y) {\n    this.pos = p.createVector(x, y);\n    let angle = p.random(p.TWO_PI);\n    this.vel = p5.Vector.fromAngle(angle);\n    this.vel.mult(p.random(0.5, 2.5));\n    this.lifespan = 100;\n    this.hue = p.random(70, 100);\n    this.sat = p.random(60, 90);\n    this.size = p.random(4, 8);\n  }\n\n  update() {\n    this.pos.add(this.vel);\n    this.vel.mult(1.005);\n    this.lifespan -= 0.5;\n    this.size *= 0.98;\n  }\n\n  display() {\n    p.fill(this.hue, this.sat, 100, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0 || \n           this.pos.x < -10 || this.pos.x > p.width + 10 ||\n           this.pos.y < -10 || this.pos.y > p.height + 10;\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 150; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 2.5),\n      brightness: p.random(70, 100)\n    });\n  }\n};\n",
    "citations": [
      "RV 9.1.1",
      "RV 9.1.2",
      "RV 9.7.1",
      "RV 1.91.1",
      "RV 1.91.2",
      "RV 8.48.3"
    ],
    "suggestions": [
      "What does 'becoming immortal' mean in this context?",
      "How was the Soma plant pressed?",
      "Why is Soma offered to Indra?",
      "Tell me more about Soma as a 'poet' and 'sage'."
    ]
  }
}, 
"Sarasvati, Goddess of Wisdom": {
  "en-US": {
    "story": "She is the purifier (`pāvakā naḥ`), Sarasvatī, the river of inspiration (RV 1.3.12). She awakens every pious thought and understanding (`dhiyo viśvā vi rājati`) (RV 1.3.11). She is a great flood (`maho arṇaḥ`), flowing from the mountains onward to the sea (RV 7.95.2). O Sarasvatī, you are the bestower of food, the fierce one, and we call upon you to protect us (RV 6.61.1). You, who are divine, accept our hymn (RV 1.3.10).",
    "p5jsCode": "p.setup = () => {\n  p.particles = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 2.5),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(190, 10, 99, 10);\n\n  for (const light of p.lights) {\n    p.fill(180, 5, light.brightness, p.sin(p.frameCount * 0.01 + light.x) * 5 + 10);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  let riverCenter = p.width / 2;\n\n  for (let i = 0; i < 8; i++) {\n    p.particles.push(new p.Particle(riverCenter + p.random(-30, 30), 0));\n  }\n\n  for (let i = p.particles.length - 1; i >= 0; i--) {\n    p.particles[i].update();\n    p.particles[i].display();\n    if (p.particles[i].isDead()) {\n      p.particles.splice(i, 1);\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y) {\n    this.pos = p.createVector(x, y);\n    this.vel = p.createVector(p.random(-0.5, 0.5), p.random(2, 5));\n    this.lifespan = 100;\n    this.hue = p.random(180, 210);\n    this.sat = p.random(50, 80);\n    this.size = p.random(3, 7);\n  }\n\n  update() {\n    this.pos.add(this.vel);\n    this.vel.x += p.random(-0.1, 0.1);\n    this.lifespan -= 0.8;\n    this.size *= 0.98;\n  }\n\n  display() {\n    p.fill(this.hue, this.sat, 100, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0 || this.pos.y > p.height;\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 2.5),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n",
    "citations": [
      "RV 1.3.10",
      "RV 1.3.11",
      "RV 1.3.12",
      "RV 6.61.1",
      "RV 7.95.2"
    ],
    "suggestions": [
      "What does 'purifier' (pāvakā) mean in this context?",
      "Why is Saraswati described as a 'great flood' (maho arṇaḥ)?",
      "How is a river also the goddess of speech and inspiration?",
      "What mountains are being referred to?"
    ]
  }
}, 
"Rudra, The Fierce God": {
  "en-US": {
    "story": "We bow to the mighty Rudra, the father of the Maruts, the one with braided hair (`kapardine`) (RV 1.114.1, 2.33.2). He is the fierce one (`tavase`), the ruler of this world (RV 2.33.2). We ask, O Rudra, for your mercy; do not, in your anger, harm our children or our people (RV 1.114.8). For in your hand you hold the best healing remedies (`jalāṣabheṣajam`) (RV 1.43.4). O wielder of the thunderbolt (`vajrabāho`), we call to you (RV 2.33.9).",
    "p5jsCode": "p.setup = () => {\n  p.particles = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 3),\n      brightness: p.random(70, 95)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(60, 5, 99, 10);\n\n  for (const light of p.lights) {\n    p.fill(70, 5, light.brightness, p.sin(p.frameCount * 0.01 + light.y) * 5 + 10);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  let center = p.createVector(p.width / 2, p.height / 2);\n  let coreSize = 25 + p.sin(p.frameCount * 0.02) * 5;\n  \n  p.fill(40, 80, 100, 60);\n  p.ellipse(center.x, center.y, coreSize, coreSize);\n\n  if (p.frameCount % 200 < 100) {\n    for (let i = 0; i < 2; i++) {\n      p.particles.push(new p.Particle(center.x, center.y, 'heal'));\n    }\n  } else {\n    if (p.frameCount % 10 == 0) {\n      for (let i = 0; i < 15; i++) {\n        p.particles.push(new p.Particle(center.x, center.y, 'storm'));\n      }\n    }\n  }\n\n  for (let i = p.particles.length - 1; i >= 0; i--) {\n    p.particles[i].update();\n    p.particles[i].display();\n    if (p.particles[i].isDead()) {\n      p.particles.splice(i, 1);\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y, type) {\n    this.pos = p.createVector(x, y);\n    this.type = type;\n    this.lifespan = 100;\n    \n    if (this.type === 'heal') {\n      let angle = p.random(p.TWO_PI);\n      this.vel = p5.Vector.fromAngle(angle).mult(p.random(0.5, 1.5));\n      this.hue = p.random(100, 140);\n      this.sat = p.random(50, 80);\n      this.size = p.random(4, 8);\n    } else {\n      let angle = p.random(p.TWO_PI);\n      this.vel = p5.Vector.fromAngle(angle).mult(p.random(3, 7));\n      this.hue = p.random(0, 30);\n      this.sat = p.random(80, 100);\n      this.size = p.random(2, 5);\n    }\n  }\n\n  update() {\n    this.pos.add(this.vel);\n    if (this.type === 'heal') {\n      this.vel.mult(0.98);\n      this.lifespan -= 0.5;\n    } else {\n      this.vel.mult(0.95);\n      this.lifespan -= 1.5;\n    }\n  }\n\n  display() {\n    p.fill(this.hue, this.sat, 100, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0;\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 3),\n      brightness: p.random(70, 95)\n    });\n  }\n};\n",
    "citations": [
      "RV 1.43.4",
      "RV 1.114.1",
      "RV 1.114.8",
      "RV 2.33.2",
      "RV 2.33.9"
    ],
    "suggestions": [
      "Why is Rudra called 'fierce'?",
      "What are the 'healing remedies' he possesses?",
      "Who are the Maruts, his sons?",
      "What does 'with braided hair' (kapardine) mean?"
    ]
  }
},
"Ashvins, Divine Twin Horsemen": {
  "en-US": {
    "story": "O Ashvins, come on your golden, three-wheeled chariot (`tricakraḥ`) (RV 1.34.2)! It is swift as thought (`manojavaḥ`), yoked with your horses (RV 1.34.1). You are the wonder-workers (`dasrā`), the physicians (`bhiṣajā`), the lords of healing (RV 1.46.2). O runners of the sky, abundant in wealth, we call you to our offering, to drink the sweet juice (RV 1.3.1, 1.3.2).",
    "p5jsCode": "p.setup = () => {\n  p.particles = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 2.5),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(30, 20, 99, 10);\n\n  for (const light of p.lights) {\n    p.fill(40, 10, light.brightness, p.sin(p.frameCount * 0.01 + light.x) * 5 + 10);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  let center = p.createVector(p.width / 2, p.height / 2);\n  let angle = p.frameCount * 0.02;\n  let orbitRadius = p.min(p.width, p.height) * 0.1;\n  if (orbitRadius < 20) orbitRadius = 20;\n\n  let pos1 = p.createVector(center.x + p.cos(angle) * orbitRadius, center.y + p.sin(angle) * orbitRadius);\n  let pos2 = p.createVector(center.x + p.cos(angle + p.PI) * orbitRadius, center.y + p.sin(angle + p.PI) * orbitRadius);\n\n  p.fill(45, 80, 100, 90);\n  p.ellipse(pos1.x, pos1.y, 15, 15);\n  p.fill(55, 80, 100, 90);\n  p.ellipse(pos2.x, pos2.y, 15, 15);\n\n  p.particles.push(new p.Particle(pos1.x, pos1.y, p.createVector(0,0).sub(p5.Vector.fromAngle(angle))));\n  p.particles.push(new p.Particle(pos2.x, pos2.y, p.createVector(0,0).sub(p5.Vector.fromAngle(angle + p.PI))));\n\n  for (let i = p.particles.length - 1; i >= 0; i--) {\n    p.particles[i].update();\n    p.particles[i].display();\n    if (p.particles[i].isDead()) {\n      p.particles.splice(i, 1);\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y, v) {\n    this.pos = p.createVector(x, y);\n    this.vel = v.setMag(p.random(0.5, 1.5));\n    this.lifespan = 100;\n    this.hue = p.random(40, 60);\n    this.sat = p.random(60, 90);\n    this.size = p.random(3, 6);\n  }\n\n  update() {\n    this.pos.add(this.vel);\n    this.lifespan -= 1.5;\n    this.size *= 0.97;\n  }\n\n  display() {\n    p.fill(this.hue, this.sat, 100, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0;\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 2.5),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n",
    "citations": [
      "RV 1.3.1",
      "RV 1.3.2",
      "RV 1.34.1",
      "RV 1.34.2",
      "RV 1.46.2"
    ],
    "suggestions": [
      "Why is their chariot 'three-wheeled'?",
      "What kind of healing do the Ashvins perform?",
      "What do the 'wonder-workers' (Dasra) do?",
      "When do the Ashvins appear?"
    ]
  }
},
"Usha, Goddess of Dawn": {
  "en-US": {
    "story": "Behold! The shining goddess, Ushas, has made her appearance (RV 1.92.1). She is the daughter of heaven (`divo duhitā`), born again and again (`punaḥ punaḥ jāyamānā`), ancient, yet ever-young (RV 1.48.1, 1.113.16). She spreads her radiant light (`jyotir yacchanti`), opening the gates of the sky (RV 1.92.5, 1.92.1). She awakens all life, every being that moves (`viśvaṁ jīvaṁ carase bodhayantī`), and makes the paths easy to travel (RV 1.92.4).",
    "p5jsCode": "p.setup = () => {\n  p.particles = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height / 2, p.height),\n      size: p.random(0.5, 2),\n      brightness: p.random(60, 90)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(20, 25, 99, 10);\n\n  for (const light of p.lights) {\n    p.fill(30, 10, light.brightness, p.sin(p.frameCount * 0.01 + light.x) * 5 + 10);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  let horizon = p.height * 0.55;\n\n  for (let i = 0; i < 10; i++) {\n    p.particles.push(new p.Particle(p.random(p.width), horizon));\n  }\n\n  for (let i = p.particles.length - 1; i >= 0; i--) {\n    p.particles[i].update();\n    p.particles[i].display();\n    if (p.particles[i].isDead()) {\n      p.particles.splice(i, 1);\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y) {\n    this.pos = p.createVector(x, y);\n    this.vel = p.createVector(p.random(-0.5, 0.5), p.random(-0.5, -2.5));\n    this.lifespan = 100;\n    this.hue = p.random(10, 50);\n    this.sat = p.random(60, 100);\n    this.size = p.random(4, 10);\n  }\n\n  update() {\n    this.pos.add(this.vel);\n    this.vel.mult(0.99);\n    this.lifespan -= 0.8;\n    this.size *= 0.98;\n  }\n\n  display() {\n    p.fill(this.hue, this.sat, 100, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0 || this.pos.y < 0;\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height / 2, p.height),\n      size: p.random(0.5, 2),\n      brightness: p.random(60, 90)\n    });\n  }\n};\n",
    "citations": [
      "RV 1.48.1",
      "RV 1.92.1",
      "RV 1.92.4",
      "RV 1.92.5",
      "RV 1.113.16"
    ],
    "suggestions": [
      "Who is the 'daughter of heaven'?",
      "Why is she described as 'born again and again'?",
      "What is her relationship to Surya (the Sun)?",
      "What 'gates' does she open?"
    ]
  }
},
"Madhuchhandas Vaishvamitra": {
  "en-US": {
    "story": "The son of Vishvamitra, the sage Madhuchhandas, is the one who sings the first hymns (`sūktāni`) of the sacred Rigveda. His voice is the first to be heard, and he first calls upon Agni. 'I praise Agni,' he sings, 'who is placed at the very front (`purohitaṁ`), the chosen priest of the sacrifice, the invoker, who bestows great treasure' (RV 1.1.1). Having praised the Fire, his song then turns to mighty Indra: 'Sing to Indra, O singers, the King (`rājā`) of all, the chief of the sacrifice, the mighty one who drinks the Soma' (RV 1.7.1).",
    "p5jsCode": "p.setup = () => {\n  p.particles = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 2.5),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(30, 5, 99, 10);\n\n  for (const light of p.lights) {\n    p.fill(40, 5, light.brightness, p.sin(p.frameCount * 0.01 + light.x) * 5 + 10);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  let center = p.createVector(p.width / 2, p.height / 2);\n  let pulse = p.sin(p.frameCount * 0.02) * 5;\n  p.fill(50, 80, 100, 70 + pulse * 2);\n  p.ellipse(center.x, center.y, 30 + pulse, 30 + pulse);\n\n  let hue = p.frameCount % 120 < 60 ? p.random(10, 40) : p.random(190, 220);\n\n  for (let i = 0; i < 3; i++) {\n    p.particles.push(new p.Particle(center.x, center.y, hue));\n  }\n\n  for (let i = p.particles.length - 1; i >= 0; i--) {\n    p.particles[i].update();\n    p.particles[i].display();\n    if (p.particles[i].isDead()) {\n      p.particles.splice(i, 1);\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y, hue) {\n    this.pos = p.createVector(x, y);\n    let angle = p.random(p.TWO_PI);\n    this.vel = p5.Vector.fromAngle(angle);\n    this.vel.mult(p.random(1, 3));\n    this.lifespan = 100;\n    this.hue = hue + p.random(-5, 5);\n    this.sat = p.random(70, 90);\n    this.size = p.random(2, 6);\n  }\n\n  update() {\n    this.pos.add(this.vel);\n    this.vel.mult(0.98);\n    this.lifespan -= 1.2;\n  }\n\n  display() {\n    p.fill(this.hue, this.sat, 100, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0;\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 2.5),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n",
    "citations": [
      "RV 1.1.1",
      "RV 1.7.1"
    ],
    "suggestions": [
      "Why is Agni praised first in the Rigveda?",
      "Who was Vishvamitra, Madhuchhandas's father?",
      "What does 'purohita' (placed at the front) mean?",
      "Tell me more about the relationship between Indra and Soma."
    ]
  }
}, 
"Vishvamitra": {
  "en-US": {
    "story": "He is the great sage, the son of Kuśika, the Rishi of the third Mandala. It is Vishvamitra who gave to all people the most sacred hymn, the Gāyatrī. He sang, 'We meditate upon the supreme, adorable light of the divine Savitṛ (`tat savitur vareṇyaṁ bhargo devasya dhīmahi`). May he impel our thoughts (`dhiyo yo naḥ pracodayāt`)' (RV 3.62.10). Through his vision, he brought forth this prayer for divine guidance and inspiration, a light for all generations.",
    "p5jsCode": "p.setup = () => {\n  p.particles = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 150; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 3),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(50, 10, 99, 10);\n\n  for (const light of p.lights) {\n    p.fill(55, 5, light.brightness, p.sin(p.frameCount * 0.01 + light.x) * 5 + 10);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  let center = p.createVector(p.width / 2, p.height / 2);\n  let pulse = p.sin(p.frameCount * 0.03) * 8;\n  p.fill(50, 90, 100, 80 + pulse);\n  p.ellipse(center.x, center.y, 35 + pulse, 35 + pulse);\n\n  for (let i = 0; i < 4; i++) {\n    p.particles.push(new p.Particle(center.x, center.y));\n  }\n\n  for (let i = p.particles.length - 1; i >= 0; i--) {\n    p.particles[i].update();\n    p.particles[i].display();\n    if (p.particles[i].isDead()) {\n      p.particles.splice(i, 1);\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y) {\n    this.pos = p.createVector(x, y);\n    let angle = p.random(-p.PI * 0.6, -p.PI * 0.4);\n    this.vel = p5.Vector.fromAngle(angle);\n    this.vel.mult(p.random(1, 4));\n    this.lifespan = 100;\n    this.hue = p.random(45, 60);\n    this.sat = p.random(70, 100);\n    this.size = p.random(3, 7);\n  }\n\n  update() {\n    this.pos.add(this.vel);\n    this.vel.mult(0.98);\n    this.lifespan -= 1;\n  }\n\n  display() {\n    p.fill(this.hue, this.sat, 100, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0 || this.pos.y < 0;\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 150; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 3),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n",
    "citations": [
      "RV 3.62.10"
    ],
    "suggestions": [
      "What is the Gāyatrī mantra?",
      "Who is Savitṛ?",
      "What does 'impel our thoughts' (pracodayāt) mean?",
      "Tell me the story of Vishvamitra becoming a Brahmarshi."
    ]
  }
}, 
"Vasistha": {
  "en-US": {
    "story": "Vasistha, the wise Brahmarshi, is the seer of the seventh Mandala. His hymns flow with deep wisdom, especially those to Varuna, the keeper of cosmic law (`ṛta`). In his profound song, Vasistha seeks the sovereign, saying, 'O Varuna, I ask, declare to me my sin (`enam`). I come seeking knowledge' (RV 7.86.2). He sings of Varuna's greatness, 'He supports the worlds (`dadhāra...viśvā bhuvanāni`)', and he longs for his mercy (RV 7.86.1, 7.86.2).",
    "p5jsCode": "p.setup = () => {\n  p.particles = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 150; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(0.5, 2),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(220, 15, 99, 10);\n\n  for (const light of p.lights) {\n    p.fill(230, 10, light.brightness, p.sin(p.frameCount * 0.01 + light.x) * 5 + 10);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  let center = p.createVector(p.width / 2, p.height / 2);\n  let pulse = p.sin(p.frameCount * 0.015) * 6;\n  p.fill(240, 80, 100, 75 + pulse);\n  p.ellipse(center.x, center.y, 30 + pulse, 30 + pulse);\n\n  for (let i = 0; i < 3; i++) {\n    p.particles.push(new p.Particle(center.x, center.y));\n  }\n\n  for (let i = p.particles.length - 1; i >= 0; i--) {\n    p.particles[i].update();\n    p.particles[i].display();\n    if (p.particles[i].isDead()) {\n      p.particles.splice(i, 1);\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y) {\n    this.pos = p.createVector(x, y);\n    let angle = p.random(p.TWO_PI);\n    this.vel = p5.Vector.fromAngle(angle);\n    this.vel.mult(p.random(0.5, 2));\n    this.lifespan = 100;\n    this.hue = p.random(210, 240);\n    this.sat = p.random(60, 90);\n    this.size = p.random(3, 7);\n  }\n\n  update() {\n    this.pos.add(this.vel);\n    let angle = p.noise(this.pos.x * 0.01, this.pos.y * 0.01) * p.TWO_PI;\n    this.vel.add(p5.Vector.fromAngle(angle).setMag(0.05));\n    this.vel.limit(2);\n    this.lifespan -= 0.8;\n  }\n\n  display() {\n    p.fill(this.hue, this.sat, 100, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0;\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 150; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(0.5, 2),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n",
    "citations": [
      "RV 7.86.1",
      "RV 7.86.2"
    ],
    "suggestions": [
      "What is the cosmic law (Rta) that Varuna upholds?",
      "Why does Vasistha ask Varuna about his sin?",
      "Tell me about the rivalry between Vasistha and Vishvamitra.",
      "What other gods does Vasistha praise in Mandala 7?"
    ]
  }
}, 
"Gautam": {
  "en-US": {
    "story": "The sage Gautama (Gotama), of the family of Rāhūgaṇa, is a seer from the first Mandala. His hymns are raised to the gods, especially to Agni. He sings, 'O Agni, we, with our praise, seek you, the immortal, who are like a friend (`mitramiva`), the swift messenger of the gods, the one who knows all generations' (RV 1.74.1). He also sings to the Maruts, the shining storm gods, asking for their protection and strength (RV 1.85.1).",
    "p5jsCode": "p.setup = () => {\n  p.particles = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 2.5),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(70, 10, 99, 10);\n\n  for (const light of p.lights) {\n    p.fill(80, 5, light.brightness, p.sin(p.frameCount * 0.01 + light.x) * 5 + 10);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  let center = p.createVector(p.width / 2, p.height / 2);\n  let pulse = p.sin(p.frameCount * 0.02) * 4;\n  p.fill(60, 80, 100, 70 + pulse);\n  p.ellipse(center.x, center.y, 28 + pulse, 28 + pulse);\n\n  for (let i = 0; i < 3; i++) {\n    p.particles.push(new p.Particle(center.x, center.y));\n  }\n\n  for (let i = p.particles.length - 1; i >= 0; i--) {\n    p.particles[i].update();\n    p.particles[i].display();\n    if (p.particles[i].isDead()) {\n      p.particles.splice(i, 1);\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y) {\n    this.pos = p.createVector(x, y);\n    let angle = p.random(p.TWO_PI);\n    this.vel = p5.Vector.fromAngle(angle);\n    this.vel.mult(p.random(1, 3));\n    this.lifespan = 100;\n    this.hue = p.random(30, 50);\n    this.sat = p.random(60, 90);\n    this.size = p.random(3, 6);\n  }\n\n  update() {\n    this.pos.add(this.vel);\n    this.vel.mult(0.98);\n    this.lifespan -= 1.1;\n  }\n\n  display() {\n    p.fill(this.hue, this.sat, 100, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0;\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 2.5),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n",
    "citations": [
      "RV 1.74.1",
      "RV 1.85.1"
    ],
    "suggestions": [
      "Who is Gotama Rāhūgaṇa?",
      "Why is Agni called a 'friend'?",
      "Who are the Maruts?",
      "What is the significance of the Gautama family of seers?"
    ]
  }
}, 
"Bhrigu": {
  "en-US": {
    "story": "The Bhrigus (Bhṛgu) are an ancient family of seers, closely associated with the very gift of fire to mortals. They are said to have established Agni in the homes of men. A seer of the Bhrigu line sings to Agni, 'We praise you, Agni, who are born in the wood (`vaneṣu jāyuṁ`), the embryo of plants, the child of the waters (RV 10.122.1). You are the priest, the one who brings the gods, shining brightly for the one who serves you' (RV 10.122.1).",
    "p5jsCode": "p.setup = () => {\n  p.particles = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 3),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(35, 15, 99, 10);\n\n  for (const light of p.lights) {\n    p.fill(40, 10, light.brightness, p.sin(p.frameCount * 0.01 + light.x) * 5 + 10);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  let center = p.createVector(p.width / 2, p.height / 2);\n  let pulse = p.sin(p.frameCount * 0.04) * 7;\n  p.fill(25, 90, 100, 80 + pulse);\n  p.ellipse(center.x, center.y, 32 + pulse, 32 + pulse);\n\n  for (let i = 0; i < 4; i++) {\n    p.particles.push(new p.Particle(center.x, center.y));\n  }\n\n  for (let i = p.particles.length - 1; i >= 0; i--) {\n    p.particles[i].update();\n    p.particles[i].display();\n    if (p.particles[i].isDead()) {\n      p.particles.splice(i, 1);\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y) {\n    this.pos = p.createVector(x, y);\n    let angle = p.random(p.TWO_PI);\n    this.vel = p5.Vector.fromAngle(angle);\n    this.vel.mult(p.random(1, 3));\n    this.lifespan = 100;\n    this.hue = p.random(15, 40);\n    this.sat = p.random(80, 100);\n    this.size = p.random(3, 7);\n  }\n\n  update() {\n    this.pos.add(this.vel);\n    this.vel.mult(0.97);\n    this.lifespan -= 1;\n  }\n\n  display() {\n    p.fill(this.hue, this.sat, 100, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0;\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 3),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n",
    "citations": [
      "RV 10.122.1"
    ],
    "suggestions": [
      "What is the story of Bhrigu bringing fire to humans?",
      "How is Agni the 'embryo of plants'?",
      "Why is this family of seers named Bhrigu?",
      "What is the role of the Bhrigus in the Rigveda?"
    ]
  }
},
"Sapta Sindhu, Land of Seven Rivers": {
  "en-US": {
    "story": "This is the sacred land, defined by the flow of the great waters. It was Indra, the wielder of the thunderbolt, who slew the serpent (`ahim`) and set the seven rivers (`sapta sindhūn`) free to flow (RV 1.32.1, 1.32.12). He carved their channels with his might. Like lowing cows rushing forth, the flowing waters descended straight to the sea (`samudraṁ`) (RV 1.32.2). They are the life-givers, the mothers, and their streams are filled with light and strength.",
    "p5jsCode": "p.setup = () => {\n  p.rivers = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 2.5),\n      brightness: p.random(80, 100)\n    });\n  }\n  \n  let center = p.createVector(p.width / 2, p.height * 0.1);\n  for(let i = 0; i < 7; i++) {\n    p.rivers.push(new p.River(center.x + (i - 3) * (p.width / 10), center.y));\n  }\n};\n\np.draw = () => {\n  p.background(190, 10, 99, 10);\n\n  for (const light of p.lights) {\n    p.fill(200, 5, light.brightness, p.sin(p.frameCount * 0.01 + light.x) * 5 + 10);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  for (let river of p.rivers) {\n    river.update();\n    river.display();\n  }\n};\n\np.River = class {\n  constructor(x, y) {\n    this.particles = [];\n    this.baseX = x;\n    this.y = y;\n  }\n\n  update() {\n    this.y += p.random(1, 3);\n    if (this.y > p.height + 10) {\n      this.y = 0;\n    }\n    \n    let x = this.baseX + p.sin(this.y * 0.01) * 20;\n    this.particles.push(new p.Particle(x, this.y));\n\n    for (let i = this.particles.length - 1; i >= 0; i--) {\n      this.particles[i].update();\n      if (this.particles[i].isDead()) {\n        this.particles.splice(i, 1);\n      }\n    }\n  }\n\n  display() {\n    for (let particle of this.particles) {\n      particle.display();\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y) {\n    this.pos = p.createVector(x, y);\n    this.lifespan = 100;\n    this.hue = p.random(190, 220);\n    this.sat = p.random(70, 90);\n    this.size = p.random(2, 5);\n  }\n\n  update() {\n    this.lifespan -= 1.5;\n  }\n\n  display() {\n    p.fill(this.hue, this.sat, 100, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0;\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 2.5),\n      brightness: p.random(80, 100)\n    });\n  }\n  \n  p.rivers = [];\n  let center = p.createVector(p.width / 2, p.height * 0.1);\n  for(let i = 0; i < 7; i++) {\n    p.rivers.push(new p.River(center.x + (i - 3) * (p.width / 10), center.y));\n  }\n};\n",
    "citations": [
      "RV 1.32.1",
      "RV 1.32.2",
      "RV 1.32.12"
    ],
    "suggestions": [
      "Who was the 'serpent' (Ahi) that Indra slew?",
      "Can you name the Seven Rivers?",
      "Why are the rivers compared to 'lowing cows'?",
      "What is the 'samudra' (sea) in this context?"
    ]
  }
}, 
"Rta, Cosmic Order" : {
  "en-US": {
    "story": "Rta is the great, eternal, cosmic order. It is the very foundation of the universe, the path that all things follow. The gods themselves are born from Rta and are its guardians. Varuna, the sovereign, is the upholder of this law (RV 1.25.10). Agni, the sacred fire, is the guardian of the eternal order (`ṛtasya gopām`) and knows its truth (RV 1.1.8). Even the glorious Dawn, Ushas, follows the path of Rta perfectly, arriving each day without fail (RV 1.113.12). To live in harmony with the gods is to follow the path of Rta.",
    "p5jsCode": "p.setup = () => {\n  p.particles = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 200; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(0.5, 2),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(50, 5, 99, 10);\n\n  for (const light of p.lights) {\n    p.fill(60, 2, light.brightness, p.sin(p.frameCount * 0.01 + light.x) * 5 + 10);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  let center = p.createVector(p.width / 2, p.height / 2);\n  \n  let pulse = p.sin(p.frameCount * 0.01) * 10;\n  p.fill(55, 70, 100, 80 + pulse);\n  p.ellipse(center.x, center.y, 40 + pulse, 40 + pulse);\n\n  if (p.frameCount % 5 == 0) {\n    p.particles.push(new p.Particle(center.x, center.y));\n  }\n\n  for (let i = p.particles.length - 1; i >= 0; i--) {\n    p.particles[i].update();\n    p.particles[i].display();\n    if (p.particles[i].isDead()) {\n      p.particles.splice(i, 1);\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y) {\n    this.pos = p.createVector(x, y);\n    this.angle = p.random(p.TWO_PI);\n    this.radius = p.random(p.min(p.width, p.height) * 0.1, p.min(p.width, p.height) * 0.4);\n    this.speed = p.random(0.005, 0.015) * (p.random() > 0.5 ? 1 : -1);\n    this.lifespan = 100;\n    this.hue = p.random(40, 70);\n    this.size = p.random(2, 5);\n  }\n\n  update() {\n    this.angle += this.speed;\n    this.pos.x = p.width / 2 + p.cos(this.angle) * this.radius;\n    this.pos.y = p.height / 2 + p.sin(this.angle) * this.radius;\n    this.lifespan -= 0.3;\n  }\n\n  display() {\n    p.fill(this.hue, 80, 100, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0;\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 200; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(0.5, 2),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n",
    "citations": [
      "RV 1.1.8",
      "RV 1.25.10",
      "RV 1.113.12"
    ],
    "suggestions": [
      "How is Rta different from Dharma?",
      "Which god is most responsible for protecting Rta?",
      "What happens when Rta is broken?",
      "How does the sun (Surya) follow Rta?"
    ]
  }
},
"Yajna, Sacrifice" : {
  "en-US": {
    "story": "The Yajna, or sacrifice, is the sacred ritual at the center of all things. It is the 'navel' (`nābhiḥ`) of the world, the meeting place of gods and mortals (RV 1.164.35). We perform the sacrifice with Agni as our chief priest (`purohitaṁ`), our invoker, and our messenger (`dūtaṁ`) (RV 1.1.1, 1.12.1). For whatever sacrifice you, O Agni, surround on every side, that offering alone travels to the gods (RV 1.1.4). Through this offering, we nourish the gods, and they, in turn, bestow upon us wealth, strength, and life (RV 1.1.3).",
    "p5jsCode": "p.setup = () => {\n  p.particles = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height * 0.6),\n      size: p.random(1, 3),\n      brightness: p.random(70, 95)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(30, 15, 99, 10);\n\n  for (const light of p.lights) {\n    p.fill(40, 10, light.brightness, p.sin(p.frameCount * 0.01 + light.x) * 5 + 10);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  let center = p.createVector(p.width / 2, p.height * 0.75);\n  \n  p.fill(35, 90, 100, 70);\n  p.ellipse(center.x, center.y, 30, 15);\n\n  for (let i = 0; i < 5; i++) {\n    p.particles.push(new p.Particle(center.x + p.random(-20, 20), center.y));\n  }\n\n  for (let i = p.particles.length - 1; i >= 0; i--) {\n    p.particles[i].update();\n    p.particles[i].display();\n    if (p.particles[i].isDead()) {\n      p.particles.splice(i, 1);\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y) {\n    this.pos = p.createVector(x, y);\n    this.vel = p.createVector(p.random(-0.3, 0.3), p.random(-1.5, -3.0));\n    this.lifespan = 100;\n    this.hue = p.random(15, 50);\n    this.sat = p.random(70, 100);\n    this.size = p.random(4, 9);\n  }\n\n  update() {\n    this.pos.add(this.vel);\n    this.vel.y *= 0.98;\n    this.lifespan -= 1.0;\n    this.size *= 0.97;\n  }\n\n  display() {\n    p.fill(this.hue, this.sat, 100, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0 || this.pos.y < 0;\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height * 0.6),\n      size: p.random(1, 3),\n      brightness: p.random(70, 95)\n    });\n  }\n};\n",
    "citations": [
      "RV 1.1.1",
      "RV 1.1.3",
      "RV 1.1.4",
      "RV 1.12.1",
      "RV 1.164.35"
    ],
    "suggestions": [
      "What does it mean that the sacrifice 'travels to the gods'?",
      "Why is Agni the 'purohita' (chief priest)?",
      "What is the 'navel of the world'?",
      "What other offerings are made besides Soma?"
    ]
  }
},
"Soma Pressing Ritual": {
  "en-US": {
    "story": "The sacred Soma is prepared. The pressing-stones (`adribhiḥ`) are set to work, and the poet-juice is pressed out (`suto`) (RV 9.1.2). The sages sing as the bright stream (`dhārayā`) flows, purifying itself as it passes through the filter (RV 9.7.1). This is the sweetest, most exhilarating drink, pressed for Indra (RV 9.1.1). We have drunk this Soma, we have become immortal (`apāma somamamṛtā abhūma`); we have attained the light and found the gods (RV 8.48.3).",
    "p5jsCode": "p.setup = () => {\n  p.particles = [];\n  p.lights = [];\n  p.colorMode(p.HSB, 360, 100, 100, 100);\n  p.noStroke();\n  \n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 2.5),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n\np.draw = () => {\n  p.background(80, 20, 99, 10);\n\n  for (const light of p.lights) {\n    p.fill(90, 10, light.brightness, p.sin(p.frameCount * 0.01 + light.x) * 5 + 10);\n    p.ellipse(light.x, light.y, light.size, light.size);\n  }\n\n  let center = p.createVector(p.width / 2, p.height / 2);\n  let offset = p.sin(p.frameCount * 0.03) * 10 + 20;\n  \n  p.fill(70, 30, 80, 70);\n  p.ellipse(center.x - offset, center.y, 25, 25);\n  p.ellipse(center.x + offset, center.y, 25, 25);\n\n  if (offset < 21) {\n    for (let i = 0; i < 10; i++) {\n      p.particles.push(new p.Particle(center.x, center.y));\n    }\n  }\n\n  for (let i = p.particles.length - 1; i >= 0; i--) {\n    p.particles[i].update();\n    p.particles[i].display();\n    if (p.particles[i].isDead()) {\n      p.particles.splice(i, 1);\n    }\n  }\n};\n\np.Particle = class {\n  constructor(x, y) {\n    this.pos = p.createVector(x, y);\n    this.vel = p.createVector(p.random(-0.5, 0.5), p.random(1, 3));\n    this.lifespan = 100;\n    this.hue = p.random(75, 95);\n    this.sat = p.random(80, 100);\n    this.size = p.random(3, 7);\n  }\n\n  update() {\n    this.pos.add(this.vel);\n    this.lifespan -= 1.0;\n    this.size *= 0.98;\n  }\n\n  display() {\n    p.fill(this.hue, this.sat, 100, this.lifespan);\n    p.ellipse(this.pos.x, this.pos.y, this.size, this.size);\n  }\n\n  isDead() {\n    return this.lifespan <= 0 || this.pos.y > p.height;\n  }\n};\n\np.windowResized = () => {\n  p.lights = [];\n  for (let i = 0; i < 100; i++) {\n    p.lights.push({\n      x: p.random(p.width),\n      y: p.random(p.height),\n      size: p.random(1, 2.5),\n      brightness: p.random(80, 100)\n    });\n  }\n};\n",
    "citations": [
      "RV 9.1.1",
      "RV 9.1.2",
      "RV 9.7.1",
      "RV 8.48.3"
    ],
    "suggestions": [
      "What are the 'pressing stones' (adri)?",
      "What does 'we have become immortal' mean?",
      "What is the filter that purifies the Soma?",
      "Why is Soma called a 'poet' (kavi)?"
    ]
  }
}
};
