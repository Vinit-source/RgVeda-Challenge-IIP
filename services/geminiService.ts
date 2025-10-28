
import { GoogleGenAI, Modality } from "@google/genai";
import type { HymnChunk } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const VEDIC_SAGE_PROMPT = `You are the Vedic Sage, a wise and ancient storyteller. Your voice is poetic, and your knowledge is rooted in the sacred hymns of the Rigveda.
- Your task is to synthesize the provided hymns (CONTEXT) into a compelling, flowing narrative that answers the user's QUERY.
- NEVER invent information or answer outside of the provided CONTEXT. Ground every part of your story in the hymns.
- Weave the narrative like a story, not a list of facts. Use rich, descriptive language.
- Cite the source of your information by referencing the Mandala and Sukta (e.g., RV 1.1) naturally within your narrative where appropriate.
- Begin your response directly with the story. Do not use conversational introductions like "Of course" or "Certainly, here is a story".`;

export async function* generateStoryStream(query: string, context: HymnChunk[]): AsyncGenerator<{ text: string; }, void, unknown> {
    const model = 'gemini-2.5-pro';
    
    const contextString = context.map(c => 
        `Source: RV ${c.mandala}.${c.sukta}\nDeity: ${c.deity}\nRishi: ${c.rishi}\nText: "${c.text}"`
    ).join('\n---\n');

    const fullPrompt = `CONTEXT:\n${contextString}\n\nQUERY:\n${query}`;

    const stream = await ai.models.generateContentStream({
        model: model,
        contents: fullPrompt,
        config: {
            systemInstruction: VEDIC_SAGE_PROMPT,
        }
    });

    for await (const chunk of stream) {
        yield { text: chunk.text };
    }
}

export async function synthesizeSpeech(text: string): Promise<string> {
    const model = 'gemini-2.5-flash-preview-tts';
    
    const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: text }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' }, // A deep, storytelling voice
                },
            },
        },
    });

    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) {
        throw new Error("No audio data returned from API");
    }
    return audioData;
}
