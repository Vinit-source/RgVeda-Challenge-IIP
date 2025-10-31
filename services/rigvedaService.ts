
import type { HymnChunk, Topic } from '../types';
import { GoogleGenAI } from '@google/genai';
import { searchSimilarDocuments } from '../lib/supabase';
import { getApiKey } from '../utils/apiUtils';

export const TOPICS_CATEGORIZED: { [key: string]: Topic[] } = {
    Deities: [
        {
            title: "Agni, The Divine Messenger",
            description: "Explore hymns to the god of fire, the priest of the gods and messenger for the sacrifice.",
            keywords: ["agni", "fire", "priest", "messenger", "अग्नि"],
            image: "https://picsum.photos/seed/agni/600/400"
        },
        {
            title: "Indra, King of Gods",
            description: "The powerful king of the Devas, a heroic god of thunder, storms, and war.",
            keywords: ["indra", "storm", "thunder", "इंद्र", "इन्द्र"],
            image: "https://picsum.photos/seed/indra/600/400"
        },
        {
            title: "Soma, Plant of Immortality",
            description: "The deified plant whose juice is a drink of the gods, granting inspiration and power.",
            keywords: ["soma", "plant", "immortality", "सोम"],
            image: "https://picsum.photos/seed/soma/600/400"
        },
        {
            title: "The Ashvins, Divine Twins",
            description: "Discover the benevolent twin horsemen associated with dawn, healing, and rescue.",
            keywords: ["ashvin", "ashvins", "twins", "healing", "अश्विनीकुमार", "अश्विनौ"],
            image: "https://picsum.photos/seed/ashvins/600/400"
        },
        {
            title: "Ushas, The Dawn",
            description: "Behold the beauty of the goddess of dawn who brings light and life to the world.",
            keywords: ["ushas", "dawn", "light", "उषा"],
            image: "https://picsum.photos/seed/ushas/600/400"
        },
        {
            title: "Varuna, Cosmic Law Keeper",
            description: "The sovereign god of cosmic order (Rta), the sky, and the celestial ocean.",
            keywords: ["varuna", "rta", "cosmic order", "वरुण"],
            image: "https://picsum.photos/seed/varuna/600/400"
        },
        {
            title: "Saraswati, River of Inspiration",
            description: "Invoke the goddess of knowledge, music, art, and the sacred river.",
            keywords: ["saraswati", "river", "knowledge", "goddess", "सरस्वती"],
            image: "https://picsum.photos/seed/saraswati/600/400"
        },
        {
            title: "The Maruts, Storm Deities",
            description: "Tales of the fierce storm gods who ride with Indra, wielding lightning and thunder.",
            keywords: ["maruts", "storm", "rudra", "wind", "मरुत"],
            image: "https://picsum.photos/seed/maruts/600/400"
        },
        {
            title: "Surya, The Sun God",
            description: "The all-seeing eye of the cosmos, riding his chariot across the sky.",
            keywords: ["surya", "sun", "सूर्य"],
            image: "https://picsum.photos/seed/surya/600/400"
        },
        {
            title: "Vayu, Lord of the Wind",
            description: "The swift god of the wind, the first to drink the Soma offering.",
            keywords: ["vayu", "wind", "वायु"],
            image: "https://picsum.photos/seed/vayu/600/400"
        },
        {
            title: "Rudra, The Howler",
            description: "A fierce deity associated with storms, wind, and the hunt, possessing a fearsome and healing nature.",
            keywords: ["rudra", "storm", "healer", "रुद्र"],
            image: "https://picsum.photos/seed/rudra/600/400"
        },
    ],
    Rishis: [
        {
            title: "Madhuchhandas Vaishvamitra",
            description: "Son of Vishvamitra, composer of the opening hymns of the Rigveda to Agni and Indra.",
            keywords: ["madhuchhandas", "vishvamitra", " विश्वामित्र", "मधुच्छन्दस्"],
            image: "https://picsum.photos/seed/madhuchhandas/600/400"
        },
        {
            title: "Vishvamitra",
            description: "A great king who became a revered Rishi, credited with composing most of Mandala 3.",
            keywords: ["vishvamitra", "विश्वामित्र"],
            image: "https://picsum.photos/seed/vishvamitra-rishi/600/400"
        },
        {
            title: "Gritsamada",
            description: "A renowned Rishi, traditionally considered the author of most hymns in Mandala 2.",
            keywords: ["gritsamada", "गृत्समद"],
            image: "https://picsum.photos/seed/gritsamada/600/400"
        },
    ],
    "Locations, Objects & Concepts": [
        {
            title: "The Seven Rivers (Sapta Sindhu)",
            description: "The sacred land defined by seven major rivers, the heartland of Vedic civilization.",
            keywords: ["sapta sindhu", "seven rivers", "sindhu", "सप्त सिन्धु"],
            image: "https://picsum.photos/seed/saptasindhu/600/400"
        },
        {
            title: "Rta, Cosmic Order",
            description: "The principle of natural order which regulates and coordinates the operation of the universe.",
            keywords: ["rta", "rita", "cosmic order", "ऋत"],
            image: "https://picsum.photos/seed/rta/600/400"
        },
        {
            title: "Yajna, The Sacrifice",
            description: "The ritual of offering, a central practice for communicating with and nourishing the gods.",
            keywords: ["yajna", "sacrifice", "ritual", "यज्ञ"],
            image: "https://picsum.photos/seed/yajna/600/400"
        },
        {
            title: "Soma Pressing Ritual",
            description: "The ritual preparation of the sacred Soma juice, a key element of Vedic sacrifice.",
            keywords: ["soma", "pressing", "ritual", "सोम"],
            image: "https://picsum.photos/seed/somapressing/600/400"
        },
    ]
};

const ALL_TOPICS: Topic[] = Object.values(TOPICS_CATEGORIZED).flat();

export const getTopicByTitle = (title: string): Topic | undefined => ALL_TOPICS.find(t => t.title === title);

/**
 * Retrieves relevant hymn chunks from Supabase using vector similarity search.
 * Uses Gemini embeddings to find semantically similar hymns based on keywords.
 * 
 * @param keywords - Array of keywords to search for
 * @returns Promise<HymnChunk[]> - Array of relevant hymn chunks
 */
export const retrieveHymns = async (keywords: string[]): Promise<HymnChunk[]> => {
  try {
    // Combine keywords into a search query
    const searchQuery = keywords.join(' ');
    
    // Initialize Gemini AI client
    const apiKey = getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    
    // Generate embedding for the search query
    const result = await ai.models.embedContent({
      model: 'gemini-embedding-001',
      contents: searchQuery,
      config: {
        outputDimensionality: 1536,
        taskType: 'RETRIEVAL_QUERY',
      }
    });
    
    const queryEmbedding = result.embeddings?.[0]?.values || [];
    
    if (queryEmbedding.length === 0) {
      console.warn('Failed to generate embedding for query');
      return [];
    }
    
    // Search in Supabase using vector similarity
    const searchResults = await searchSimilarDocuments(queryEmbedding, {
      topK: 10,
      threshold: 0.0,
      docId: undefined,
    });
    
    // Map Supabase results to HymnChunk format
    const hymnChunks: HymnChunk[] = searchResults.map(result => ({
      source: 'Rgveda',
      mandala: result.mandala ? parseInt(result.mandala) : 0,
      sukta: result.sukta ? parseInt(result.sukta) : 0,
      text: result.text,
      deity: result.deity || '',
      rishi: '', // Supabase doesn't have rishi field, set to empty string
    }));
    
    return hymnChunks;
  } catch (error) {
    console.error('Error retrieving hymns from Supabase:', error);
    // Return empty array on error to prevent app crash
    return [];
  }
};

