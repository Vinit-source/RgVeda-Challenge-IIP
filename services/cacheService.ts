
import type { CachedStory } from '../types';

const CACHE_PREFIX = 'vedicSageCache_';

export const cacheService = {
  /**
   * Retrieves a cached story for a given topic title and language.
   * @param topicTitle - The title of the topic.
   * @param languageCode - The code for the selected language (e.g., 'en-US', 'hi-IN').
   * @returns The cached story object or null if not found.
   */
  get: (topicTitle: string, languageCode: string): CachedStory | null => {
    try {
      const key = `${CACHE_PREFIX}${topicTitle}_${languageCode}`;
      const item = localStorage.getItem(key);
      if (item) {
        return JSON.parse(item) as CachedStory;
      }
      return null;
    } catch (error) {
      console.error("Failed to retrieve from cache:", error);
      return null;
    }
  },

  /**
   * Saves a story to the cache.
   * @param topicTitle - The title of the topic.
   * @param data - The story data to cache.
   * @param languageCode - The code for the selected language.
   */
  set: (topicTitle: string, data: CachedStory, languageCode: string): void => {
    try {
      const key = `${CACHE_PREFIX}${topicTitle}_${languageCode}`;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save to cache:", error);
      // Fails silently, caching is a non-critical feature.
    }
  },
};
