
import React, { useState } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !disabled) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        disabled={disabled}
        placeholder={disabled ? "The Sage is contemplating..." : "Ask the Sage a question..."}
        className="flex-grow w-full bg-white border border-amber-300 text-stone-700 py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-label="Your message to the Sage"
      />
      <button
        type="submit"
        disabled={disabled || !inputValue.trim()}
        className="bg-amber-600 text-white p-2 rounded-lg hover:bg-amber-700 transition-colors shadow disabled:bg-amber-400 disabled:cursor-not-allowed flex items-center justify-center h-10 w-10 shrink-0"
        aria-label="Send message"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
        </svg>
      </button>
    </form>
  );
};
