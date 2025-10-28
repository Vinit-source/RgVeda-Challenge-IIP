import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';
import { SpeakerIcon } from './icons/SpeakerIcon';
import { AudioWaveIcon } from './icons/AudioWaveIcon';

interface ChatMessageProps {
  message: ChatMessageType;
  onPlayMessage: (message: ChatMessageType) => void;
  ttsState: { id: string | null; status: 'IDLE' | 'LOADING' | 'PLAYING' };
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onPlayMessage, ttsState }) => {
  const isSage = message.sender === 'sage';
  const isThisMessagePlaying = ttsState.status === 'PLAYING' && ttsState.id === message.id;
  const isThisMessageLoading = ttsState.status === 'LOADING' && ttsState.id === message.id;
  const isAnyMessageLoading = ttsState.status === 'LOADING';

  const renderPlayButton = () => {
    if (!isSage) return null;

    let icon;
    if (isThisMessageLoading) {
      icon = <div className="h-5 w-5 border-2 border-amber-800 border-t-transparent rounded-full animate-spin"></div>;
    } else if (isThisMessagePlaying) {
      icon = <AudioWaveIcon className="h-5 w-5" />;
    } else {
      icon = <SpeakerIcon className="h-5 w-5" />;
    }

    return (
      <button
        onClick={() => onPlayMessage(message)}
        disabled={isAnyMessageLoading}
        className="p-1 rounded-full text-amber-700 hover:bg-amber-200/50 transition-colors self-start ml-2 disabled:opacity-50 disabled:cursor-wait"
        aria-label={
          isThisMessageLoading ? "Loading audio..." : 
          isThisMessagePlaying ? "Stop audio" : 
          "Play message audio"
        }
      >
        {icon}
      </button>
    );
  };

  return (
    <div className={`flex items-start gap-3 my-4 ${isSage ? '' : 'flex-row-reverse'}`}>
      <div className={`text-2xl p-2 rounded-full self-start ${isSage ? 'bg-amber-200 text-amber-800' : 'bg-stone-200 text-stone-700'}`}>
        {isSage ? '📜' : '👤'}
      </div>
      <div className={`p-3 rounded-lg max-w-md prose prose-stone ${isSage ? 'bg-amber-100' : 'bg-stone-100'}`}>
        <p className="whitespace-pre-wrap m-0">{message.text}</p>
      </div>
      {renderPlayButton()}
    </div>
  );
};