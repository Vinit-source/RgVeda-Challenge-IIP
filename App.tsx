
import React, { useState, useCallback, useRef } from 'react';
import { Playbook } from './components/Playbook';
import { StoryDisplay } from './components/StoryDisplay';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { retrieveHymns, TOPICS, getTopicByTitle } from './services/rigvedaService';
import { generateStoryStream, synthesizeSpeech } from './services/geminiService';
import { useAudioPlayer } from './hooks/useAudioPlayer';
import type { Topic, HymnChunk } from './types';

const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [story, setStory] = useState<string>('');
  const [citations, setCitations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const { addToQueue, isPlaying } = useAudioPlayer();
  const storyBuffer = useRef<string>('');

  const processStoryStream = useCallback(async <T,>(
    stream: AsyncGenerator<T, void, unknown>,
    processChunk: (chunk: T) => string
  ) => {
    let fullStory = '';
    const uniqueCitations = new Set<string>();

    for await (const chunk of stream) {
      const text = processChunk(chunk);
      fullStory += text;
      storyBuffer.current += text;
      setStory(prev => prev + text);
      
      const citationRegex = /RV \d+\.\d+/g;
      const foundCitations = fullStory.match(citationRegex);
      if (foundCitations) {
          foundCitations.forEach(c => uniqueCitations.add(c));
          setCitations(Array.from(uniqueCitations));
      }

      // Buffer sentences for TTS
      const sentences = storyBuffer.current.split(/(?<=[.?!])\s+/);
      if (sentences.length > 1) {
        const completeSentences = sentences.slice(0, -1);
        storyBuffer.current = sentences[sentences.length - 1];

        for (const sentence of completeSentences) {
          if (sentence.trim().length > 0) {
            try {
              const audioData = await synthesizeSpeech(sentence);
              addToQueue(audioData);
            } catch (e) {
              console.error("Speech synthesis failed for sentence:", e);
              // Continue without audio for this sentence
            }
          }
        }
      }
    }
     // Process any remaining text in the buffer
    if (storyBuffer.current.trim().length > 0) {
        try {
            const audioData = await synthesizeSpeech(storyBuffer.current);
            addToQueue(audioData);
            storyBuffer.current = '';
        } catch(e) {
            console.error("Speech synthesis failed for remaining buffer:", e);
        }
    }
  }, [addToQueue]);

  const handleTopicSelect = useCallback(async (topicTitle: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setStory('');
    setCitations([]);
    storyBuffer.current = '';
    
    const topic = getTopicByTitle(topicTitle);
    setSelectedTopic(topic);
    
    if (!topic) {
        setError("Selected topic not found.");
        setIsLoading(false);
        return;
    }

    try {
      const context: HymnChunk[] = retrieveHymns(topic.keywords);
      const query = `As the Vedic Sage, tell me a story about ${topic.title}. Explain its significance and meaning, drawing upon the ancient hymns.`;
      
      const storyStream = generateStoryStream(query, context);
      await processStoryStream(storyStream, (chunk) => chunk.text);
      
    } catch (e) {
      console.error(e);
      setError("The sage is currently in deep meditation. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, processStoryStream]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-amber-50 to-orange-100 text-stone-900 flex flex-col items-center p-4 sm:p-6 md:p-8">
      <header className="w-full max-w-5xl text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-bold font-display text-amber-800 tracking-wider">The Vedic Sage</h1>
        <p className="text-lg md:text-xl text-stone-600 mt-2">An AI-Powered Journey into the Rigveda</p>
      </header>
      
      <main className="w-full max-w-5xl flex-grow">
        {selectedTopic ? (
          <StoryDisplay
            topic={selectedTopic}
            story={story}
            citations={citations}
            isLoading={isLoading}
            isPlaying={isPlaying}
            onBack={() => setSelectedTopic(null)}
          />
        ) : (
          <div>
            <div className="text-center mb-8 p-4 bg-amber-50/50 rounded-lg border border-amber-200">
                <h2 className="text-2xl font-display text-amber-900">Choose a Path of Wisdom</h2>
                <p className="mt-2 text-stone-700 max-w-3xl mx-auto">Select a deity, concept, or hymn from the sacred playbook below. The Sage will weave a tale from the ancient verses of the Rigveda, illuminating its timeless knowledge.</p>
            </div>
            <Playbook topics={TOPICS} onSelect={handleTopicSelect} />
          </div>
        )}
      </main>

      <footer className="w-full max-w-5xl text-center mt-8 p-4 text-stone-500 text-sm">
        <p>Crafted with <SparklesIcon className="inline-block h-4 w-4 text-amber-500" /> Generative AI. Narratives are interpretations grounded in the Rigveda.</p>
      </footer>
       {error && (
        <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg" role="alert">
          <strong className="font-bold">An error occurred:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      )}
    </div>
  );
};

export default App;
