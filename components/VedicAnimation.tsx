
import React, { useRef, useEffect, useState } from 'react';

// Ensure p5 is recognized as a global if loaded via script tag
declare global {
  interface Window {
    p5: any;
  }
}

interface VedicAnimationProps {
  isPlaying: boolean;
  p5jsCode: string | null;
}

export const VedicAnimation: React.FC<VedicAnimationProps> = ({ isPlaying, p5jsCode }) => {
  const sketchRef = useRef<HTMLDivElement>(null);
  const p5Instance = useRef<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [p5Loaded, setP5Loaded] = useState(false);

  // Poll for p5.js availability
  useEffect(() => {
    if (window.p5) {
      setP5Loaded(true);
      return;
    }

    const interval = setInterval(() => {
      if (window.p5) {
        setP5Loaded(true);
        clearInterval(interval);
      }
    }, 100);

    // Timeout after 10 seconds to stop polling and show error
    const timeout = setTimeout(() => {
        clearInterval(interval);
        if (!window.p5) {
             console.error("p5.js failed to load within timeout.");
             setError("Visualization library missing. Please refresh.");
        }
    }, 10000);

    return () => {
        clearInterval(interval);
        clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    setError(null);

    // If no code, or p5 isn't loaded yet, do nothing.
    if (!p5jsCode || !sketchRef.current || !p5Loaded) return;

    if (!window.p5) {
      // This should theoretically be handled by the effect above, but safe guard.
      console.error("p5.js library not found on window.");
      setError("Visualization library missing.");
      return;
    }

    // Cleanup previous instance
    if (p5Instance.current) {
      p5Instance.current.remove();
      p5Instance.current = null;
    }

    try {
      const sketch = (p: any) => {
        // Safe execution of the generated code
        try {
           // Provide a safe environment for the code execution
           // We assume 'p' is the p5 instance passed to the function
           new Function('p', 'p5', p5jsCode)(p, window.p5);
        } catch(err) {
            console.error("Error executing generated p5 code:", err);
            // We can't easily set React state from here without potential side effects, 
            // but the p5 instance creation will likely fail or produce empty canvas.
        }

        // We wrap setup to ensure canvas is attached to our ref
        const originalSetup = p.setup;
        p.setup = () => {
          if (sketchRef.current) {
            const { clientWidth, clientHeight } = sketchRef.current;
            // Ensure dimensions are valid
            const w = clientWidth || 400;
            const h = clientHeight || 300;
            
            // Create canvas and attach to parent
            p.createCanvas(w, h).parent(sketchRef.current);
            
            if (typeof originalSetup === 'function') {
              try {
                originalSetup();
              } catch(e) {
                console.error("Error in p5 setup:", e);
              }
            }
          }
        };

        // Wrap windowResized to handle container resize
        const originalResized = p.windowResized;
        p.windowResized = () => {
          if (sketchRef.current) {
            const { clientWidth, clientHeight } = sketchRef.current;
            p.resizeCanvas(clientWidth, clientHeight);
            if (typeof originalResized === 'function') {
               try {
                 originalResized();
               } catch(e) {
                 console.error("Error in p5 windowResized:", e);
               }
            }
          }
        };
        
        // Wrap draw to catch runtime errors during animation loop
        const originalDraw = p.draw;
        if (typeof originalDraw === 'function') {
            p.draw = () => {
                try {
                    originalDraw();
                } catch (e) {
                    console.error("Error in p5 draw loop:", e);
                    p.noLoop(); // Stop the loop to prevent spamming console
                }
            };
        }
      };

      // Instantiate p5
      // We pass sketchRef.current as the node to ensure p5 attaches correctly if it tries to auto-attach
      p5Instance.current = new window.p5(sketch);

    } catch (e) {
      console.error("Failed to initialize p5 sketch:", e);
      setError("The Sage's vision could not be rendered.");
    }

    return () => {
      if (p5Instance.current) {
        p5Instance.current.remove();
        p5Instance.current = null;
      }
    };
  }, [p5jsCode, p5Loaded]);

  // Handle Play/Pause
  useEffect(() => {
    if (p5Instance.current) {
       try {
        if (typeof p5Instance.current.loop === 'function' && typeof p5Instance.current.noLoop === 'function') {
             if (isPlaying) {
                 p5Instance.current.loop();
             } else {
                 p5Instance.current.noLoop();
             }
        }
       } catch(e) {
           console.warn("Error toggling loop state:", e);
       }
    }
  }, [isPlaying]);

  return (
    <div ref={sketchRef} className="w-full h-full relative overflow-hidden bg-black/20 rounded-lg">
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-900/50 text-white p-4 text-center">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
};
