import { GoogleGenAI, Type } from "@google/genai";
import type { CachedStory } from '../types';
import { getApiKey } from '../utils/apiUtils';

const ai = new GoogleGenAI({ apiKey: getApiKey() });

const TRANSLATION_SCHEMA = {
    type: Type.OBJECT,
    properties: {
        translatedStory: {
            type: Type.STRING,
            description: "The translated version of the story."
        },
        translatedSuggestions: {
            type: Type.ARRAY,
            description: "The translated version of the array of suggestion strings.",
            items: {
                type: Type.STRING
            }
        }
    },
    required: ['translatedStory', 'translatedSuggestions']
};

interface TranslationResponse {
    translatedStory: string;
    translatedSuggestions: string[];
}

/**
 * Translates the story and suggestions of a CachedStory object to a target language.
 * @param storyToTranslate - The story object (in English) to be translated.
 * @param targetLanguage - The name of the language to translate to (e.g., "Hindi (हिन्दी)").
 * @returns A promise that resolves to an object with the translated story and suggestions.
 */
export const translateCachedStory = async (
    storyToTranslate: Omit<CachedStory, 'language'>,
    targetLanguage: string
): Promise<{ story: string; suggestions: string[] }> => {
    const model = 'gemini-2.5-flash';

    const prompt = `You are an expert translator specializing in ancient religious and poetic texts. Your task is to translate the following content from English to ${targetLanguage}.
    
    Preserve the poetic, reverent, and wise tone of the original text. The suggestions should be translated into natural-sounding questions in the target language.
    
    Translate the following JSON object:
    ${JSON.stringify({ story: storyToTranslate.story, suggestions: storyToTranslate.suggestions }, null, 2)}
    `;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: TRANSLATION_SCHEMA,
        },
    });

    try {
        const jsonText = response.text.trim();
        const data = JSON.parse(jsonText) as TranslationResponse;
        
        if (data.translatedStory && Array.isArray(data.translatedSuggestions)) {
            return {
                story: data.translatedStory,
                suggestions: data.translatedSuggestions
            };
        }
        throw new Error("Invalid response schema from translation model.");

    } catch (e) {
        console.error("Failed to parse translation response:", e, response.text);
        throw new Error("The Sage's words were lost in translation. Please try again.");
    }
};
