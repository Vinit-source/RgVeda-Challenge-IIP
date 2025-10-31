import { useState } from 'react';
import type { Topic, Language, ChatMessage } from '../types';

interface TestingModalProps {
  // App-level states
  selectedTopic: Topic | null;
  selectedLanguage: Language;
  story: string | null;
  p5jsCode: string | null;
  citations: string[];
  initialSuggestions: string[];
  isLoading: boolean;
  loadingMessage: string;
  error: string | null;
  
  // StoryDisplay-level states
  messages: ChatMessage[];
  suggestions: string[];
  isReplying: boolean;
  ttsState: { id: string | null; status: 'IDLE' | 'LOADING' | 'PLAYING' };
  ttsError: string | null;
  audioCacheSize: number;
  playbackRate: number;
  
  // API Key state
  apiKey: string | null;
}

export default function TestingModal({ 
  selectedTopic,
  selectedLanguage,
  story,
  p5jsCode,
  citations,
  initialSuggestions,
  isLoading,
  loadingMessage,
  error,
  messages,
  suggestions,
  isReplying,
  ttsState,
  ttsError,
  audioCacheSize,
  playbackRate,
  apiKey
}: TestingModalProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatValue = (value: unknown, key: string): string => {
    if (value === null) return 'null';
    if (value === undefined) return 'undefined';
    if (value === '') return '""';
    if (typeof value === 'boolean') return value.toString();
    if (typeof value === 'number') return value.toString();
    if (typeof value === 'string') {
      if (key === 'apiKey') return value ? `"${value.substring(0, 10)}..."` : '""';
      if (key === 'story' || key === 'p5jsCode') {
        return value ? `"${value.substring(0, 100)}..." (${value.length} chars)` : '""';
      }
      if (key === 'loadingMessage' || key === 'error' || key === 'ttsError') {
        return value ? `"${value}"` : '""';
      }
      return `"${value}"`;
    }
    if (Array.isArray(value)) {
      if (key === 'messages') return `Array(${value.length}) messages`;
      if (key === 'suggestions' || key === 'initialSuggestions') return `Array(${value.length}) suggestions`;
      if (key === 'citations') return `Array(${value.length}) citations`;
      return `Array(${value.length})`;
    }
    if (typeof value === 'object') {
      if (key === 'selectedTopic') {
        const topic = value as Topic;
        return topic ? `{ title: "${topic.title}", keywords: ${topic.keywords.length} }` : 'null';
      }
      if (key === 'selectedLanguage') {
        const lang = value as Language;
        return lang ? `{ code: "${lang.code}", name: "${lang.name}" }` : 'null';
      }
      if (key === 'ttsState') {
        const state = value as { id: string | null; status: string };
        return `{ id: ${state.id ? `"${state.id}"` : 'null'}, status: "${state.status}" }`;
      }
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  };

  const getStateColor = (key: string, value: unknown): string => {
    if (key === 'error' || key === 'ttsError') {
      return value ? 'bg-red-100 text-red-800 border-red-300' : 'bg-gray-100 text-gray-600 border-gray-300';
    }
    if (key === 'isLoading' || key === 'isReplying') {
      return value ? 'bg-yellow-100 text-yellow-800 border-yellow-300' : 'bg-gray-100 text-gray-600 border-gray-300';
    }
    if (key === 'apiKey') {
      return value ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300';
    }
    if (key === 'selectedTopic' || key === 'selectedLanguage') {
      return value ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-gray-100 text-gray-600 border-gray-300';
    }
    if (key === 'story' || key === 'p5jsCode') {
      return value ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-600 border-gray-300';
    }
    if (key === 'ttsState') {
      const state = value as { status: string };
      if (state.status === 'PLAYING') return 'bg-green-100 text-green-800 border-green-300';
      if (state.status === 'LOADING') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      return 'bg-gray-100 text-gray-600 border-gray-300';
    }
    if (Array.isArray(value)) {
      return value.length > 0 ? 'bg-blue-100 text-blue-800 border-blue-300' : 'bg-gray-100 text-gray-600 border-gray-300';
    }
    return 'bg-gray-100 text-gray-600 border-gray-300';
  };

  const getBadgeColor = (key: string, value: unknown): string => {
    if (key === 'error' || key === 'ttsError') {
      return value ? 'bg-red-500 text-white' : 'bg-gray-400 text-white';
    }
    if (key === 'isLoading' || key === 'isReplying') {
      return value ? 'bg-yellow-500 text-white' : 'bg-gray-400 text-white';
    }
    return 'bg-blue-500 text-white';
  };

  const states = {
    // App-level
    apiKey,
    selectedTopic,
    selectedLanguage,
    isLoading,
    loadingMessage,
    error,
    story,
    p5jsCode,
    citations,
    initialSuggestions,
    
    // StoryDisplay-level
    messages,
    suggestions,
    isReplying,
    ttsState,
    ttsError,
    playbackRate,
    audioCacheSize,
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-white/90 backdrop-blur-sm border-2 border-stone-300 text-stone-700 px-4 py-2 rounded-lg hover:bg-white transition-colors shadow-lg font-mono text-sm"
        >
          🐛 Debug States
        </button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl max-h-[85vh] bg-white rounded-lg shadow-2xl flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <div>
            <h2 className="text-xl font-bold text-stone-800">Application State Debug</h2>
            <p className="text-sm text-stone-600">Real-time state values</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="bg-stone-200 hover:bg-stone-300 text-stone-700 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
          >
            Close
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-3">
            {Object.entries(states).map(([key, value]) => (
              <div key={key} className={`border rounded-lg p-3 ${getStateColor(key, value)}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-sm font-bold">{key}</span>
                  <span className={`px-2 py-1 rounded text-xs font-mono ${getBadgeColor(key, value)}`}>
                    {typeof value}
                  </span>
                </div>
                <div className="bg-white/50 p-2 rounded text-xs font-mono break-all overflow-auto max-h-32">
                  {formatValue(value, key)}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-stone-200 bg-stone-50">
          <div className="text-xs text-stone-600 font-mono">
            <div>Total States: {Object.keys(states).length}</div>
            <div>Last Updated: {new Date().toLocaleTimeString()}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
