import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Topic, Language, ChatMessage as ChatMessageType } from '../types';
import { VedicAnimation } from './VedicAnimation';
import { ChatMessage } from './ChatMessage';
import { Suggestions } from './Suggestions';
import { ChatInput } from './ChatInput';
import { synthesizeSpeech, continueConversationStream } from '../services/geminiService';
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

// Utility to split text into sentences more reliably.
const splitSentences = (text: string): string[] => {
    if (!text) return [];
    // This regex matches sentences ending in . ! ? and handles cases where they might be followed by quotes or spaces.
    const sentences = text.match(/[^.!?]+[.!?]+(\s|$)/g);
    return sentences ? sentences.map(s => s.trim()).filter(Boolean) : [text.trim()].filter(Boolean);
};


export const StoryDisplay: React.FC<StoryDisplayProps> = ({ topic, story, p5jsCode, citations, isLoading, loadingMessage, onBack, selectedLanguage, initialSuggestions }) => {
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [isReplying, setIsReplying] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    
    // Unified TTS state management
    const [ttsState, setTtsState] = useState<{ id: string | null; status: 'IDLE' | 'LOADING' | 'PLAYING' }>({ id: null, status: 'IDLE' });
    const [ttsError, setTtsError] = useState<string | null>(null);
    const [audioCache, setAudioCache] = useState<Map<string, AudioBuffer>>(new Map());
    const [playbackRate, setPlaybackRate] = useState(1.25);
    const activePlaybackController = useRef<AbortController | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const scheduledSourcesRef = useRef<AudioBufferSourceNode[]>([]);

    const handlePlaybackRateChange = () => {
        setPlaybackRate(currentRate => {
            if (currentRate === 1) return 1.25;
            if (currentRate === 1.25) return 1.5;
            if (currentRate === 1.5) return 1;
            return 1.25; // Default case
        });
    };

    const stopCurrentPlayback = useCallback(() => {
        if (activePlaybackController.current) {
            activePlaybackController.current.abort();
            activePlaybackController.current = null;
        }
        scheduledSourcesRef.current.forEach(source => {
            try { source.stop(); } catch (e) { /* ignore if already stopped */ }
        });
        scheduledSourcesRef.current = [];
        setTtsState({ id: null, status: 'IDLE' });
    }, []);

    const playMessageWithStreamingAudio = useCallback(async (message: ChatMessageType) => {
        if (ttsState.status !== 'IDLE') {
            const previousMessageId = ttsState.id;
            stopCurrentPlayback();
            if (previousMessageId === message.id) {
                setMessages(prev => prev.map(m => m.id === message.id ? { ...m, text: message.text } : m));
                return;
            }
        }
        
        const fetchAndDecodeSentence = async (sentence: string, signal: AbortSignal): Promise<AudioBuffer | null> => {
            try {
                if (signal.aborted) return null;
                const cacheKey = `${selectedLanguage.code}:${sentence}`;
                
                if (audioCache.has(cacheKey)) {
                    return audioCache.get(cacheKey)!;
                }
                
                const audioData = await synthesizeSpeech(sentence, selectedLanguage.name);
                if (signal.aborted) return null;
                
                const decodedBytes = decode(audioData);
                const ctx = audioContextRef.current!;
                const audioBuffer = await decodeAudioData(decodedBytes, ctx, 24000, 1);
                
                if (!signal.aborted) {
                    setAudioCache(prev => new Map(prev).set(cacheKey, audioBuffer));
                }

                return audioBuffer;
            } catch (e) {
                if (e.name !== 'AbortError' && e.message !== 'Aborted') {
                    console.error(`Failed to fetch/decode audio for sentence: "${sentence}"`, e);
                }
                return null;
            }
        };

        const controller = new AbortController();
        activePlaybackController.current = controller;
        const { signal } = controller;

        setTtsState({ id: message.id, status: 'LOADING' });
        setTtsError(null);
        setMessages(prev => prev.map(m => m.id === message.id ? { ...m, text: '' } : m));

        try {
            const cleanedText = message.text.replace(/\(RV \d+\.\d+(\.\d+)?\)/g, '').trim();
            const sentences = splitSentences(cleanedText);
            
            if (sentences.length === 0) {
                 setTtsState({ id: null, status: 'IDLE' });
                 setMessages(prev => prev.map(m => m.id === message.id ? message : m));
                 return;
            }

            const ctx = audioContextRef.current!;
            if (ctx.state === 'suspended') await ctx.resume();
            let nextStartTime = ctx.currentTime;
            
            let onPlaybackEnd: () => void;
            const playbackFinishedPromise = new Promise<void>(resolve => { onPlaybackEnd = resolve; });

            let audioBufferPromise: Promise<AudioBuffer | null> | null = fetchAndDecodeSentence(sentences[0], signal);

            for (let i = 0; i < sentences.length; i++) {
                const sentence = sentences[i];
                if (signal.aborted) throw new Error('Aborted');

                // Start fetching the *next* sentence's audio in parallel.
                const nextAudioBufferPromise = (i + 1 < sentences.length)
                    ? fetchAndDecodeSentence(sentences[i + 1], signal)
                    : Promise.resolve(null);
                
                // FIX: Ensure the AudioContext is awake before decoding, which happens inside the awaited promise.
                // This prevents failures on slower speeds where the browser might suspend the context.
                if (ctx.state === 'suspended') await ctx.resume();
                
                // Wait for the *current* sentence's audio to be ready.
                const audioBuffer = await audioBufferPromise;
                
                if (!audioBuffer) {
                    console.warn(`Skipping sentence due to audio fetch failure: "${sentence}"`);
                    if (i === sentences.length - 1) onPlaybackEnd();
                    audioBufferPromise = nextAudioBufferPromise; // Move to the next promise
                    continue;
                }
                
                const source = ctx.createBufferSource();
                source.buffer = audioBuffer;
                source.playbackRate.value = playbackRate;
                source.connect(ctx.destination);
                source.start(nextStartTime);
                scheduledSourcesRef.current.push(source);
                
                if(i === 0) setTtsState({ id: message.id, status: 'PLAYING' });

                if (i === sentences.length - 1) {
                    source.onended = () => { onPlaybackEnd(); };
                }

                const typingDuration = audioBuffer.duration / playbackRate;
                const charDelay = typingDuration > 0.1 ? (typingDuration * 1000) / sentence.length : 25;

                for (const char of sentence) {
                    if (signal.aborted) throw new Error('Aborted');
                    setMessages(prev => prev.map(m => m.id === message.id ? { ...m, text: m.text + char } : m));
                    await new Promise(r => setTimeout(r, charDelay));
                }
                setMessages(prev => prev.map(m => m.id === message.id ? { ...m, text: m.text + ' ' } : m));

                nextStartTime += audioBuffer.duration / playbackRate;
                audioBufferPromise = nextAudioBufferPromise; // For the next iteration, we'll await the promise we just started.
            }
            
            await playbackFinishedPromise;
            if (!signal.aborted) {
                 setTtsState({ id: null, status: 'IDLE' });
            }

        } catch (e) {
            if (e.name !== 'AbortError' && e.message !== 'Aborted') {
                console.error("Streaming TTS process failed:", e);
                setTtsError("The Sage's voice could not be heard. Please try again.");
                setTtsState({ id: null, status: 'IDLE' });
                setMessages(prev => prev.map(m => m.id === message.id ? message : m));
            }
        }
    }, [ttsState, audioCache, selectedLanguage.name, selectedLanguage.code, stopCurrentPlayback, playbackRate]);


    // Background music and audio context management
    useEffect(() => {
        audioService.play();
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        }

        return () => {
            audioService.stop();
            stopCurrentPlayback();
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close().then(() => audioContextRef.current = null);
            }
        };
    }, [stopCurrentPlayback]);

    // Effect to populate initial message from story prop
    useEffect(() => {
        if (story) {
            const firstMessage: ChatMessageType = { id: `sage-${Date.now()}`, sender: 'sage', text: story };
            setMessages([firstMessage]);
            setSuggestions(initialSuggestions);
            playMessageWithStreamingAudio(firstMessage); // Autoplay the initial story
        } else {
            setMessages([]);
            setSuggestions([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [story, initialSuggestions]);

    // Auto-scroll chat
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSendMessage = useCallback(async (userInput: string) => {
        if (!userInput.trim() || isReplying) return;
        setIsReplying(true);
        setSuggestions([]);
        stopCurrentPlayback();

        const userMessage: ChatMessageType = { id: `user-${Date.now()}`, sender: 'user', text: userInput };
        const sagePlaceholderId = `sage-${Date.now()}`;
        const sagePlaceholderMessage: ChatMessageType = { id: sagePlaceholderId, sender: 'sage', text: '...' };

        const currentMessages = [...messages, userMessage];
        setMessages([...currentMessages, sagePlaceholderMessage]);

        const history = currentMessages.map(m => `${m.sender === 'sage' ? 'Sage' : 'User'}: ${m.text}`).join('\n\n');
        
        let fullResponseText = '';
        try {
            const stream = continueConversationStream(history, selectedLanguage.name);
            for await (const chunk of stream) {
                fullResponseText += chunk;
            }

            const suggestionDelimiter = '[SUGGESTIONS]';
            const delimiterIndex = fullResponseText.indexOf(suggestionDelimiter);
            let finalReply = fullResponseText.trim();
            let finalSuggestions: string[] = [];

            if (delimiterIndex !== -1) {
                finalReply = fullResponseText.substring(0, delimiterIndex).trim();
                const suggestionsJson = fullResponseText.substring(delimiterIndex + suggestionDelimiter.length).trim();
                try {
                    finalSuggestions = JSON.parse(suggestionsJson);
                } catch (e) {
                    console.error("Failed to parse final suggestions JSON:", e);
                    finalSuggestions = ["Tell me more about that.", "What does this symbolize?"];
                }
            }

            const finalSageMessage = { id: sagePlaceholderId, sender: 'sage' as const, text: finalReply };
            setMessages(prev => prev.map(m => m.id === sagePlaceholderId ? finalSageMessage : m));
            setSuggestions(finalSuggestions);
            playMessageWithStreamingAudio(finalSageMessage);

        } catch (e) {
            console.error(e);
            const errorMessage = "The Sage seems to be in deep meditation and cannot reply right now. Please try again later.";
            setMessages(prev => prev.map(m => m.id === sagePlaceholderId ? { ...m, text: errorMessage } : m));
        } finally {
            setIsReplying(false);
        }
    }, [messages, selectedLanguage.name, playMessageWithStreamingAudio, isReplying, stopCurrentPlayback]);


    return (
    <div className="bg-white/50 rounded-lg shadow-lg p-4 sm:p-8 w-full border border-amber-200/80">
      <div className="flex justify-between items-start mb-6">
        <div>
            <h2 className="text-3xl sm:text-4xl font-display text-amber-900">{topic.title}</h2>
            <p className="text-stone-600">{topic.description}</p>
        </div>
        <div className="flex items-center gap-4">
             <button
                onClick={handlePlaybackRateChange}
                className="bg-white/50 text-amber-800 px-4 py-2 rounded-md hover:bg-white transition-colors duration-200 shadow border border-amber-300 font-mono text-sm"
                title={`Change playback speed (current: ${playbackRate}x)`}
            >
                {playbackRate}x
            </button>
            <button
              onClick={() => {
                  stopCurrentPlayback();
                  onBack();
              }}
              className="bg-amber-600 text-white px-4 py-2 rounded-md hover:bg-amber-700 transition-colors duration-200 shadow"
            >
              &larr; Back
            </button>
        </div>
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
                isPlaying={true} // Animation is now independent
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
                        onPlayMessage={playMessageWithStreamingAudio}
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
                 <Suggestions suggestions={suggestions} onSuggestionClick={handleSendMessage} disabled={isReplying || isLoading || ttsState.status !== 'IDLE'} />
                 <ChatInput
                    onSendMessage={handleSendMessage}
                    disabled={isReplying || isLoading || ttsState.status !== 'IDLE'}
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