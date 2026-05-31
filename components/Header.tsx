import React from 'react';
import { DownloadIcon, SunIcon } from './icons/Icons';
import { AppMode } from '../types';

interface HeaderProps {
  appMode: AppMode;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onDownload?: () => void;
  onConfigureApiKey?: () => void;
  isSharedView?: boolean;
}

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2005/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const KeyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m-5.5 5.5l-3 3H3v-3l3-3M12 15a4 4 0 110-8 4 4 0 010 8z" />
  </svg>
);

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onDownload, onConfigureApiKey, isSharedView }) => {
  return (
    <header className={`backdrop-blur-md border-b sticky top-0 z-50 transition-all duration-300 ${
      theme === 'light'
        ? 'bg-white/80 border-zinc-200 text-zinc-900'
        : 'bg-neutral-950/85 border-neutral-900 text-white'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center space-x-2.5 items-center animate-fade-in-up">
            <span className={`text-sm font-bold tracking-wide font-sans ${
              theme === 'light' ? 'text-zinc-900' : 'text-white'
            }`}>
              GOW AI ULTRA
            </span>
            {isSharedView && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono border ${
                theme === 'light'
                  ? 'bg-zinc-100 border-zinc-200/60 text-zinc-650'
                  : 'bg-rose-950/25 border-rose-900/30 text-rose-300'
              }`}>
                <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>SHOWCASE LINK (REMIX LOCKED)</span>
              </span>
            )}
          </div>
          <div className="flex items-center space-x-3">
             {onDownload && (
               <button
                 onClick={onDownload}
                 className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-sans text-xs font-semibold transition-all duration-300 shadow-[0_2px_8px_rgba(225,29,72,0.3)] hover:scale-105 active:scale-95"
                 title="Download website package"
               >
                 <DownloadIcon className="w-3.5 h-3.5 text-white" />
                 <span className="hidden sm:inline">HTML Download</span>
                 <span className="inline sm:hidden">Download</span>
               </button>
             )}
             {onConfigureApiKey && (
               <button
                 onClick={onConfigureApiKey}
                 className={`p-2 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 ${
                   theme === 'light'
                     ? 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:text-zinc-950 hover:bg-zinc-200'
                     : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-rose-400 hover:bg-neutral-850'
                 }`}
                 title="Configure Gemini API Key"
               >
                 <KeyIcon className="w-4 h-4" />
               </button>
             )}
             <button
              onClick={onToggleTheme}
              className={`p-2 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 ${
                theme === 'light'
                  ? 'bg-zinc-100 border-zinc-200 text-zinc-750 hover:text-zinc-950 hover:bg-zinc-200'
                  : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-amber-400 hover:bg-neutral-850'
              }`}
              title={theme === 'light' ? "Switch to Dark Mode" : "Switch to Light Mode"}
             >
                {theme === 'light' ? (
                  <MoonIcon className="w-4 h-4" />
                ) : (
                  <SunIcon className="w-4 h-4 text-amber-400" />
                )}
             </button>
          </div>
        </div>
      </div>
    </header>
  );
};

