import React, { useState, useEffect } from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { text } from 'stream/consumers';

const API_KEY_STORAGE_KEY = 'geminiApiKey';

export const ApiKeyManager: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [storedApiKey, setStoredApiKey] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [preSavedNotLoaded, setPreSavedNotLoaded] = useState(false);

  useEffect(() => {
    const key = localStorage.getItem(API_KEY_STORAGE_KEY);
    setStoredApiKey(key);
    if (!key) {
      setIsEditing(true);
    }
  }, []);

  const handleSave = () => {
    if (apiKey.trim()) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
      setStoredApiKey(apiKey);
      setIsEditing(false);
      setApiKey('');
    }
  };

  const handleUsePreSaved = () => {
    const preSavedKey = process.env.API_KEY;
    if (preSavedKey) {
      localStorage.setItem(API_KEY_STORAGE_KEY, preSavedKey);
      setStoredApiKey(preSavedKey);
      setIsEditing(false);
      setApiKey('');
    } else {
      setPreSavedNotLoaded(true);
    }
  };

  const handleClear = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setStoredApiKey(null);
    setIsEditing(true);
    // Force a reload to ensure geminiService falls back to the default
    window.location.reload();
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  if (!isEditing && storedApiKey) {
    return (
       <div className="text-center mb-6 p-3 bg-green-50/70 rounded-lg border border-green-200 text-sm flex items-center justify-between">
            <div className="flex items-center">
                <SparklesIcon className="h-5 w-5 text-green-600 mr-2" />
                <span className="text-green-800">Using your provided Gemini API Key.</span>
            </div>
            <button
                onClick={handleEdit}
                className="text-xs bg-white/80 text-stone-600 px-2 py-1 rounded hover:bg-white transition-colors border border-stone-300"
            >
                Change
            </button>
        </div>
    );
  }

  return (
    <div className="text-center mb-6 p-4 bg-amber-50/50 rounded-lg border border-amber-200">
      <h3 className="text-lg font-display text-amber-900 mb-2">Provide Your Gemini API Key</h3>
      <p className="text-sm text-stone-600 mb-4">
        Your API key is stored locally in your browser and is not shared. You have to provide a valid Gemini API key (Free-tier also works) to use the application.
        <div><em>Note: For the IIP hackathon, a demo key is used. In order to use it, click 'Use Demo Key' button.</em></div>
      </p>
      <div className="flex items-center gap-2 max-w-lg mx-auto">
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API Key..."
          className="flex-grow w-full bg-white border border-amber-300 text-stone-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          aria-label="Gemini API Key input"
        />
        <button
          onClick={handleSave}
          className="h-10 inline-flex items-center justify-center leading-none bg-amber-600 text-white px-4 rounded-lg hover:bg-amber-700 transition-colors shadow disabled:bg-amber-400"
          disabled={!apiKey.trim()}
        >
          Save
        </button>
        <button
          onClick={handleUsePreSaved}
          className="h-10 inline-flex items-center justify-center leading-none bg-orange-600 text-white px-3 rounded-lg hover:bg-orange-700 transition-colors shadow min-w-[140px]"
          title="Use a pre-saved key stored for the IIP hackathon"
        >
          Use Demo Key
        </button>
        {storedApiKey && (
           <button
             onClick={handleClear}
             className="text-xs text-stone-500 hover:text-stone-700"
           >
             Clear
           </button>
        )}
      </div>
      {preSavedNotLoaded && (
        <div className="text-xs text-red-600 mt-2">Failed to load pre-saved key. Please provide your own Gemini API Key. Create a new API Key by visiting <a href="https://aistudio.google.com/api-keys" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline' }} className="hover:text-red-700">Gemini API Key website</a></div>
      )}
    </div>
  );
};