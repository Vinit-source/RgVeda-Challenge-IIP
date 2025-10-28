import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Topic, Language, ChatMessage as ChatMessageType } from '../types';
import { VedicAnimation } from './VedicAnimation';
import { ChatMessage } from './ChatMessage';
import { Suggestions } from './Suggestions';
import { ChatInput } from './ChatInput';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { synthesizeSpeech, continueConversation } from '../services/geminiService';
import { audioService } from '../services/audioService';

interface StoryDisplayProps {
  topic: Topic;
  story: string | null;
  p5jsCode: string | null;
  citations: string[];
  isLoading: boolean;
  loadingMessage: string;
  onBack: () => void;
  selectedLanguage: Language;
  initialSuggestions: string[];
}

const LoadingSpinner: React.FC<{ message: string }> = ({ message }) => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-4 h-4 rounded-full bg-amber-700 animate-pulse delay-0"></div>
        <div className="w-4 h-4 rounded-full bg-amber-700 animate-pulse delay-200"></div>
        <div className="w-4 h-4 rounded-full bg-amber-700 animate-pulse delay-400"></div>
        <span className="ml-3 text-stone-600">{message}</span>
    </div>
);

export const StoryDisplay: React.FC<StoryDisplayProps> = ({ topic, story, p5jsCode, citations, isLoading, loadingMessage, onBack, selectedLanguage, initialSuggestions }) => {
    const { addToQueue, isPlaying, error: audioError, clearError: clearAudioError } = useAudioPlayer();
    const [isAnimationReady, setIsAnimationReady] = useState(false);
    
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isReplying, setIsReplying] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        audioService.play();
        return () => audioService.stop();
    }, []);

    useEffect(() => {
        if (story) {
            const firstMessage = { sender: 'sage' as const, text: story };
            setMessages([firstMessage]);
            setSuggestions(initialSuggestions);
            processSageMessageAudio(story);
        } else {
            setMessages([]);
            setSuggestions([]);
        }
    }, [story, initialSuggestions]);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const processSageMessageAudio = useCallback(async (text: string) => {
        const sentences = text.split(/(?<=[.?!])\s+/);
        for (const sentence of sentences) {
          if (sentence.trim().length > 0) {
            try {
              const audioData = await synthesizeSpeech(sentence, selectedLanguage.name);
              addToQueue(audioData);
            } catch (e) {
              console.error("Speech synthesis failed for sentence:", e);
            }
          }
        }
    }, [addToQueue, selectedLanguage.name]);

    const handleSendMessage = useCallback(async (userInput: string) => {
        setIsReplying(true);
        setSuggestions([]);

        const newMessages: ChatMessageType[] = [...messages, { sender: 'user', text: userInput }];
        setMessages(newMessages);

        const history = newMessages.map(m => `${m.sender === 'sage' ? 'Sage' : 'User'}: ${m.text}`).join('\n\n');
        
        try {
            const response = await continueConversation(history, selectedLanguage.name);
            setMessages(prev => [...prev, { sender: 'sage', text: response.reply }]);
            setSuggestions(response.suggestions);
            processSageMessageAudio(response.reply);
        } catch (e) {
            console.error(e);
            const errorMessage = "The Sage seems to be in deep meditation and cannot reply right now. Please try again later.";
            setMessages(prev => [...prev, { sender: 'sage', text: errorMessage }]);
        } finally {
            setIsReplying(false);
        }
    }, [messages, selectedLanguage.name, processSageMessageAudio]);

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

        <div id="conversations" className="lg:w-1/2 flex flex-col">
            <div ref={chatContainerRef} className="flex-grow h-96 overflow-y-auto p-4 bg-orange-50/70 rounded-md border border-amber-200">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                ))}
                {isReplying && <div className="flex justify-center p-4"><LoadingSpinner message="The Sage is contemplating..."/></div>}
                {isLoading && messages.length === 0 && <div className="flex justify-center p-4"><LoadingSpinner message={loadingMessage}/></div>}
                {!isLoading && messages.length === 0 && <p className="text-stone-500 p-4">The sage prepares to speak...</p>}
            </div>
            
            <div className="mt-4">
                 {audioError && !isLoading && (
                     <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-r-lg flex justify-between items-center w-full mb-4" role="alert">
                      <div>
                        <p className="font-bold">Audio Playback Error</p>
                        <p className="text-sm">{audioError}</p>
                      </div>
                      {/* FIX: `clearError` was renamed to `clearAudioError` during destructuring. */}
                      <button onClick={clearAudioError} className="ml-4 p-1 rounded-full hover:bg-red-200" aria-label="Dismiss">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                 )}
                 <Suggestions suggestions={suggestions} onSuggestionClick={handleSendMessage} disabled={isReplying || isLoading} />
                 <ChatInput onSendMessage={handleSendMessage} disabled={isReplying || isLoading} />
            </div>

             {citations.length > 0 && !isLoading && (
                <div className="mt-4 pt-4 border-t border-amber-200">
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
