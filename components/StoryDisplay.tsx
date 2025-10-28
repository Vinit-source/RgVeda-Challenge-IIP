import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Topic } from '../types';
import { VedicAnimation } from './VedicAnimation';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { synthesizeSpeech } from '../services/geminiService';

interface StoryDisplayProps {
  topic: Topic;
  story: string | null;
  p5jsCode: string | null;
  citations: string[];
  isLoading: boolean;
  loadingMessage: string;
  onBack: () => void;
}

const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-amber-700 animate-pulse delay-0"></div>
        <div className="w-4 h-4 rounded-full bg-amber-700 animate-pulse delay-200"></div>
        <div className="w-4 h-4 rounded-full bg-amber-700 animate-pulse delay-400"></div>
        <span className="ml-3 text-stone-600">{message}</span>
    </div>
);

export const StoryDisplay: React.FC<StoryDisplayProps> = ({ topic, story, p5jsCode, citations, isLoading, loadingMessage, onBack }) => {
    const { addToQueue, isPlaying } = useAudioPlayer();
    const [displayedStory, setDisplayedStory] = useState('');
    const [isAnimationReady, setIsAnimationReady] = useState(false);
    const hasStartedPlayback = useRef<boolean>(false);
    
    const processTts = useCallback(async (fullStory: string) => {
        const sentences = fullStory.split(/(?<=[.?!])\s+/);

        for (const sentence of sentences) {
          if (sentence.trim().length > 0) {
            try {
              const audioData = await synthesizeSpeech(sentence);
              addToQueue(audioData);
            } catch (e) {
              console.error("Speech synthesis failed for sentence:", e);
            }
          }
        }
    }, [addToQueue]);

    const startTypewriter = useCallback((fullStory: string) => {
        let i = 0;
        const typingSpeed = 30; // ms per character
        const intervalId = setInterval(() => {
            i++;
            setDisplayedStory(fullStory.substring(0, i));
            if (i >= fullStory.length) {
                clearInterval(intervalId);
            }
        }, typingSpeed);
        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        // When the full story is available, the p5 code is ready, the animation is rendered, and we haven't started playback yet...
        if (story && p5jsCode && isAnimationReady && !hasStartedPlayback.current) {
            hasStartedPlayback.current = true;
            processTts(story);
            const clearTypewriter = startTypewriter(story);
            return clearTypewriter; // Cleanup interval on unmount
        }
    }, [story, p5jsCode, isAnimationReady, processTts, startTypewriter]);

    // Reset component state when topic changes (when story becomes null)
    useEffect(() => {
        if (!story) {
            setDisplayedStory('');
            setIsAnimationReady(false);
            hasStartedPlayback.current = false;
        }
    }, [story]);

    return (
    <div className="bg-white/50 rounded-lg shadow-lg p-4 sm:p-8 w-full border border-amber-200/80">
      <div className="flex justify-between items-start mb-6">
        <div>
            <h2 className="text-3xl sm:text-4xl font-display text-amber-900">{topic.title}</h2>
            <p className="text-stone-600">{topic.description}</p>
        </div>
        <button
          onClick={onBack}
          className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors duration-200 shadow"
        >
          &larr; Back
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/2 relative aspect-video rounded-lg overflow-hidden shadow-inner bg-stone-900">
            {/* Loading overlay for the animation */}
            {isLoading && !p5jsCode && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-stone-900/80 z-10 text-amber-100">
                    <svg className="animate-spin h-8 w-8 text-amber-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p>{loadingMessage}</p>
                </div>
            )}
            <VedicAnimation 
                p5jsCode={p5jsCode}
                isPlaying={isPlaying || isLoading}
                onReady={() => setIsAnimationReady(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 text-white">
                {isPlaying && <div className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-full text-sm"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>Listening...</div>}
            </div>
        </div>

        <div className="lg:w-1/2">
            <div className="h-96 overflow-y-auto p-4 bg-orange-50/70 rounded-md border border-amber-200 prose prose-stone max-w-none">
                { (displayedStory || isLoading) ? (
                    <p className="whitespace-pre-wrap">{displayedStory}{story && displayedStory.length < story.length && <span className="inline-block w-2 h-4 bg-amber-800 animate-pulse ml-1"></span>}</p>
                 ) : <p className="text-stone-500">The sage prepares to speak...</p>
                }
            </div>
             {isLoading && <div className="mt-4"><LoadingSpinner message={loadingMessage}/></div>}
             {citations.length > 0 && (
                <div className="mt-4">
                    <h4 className="font-bold text-stone-700">Sources from the Rigveda:</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {citations.map(c => <span key={c} className="bg-amber-200 text-amber-800 text-xs font-mono px-2 py-1 rounded-full">{c}</span>)}
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};