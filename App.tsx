import React, { useState, useCallback } from 'react';
import { Playbook } from './components/Playbook';
import { StoryDisplay } from './components/StoryDisplay';
import { LanguageSelector } from './components/LanguageSelector';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { retrieveHymns, TOPICS_CATEGORIZED, getTopicByTitle } from './services/rigvedaService';
import { generateStoryStream, generateP5jsAnimation, generateInitialSuggestions } from './services/geminiService';
import { cacheService } from './services/cacheService';
import { translateCachedStory } from './services/translationService';
import { LANGUAGES } from './services/languageService';
import { prefetchedStories } from './services/prefetched-stories';
import type { Topic, HymnChunk, Language } from './types';
import { ApiKeyManager } from './components/ApiKeyManager';
import TestingModal from './components/TestingModal';
import { getApiKey } from './utils/apiUtils';

const App: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(LANGUAGES[0]);
  const [story, setStory] = useState<string | null>(null);
  const [p5jsCode, setP5jsCode] = useState<string | null>(null);
  const [citations, setCitations] = useState<string[]>([]);
  const [initialSuggestions, setInitialSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleTopicSelect = useCallback(async (topicTitle: string) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);
    setStory(null);
    setP5jsCode(null);
    setCitations([]);
    setInitialSuggestions([]);
    
    const topic = getTopicByTitle(topicTitle);
    setSelectedTopic(topic);
    
    if (!topic) {
        setError("Selected topic not found.");
        setIsLoading(false);
        return;
    }

    const loadAnimation = async (): Promise<string> => {
        const englishPrefetched = prefetchedStories[topic.title]?.['en-US'];
        if (englishPrefetched?.p5jsCode) {
            return englishPrefetched.p5jsCode;
        }

        const cachedEnglish = cacheService.get(topic.title, 'en-US');
        if (cachedEnglish?.p5jsCode) {
            return cachedEnglish.p5jsCode;
        }

        const cachedSelectedLang = cacheService.get(topic.title, selectedLanguage.code);
        if (cachedSelectedLang?.p5jsCode) {
            return cachedSelectedLang.p5jsCode;
        }
        
        setLoadingMessage("The Sage is visualizing the narrative...");
        return generateP5jsAnimation(topic.title, topic.description);
    };

    const loadStory = async (): Promise<{ story: string; citations: string[]; suggestions: string[] }> => {
        // 1. Direct language match in prefetched stories
        const prefetchedData = prefetchedStories[topic.title]?.[selectedLanguage.code];
        if (prefetchedData) {
            return {
                story: prefetchedData.story,
                citations: prefetchedData.citations,
                suggestions: prefetchedData.suggestions || [],
            };
        }

        // 2. Check localStorage cache
        const cachedData = cacheService.get(topic.title, selectedLanguage.code);
        if (cachedData) {
            return {
                story: cachedData.story,
                citations: cachedData.citations,
                suggestions: cachedData.suggestions || [],
            };
        }

        // 3. Check for English prefetched story to translate
        const englishPrefetched = prefetchedStories[topic.title]?.['en-US'];
        if (englishPrefetched && selectedLanguage.code !== 'en-US') {
            setLoadingMessage("The Sage is translating ancient texts...");
            const translatedData = await translateCachedStory(englishPrefetched, selectedLanguage.name);
            return {
                story: translatedData.story,
                citations: englishPrefetched.citations,
                suggestions: translatedData.suggestions,
            };
        }
        
        // 4. Generate story and suggestions if not found in any cache
        setLoadingMessage("The Sage is weaving the tale...");
        const context: HymnChunk[] = await retrieveHymns(topic.keywords);
        
        const query = `As the Vedic Sage, tell me a story about ${topic.title} in ${selectedLanguage.name}. Explain its significance and meaning, drawing upon the ancient hymns. Generate the story in the native script for ${selectedLanguage.name}, unless it is a transliterated language like Hinglish, in which case use the Latin script.`;
        const storyStream = generateStoryStream(query, context);
        
        let fullStory = '';
        const uniqueCitations = new Set<string>();
        for await (const chunk of storyStream) {
            fullStory += chunk.text;
            const citationRegex = /RV \d+\.\d+(\.\d+)?/g;
            const foundCitations = fullStory.match(citationRegex);
            if (foundCitations) {
                foundCitations.forEach(c => uniqueCitations.add(c));
            }
        }
        const storyCitations = Array.from(uniqueCitations);
        
        setLoadingMessage("The Sage is pondering further questions...");
        const suggestions = await generateInitialSuggestions(fullStory, selectedLanguage.name);
        
        return { story: fullStory, citations: storyCitations, suggestions };
    };

    try {
        const animationPromise = loadAnimation();
        const storyPromise = loadStory();

        // Set animation state as soon as it's ready for immediate rendering.
        // This makes the UI feel much faster.
        animationPromise.then(code => {
            setP5jsCode(code);
        }).catch(err => {
            console.error("Failed to load animation:", err);
            setError("The Sage's vision could not be rendered.");
        });

        // Wait for the story content to be ready.
        const storyData = await storyPromise;

        // Set the story content state.
        setStory(storyData.story);
        setCitations(storyData.citations);
        setInitialSuggestions(storyData.suggestions);

        // Wait for the animation promise to resolve to get the code for caching.
        const animationCode = await animationPromise;

        // Cache the combined result for future visits.
        cacheService.set(topic.title, {
            story: storyData.story,
            p5jsCode: animationCode,
            citations: storyData.citations,
            language: selectedLanguage.code,
            suggestions: storyData.suggestions,
        }, selectedLanguage.code);
      
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "The sage is currently in deep meditation. Please try again later.");
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [isLoading, selectedLanguage.code, selectedLanguage.name]);
  
  const handleBack = () => {
    setSelectedTopic(null);
    setStory(null);
    setP5jsCode(null);
    setCitations([]);
    setInitialSuggestions([]);
  };

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
            p5jsCode={p5jsCode}
            citations={citations}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
            onBack={handleBack}
            selectedLanguage={selectedLanguage}
            initialSuggestions={initialSuggestions}
          />
        ) : (
          <div>
            <ApiKeyManager />
            <div className="text-center mb-8 p-4 bg-amber-50/50 rounded-lg border border-amber-200">
                <div className="max-w-xs mx-auto mb-6">
                  <LanguageSelector
                    languages={LANGUAGES}
                    selectedLanguage={selectedLanguage}
                    onSelect={setSelectedLanguage}
                    disabled={isLoading}
                  />
                </div>
                <h2 className="text-2xl font-display text-amber-900">Choose a Path of Wisdom</h2>
                <p className="mt-2 text-stone-700 max-w-3xl mx-auto">Select a deity, concept, or hymn from the sacred playbook below. The Sage will weave a tale from the ancient verses of the Rigveda, illuminating its timeless knowledge.</p>
            </div>
            <Playbook topics={TOPICS_CATEGORIZED} onSelect={handleTopicSelect} />
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
      
      <TestingModal
        selectedTopic={selectedTopic}
        selectedLanguage={selectedLanguage}
        story={story}
        p5jsCode={p5jsCode}
        citations={citations}
        initialSuggestions={initialSuggestions}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        error={error}
        messages={[]}
        suggestions={[]}
        isReplying={false}
        ttsState={{ id: null, status: 'IDLE' }}
        ttsError={null}
        audioCacheSize={0}
        playbackRate={1.25}
        apiKey={getApiKey()}
      />
    </div>
  );
};

export default App;