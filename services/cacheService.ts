
import type { CachedStory } from '../types';

const CACHE_PREFIX = 'vedicSageCache_';

export const cacheService = {
  /**
   * Retrieves a cached story for a given topic title.
   * @param topicTitle - The title of the topic.
   * @returns The cached story object or null if not found.
   */
  get: (topicTitle: string): CachedStory | null => {
    try {
      const key = CACHE_PREFIX + topicTitle;
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
   */
  set: (topicTitle: string, data: CachedStory): void => {
    try {
      const key = CACHE_PREFIX + topicTitle;
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error("Failed to save to cache:", error);
      // Fails silently, caching is a non-critical feature.
    }
  },
};
