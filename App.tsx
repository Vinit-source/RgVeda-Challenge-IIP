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

    try {
      // 1. Check prefetched stories for a direct language match
      const prefetchedData = prefetchedStories[topic.title]?.[selectedLanguage.code];
      if (prefetchedData) {
          setStory(prefetchedData.story);
          setP5jsCode(prefetchedData.p5jsCode);
          setCitations(prefetchedData.citations);
          setInitialSuggestions(prefetchedData.suggestions || []);
          setIsLoading(false);
          return;
      }

      // 2. Check localStorage cache
      const cachedData = cacheService.get(topic.title, selectedLanguage.code);
      if (cachedData) {
          setStory(cachedData.story);
          setP5jsCode(cachedData.p5jsCode);
          setCitations(cachedData.citations);
          setInitialSuggestions(cachedData.suggestions || []);
          setIsLoading(false);
          return;
      }

      // 3. Check for English prefetched story to translate
      const englishPrefetchedData = prefetchedStories[topic.title]?.['en-US'];
      if (englishPrefetchedData && selectedLanguage.code !== 'en-US') {
        setLoadingMessage("The Sage is translating ancient texts...");
        const translatedData = await translateCachedStory(englishPrefetchedData, selectedLanguage.name);
        
        setStory(translatedData.story);
        setP5jsCode(englishPrefetchedData.p5jsCode); // p5js code doesn't need translation
        setCitations(englishPrefetchedData.citations); // citations don't need translation
        setInitialSuggestions(translatedData.suggestions);

        // Cache the newly translated story
        cacheService.set(topic.title, {
            story: translatedData.story,
            p5jsCode: englishPrefetchedData.p5jsCode,
            citations: englishPrefetchedData.citations,
            language: selectedLanguage.code,
            suggestions: translatedData.suggestions,
        }, selectedLanguage.code);

        setIsLoading(false);
        return;
      }

      // 4. Generate story and animation if not found in any cache
      setLoadingMessage("The Sage is contemplating the hymns and visualizing the narrative...");
      const context: HymnChunk[] = retrieveHymns(topic.keywords);
      
      // Start both tasks in parallel
      const animationPromise = generateP5jsAnimation(topic.title, topic.description);
      
      const storyPromise = (async () => {
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
        return { fullStory, storyCitations };
      })();

      // Await animation code first, so it can start rendering immediately
      const animationCode = await animationPromise;
      setP5jsCode(animationCode);

      // Then await the story and its data
      const { fullStory, storyCitations } = await storyPromise;
      setStory(fullStory);
      setCitations(storyCitations);
      
      // Then generate suggestions based on the story
      setLoadingMessage("The Sage is pondering further questions...");
      const suggestions = await generateInitialSuggestions(fullStory, selectedLanguage.name);
      setInitialSuggestions(suggestions);

      // Now that everything is generated, cache it
      cacheService.set(topic.title, {
          story: fullStory,
          p5jsCode: animationCode,
          citations: storyCitations,
          language: selectedLanguage.code,
          suggestions: suggestions,
      }, selectedLanguage.code);
      
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "The sage is currently in deep meditation. Please try again later.");
    } finally {
      setIsLoading(false);
      setLoadingMessage('');
    }
  }, [isLoading, selectedLanguage]);
  
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
    </div>
  );
};

export default App;