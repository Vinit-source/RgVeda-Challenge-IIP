import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { HymnChunk } from '../types';
import { getApiKey } from '../utils/apiUtils';


// Function to dynamically create a GoogleGenAI client instance.
// This is called before every API request to ensure the correct key is used.
const getAiClient = () => {
    const apiKey = getApiKey();
    return new GoogleGenAI({ apiKey });
};


const VEDIC_SAGE_PROMPT = `You are the Vedic Sage, a wise and ancient storyteller. Your voice is poetic, and your knowledge is rooted in the sacred hymns of the Rigveda.
- Your task is to synthesize the provided hymns (CONTEXT) into a compelling, flowing narrative that answers the user's QUERY.
- When you draw from a new hymn or a different source, start a new paragraph to clearly separate the ideas drawn from different verses.
- NEVER invent information or answer outside of the provided CONTEXT. Ground every part of your story in the hymns.
- Weave the narrative like a story, not a list of facts. Use rich, descriptive language.
- **CRITICAL**: Cite the source of your information by referencing the Mandala and Sukta in parentheses (e.g., (RV 1.1)) naturally within your narrative. Each paragraph should ideally end with its primary citation.
- Begin your response directly with the story. Do not use conversational introductions like "Of course" or "Certainly, here is a story".`;

const P5JS_GENERATION_PROMPT = `You are an expert creative coder specializing in p5.js. Your task is to generate a self-contained, abstract, and visually captivating p5.js animation script based on a provided topic from the Rigveda.

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

/**
 * Helper function to format hymn chunks into a consistent string format
 * @param hymns - Array of hymn chunks to format
 * @returns Formatted string of hymn information
 */
function formatHymnContext(hymns: HymnChunk[]): string {
    return hymns.map(c => 
        `Source: RV ${c.mandala}.${c.sukta}\nDeity: ${c.deity}\nRishi: ${c.rishi}\nText: "${c.text}"`
    ).join('\n---\n');
}

export async function* generateStoryStream(query: string, context: HymnChunk[]): AsyncGenerator<{ text: string; }, void, unknown> {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';
    
    const contextString = formatHymnContext(context);

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
    const model = 'gemini-2.5-flash';
    
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

export async function* continueConversationStream(history: string, language: string, hymnContext?: HymnChunk[]): AsyncGenerator<string, void, unknown> {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';
    
    // Build context string from hymns if provided
    const contextString = hymnContext && hymnContext.length > 0
        ? formatHymnContext(hymnContext)
        : '';
    
    const hasHymnContext = !!contextString;
    const contextSection = hasHymnContext 
        ? `RELEVANT HYMNS FROM RIGVEDA:\n${contextString}\n\n`
        : '';
    
    // Build conditional prompt text for better readability
    const introText = hasHymnContext
        ? 'Relevant hymns from the Rigveda are provided to help answer their question.'
        : '';
    
    const groundingInstruction = hasHymnContext
        ? 'Use the provided hymns to ground your answer in the sacred texts.'
        : 'Ground your answer in the hymns of the Rigveda based on your knowledge.';
    
    const suggestionInstruction = hasHymnContext
        ? ', rooted in the themes of the provided hymns'
        : '';
    
    const query = `You are the Vedic Sage. A user is asking you a follow-up question. ${introText} Your conversation history is provided below.
    First, provide a direct and concise answer to their last question. Structure your answer with separate paragraphs for distinct ideas, especially when drawing from different hymns.
    ${groundingInstruction}
    After your answer is complete, on a new line, write the special delimiter "[SUGGESTIONS]".
    After the delimiter, provide a JSON array of 3-4 short, insightful follow-up questions the user could ask${suggestionInstruction}.
    
    Example output format:
    This is the sage's wise reply, flowing like a river of knowledge (RV 1.2.3).

    It draws upon the ancient verses, a new thought in a new line (RV 1.3.4).
    [SUGGESTIONS]
    ["What does this mean?", "Tell me more about that.", "How is this related to the hymns?"]

    Your entire response, including the reply and suggestions, must be in ${language}.
    Your answer must be concise (less than 400 tokens).
    **CRITICAL**: Cite the source of your information by referencing the Mandala and Sukta in parentheses (e.g., (RV 1.1)). Each paragraph should ideally end with its primary citation.
    
    ${contextSection}CONVERSATION HISTORY:
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
    const model = 'gemini-2.5-flash';
    const query = `Based on the following story from the Rigveda, generate 3-4 short, insightful follow-up questions a curious user might ask. Output only a JSON array of strings.
    
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

// Fallback keyword extraction constants
const MIN_KEYWORD_LENGTH = 3;
const MAX_FALLBACK_KEYWORDS = 5;
const STOP_WORDS = new Set(['the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his', 'how', 'man', 'new', 'now', 'old', 'see', 'two', 'way', 'who', 'boy', 'did', 'its', 'let', 'put', 'say', 'she', 'too', 'use', 'what', 'when', 'with', 'your', 'about', 'from', 'have', 'this', 'that', 'they', 'been', 'call', 'come', 'each', 'find', 'long', 'made', 'many', 'more', 'most', 'much', 'must', 'over', 'said', 'such', 'than', 'them', 'then', 'there', 'these', 'thing', 'very', 'were', 'will', 'with', 'would', 'like', 'just', 'know', 'take', 'into', 'good', 'some', 'could', 'make', 'than', 'time', 'first', 'other', 'where', 'after', 'their', 'think', 'also', 'back', 'only', 'tell', 'does']);

/**
 * Extract relevant keywords from user's message for hymn retrieval.
 * Uses AI to identify key concepts, deities, themes, or entities that would be
 * relevant for searching Rigveda hymns in the vector database.
 * 
 * @param userMessage - The user's question or message to extract keywords from
 * @param context - Optional conversation history context to help with keyword extraction
 * @returns Promise<string[]> - Array of 3-5 relevant keywords for hymn search
 * 
 * @example
 * const keywords = await extractKeywords("Tell me about fire");
 * // Returns: ["agni", "fire", "sacrifice"]
 */
export async function extractKeywords(userMessage: string, context?: string): Promise<string[]> {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash';
    
    const contextInfo = context ? `\n\nCONTEXT:\n${context}` : '';
    
    const query = `Extract 3-5 key concepts, deities, themes, or entities from the user's question that would be relevant for searching Rigveda hymns. Output only a JSON array of keyword strings.
    
    USER QUESTION:
    ${userMessage}${contextInfo}
    
    Examples:
    - User: "Tell me about fire" -> ["agni", "fire", "sacrifice"]
    - User: "What is cosmic order?" -> ["rta", "cosmic order", "dharma", "varuna"]
    - User: "Who are the storm gods?" -> ["maruts", "storm", "indra", "wind"]
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
        console.error("Failed to parse keywords:", e, response.text);
        // Fallback: extract simple words from the message, filtering stop words
        const words = userMessage.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > MIN_KEYWORD_LENGTH && !STOP_WORDS.has(w));
        return words.slice(0, MAX_FALLBACK_KEYWORDS);
    }
}