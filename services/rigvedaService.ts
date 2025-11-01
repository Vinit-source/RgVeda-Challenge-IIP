import type { HymnChunk, Topic } from '../types';
import { GoogleGenAI } from '@google/genai';
import { searchSimilarDocuments } from '../lib/supabase';
import { getApiKey } from '../utils/apiUtils';
import { rigveda_db } from './rigveda_db';

const BASE_URL = "https://raw.githubusercontent.com/Vinit-source/RgVeda-Challenge-IIP/refs/heads/dev/public/"
export const TOPICS_CATEGORIZED: { [key: string]: Topic[] } = {
    Deities: [
        {
            title: "Surya, The Sun God",
            description: "The all-seeing eye of the cosmos, riding his chariot across the sky.",
            keywords: ["surya", "sun", "सूर्य"],
            image: "https://live.staticflickr.com/65535/54893157756_6b3b918e79.jpg"
        },
        {
            title: "Agni, The Fire God",
            description: "Explore hymns to the god of fire, the priest of the gods and messenger for the sacrifice.",
            keywords: ["agni", "fire", "priest", "messenger", "अग्नि"],
            image: "https://live.staticflickr.com/65535/54893157706_eb7d820902_w.jpg" 
        },
        {
            title: "Indra, King of Gods",
            description: "The powerful king of the Devas, a heroic god of thunder, storms, and war.",
            keywords: ["indra", "storm", "thunder", "इंद्र", "इन्द्र"],
            image: "https://live.staticflickr.com/65535/54892276107_6cc4fe56f9_z.jpg"
        },
        {
            title: "Vayu, Lord of the Wind",
            description: "The swift god of the wind, the first to drink the Soma offering.",
            keywords: ["vayu", "wind", "वायु"],
            image: "https://live.staticflickr.com/65535/54893383013_59b5e17485_w.jpg"
        },
        {
            title: "Varuna, Cosmic Law Keeper",
            description: "The sovereign god of cosmic order (Rta), the sky, and the celestial ocean.",
            keywords: ["varuna", "rta", "cosmic order", "वरुण"],
            image: "https://live.staticflickr.com/65535/54893451720_855f042e79_w.jpg"
        },
        {
            title: "The Maruts, Storm Deities",
            description: "Tales of the fierce storm gods who ride with Indra, wielding lightning and thunder.",
            keywords: ["maruts", "storm", "rudra", "wind", "मरुत"],
            image: "https://live.staticflickr.com/65535/54893382883_a7c4580c39.jpg"
        },
        {
            title: "Sarasvati, Goddess of Wisdom",
            description: "Invoke the goddess of knowledge, music, art, and the sacred river.",
            keywords: ["saraswati", "river", "knowledge", "goddess", "सरस्वती"],
            image: "https://live.staticflickr.com/65535/54893157761_13db7d71e9.jpg" 
        },
        {
            title: "Rudra, The Fierce God",
            description: "A fierce deity associated with storms, wind, and the hunt, possessing a fearsome and healing nature.",
            keywords: ["rudra", "storm", "healer", "रुद्र"],
            image: "https://live.staticflickr.com/65535/54892276112_800faeb25e.jpg"
        },
        {
            title: "Ashvins, Divine Twin Horsemen",
            description: "Discover the benevolent twin horsemen associated with dawn, healing, and rescue.",
            keywords: ["ashvin", "ashvins", "twins", "healing", "अश्विनीकुमार", "अश्विनौ"],
            image: "https://live.staticflickr.com/65535/54893451670_ca502c1367_b.jpg"
        },
        {
            title: "Soma, Plant of Immortality",
            description: "The deified plant whose juice is a drink of the gods, granting inspiration and power.",
            keywords: ["soma", "plant", "immortality", "सोम"],
            image:"https://live.staticflickr.com/65535/54892276142_3d19dc22d3.jpg"
        },
        {
            title: "Usha, Goddess of Dawn",
            description: "Behold the beauty of the goddess of dawn who brings light and life to the world.",
            keywords: ["usha", "dawn", "light", "उषा"],
            image: BASE_URL + "images/Usha.webp?token=GHSAT0AAAAAADNQTPJPT757QHNCXHE7ZDZC2IFITOA"
        },
        
        
        
        
    ],
    Rishis: [
        {
            title: "Madhuchhandas Vaishvamitra",
            description: "Son of Vishvamitra, composer of the opening hymns of the Ṛgveda to Agni and Indra.",
            keywords: ["madhuchhandas", "vishvamitra", " विश्वामित्र", "मधुच्छन्दस्"],
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRO7lqLxawl4iIgCZm3ITr6ZOxNCxgL78Arw&s"
        },
        {
            title: "Vishvamitra",
            description: "A great king who became a revered Rishi, credited with composing most of Mandala 3.",
            keywords: ["vishvamitra", "विश्वामित्र"],
            image: "https://live.staticflickr.com/65535/54893451775_0ce6f749a0_w.jpg"
        },
        {
            title: "Vasistha",
            description: "A revered Brahmarshi known for his wisdom and as the author of several hymns.",
            keywords: ["vasistha", "वसिष्ठ"],
            image: "https://live.staticflickr.com/65535/54893405614_2b7df4738f_w.jpg"
        {
            title: "Gautama",
            description: "A renowned Rishi, traditionally considered the author of one of the mandalas in RgVeda.",
            keywords: ["gautama", "गौतम"],
            image: "https://live.staticflickr.com/65535/54893382893_70594cb080_z.jpg"

        },
        {
            title: "Bhrigu",
            description: "A renowned Rishi, traditionally considered the author of one of the mandalas in RgVeda",
            keywords: ["bhrigu", "भृगु"],
            image: "https://live.staticflickr.com/65535/54893382898_bd8e69c07e_b.jpg"
        }
    ],
    "Locations, Objects & Concepts": [
        {
            title: "Sapta Sindhu, Land of Seven Rivers",
            description: "The sacred land defined by seven major rivers, the heartland of Vedic civilization.",
            keywords: ["sapta sindhu", "seven rivers", "sindhu", "सप्त सिन्धु"],
            image:"https://upload.wikimedia.org/wikipedia/commons/0/02/Map_of_Vedic_India.png"
        },
        {
            title: "Rita, Cosmic Order",
            description: "The principle of natural order which regulates and coordinates the operation of the universe.",
            keywords: ["rta", "rita", "cosmic order", "ऋत"],
            image: "https://live.staticflickr.com/65535/54893451755_1de62ddf84_w.jpg"
        },
        {
            title: "Yajna, Sacrifice",
            description: "The ritual of offering, a central practice for communicating with and nourishing the gods.",
            keywords: ["yajna", "sacrifice", "ritual", "यज्ञ"],
            image: "https://live.staticflickr.com/65535/54893383033_03fece280f_w.jpg"
        },
        {
            title: "Soma Pressing Ritual",
            description: "The ritual preparation of the sacred Soma juice, a key element of Vedic sacrifice.",
            keywords: ["soma", "pressing", "ritual", "सोम"],
            image: "https://live.staticflickr.com/65535/54893157736_67b774e57a.jpg"
        },
    ]
};

const ALL_TOPICS: Topic[] = Object.values(TOPICS_CATEGORIZED).flat();

export const getTopicByTitle = (title: string): Topic | undefined => ALL_TOPICS.find(t => t.title === title);

/**
 * Retrieves relevant hymn chunks from Supabase using vector similarity search,
 * with a fallback to local keyword search.
 * 
 * @param keywords - Array of keywords to search for
 * @returns Promise<HymnChunk[]> - Array of relevant hymn chunks
 */
export const retrieveHymns = async (keywords: string[]): Promise<HymnChunk[]> => {
  try {
    // Combine keywords into a search query
    const searchQuery = keywords.join(' ');
    console.log('Retrieving hymns for query from Supabase:', searchQuery);

    // Initialize Gemini AI client
    const apiKey = getApiKey();
    if (!apiKey) {
      // If no API key, Supabase will fail, so go directly to fallback.
      console.log("No API Key loaded")
    }
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
      console.warn('Failed to generate embedding for query, falling back.');
      throw new Error('Embedding generation failed.');
    }
    
    // Search in Supabase using vector similarity
    const searchResults = await searchSimilarDocuments(queryEmbedding, {
      topK: 10,
      threshold: 0.0,
      docId: undefined,
    });

    if (searchResults.length === 0) {
        console.warn('No results from Supabase, falling back.');
        throw new Error('No results from Supabase.');
    }
    
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
    console.error('Error retrieving hymns from Supabase, falling back to local DB:', error);
    
    // Fallback to local keyword search on rigveda_db
    const lowerCaseKeywords = keywords.map(k => k.toLowerCase());
    const matchedHymns = rigveda_db.filter(hymn => {
        const textToSearch = `${hymn.text} ${hymn.deity} ${hymn.rishi}`.toLowerCase();
        return lowerCaseKeywords.some(keyword => textToSearch.includes(keyword));
    });

    if (matchedHymns.length === 0) {
        // If still no matches, return a random selection as a last resort to provide some context.
        console.log("No keyword matches in fallback, returning a few hymns from local DB.");
        return rigveda_db.slice(0, 5);
    }
    
    console.log(`Found ${matchedHymns.length} hymns from local fallback.`);
    return matchedHymns;
  }
};