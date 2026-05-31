import React from 'react';
import { SparklesIcon, PlusIcon, ToolsIcon, MicIcon, SendIcon } from './icons/Icons';
import { AppMode } from '../types';

interface PromptInputProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isEnhancing: boolean;
  onEnhance: () => void;
  appMode: AppMode;
  onUploadClick: () => void;
  onMicClick: () => void;
  isListening: boolean;
  micSupported: boolean;
  theme: 'dark' | 'light';
}

export const PromptInput: React.FC<PromptInputProps> = ({ 
  prompt, setPrompt, onGenerate, isLoading, isEnhancing, onEnhance, appMode,
  onUploadClick, onMicClick, isListening, micSupported, theme
}) => {
  const isGow = appMode === 'GOW';
  const isDisabled = isLoading || isEnhancing;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onGenerate();
    }
  };

  return (
    <div className={`rounded-xl p-4 border transition-all duration-300 ${
      theme === 'light'
        ? 'bg-white border-zinc-200 focus-within:border-zinc-400 focus-within:ring-1 focus-within:ring-zinc-200/50'
        : isGow 
          ? 'bg-neutral-900/40 border-neutral-900 focus-within:border-orange-950 focus-within:ring-1 focus-within:ring-orange-950/40' 
          : 'bg-neutral-900/40 border-neutral-900 focus-within:border-neutral-800 focus-within:ring-1 focus-within:ring-neutral-800/40'
    }`}>
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={isGow ? 'गउ से कहें (जैसे: "एक अंतरिक्ष गाय की डायरी")...' : 'Describe the web application, layouts, and animations...'}
        className={`w-full h-24 p-1 resize-none border-none focus:ring-0 focus:outline-none bg-transparent text-base font-sans leading-relaxed transition-all ${
          theme === 'light' ? 'text-zinc-950 placeholder-zinc-450' : 'text-white placeholder-neutral-500'
        }`}
        disabled={isDisabled}
      />
      
      <div className={`flex flex-col sm:flex-row gap-3 sm:items-center justify-between mt-2 pt-3 border-t transition-colors duration-300 ${
        theme === 'light' ? 'border-zinc-150' : 'border-neutral-900'
      }`}>
        <div className="flex items-center space-x-2">
          <button 
            onClick={onUploadClick}
            className={`p-2 rounded transition-all active:scale-95 ${
              theme === 'light' 
                ? 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900' 
                : 'hover:bg-neutral-900 text-neutral-400 hover:text-neutral-100'
            }`}
            title="Upload Context Files"
            aria-label="Upload Context Files"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
          
          <button 
            onClick={() => {}}
            className={`p-2 rounded transition-all active:scale-95 ${
              theme === 'light' 
                ? 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900' 
                : 'hover:bg-neutral-900 text-neutral-400 hover:text-neutral-100'
            }`}
            title="3D Presets"
            aria-label="3D Presets"
          >
            <ToolsIcon className="w-5 h-5" />
          </button>

          {micSupported && (
            <button 
              onClick={onMicClick}
              className={`p-2 rounded transition-all active:scale-95 ${
                isListening 
                  ? theme === 'light' ? 'bg-red-50 text-red-650' : 'bg-red-950/20 text-red-400 animate-pulse' 
                  : theme === 'light' 
                    ? 'hover:bg-zinc-100 text-zinc-500 hover:text-zinc-900' 
                    : 'hover:bg-neutral-900 text-neutral-400 hover:text-neutral-100'
              }`}
              title={isListening ? "Stop Active Listening" : "Use Voice Dictation"}
              aria-label={isListening ? "Stop Active Listening" : "Use Voice Dictation"}
            >
              <MicIcon className="w-5 h-5" />
            </button>
          )}

          {/* Token Display in Minimalist typography */}
          <span 
            className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all ${
              theme === 'light' ? 'bg-zinc-100 text-zinc-500' : 'bg-neutral-950 border border-neutral-900 text-neutral-550'
            }`}
            title="Estimated token count based on 4 characters per token"
          >
            Tokens: {Math.max(0, Math.ceil(prompt.length / 4))}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onEnhance}
            disabled={isDisabled}
            className={`flex items-center text-[11px] font-mono tracking-wider transition-all py-1.5 px-3 rounded ${
              theme === 'light' 
                ? 'text-zinc-550 hover:text-zinc-950 hover:bg-zinc-100' 
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            } disabled:opacity-50`}
            title={isGow ? 'प्रॉम्प्ट को सुधारें' : 'Polish Prompt'}
          >
            <SparklesIcon className={`w-3.5 h-3.5 mr-1 ${theme === 'light' ? 'text-zinc-500 font-bold' : 'text-neutral-400'}`} />
            <span>{isEnhancing ? 'Improving...' : 'Improve'}</span>
          </button>

          <button
            onClick={onGenerate}
            disabled={isDisabled || !prompt.trim()}
            className={`py-1.5 px-4 rounded font-mono text-xs transition-all active:scale-95 flex items-center gap-1.5 ${
              !prompt.trim() || isDisabled
                ? theme === 'light' ? 'bg-zinc-150 text-zinc-400 cursor-not-allowed' : 'bg-neutral-900 text-neutral-600 cursor-not-allowed'
                : isGow
                  ? 'bg-orange-600 hover:bg-orange-500 text-white font-medium'
                  : theme === 'light' 
                    ? 'bg-zinc-950 hover:bg-zinc-850 text-white font-medium shadow-sm'
                    : 'bg-neutral-100 hover:bg-white text-neutral-950 font-medium'
            }`}
            aria-label={isGow ? 'डिजाइन करें' : 'Generate'}
          >
             {isLoading ? (
              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <span>{isGow ? 'बनाएं' : 'Build'}</span>
                <SendIcon className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};