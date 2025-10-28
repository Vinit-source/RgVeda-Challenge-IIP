
import React from 'react';
import type { Topic } from '../types';
import { VedicAnimation } from './VedicAnimation';

interface StoryDisplayProps {
  topic: Topic;
  story: string;
  citations: string[];
  isLoading: boolean;
  isPlaying: boolean;
  onBack: () => void;
}

const LoadingSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-amber-700 animate-pulse delay-0"></div>
        <div className="w-4 h-4 rounded-full bg-amber-700 animate-pulse delay-200"></div>
        <div className="w-4 h-4 rounded-full bg-amber-700 animate-pulse delay-400"></div>
        <span className="ml-3 text-stone-600">The Sage is contemplating...</span>
    </div>
);

export const StoryDisplay: React.FC<StoryDisplayProps> = ({ topic, story, citations, isLoading, isPlaying, onBack }) => {
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
            <VedicAnimation isPlaying={isPlaying || isLoading} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-4 left-4 text-white">
                {isPlaying && <div className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-full text-sm"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>Listening...</div>}
            </div>
        </div>

        <div className="lg:w-1/2">
            <div className="h-96 overflow-y-auto p-4 bg-orange-50/70 rounded-md border border-amber-200 prose prose-stone max-w-none">
                {story || isLoading ? (
                    <p className="whitespace-pre-wrap">{story}{isLoading && <span className="inline-block w-2 h-4 bg-amber-800 animate-pulse ml-1"></span>}</p>
                ) : <p className="text-stone-500">The sage prepares to speak...</p>
                }
            </div>
             {isLoading && <div className="mt-4"><LoadingSpinner/></div>}
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
