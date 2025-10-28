import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Topic, Language, ChatMessage as ChatMessageType } from '../types';
import { VedicAnimation } from './VedicAnimation';
import { ChatMessage } from './ChatMessage';
import { Suggestions } from './Suggestions';
import { ChatInput } from './ChatInput';
import { synthesizeSpeech, continueConversation } from '../services/geminiService';
import { audioService } from '../services/audioService';
import { decode, decodeAudioData } from '../utils/audioUtils';

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
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isReplying, setIsReplying] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    // Unified TTS state management
    const [ttsState, setTtsState] = useState<{ id: string | null; status: 'IDLE' | 'LOADING' | 'PLAYING' }>({ id: null, status: 'IDLE' });
    const [ttsError, setTtsError] = useState<string | null>(null);
    const [audioCache, setAudioCache] = useState<Map<string, AudioBuffer>>(new Map());
    const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const playAudioForMessage = useCallback(async (message: ChatMessageType) => {
        if (ttsState.status === 'LOADING') {
            return; // Don't interrupt loading
        }

        // If the clicked message is already playing, stop it.
        if (ttsState.id === message.id && ttsState.status === 'PLAYING') {
            if (audioSourceRef.current) {
                audioSourceRef.current.onended = null;
                audioSourceRef.current.stop();
                audioSourceRef.current = null;
            }
            setTtsState({ id: null, status: 'IDLE' });
            return;
        }
        
        // Stop any currently playing audio before starting a new one.
        if (audioSourceRef.current) {
            audioSourceRef.current.onended = null;
            audioSourceRef.current.stop();
            audioSourceRef.current = null;
        }

        setTtsState({ id: message.id, status: 'LOADING' });
        setTtsError(null);

        try {
            let audioBuffer: AudioBuffer;
            if (audioCache.has(message.id)) {
                audioBuffer = audioCache.get(message.id)!;
            } else {
                const cleanedText = message.text.replace(/\(RV \d+\.\d+(\.\d+)?\)/g, '').trim();
                if (!cleanedText) {
                    setTtsState({ id: null, status: 'IDLE' });
                    return;
                }
                const audioData = await synthesizeSpeech(cleanedText, selectedLanguage.name);
                const ctx = audioContextRef.current!;
                const decodedBytes = decode(audioData);
                audioBuffer = await decodeAudioData(decodedBytes, ctx, 24000, 1);
                setAudioCache(prev => new Map(prev).set(message.id, audioBuffer));
            }
            
            const ctx = audioContextRef.current!;
            if (ctx.state === 'suspended') await ctx.resume();

            const source = ctx.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(ctx.destination);
            source.start();

            audioSourceRef.current = source;
            setTtsState({ id: message.id, status: 'PLAYING' });
            
            source.onended = () => {
                if (audioSourceRef.current === source) {
                    audioSourceRef.current = null;
                    setTtsState(current => (current.id === message.id ? { id: null, status: 'IDLE' } : current));
                }
            };
        } catch (e) {
            console.error("TTS process failed:", e);
            setTtsError("The Sage's voice could not be heard. Please try again.");
            setTtsState({ id: null, status: 'IDLE' });
        }
    }, [ttsState, audioCache, selectedLanguage.name]);

    // Background music and audio context management
    useEffect(() => {
        audioService.play();
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }

        return () => {
            audioService.stop();
            if (audioSourceRef.current) {
                audioSourceRef.current.onended = null;
                audioSourceRef.current.stop();
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().then(() => audioContextRef.current = null);
            }
        };
    }, []);

    // Effect to populate initial message from story prop
    useEffect(() => {
        if (story) {
            const firstMessage: ChatMessageType = { id: `sage-${Date.now()}`, sender: 'sage', text: story };
            setMessages([firstMessage]);
            setSuggestions(initialSuggestions);
            playAudioForMessage(firstMessage); // Autoplay the initial story
        } else {
            setMessages([]);
            setSuggestions([]);
        }
    // This effect should only run when the main story prop changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [story, initialSuggestions]);

    // Auto-scroll chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = useCallback(async (userInput: string) => {
        if (!userInput.trim()) return;
        setIsReplying(true);
        setSuggestions([]);
        
        // Stop any currently playing audio.
        if (audioSourceRef.current) {
            audioSourceRef.current.onended = null;
            audioSourceRef.current.stop();
            audioSourceRef.current = null;
        }
        setTtsState({ id: null, status: 'IDLE' });

        const userMessage: ChatMessageType = { id: `user-${Date.now()}`, sender: 'user', text: userInput };
        const newMessages: ChatMessageType[] = [...messages, userMessage];
        setMessages(newMessages);

        const history = newMessages.map(m => `${m.sender === 'sage' ? 'Sage' : 'User'}: ${m.text}`).join('\n\n');
        
        try {
            const response = await continueConversation(history, selectedLanguage.name);
            const sageMessage: ChatMessageType = { id: `sage-${Date.now()}`, sender: 'sage', text: response.reply };
            setMessages(prev => [...prev, sageMessage]);
            setSuggestions(response.suggestions);
            playAudioForMessage(sageMessage); // Autoplay the new reply
        } catch (e) {
            console.error(e);
            const errorMessage = "The Sage seems to be in deep meditation and cannot reply right now. Please try again later.";
            setMessages(prev => [...prev, { id: `sage-error-${Date.now()}`, sender: 'sage', text: errorMessage }]);
        } finally {
            setIsReplying(false);
        }
    }, [messages, selectedLanguage.name, playAudioForMessage]);

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
                    <svg className="animate-spin h-8 w-8 text-amber-500 mb-4" xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p>{loadingMessage}</p>
                </div>
            )}
            <VedicAnimation 
                p5jsCode={p5jsCode}
                isPlaying={!isLoading}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none"></div>
            <div className="absolute bottom-4 left-4 text-white">
                {ttsState.status === 'PLAYING' && <div className="flex items-center gap-2 px-3 py-1 bg-black/50 rounded-full text-sm"><div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>Listening...</div>}
            </div>
        </div>

        <div id="conversations" className="lg:w-1/2 flex flex-col">
            <div ref={chatContainerRef} className="flex-grow h-96 overflow-y-auto p-4 bg-orange-50/70 rounded-md border border-amber-200">
                {messages.map((msg) => (
                    <ChatMessage
                        key={msg.id}
                        message={msg}
                        onPlayMessage={playAudioForMessage}
                        ttsState={ttsState}
                    />
                ))}
                {isReplying && <div className="flex justify-center p-4"><LoadingSpinner message="The Sage is contemplating..."/></div>}
                {isLoading && messages.length === 0 && <div className="flex justify-center p-4"><LoadingSpinner message={loadingMessage}/></div>}
                {!isLoading && messages.length === 0 && <p className="text-stone-500 p-4">The sage prepares to speak...</p>}
            </div>
            
            <div className="mt-4">
                 {ttsError && !isLoading && (
                     <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-3 rounded-r-lg flex justify-between items-center w-full mb-4" role="alert">
                      <div>
                        <p className="font-bold">Audio Playback Error</p>
                        <p className="text-sm">{ttsError}</p>
                      </div>
                      <button onClick={() => setTtsError(null)} className="ml-4 p-1 rounded-full hover:bg-red-200" aria-label="Dismiss">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                 )}
                 <Suggestions suggestions={suggestions} onSuggestionClick={handleSendMessage} disabled={isReplying || isLoading} />
                 <ChatInput
                    onSendMessage={handleSendMessage}
                    disabled={isReplying || isLoading}
                    languageCode={selectedLanguage.code}
                 />
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