
import React from 'react';
import type { Topic } from '../types';

interface PlaybookProps {
  topics: { [key: string]: Topic[] };
  onSelect: (topicTitle: string) => void;
}

export const Playbook: React.FC<PlaybookProps> = ({ topics, onSelect }) => {
  return (
    <div className="space-y-12">
      {(Object.entries(topics) as [string, Topic[]][]).map(([category, topicList]) => (
        <section key={category}>
          <h2 className="text-3xl font-display text-amber-900 border-b-2 border-amber-300 pb-2 mb-6">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topicList.map((topic) => (
              <button
                key={topic.title}
                onClick={() => onSelect(topic.title)}
                className="group block w-full text-left bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-amber-200/50"
              >
                <img
                  src={topic.image}
                  alt={topic.title}
                  className="w-full h-64 object-cover object-top transition-transform duration-300 group-hover:scale-105"
                  style={{ aspectRatio: '3/4' }}
                />
                <div className="p-4">
                  <h3 className="font-display text-2xl font-bold text-amber-900 tracking-wide mb-2">{topic.title}</h3>
                  <p className="text-amber-800 text-sm">{topic.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
