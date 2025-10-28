
import { useState, useRef, useCallback, useEffect } from 'react';
import { decode, decodeAudioData } from '../utils/audioUtils';

// Singleton AudioContext
let audioContext: AudioContext | null = null;
const getAudioContext = (): AudioContext => {
    if (!audioContext || audioContext.state === 'closed') {
        audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
    }
    return audioContext;
};

export const useAudioPlayer = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const audioQueue = useRef<string[]>([]);
  const isProcessing = useRef<boolean>(false);
  const nextStartTime = useRef<number>(0);
  const sources = useRef<Set<AudioBufferSourceNode>>(new Set()).current;

  const playNextInQueue = useCallback(async () => {
    if (audioQueue.current.length === 0 || isProcessing.current) {
      if (audioQueue.current.length === 0) {
        setIsPlaying(false);
      }
      isProcessing.current = false;
      return;
    }

    isProcessing.current = true;
    setIsPlaying(true);
    const audioData = audioQueue.current.shift();

    if (audioData) {
      try {
        const ctx = getAudioContext();
        if(ctx.state === 'suspended') {
            await ctx.resume();
        }
        
        const decodedBytes = decode(audioData);
        const audioBuffer = await decodeAudioData(decodedBytes, ctx, 24000, 1);
        
        const source = ctx.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(ctx.destination);

        const startTime = Math.max(nextStartTime.current, ctx.currentTime);
        source.start(startTime);
        nextStartTime.current = startTime + audioBuffer.duration;
        
        sources.add(source);
        source.onended = () => {
            sources.delete(source);
            isProcessing.current = false;
            playNextInQueue();
        };

      } catch (error) {
        console.error("Error playing audio:", error);
        isProcessing.current = false;
        playNextInQueue();
      }
    } else {
        isProcessing.current = false;
        playNextInQueue();
    }
  }, [sources]);

  const addToQueue = useCallback((audioData: string) => {
    audioQueue.current.push(audioData);
    if (!isProcessing.current) {
      playNextInQueue();
    }
  }, [playNextInQueue]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
        sources.forEach(source => source.stop());
        sources.clear();
        if(audioContext && audioContext.state !== 'closed') {
            audioContext.close().then(() => audioContext = null);
        }
    };
  }, [sources]);

  return { addToQueue, isPlaying };
};
