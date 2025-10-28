
import React from 'react';

interface SuggestionsProps {
  suggestions: string[];
  onSuggestionClick: (suggestion: string) => void;
  disabled: boolean;
}

export const Suggestions: React.FC<SuggestionsProps> = ({ suggestions, onSuggestionClick, disabled }) => {
  if (suggestions.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center mb-4">
      {suggestions.map((suggestion, index) => (
        <button
          key={index}
          onClick={() => onSuggestionClick(suggestion)}
          disabled={disabled}
          className="px-3 py-1.5 text-sm bg-amber-100 text-amber-800 rounded-full border border-amber-300 hover:bg-amber-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
};
