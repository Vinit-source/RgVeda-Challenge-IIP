
import React, { useRef, useEffect } from 'react';

// Make p5 globally available for the sketch
declare let p5: any;

interface VedicAnimationProps {
  isPlaying: boolean;
}

export const VedicAnimation: React.FC<VedicAnimationProps> = ({ isPlaying }) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<any>(null);

  useEffect(() => {
    const sketch = (p: any) => {
      let particles: Particle[] = [];
      const numParticles = 100;

      class Particle {
        pos: any;
        vel: any;
        acc: any;
        maxSpeed: number;
        color: any;
        history: any[];

        constructor() {
          this.pos = p.createVector(p.random(p.width), p.random(p.height));
          this.vel = p.createVector(0, 0);
          this.acc = p.createVector(0, 0);
          this.maxSpeed = 2;
          this.color = p.color(p.random(180, 220), p.random(100, 150), p.random(50, 100), 10);
          this.history = [];
        }

        update() {
          this.vel.add(this.acc);
          this.vel.limit(this.maxSpeed);
          this.pos.add(this.vel);
          this.acc.mult(0);
        }

        follow(flowfield: any) {
          const x = p.floor(this.pos.x / 20);
          const y = p.floor(this.pos.y / 20);
          const index = x + y * p.floor(p.width / 20);
          const force = flowfield[index];
          this.applyForce(force);
        }
        
        applyForce(force: any) {
          this.acc.add(force);
        }

        show() {
            p.stroke(this.color);
            p.strokeWeight(1);
            p.line(this.pos.x, this.pos.y, this.history[0]?.x, this.history[0]?.y);
            
            if (this.history.length > 0) {
                 p.line(this.pos.x, this.pos.y, this.history[0].x, this.history[0].y);
            }
        }
        
        updateHistory() {
            this.history.push(this.pos.copy());
            if (this.history.length > 5) {
                this.history.splice(0,1);
            }
        }

        edges() {
          if (this.pos.x > p.width) this.pos.x = 0;
          if (this.pos.x < 0) this.pos.x = p.width;
          if (this.pos.y > p.height) this.pos.y = 0;
          if (this.pos.y < 0) this.pos.y = p.height;
        }
      }

      let flowfield: any;
      let zoff = 0;

      p.setup = () => {
        if(sketchRef.current){
            const { clientWidth, clientHeight } = sketchRef.current;
            p.createCanvas(clientWidth, clientHeight).parent(sketchRef.current);
        }
        p.background(10, 5, 0);
        for (let i = 0; i < numParticles; i++) {
          particles[i] = new Particle();
        }
      };

      p.draw = () => {
        if (!isPlaying) {
             p.noLoop();
             return;
        }
        p.loop();
        
        p.background(10, 5, 0, 25);
        const cols = p.floor(p.width / 20);
        const rows = p.floor(p.height / 20);
        flowfield = new Array(cols * rows);

        let yoff = 0;
        for (let y = 0; y < rows; y++) {
          let xoff = 0;
          for (let x = 0; x < cols; x++) {
            const index = x + y * cols;
            const angle = p.noise(xoff, yoff, zoff) * p.TWO_PI * 4;
            const v = p5.Vector.fromAngle(angle);
            v.setMag(0.5);
            flowfield[index] = v;
            xoff += 0.1;
          }
          yoff += 0.1;
          zoff += 0.0003;
        }
        
        for (let particle of particles) {
          particle.follow(flowfield);
          particle.update();
          particle.edges();
          particle.show();
          particle.updateHistory();
        }
      };
      
       p.windowResized = () => {
        if(sketchRef.current){
            const { clientWidth, clientHeight } = sketchRef.current;
            p.resizeCanvas(clientWidth, clientHeight);
        }
      };
    };

    if (sketchRef.current && !p5Instance.current) {
      p5Instance.current = new p5(sketch, sketchRef.current);
    }
    
    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (p5Instance.current) {
      if (isPlaying) {
        p5Instance.current.loop();
      } else {
        p5Instance.current.noLoop();
      }
    }
  }, [isPlaying]);

  return <div ref={sketchRef} className="w-full h-full"></div>;
};
