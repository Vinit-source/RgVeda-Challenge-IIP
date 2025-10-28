
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
