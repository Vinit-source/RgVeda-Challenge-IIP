export interface Topic {
  title: string;
  description: string;
  keywords: string[];
  image: string;
}

export interface HymnChunk {
  source: string;
  mandala: number;
  sukta: number;
  text: string;
  deity: string;
  rishi: string;
}

export interface Language {
  code: string;
  name: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'sage';
  text: string;
}

export interface CachedStory {
    story: string;
    p5jsCode: string;
    citations: string[];
    language: string; // This is a language code string
    suggestions: string[];
    messages?: ChatMessage[];
}