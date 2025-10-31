
import type { HymnChunk, Topic } from '../types';
import { GoogleGenAI } from '@google/genai';
import { searchSimilarDocuments } from '../lib/supabase';
import { getApiKey } from '../utils/apiUtils';

export const TOPICS_CATEGORIZED: { [key: string]: Topic[] } = {
    Deities: [
        {
            title: "Surya, The Sun God",
            description: "The all-seeing eye of the cosmos, riding his chariot across the sky.",
            keywords: ["surya", "sun", "सूर्य"],
            image: "/images/Surya.jpg"
        },
        {
            title: "Agni, The Fire God",
            description: "Explore hymns to the god of fire, the priest of the gods and messenger for the sacrifice.",
            keywords: ["agni", "fire", "priest", "messenger", "अग्नि"],
            image: "/images/Agni.jpg"
        },
        {
            title: "Indra, King of Gods",
            description: "The powerful king of the Devas, a heroic god of thunder, storms, and war.",
            keywords: ["indra", "storm", "thunder", "इंद्र", "इन्द्र"],
            image: "/images/Indra.jpg"
        },
        {
            title: "Vayu, Lord of the Wind",
            description: "The swift god of the wind, the first to drink the Soma offering.",
            keywords: ["vayu", "wind", "वायु"],
            image: "/images/Vayu.jpg"
        },
        {
            title: "Varuna, Cosmic Law Keeper",
            description: "The sovereign god of cosmic order (Rta), the sky, and the celestial ocean.",
            keywords: ["varuna", "rta", "cosmic order", "वरुण"],
            image: "/images/Varuna.jpg"
        },
        {
            title: "The Maruts, Storm Deities",
            description: "Tales of the fierce storm gods who ride with Indra, wielding lightning and thunder.",
            keywords: ["maruts", "storm", "rudra", "wind", "मरुत"],
            image: "/images/Maruts.jpg"
        },
        {
            title: "Sarasvati, Goddess of Wisdom",
            description: "Invoke the goddess of knowledge, music, art, and the sacred river.",
            keywords: ["saraswati", "river", "knowledge", "goddess", "सरस्वती"],
            image: "/images/Saraswati.jpg"
        },
        {
            title: "Rudra, The Fierce God",
            description: "A fierce deity associated with storms, wind, and the hunt, possessing a fearsome and healing nature.",
            keywords: ["rudra", "storm", "healer", "रुद्र"],
            image: "/images/Rudra.jpg"
        },
        {
            title: "Ashvins, Divine Twin Horsemen",
            description: "Discover the benevolent twin horsemen associated with dawn, healing, and rescue.",
            keywords: ["ashvin", "ashvins", "twins", "healing", "अश्विनीकुमार", "अश्विनौ"],
            image: "/images/Ashwins.jpg"
        },
        {
            title: "Soma, Plant of Immortality",
            description: "The deified plant whose juice is a drink of the gods, granting inspiration and power.",
            keywords: ["soma", "plant", "immortality", "सोम"],
            image: "/images/Soma.jpg"
        },
        {
            title: "Usha, Goddess of Dawn",
            description: "Behold the beauty of the goddess of dawn who brings light and life to the world.",
            keywords: ["usha", "dawn", "light", "उषा"],
            image: "/images/Usha.webp"
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
            image: "/images/Vishvamitra.jpg"
        },
        {
            title: "Vasistha",
            description: "A revered Brahmarshi known for his wisdom and as the author of several hymns.",
            keywords: ["vasistha", "वसिष्ठ"],
            image: "/images/Vasistha.jpg"
        },
        {
            title: "Gautama",
            description: "A renowned Rishi, traditionally considered the author of one of the mandalas in RgVeda.",
            keywords: ["gautama", "गौतम"],
            image: "/images/Gautama.jpg"
        },
        {
            title: "Bhrigu",
            description: "A renowned Rishi, traditionally considered the author of one of the mandalas in RgVeda",
            keywords: ["bhrigu", "भृगु"],
            image: "/images/Bhrigu.jpg"
        }
    ],
    "Locations, Objects & Concepts": [
        {
            title: "Sapta Sindhu, Land of Seven Rivers",
            description: "The sacred land defined by seven major rivers, the heartland of Vedic civilization.",
            keywords: ["sapta sindhu", "seven rivers", "sindhu", "सप्त सिन्धु"],
            image: "/images/SaptaSindhu.jpg"
        },
        {
            title: "Rita, Cosmic Order",
            description: "The principle of natural order which regulates and coordinates the operation of the universe.",
            keywords: ["rta", "rita", "cosmic order", "ऋत"],
            image: "/images/rta.jpg"
        },
        {
            title: "Yajna, Sacrifice",
            description: "The ritual of offering, a central practice for communicating with and nourishing the gods.",
            keywords: ["yajna", "sacrifice", "ritual", "यज्ञ"],
            image: "/images/yajna.jpg"
        },
        {
            title: "Soma Pressing Ritual",
            description: "The ritual preparation of the sacred Soma juice, a key element of Vedic sacrifice.",
            keywords: ["soma", "pressing", "ritual", "सोम"],
            image: "/images/SomaPressing.jpg"
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
    console.log('Retrieving hymns for query:', searchQuery);

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

