
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
      /*
      * p5.js Visualization of Surya Hymns
      * * This sketch creates an animated visualization based on descriptions
      * from the Rigveda (Sukta 50), such as Surya's effulgence, 
      * his rays (ketavah), and his seven mares (sapta haritah).
      */

      let time = 0; // A simple counter for animation

      function setup() {
        // Create a canvas that fills the browser window
        createCanvas(windowWidth, windowHeight);
        textAlign(CENTER, CENTER);
        angleMode(DEGREES); // Using degrees for easier rotation and loops
      }

      function draw() {
        // "The supreme light beyond darkness." (50.10)
        // Dark background, with low alpha for a motion blur/trail effect
        background(0, 0, 20, 150);
        
        // Move the origin (0,0) to the center for easier drawing
        translate(width / 2, height / 2);

        // Define base sizes for the sun
        let sunCoreRadius = 100;
        let sunGlowRadius = 200;

        // --- 5. "Stars retreat like thieves." (50.2) ---
        // Stars fade as the sun's glow (time) increases
        let starAlpha = map(sin(time * 0.2), -1, 1, 200, 50);
        drawStars(200, starAlpha);

        // --- 1. & 2. "Bright and effulgent," "creator of light" (50.1, 50.4) ---
        // Create a pulsating, glowing aura (effulgence)
        noStroke();
        for (let r = sunGlowRadius * 2.5; r > sunCoreRadius; r -= 15) {
          // Use sin() for a smooth pulse
          let pulse = sin(time * 0.5 + r * 0.5) * 10;
          let alpha = map(r, sunCoreRadius, sunGlowRadius * 2.5, 10, 0);
          fill(255, 220, 100, alpha * 2); // Soft outer glow
          ellipse(0, 0, r + pulse);
        }
        
        // --- 3. "Flaming Hair" (शोचिष्केशं) (50.8) ---
        // A dynamic, spiky corona using Perlin noise
        strokeWeight(3);
        stroke(255, 180, 0, 150);
        noFill();
        beginShape();
        for (let a = 0; a < 360; a += 5) {
          // Use noise() for a more organic, flame-like shape
          let r = sunCoreRadius + 20 + noise(a * 0.1, time * 0.01) * 60; 
          let x = r * cos(a);
          let y = r * sin(a);
          curveVertex(x, y); // Use curveVertex for a smoother flame shape
        }
        endShape(CLOSE);
        
        // --- Sun's Core ---
        fill(255, 255, 220); // Brightest core
        ellipse(0, 0, sunCoreRadius + 10);
        fill(255, 255, 255);
        ellipse(0, 0, sunCoreRadius - 10);


        // --- 1. "Rays bear him upward" (केतवः) (50.1) ---
        // Draw radiating rays of light
        drawRays(sunCoreRadius);

        // --- 3. & 7. "Seven mares" (सप्त हरितो) (50.8, 50.9) ---
        // Represented as seven bright, comet-like shapes "pulling" the sun
        let chariotRadius = sunCoreRadius * 1.5;
        for (let i = 0; i < 7; i++) {
          // Angle for each "mare"
          let angle = (i * (360 / 7)) + time * 0.5; // Animate their rotation
          let x = chariotRadius * cos(angle);
          let y = chariotRadius * sin(angle);

          // Draw the "mare" (as a bright shape with a tail)
          drawMare(x, y, angle);
        }
        
        // --- Add Sanskrit Hymn Text ---
        // Translate back to corner (0,0) to draw text at the bottom
        translate(-width / 2, -height / 2);
        fill(255, 240, 200, 200); // Text color
        textSize(20);
        textStyle(NORMAL);
        // Using Sukta 50, Mantra 1 as a representative hymn
        text("उदु त्यं जातवेदसं देवं वहन्ति केतवः ।", width / 2, height - 70);
        text("दृशे विश्वाय सूर्यम् ॥", width / 2, height - 40);

        time += 1; // Increment time for animation
      }

      // --- Helper function to draw stars ---
      function drawStars(numStars, alpha) {
        for (let i = 0; i < numStars; i++) {
          // Use noise to get consistent, pseudo-random positions
          let x = (noise(i * 10) - 0.5) * width * 2;
          let y = (noise(i * 20) - 0.5) * height * 2;
          fill(255, 255, 240, random(alpha * 0.5, alpha));
          noStroke();
          ellipse(x, y, random(1, 3));
        }
      }

      // --- Helper function to draw sun rays ---
      function drawRays(sunRadius) {
        for (let i = 0; i < 360; i += 15) {
          // Vary length and opacity for a shimmering effect
          let rayLength = sunRadius * 3 + sin(i * 8 + time * 2) * 100;
          let rayOpacity = map(rayLength, sunRadius * 3 - 100, sunRadius * 3 + 100, 50, 150);
          stroke(255, 220, 100, rayOpacity);
          strokeWeight(random(1, 4));
          // Draw lines radiating from the core
          line(0, 0, rayLength * cos(i), rayLength * sin(i));
        }
      }

      // --- Helper function to draw a "mare" ---
      function drawMare(x, y, angle) {
        noStroke();
        
        // Save current drawing state (translation, rotation)
        push();
        translate(x, y);
        rotate(angle + 90); // Point the tail away from the sun's center
        
        // Tail (as a gradient triangle)
        let tailLength = 50 + sin(time * 2 + angle) * 10;
        let tailWidth = 20;
        for (let i = 0; i < tailLength; i += 2) {
          let alpha = map(i, 0, tailLength, 150, 0);
          let w = map(i, 0, tailLength, tailWidth, 0);
          fill(255, 200, 150, alpha); // Fiery color
          triangle(0, i, -w / 2, i + 2, w / 2, i + 2);
        }
        
        // Head (bright core of the "mare")
        fill(255, 255, 220, 255);
        ellipse(0, 0, 15, 15);
        
        // Restore drawing state to what it was before push()
        pop();
      }

      // --- p5.js function to resize canvas if window is resized ---
      function windowResized() {
        resizeCanvas(windowWidth, windowHeight);
      }
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
  }
};
