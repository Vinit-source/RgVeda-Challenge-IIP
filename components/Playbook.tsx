
import React from 'react';
import type { Topic } from '../types';

interface PlaybookProps {
  topics: { [key: string]: Topic[] };
  onSelect: (topicTitle: string) => void;
}

export const Playbook: React.FC<PlaybookProps> = ({ topics, onSelect }) => {
  return (
    <div className="space-y-12">
      {Object.entries(topics).map(([category, topicList]) => (
        <section key={category}>
          <h2 className="text-3xl font-display text-amber-900 border-b-2 border-amber-300 pb-2 mb-6">{category}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {topicList.map((topic) => (
              <button
                key={topic.title}
                onClick={() => onSelect(topic.title)}
                className="group relative block w-full text-left bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1 border border-amber-200/50"
              >
                <img src={topic.image} alt={topic.title} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                <div className="p-4 absolute bottom-0 left-0 right-0">
                  <h3 className="font-display text-2xl font-bold text-white tracking-wide">{topic.title}</h3>
                  <p className="text-amber-100 text-sm mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-0 group-hover:h-auto">{topic.description}</p>
                </div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
