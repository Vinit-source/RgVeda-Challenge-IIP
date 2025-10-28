
export interface HymnChunk {
  source: string;
  mandala: number;
  sukta: number;
  text: string;
  deity: string;
  rishi: string;
}

export interface Topic {
  title: string;
  description: string;
  keywords: string[];
  image: string;
}

export interface CachedStory {
  story: string;
  p5jsCode: string;
  citations: string[];
  language: string; // The code of the language, e.g., 'en-US'
  suggestions: string[];
}

export interface Language {
  code: string;
  name: string;
}

export interface ChatMessage {
  sender: 'user' | 'sage';
  text: string;
}

export interface SageResponse {
    reply: string;
    suggestions: string[];
}
