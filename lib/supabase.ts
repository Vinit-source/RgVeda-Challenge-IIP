import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://nwiogypqdiwuwdjptgre.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53aW9neXBxZGl3dXdkanB0Z3JlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4MDA1NTgsImV4cCI6MjA3NzM3NjU1OH0.Qy7lwHLquSRW1CQPITUk1lLPtHMKvMGX5tThHal1lJw";

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please set VITE_PUBLIC_SUPABASE_URL and VITE_PUBLIC_SUPABASE_ANON_KEY environment variables.');
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');

export interface DocumentRecord {
  id?: string;
  doc_id: string;
  chunk_index: number;
  text: string;
  metadata?: Record<string, any>;
  embedding?: number[];
  mandala?: string;
  sukta?: string;
  deity?: string;
  created_at?: string;
  similarity?: number;
}

/**
 * Search for similar documents using vector similarity
 */
export async function searchSimilarDocuments(
  queryEmbedding: number[],
  options: {
    topK?: number;
    threshold?: number;
    docId?: string;
  } = {}
) {
  const { topK = 5, threshold = 0, docId } = options;

  try {
    // Use RPC call for vector similarity search
    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: JSON.stringify(queryEmbedding),
      match_threshold: threshold,
      match_count: topK,
      filter_doc_id: docId || null,
    });

    if (error) {
      throw new Error(`Search failed: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Search error:', error);
    throw error;
  }
}
