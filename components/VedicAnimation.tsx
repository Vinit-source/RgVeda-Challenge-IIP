import React, { useRef, useEffect, useState } from 'react';

declare let p5: any;

interface VedicAnimationProps {
  isPlaying: boolean;
  p5jsCode: string | null;
  onReady?: () => void;
}

export const VedicAnimation: React.FC<VedicAnimationProps> = ({ isPlaying, p5jsCode, onReady }) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null); // Reset error on new code

    const cleanup = () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
    
    if (p5jsCode && sketchRef.current) {
      cleanup();

      try {
        const sketch = (p: any) => {
          // This will define p.setup, p.draw, etc. by executing the generated code.
          new Function('p', p5jsCode)(p);

          const originalSetup = p.setup;
          p.setup = () => {
            if (sketchRef.current) {
              const { clientWidth, clientHeight } = sketchRef.current;
              p.createCanvas(clientWidth, clientHeight).parent(sketchRef.current);
              if (typeof originalSetup === 'function') {
                originalSetup();
              }
              onReady?.();
            }
          };

          const originalResized = p.windowResized;
          p.windowResized = () => {
            if (sketchRef.current) {
              const { clientWidth, clientHeight } = sketchRef.current;
              p.resizeCanvas(clientWidth, clientHeight);
              if (typeof originalResized === 'function') {
                originalResized();
              }
            }
          };
        };

        p5Instance.current = new p5(sketch);
      } catch (e) {
        console.error("Failed to execute p5 sketch:", e);
        setError("The Sage's vision could not be rendered.");
      }
    }

    return cleanup;
  }, [p5jsCode, onReady]);

  useEffect(() => {
    if (p5Instance.current && typeof p5Instance.current.isLooping === 'function') {
      if (isPlaying && !p5Instance.current.isLooping()) {
        p5Instance.current.loop();
      } else if (!isPlaying && p5Instance.current.isLooping()) {
        p5Instance.current.noLoop();
      }
    }
  }, [isPlaying]);

  return (
    <div ref={sketchRef} className="w-full h-full relative">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 text-white p-4 text-center">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};