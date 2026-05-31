import React, { useState } from 'react';
import { SendIcon } from './icons/Icons';
import { AppMode } from '../types';

interface CollaborationSpaceProps {
  onModify: (prompt: string) => void;
  isLoading: boolean;
  appMode: AppMode;
  theme: 'dark' | 'light';
}

export const CollaborationSpace: React.FC<CollaborationSpaceProps> = ({ onModify, isLoading, appMode, theme }) => {
  const [modificationPrompt, setModificationPrompt] = useState('');
  const isGow = appMode === 'GOW';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modificationPrompt.trim() && !isLoading) {
      onModify(modificationPrompt);
      setModificationPrompt(''); // Clear input after submit
    }
  };

  return (
    <div className={`border rounded-xl p-5 h-full flex flex-col justify-between font-sans transition-all duration-300 ${
      theme === 'light'
        ? 'bg-white border-zinc-200 shadow-sm'
        : 'bg-neutral-900/10 border-neutral-900'
    }`}>
      <div>
        <h3 className={`text-sm font-semibold mb-2 tracking-tight ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>
          {isGow ? '🐄 Gow Mode Update' : 'Request Adjustments'}
        </h3>
        <p className={`text-xs leading-relaxed mb-4 ${theme === 'light' ? 'text-zinc-500' : 'text-neutral-400'}`}>
          {isGow 
            ? 'बताएं कि आप क्या बदलाव चाहते हैं। एआई सहयोगी कोड को तदनुसार अपडेट कर देगा।' 
            : "Specify any visual edits, behavior scripts, or layout adjustments. The AI will rebuild and proxy raw updates live."
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-4">
        <div className="relative">
          <textarea
            value={modificationPrompt}
            onChange={(e) => setModificationPrompt(e.target.value)}
            placeholder={isGow ? 'जैसे: मुख्य रंग को गहरा गोबर-हरा कर दो...' : 'e.g., Introduce a floating dark clock...'}
            className={`w-full h-24 p-3 pr-12 resize-none border rounded-lg focus:outline-none font-sans text-xs leading-relaxed transition-all duration-300 ${
              theme === 'light'
                ? 'border-zinc-200 bg-zinc-50 text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:ring-0'
                : 'border-neutral-800 bg-neutral-950 text-neutral-100 placeholder-neutral-600 focus:border-neutral-700 focus:ring-0'
            }`}
            disabled={isLoading}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <button
            type="submit"
            disabled={isLoading || !modificationPrompt.trim()}
            className={`absolute bottom-2.5 right-2.5 p-2 rounded transition-all active:scale-95 ${
              !modificationPrompt.trim() || isLoading
                ? theme === 'light' ? 'bg-zinc-100 text-zinc-400' : 'bg-neutral-900/45 text-neutral-600'
                : isGow
                  ? 'bg-orange-650 text-white hover:bg-orange-600'
                  : theme === 'light'
                    ? 'bg-zinc-950 text-white hover:bg-zinc-800'
                    : 'bg-neutral-100 text-neutral-950 hover:bg-white'
            }`}
            aria-label={isGow ? 'बदलाव लागू करें' : 'Apply'}
          >
            {isLoading ? (
              <div className="w-3.5 h-3.5 border border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <SendIcon className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Live Token count display in minimal presentation */}
        <div className="flex justify-end mt-1.5 px-1">
          <span 
            className={`text-[9px] font-mono transition-colors duration-300 ${
              theme === 'light' ? 'text-zinc-450' : 'text-neutral-550'
            }`}
            title="Estimated token count based on 4 characters per token"
          >
            Tokens: {Math.max(0, Math.ceil(modificationPrompt.length / 4))}
          </span>
        </div>
      </form>
    </div>
  );
};
