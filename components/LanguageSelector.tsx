
import React from 'react';
import type { Language } from '../types';

interface LanguageSelectorProps {
  languages: Language[];
  selectedLanguage: Language;
  onSelect: (language: Language) => void;
  disabled: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ languages, selectedLanguage, onSelect, disabled }) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = event.target.value;
    const language = languages.find(lang => lang.code === selectedCode);
    if (language) {
      onSelect(language);
    }
  };

  return (
    <div className="relative">
      <select
        value={selectedLanguage.code}
        onChange={handleChange}
        disabled={disabled}
        className="appearance-none w-full bg-white border border-amber-300 text-stone-700 py-2 px-4 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Select language"
      >
        {languages.map(lang => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-stone-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};
