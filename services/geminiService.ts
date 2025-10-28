
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

const P5JS_GENERATION_PROMPT = `You are an expert creative coder specializing in p5.js. Your task is to generate a self-contained, abstract, and visually captivating p5.js animation script based on a provided story from the Rigveda.

**INSTRUCTIONS:**
1.  **Analyze the Story:** Read the provided story and identify key themes, moods, and visual elements (e.g., fire, storms, light, flowing rivers, celestial beings).
2.  **Abstract Visualization:** Do NOT create a literal representation. Generate an abstract, beautiful, and continuously looping animation that captures the *essence* of the story. Think particle systems, flow fields, generative patterns, shimmering light, etc.
3.  **Code Requirements:**
    *   The code MUST be a single block of JavaScript that will be executed by \`new Function('p', code)\`.
    *   All p5.js functions must be called on the \`p\` object (e.g., \`p.background\`, \`p.fill\`).
    *   Define \`p.setup = () => { ... }\` and \`p.draw = () => { ... }\`.
    *   You can optionally define \`p.windowResized = () => {}\`.
    *   **CRITICAL**: DO NOT call \`p.createCanvas()\` or \`p.resizeCanvas()\`. The host environment will handle this. Assume the canvas exists and its size is available via \`p.width\` and \`p.height\`.
    *   The animation should be performant and loop smoothly.
    *   Use color palettes that are thematic to the story (e.g., oranges/reds for Agni, blues/whites for Varuna, golds for Ushas).
4.  **Output Format:**
    *   Return ONLY the raw JavaScript code inside a single markdown block (e.g. \`\`\`javascript\n...\n\`\`\`).
    *   Do NOT include any explanations or surrounding text outside the markdown block.

**STORY:**
---
{STORY_TEXT}
---
`;

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

export async function generateP5jsAnimation(story: string): Promise<string> {
    const model = 'gemini-2.5-pro';
    
    const response = await ai.models.generateContent({
        model,
        contents: P5JS_GENERATION_PROMPT.replace('{STORY_TEXT}', story),
    });

    let code = response.text;

    // More robustly find and extract the code from a markdown block.
    // The model might add explanations around the code.
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


export async function synthesizeSpeech(text: string): Promise<string> {
    const model = 'gemini-2.5-flash-preview-tts';
    
    const response = await ai.models.generateContent({
        model,
        contents: [{ parts: [{ text: `Say with a wise, ancient, and slightly poetic tone: ${text}` }] }],
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