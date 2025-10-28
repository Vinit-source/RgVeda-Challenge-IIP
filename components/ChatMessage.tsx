
import React from 'react';
import type { ChatMessage as ChatMessageType } from '../types';

export const ChatMessage: React.FC<{ message: ChatMessageType }> = ({ message }) => {
  const isSage = message.sender === 'sage';
  return (
    <div className={`flex items-start gap-3 my-4 ${isSage ? '' : 'flex-row-reverse'}`}>
      <div className={`text-2xl p-2 rounded-full ${isSage ? 'bg-amber-200 text-amber-800' : 'bg-stone-200 text-stone-700'}`}>
        {isSage ? '📜' : '👤'}
      </div>
      <div className={`p-3 rounded-lg max-w-md prose prose-stone ${isSage ? 'bg-amber-100' : 'bg-stone-100'}`}>
        <p className="whitespace-pre-wrap m-0">{message.text}</p>
      </div>
    </div>
  );
};
