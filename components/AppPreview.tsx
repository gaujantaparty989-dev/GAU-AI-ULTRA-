import React, { useState } from 'react';
import { AppState, AppMode } from '../types';
import { DownloadIcon, ShareIcon } from './icons/Icons';
import { CollaborationSpace } from './CollaborationSpace';
import { CodeGenerator } from './CodeGenerator';
import { GowLoading } from './GowLoading';
import { compressToUrlSafeB64 } from '../utils/compression';

interface AppPreviewProps {
  code: string;
  onBack: () => void;
  appState: AppState;
  onModify: (prompt: string) => void;
  appMode: AppMode;
  theme: 'dark' | 'light';
  isSharedView?: boolean;
}

const CodeDisplay: React.FC<{ code: string, appState: AppState, appMode: AppMode }> = ({ code, appState, appMode }) => (
  <div className="h-full">
    <CodeGenerator code={code} appState={appState} appMode={appMode} />
  </div>
);

const PreviewDisplay: React.FC<{ code: string; appState: AppState, appMode: AppMode, theme: 'dark' | 'light' }> = ({ code, appState, appMode, theme }) => {
  const isUpdating = appState === AppState.EDITING || appState === AppState.GENERATING_IMAGES;
  const isGow = appMode === 'GOW';

  let message = "";
  if (isGow) {
     if (appState === AppState.GENERATING_IMAGES) {
      message = "गउ माता आपकी वेबसाइट के लिए मज़ेदार छवियाँ बना रही हैं...";
    } else if (appState === AppState.EDITING) {
      message = "गउ माता आपके अनुरोधित परिवर्तन लागू कर रही हैं...";
    }
  }

  return (
    <div className={`rounded-xl h-full border overflow-hidden relative transition-all duration-300 ${
      theme === 'light' ? 'bg-zinc-100 border-zinc-200' : 'bg-neutral-950 border-neutral-900'
    }`}>
      {isUpdating && (
        <div className={`absolute inset-0 backdrop-blur-md flex flex-col items-center justify-center z-10 p-6 ${
          theme === 'light' ? 'bg-zinc-100/90' : 'bg-neutral-950/90'
        }`}>
          {isGow ? (
            <div className="scale-75">
              <GowLoading message={message} />
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className={`w-6 h-6 border-2 border-t-transparent rounded-full animate-spin mx-auto ${
                theme === 'light' ? 'border-zinc-850' : 'border-neutral-400'
              }`}></div>
              <p className={`text-xs font-mono tracking-widest uppercase ${
                theme === 'light' ? 'text-zinc-600' : 'text-neutral-400'
              }`}>
                {appState === AppState.GENERATING_IMAGES ? "Assembling Vector Assets..." : "Applying Node Changes..."}
              </p>
            </div>
          )}
        </div>
      )}
      <iframe
        srcDoc={code}
        title="App Preview"
        sandbox="allow-scripts allow-same-origin"
        className={`w-full h-full border-0 ${theme === 'light' ? 'bg-white' : 'bg-neutral-900'}`}
      />
    </div>
  );
};

export const AppPreview: React.FC<AppPreviewProps> = ({ code, onBack, appState, onModify, appMode, theme, isSharedView }) => {
  const [activeTab, setActiveTab] = useState('preview');
  const [shareButtonText, setShareButtonText] = useState(appMode === 'GOW' ? 'साझा करें' : 'Share');
  const isGow = appMode === 'GOW';
  
  // A simple way to guess if it's a chatbot vs a website
  const isChatbot = code.toLowerCase().includes('chatbot');

  const handleDownload = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleShare = async () => {
    setShareButtonText(isGow ? 'तैयार कर रहे हैं...' : 'Generating...');
    try {
      const compressed = await compressToUrlSafeB64(code);
      const shareUrl = `${window.location.origin}${window.location.pathname}#code=${compressed}&remix=false&locked=true`;
      
      navigator.clipboard.writeText(shareUrl).then(() => {
        setShareButtonText(isGow ? 'लिंक कॉपी हो गया!' : 'Link Copied!');
        setTimeout(() => setShareButtonText(isGow ? 'साझा करें' : 'Share'), 2500);
      }, (err) => {
        console.error('Could not copy text: ', err);
        setShareButtonText(isGow ? 'विफल!' : 'Failed!');
        setTimeout(() => setShareButtonText(isGow ? 'साझा करें' : 'Share'), 2500);
      });
    } catch (err) {
      console.error(err);
      // Fallback to copying raw code
      navigator.clipboard.writeText(code).then(() => {
        setShareButtonText(isGow ? 'कोड कॉपी हो गया!' : 'Code Copied!');
        setTimeout(() => setShareButtonText(isGow ? 'साझा करें' : 'Share'), 2500);
      });
    }
  };

  const getTitle = () => {
    if (isGow) {
      return '🐄 Gow Mode Artpiece';
    }
    return '🔮 Normal Mode Workspace';
  }

  return (
    <div className="space-y-4 md:space-y-6 animate-fade-in-up w-full font-sans">
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b ${
        theme === 'light' ? 'border-zinc-200' : 'border-neutral-900'
      }`}>
        <div>
          <h2 className={`text-lg md:text-2xl font-light tracking-tight transition-colors duration-300 ${
            theme === 'light' ? 'text-zinc-950' : 'text-white'
          }`}>{getTitle()}</h2>
          <p className={`text-xs mt-0.5 ${theme === 'light' ? 'text-zinc-500' : 'text-neutral-500'}`}>
            {isGow ? 'गउ AI सहयोगी द्वारा निर्मित वेबसाइट।' : 'Fully reactive and responsive output with local adjustments.'}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={handleDownload}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-[10px] font-mono uppercase border transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
              theme === 'light'
                ? 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950'
                : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            <DownloadIcon className={`w-3 h-3 ${theme === 'light' ? 'text-zinc-550' : 'text-neutral-400'}`} />
            <span>Download</span>
          </button>
          <button
            onClick={handleShare}
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded text-[10px] font-mono uppercase min-w-[65px] justify-center border transition-all duration-300 shadow-[0_1px_2px_rgba(0,0,0,0.02)] ${
              theme === 'light'
                ? 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950'
                : 'bg-neutral-900 border-neutral-800 text-neutral-300 hover:text-white'
            }`}
          >
            <ShareIcon className={`w-3 h-3 ${theme === 'light' ? 'text-zinc-550' : 'text-neutral-400'}`} />
            <span>{shareButtonText}</span>
          </button>
          <button
            onClick={onBack}
            className={`px-2.5 py-1.5 rounded text-[10px] font-mono uppercase transition-all duration-300 border ${
              theme === 'light'
                ? 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-950'
                : 'bg-neutral-800 border-transparent text-neutral-200 hover:text-white'
            }`}
          >
            &larr; <span>{isGow ? 'वापस' : 'Reset'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className={`p-0.5 rounded inline-flex items-center border transition-all duration-300 ${
            theme === 'light' ? 'border-zinc-200 bg-zinc-100' : 'border-neutral-900 bg-neutral-950'
          }`}>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-1 text-xs font-mono uppercase rounded transition-all duration-300 ${
                activeTab === 'preview' 
                  ? theme === 'light' ? 'bg-white text-zinc-950 shadow-sm font-semibold' : 'bg-neutral-800 text-white' 
                  : theme === 'light' ? 'text-zinc-500 hover:text-zinc-800' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {isGow ? 'पूर्वावलोकन' : 'PREVIEW'}
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-1 text-xs font-mono uppercase rounded transition-all duration-300 ${
                activeTab === 'code' 
                  ? theme === 'light' ? 'bg-white text-zinc-950 shadow-sm font-semibold' : 'bg-neutral-800 text-white' 
                  : theme === 'light' ? 'text-zinc-500 hover:text-zinc-800' : 'text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {isGow ? 'स्रोत्र कोड' : 'MARKUP'}
            </button>
          </div>
          <div className="h-[55vh] lg:h-[65vh]">
            {activeTab === 'preview'
              ? <PreviewDisplay code={code} appState={appState} appMode={appMode} theme={theme} />
              : <CodeDisplay code={code} appState={appState} appMode={appMode} />}
          </div>
        </div>
        <div className="lg:col-span-1 h-full">
          {isSharedView ? (
            <div className={`border rounded-xl p-6 h-full flex flex-col justify-center items-center text-center font-sans ${
              theme === 'light'
                ? 'bg-white border-zinc-200'
                : 'bg-neutral-900/10 border-neutral-900'
            }`}>
              <div className="w-12 h-12 rounded-full bg-rose-500/10 flex items-center justify-center mb-4 text-rose-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className={`text-sm font-semibold mb-2 tracking-tight ${theme === 'light' ? 'text-zinc-900' : 'text-white'}`}>
                {isGow ? '🐄 गउ शेयर (लॉक्ड)' : 'Remix Locked'}
              </h3>
              <p className={`text-xs leading-relaxed max-w-[200px] ${theme === 'light' ? 'text-zinc-500' : 'text-neutral-400'}`}>
                {isGow
                  ? 'निर्माता ने इस साझा वेबसाइट के संपादन और रीमिक्स पर रोक लगा दी है।'
                  : 'The creator has locked this showcase workspace to prevent modifications of this design.'
                }
              </p>
            </div>
          ) : (
            <CollaborationSpace onModify={onModify} isLoading={appState === AppState.EDITING || appState === AppState.GENERATING_IMAGES} appMode={appMode} theme={theme} />
          )}
        </div>
      </div>
    </div>
  );
};
