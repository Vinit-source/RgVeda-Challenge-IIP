import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { HymnChunk } from '../types';

const API_KEY_STORAGE_KEY = 'gemini_api_key';

// Helper function to get the API key
const getApiKey = (): string => {
  // Check for localStorage first, as it's the user-provided override.
  if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (storedKey && storedKey.trim() !== '') {
      return storedKey;
    }
  }

  // Fallback to environment variable if localStorage key is not present.
  if (process.env.API_KEY) {
    return process.env.API_KEY;
  }
  
  // If neither is available, throw an error.
  throw new Error("API_KEY not found in localStorage or environment variables. Please provide a key.");
};


// Function to dynamically create a GoogleGenAI client instance.
// This is called before every API request to ensure the correct key is used.
const getAiClient = () => {
    const apiKey = getApiKey();
    return new GoogleGenAI({ apiKey });
};


const VEDIC_SAGE_PROMPT = `You are the Vedic Sage, a wise and ancient storyteller. Your voice is poetic, and your knowledge is rooted in the sacred hymns of the Ṛgveda.
- Your task is to synthesize the provided hymns (CONTEXT) into a compelling, flowing narrative that answers the user's QUERY.
- When you draw from a new hymn or a different source, start a new paragraph to clearly separate the ideas drawn from different verses.
- NEVER invent information or answer outside of the provided CONTEXT. Ground every part of your story in the hymns.
- Weave the narrative like a story, not a list of facts. Use rich, descriptive language.
- **CRITICAL**: Cite the source of your information by referencing the Mandala and Sukta in parentheses (e.g., (RV 1.1)) naturally within your narrative. Each paragraph should ideally end with its primary citation.
- Begin your response directly with the story. Do not use conversational introductions like "Of course" or "Certainly, here is a story".`;

const P5JS_GENERATION_PROMPT = `You are an expert creative coder specializing in p5.js. Your task is to generate a self-contained, abstract, and visually captivating p5.js animation script based on a provided topic from the Ṛgveda.

**INSTRUCTIONS:**
1.  **Analyze the Topic:** Read the provided topic title and description to understand its key themes, moods, and visual elements (e.g., fire for Agni, storms for Indra, light for Surya, flowing rivers for Saraswati).
2.  **Visualization:** Generate a beautiful, and continuously looping animation that captures the *essence* of the topic. Identify the main character being addressed in the story and display their qualities as described in the hymns. Think particle systems, flow fields, generative patterns, shimmering light, etc.
3.  **Code Requirements:**
    *   The code MUST be a single block of JavaScript that will be executed by \`new Function('p', code)\`.
    *   All p5.js functions must be called on the \`p\` object (e.g., \`p.background\`, \`p.fill\`).
    *   Define \`p.setup = () => { ... }\` and \`p.draw = () => { ... }\`.
    *   You can optionally define \`p.windowResized = () => {}\`.
    *   **CRITICAL**: DO NOT call \`p.createCanvas()\` or \`p.resizeCanvas()\`. The host environment will handle this. Assume the canvas exists and its size is available via \`p.width\` and \`p.height\`.
    *   The animation should be performant and loop smoothly.
    *   Use color palettes that are thematic to the topic (e.g., oranges/reds for Agni, blues/whites for Varuna, golds for Ushas).
4.  **Output Format:**
    *   Return ONLY the raw JavaScript code inside a single markdown block (e.g. \`\`\`javascript\n...\n\`\`\`).
    *   Do NOT include any explanations or surrounding text outside the markdown block.

**TOPIC:** {TOPIC_TITLE}
**DESCRIPTION:** {TOPIC_DESCRIPTION}
`;

export async function* generateStoryStream(query: string, context: HymnChunk[]): AsyncGenerator<{ text: string; }, void, unknown> {
    const ai = getAiClient();
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

export async function generateP5jsAnimation(topicTitle: string, topicDescription: string): Promise<string> {
    const ai = getAiClient();
    const model = 'gemini-2.5-pro';
    
    const prompt = P5JS_GENERATION_PROMPT
        .replace('{TOPIC_TITLE}', topicTitle)
        .replace('{TOPIC_DESCRIPTION}', topicDescription);
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
    });

    let code = response.text;

    const javascriptBlockRegex = /```javascript\s*([\s\S]*?)\s*```/;
    const plainBlockRegex = /```\s*([\s\S]*?)\s*```/;

    let match = code.match(javascriptBlockRegex);
    if (match) {
        code = match[1];
    } else {
        match = code.match(plainBlockRegex);
        if (match) {
            code = match[1];
        }
    }
    
    return code.trim();
}


export async function synthesizeSpeech(text: string, language: string): Promise<string> {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash-preview-tts';
    
    const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: `Say with a wise, ancient, and slightly poetic tone, in ${language}: ${text}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
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

export async function* continueConversationStream(history: string, language: string): AsyncGenerator<string, void, unknown> {
    const ai = getAiClient();
    const model = 'gemini-2.5-pro';
    
    const query = `You are the Vedic Sage. A user is asking you a follow-up question. Your conversation history is provided below.
    First, provide a direct and concise answer to their last question. Structure your answer with separate paragraphs for distinct ideas, especially when drawing from different hymns.
    After your answer is complete, on a new line, write the special delimiter "[SUGGESTIONS]".
    After the delimiter, provide a JSON array of 3-4 short, insightful follow-up questions the user could ask.
    
    Example output format:
    This is the sage's wise reply, flowing like a river of knowledge (RV 1.2.3).

    It draws upon the ancient verses, a new thought in a new line (RV 1.3.4).
    [SUGGESTIONS]
    ["What does this mean?", "Tell me more about that.", "How is this related to the hymns?"]

    Your entire response, including the reply and suggestions, must be in ${language}.
    Your answer must be concise (less than 400 tokens).
    Ground your answer in the hymns of the Ṛgveda. **CRITICAL**: Cite the source of your information by referencing the Mandala and Sukta in parentheses (e.g., (RV 1.1)). Each paragraph should ideally end with its primary citation.
    
    CONVERSATION HISTORY:
    ---
    ${history}
    ---
    `;

    const stream = await ai.models.generateContentStream({
        model,
        contents: query,
        config: {
            systemInstruction: VEDIC_SAGE_PROMPT,
        },
    });

    for await (const chunk of stream) {
        yield chunk.text;
    }
}

export async function generateInitialSuggestions(story: string, language: string): Promise<string[]> {
    const ai = getAiClient();
    const model = 'gemini-2.5-pro';
    const query = `Based on the following story from the Ṛgveda, generate 3-4 short, insightful follow-up questions a curious user might ask. Output only a JSON array of strings.
    
    STORY:
    ---
    ${story}
    ---

    Language for questions: ${language}
    `;

    const response = await ai.models.generateContent({
        model,
        contents: query,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
            }
        }
    });

    try {
        const jsonText = response.text.trim();
        return JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse initial suggestions:", e, response.text);
        return [
            "Tell me more about this.",
            "What happens next?",
            "What does this symbolize?"
        ]; // Fallback suggestions
    }
}