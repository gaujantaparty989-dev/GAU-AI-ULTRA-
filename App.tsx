import React, { useState, useCallback, useEffect } from 'react';
import { motion } from 'motion/react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { AppPreview } from './components/AppPreview';
import { generateAppCode, enhancePrompt, modifyAppCode, generateImage } from './services/geminiService';
import { AppState, AppMode, GowFeature } from './types';
import { ModeSelection } from './components/ModeSelection';
import { GowLoading } from './components/GowLoading';
import { SuggestionChips } from './components/SuggestionChips';
import { useVoiceRecognition } from './hooks/useVoiceRecognition';
import { FileUploadModal } from './components/FileUploadModal';
import { decompressFromUrlSafeB64 } from './utils/compression';
import { InteractiveFluidCanvas } from './components/InteractiveFluidCanvas';
import { FluidCursor } from './components/FluidCursor';

// Image cache to prevent redundant generation of identical image prompts
const imageCache = new Map<string, string>();

/**
 * Deflates base64 image strings back to their semantic AI_PROMPT: tags
 * before sending to the model to save tokens and prevent model truncation/timeouts.
 */
const deflateImages = (htmlCode: string): string => {
  if (!htmlCode) return '';
  return htmlCode.replace(/src="data:image\/[^"]+" data-ai-prompt="([^"]+)"/g, (_, prompt) => {
    const unescapedPrompt = prompt.replace(/&quot;/g, '"');
    return `src="AI_PROMPT:${unescapedPrompt}"`;
  });
};

// New Animated Header Component for the "Grand Entrance" with motion springs
const AnimatedHeaderText: React.FC<{ text: string; theme: 'dark' | 'light' }> = ({ text, theme }) => {
  return (
    <motion.h1 
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 90, damping: 14 }}
      className={`text-4xl md:text-5xl font-light tracking-tight mb-2 font-sans transition-colors duration-300 ${
        theme === 'light' ? 'text-zinc-950' : 'text-white'
      }`}
    >
      <span>{text}</span>
    </motion.h1>
  );
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [appMode, setAppMode] = useState<AppMode | null>(null);
  const [gowFeature, setGowFeature] = useState<GowFeature | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [generatedCode, setGeneratedCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [tempApiKey, setTempApiKey] = useState('');
  const [isSharedView, setIsSharedView] = useState(false);

  useEffect(() => {
    const checkSharedUrl = async () => {
      try {
        const hash = window.location.hash || '';
        const search = window.location.search || '';
        
        let codeParam = '';
        let lockedParam = false;
        
        // Try parsing hash first (recommended for long URL support)
        if (hash.startsWith('#')) {
          const hashParams = new URLSearchParams(hash.substring(1));
          codeParam = hashParams.get('code') || '';
          lockedParam = hashParams.get('remix') === 'false' || hashParams.get('locked') === 'true';
        }
        
        // Fallback to query parameter
        if (!codeParam && search) {
          const searchParams = new URLSearchParams(search);
          codeParam = searchParams.get('code') || '';
          lockedParam = searchParams.get('remix') === 'false' || searchParams.get('locked') === 'true';
        }
        
        if (codeParam) {
          const decompressed = await decompressFromUrlSafeB64(codeParam);
          if (decompressed) {
            setGeneratedCode(decompressed);
            setAppMode(AppMode.NORMAL); // Default to Normal mode mapping
            setAppState(AppState.GENERATED);
            if (lockedParam) {
              setIsSharedView(true);
            }
          }
        }
      } catch (err) {
        console.error('Failed to restore compressed shared code state:', err);
      }
    };

    checkSharedUrl();

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('GOW_GEMINI_API_KEY');
      if (saved) {
        setTempApiKey(saved);
      }
    }
  }, []);
  
  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark');
  }, []);

  const { isListening, toggleListening, hasRecognitionSupport } = useVoiceRecognition(
    (transcript) => {
      setPrompt(p => p + transcript + ' ');
    }
  );


  const processAndSetImages = useCallback(async (htmlCode: string) => {
    const imagePrompts: { index: number; prompt: string; placeholder: string }[] = [];
    const regex = /src="AI_PROMPT:([^"]+)"/g;
    let match;
    let tempCode = htmlCode;

    while ((match = regex.exec(htmlCode)) !== null) {
      const placeholder = `__IMAGE_PLACEHOLDER_${imagePrompts.length}__`;
      imagePrompts.push({ index: imagePrompts.length, prompt: match[1], placeholder: match[0] });
      tempCode = tempCode.replace(match[0], `src="${placeholder}"`);
    }

    if (imagePrompts.length === 0) {
      setGeneratedCode(htmlCode);
      setAppState(AppState.GENERATED);
      return;
    }

    setAppState(AppState.GENERATING_IMAGES);

    const imagePromises = imagePrompts.map(async (p) => {
      if (imageCache.has(p.prompt)) {
        return imageCache.get(p.prompt)!;
      }
      try {
        const base64 = await generateImage(p.prompt);
        imageCache.set(p.prompt, base64);
        return base64;
      } catch (err) {
        console.error("Failed to generate separate image", p.prompt, err);
        // Return a mock or empty or throw
        throw err;
      }
    });
    
    try {
      const base64Images = await Promise.all(imagePromises);
      let finalCode = tempCode;
      base64Images.forEach((base64, index) => {
        const placeholder = `__IMAGE_PLACEHOLDER_${index}__`;
        const promptText = imagePrompts[index].prompt;
        const escapedPrompt = promptText.replace(/"/g, '&quot;');
        finalCode = finalCode.replace(`src="${placeholder}"`, `src="${base64}" data-ai-prompt="${escapedPrompt}"`);
      });
      setGeneratedCode(finalCode);
      setAppState(AppState.GENERATED);
    } catch (err) {
       console.error(err);
       setError(appMode === 'GOW' ? 'गउ की कलाकारी विफल हो गई! चित्र नहीं बन पाए, पर कोड का ढाँचा तैयार है।' : 'An error occurred while generating AI images. The generated code structure is available, but the images failed.');
       setGeneratedCode(tempCode.replace(/src="__IMAGE_PLACEHOLDER_\d+__"/g, 'src="" alt="Image generation failed"'));
       setAppState(AppState.GENERATED);
    }
  }, [appMode]);

  const handleGenerateWebsite = useCallback(async () => {
    if (!prompt) {
      setError(appMode === 'GOW' ? 'अरे! कुछ तो बताओ क्या बनाना है?' : 'Please enter a description for the app you want to build.');
      return;
    }
    setError(null);
    setGeneratedCode('');
    setAppState(AppState.GENERATING);

    try {
      const codeWithPrompts = await generateAppCode(prompt, appMode || 'NORMAL');
      setGeneratedCode(codeWithPrompts);
      await processAndSetImages(codeWithPrompts);
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message === 'MISSING_API_KEY') {
        setError('MISSING_API_KEY');
      } else {
        setError(appMode === 'GOW' ? 'ओ तेरी! दूध फट गया! गउ को कोड बनाने में समस्या आ रही है। फिर से कोशिश करें।' : 'An error occurred while generating the code. Please try again.');
      }
      setAppState(AppState.IDLE);
    }
  }, [prompt, appMode, processAndSetImages]);

  const handleModify = useCallback(async (modificationPrompt: string) => {
    if (!modificationPrompt || appState === AppState.EDITING) return;
    setError(null);
    setAppState(AppState.EDITING);
    try {
      const deflatedCode = deflateImages(generatedCode);
      const modifiedCodeWithPrompts = await modifyAppCode(deflatedCode, modificationPrompt, appMode || 'NORMAL', 'website');
      setGeneratedCode(modifiedCodeWithPrompts);
      await processAndSetImages(modifiedCodeWithPrompts);
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message === 'MISSING_API_KEY') {
        setError('MISSING_API_KEY');
      } else {
        setError(appMode === 'GOW' ? 'लगता है भैंस पानी में गई। गउ कोड नहीं बदल पा रही है। दोबारा प्रयास करें।' : 'An error occurred while modifying the code. Please try again.');
      }
      setAppState(AppState.GENERATED);
    }
  }, [generatedCode, appState, appMode, processAndSetImages]);

  const handleEnhancePrompt = useCallback(async () => {
    if (!prompt) {
      setError(appMode === 'GOW' ? 'पहले कुछ लिखो तो सही, फिर बेहतर बनाएंगे!' : 'Please enter a description to enhance.');
      return;
    }
    setError(null);
    setIsEnhancing(true);
    try {
      const enhanced = await enhancePrompt(prompt, appMode || 'NORMAL');
      setPrompt(enhanced);
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message === 'MISSING_API_KEY') {
        setError('MISSING_API_KEY');
      } else {
        setError(appMode === 'GOW' ? 'गउ का दिमाग़ अभी घास चरने गया है। विचार को बेहतर बनाने में विफल।' : 'An error occurred while enhancing the prompt. Please try again.');
      }
    } finally {
      setIsEnhancing(false);
    }
  }, [prompt, appMode]);
  
  const handleBack = () => {
    setAppState(AppState.IDLE);
    setGeneratedCode('');
    setError(null);
  };

  const handleDownloadCode = useCallback(() => {
    if (!generatedCode) return;
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [generatedCode]);

  const handleModeSelect = (mode: AppMode) => {
    setAppMode(mode);
    if (mode === AppMode.GOW) {
      setGowFeature('WEBSITE');
      setPrompt('एक वेबसाइट जो दिखाती है कि गायें गुप्त रूप से दुनिया पर कैसे राज करती हैं, जिसमें एक उड़ने वाली गाय का हीरो एनीमेशन हो।');
    } else {
      setGowFeature(null);
    }
  };

  const handleFileUpload = (content: string) => {
    setPrompt(p => p + '\n\n--- Uploaded File Content ---\n' + content);
  };

  const renderIdleContent = () => {
    const isLoading = appState === AppState.GENERATING;

    return (
      <>
        {isModalOpen && <FileUploadModal onClose={() => setIsModalOpen(false)} onFileUpload={handleFileUpload} />}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          className="flex flex-col items-center w-full"
        >
          <div className="w-full max-w-4xl mb-8">
            <SuggestionChips onChipClick={setPrompt} appMode={appMode as AppMode} theme={theme} />
          </div>
          <div className="w-full max-w-3xl">
            <PromptInput
              prompt={prompt}
              setPrompt={setPrompt}
              onGenerate={handleGenerateWebsite}
              isLoading={isLoading}
              isEnhancing={isEnhancing}
              onEnhance={handleEnhancePrompt}
              appMode={appMode as AppMode}
              onUploadClick={() => setIsModalOpen(true)}
              onMicClick={toggleListening}
              isListening={isListening}
              micSupported={hasRecognitionSupport}
              theme={theme}
            />
          </div>
        </motion.div>
      </>
    );
  };

  const renderContent = () => {
    if (appState === AppState.GENERATED || appState === AppState.EDITING || appState === AppState.GENERATING_IMAGES) {
      return <AppPreview 
        code={generatedCode} 
        onBack={handleBack} 
        appState={appState}
        onModify={handleModify}
        appMode={appMode as AppMode}
        theme={theme}
        isSharedView={isSharedView}
      />;
    }

    if (appState === AppState.GENERATING) {
        return (
          <GowLoading 
            appMode={appMode as AppMode} 
            message={appMode === 'GOW' ? "गउ AI आपकी शानदार वेबसाइट बना रही है..." : "AI is crafting your immersive website..."} 
          />
        );
    }

    return renderIdleContent();
  };

  if (!appMode) {
    return (
      <>
        <FluidCursor theme={theme} isGowMode={false} />
        <InteractiveFluidCanvas theme={theme} />
        <ModeSelection onModeSelect={handleModeSelect} />
      </>
    );
  }



  return (
    <div className={`min-h-screen flex flex-col relative overflow-hidden transition-all duration-500 ${
      theme === 'light' ? 'bg-zinc-50 text-zinc-900' : 'bg-neutral-950 text-neutral-100'
    }`}>
      {/* Background active physical mesh wave canvas & stretch cursor overlay */}
      <FluidCursor theme={theme} isGowMode={appMode === AppMode.GOW} />
      <InteractiveFluidCanvas theme={theme} />

      {/* Dynamic ambient vector lights in background */}
      <div className={`absolute top-[20%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none transition-colors duration-500 ${
        theme === 'light' ? 'bg-indigo-500/[0.02]' : 'bg-indigo-500/5'
      }`}></div>
      <div className={`absolute bottom-[10%] right-[-10%] w-[500px] h-[500px] rounded-full blur-[130px] pointer-events-none transition-colors duration-500 ${
        theme === 'light' ? 'bg-orange-500/[0.02]' : 'bg-orange-500/5'
      }`}></div>

      <Header 
        appMode={appMode} 
        theme={theme} 
        onToggleTheme={toggleTheme} 
        onDownload={generatedCode ? handleDownloadCode : undefined} 
        onConfigureApiKey={isSharedView ? undefined : () => setApiKeyModalOpen(true)}
        isSharedView={isSharedView}
      />
      <main className="flex-grow flex flex-col items-center justify-center max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10">
        {appState === AppState.IDLE && (
          <div className="text-center mb-8">
            <AnimatedHeaderText text={`Hello, ${appMode === 'GOW' ? 'Gow' : 'Creator'}`} theme={theme} />
            <p className={`text-base mt-2 animate-fade-in-up font-sans transition-colors duration-300 ${
              theme === 'light' ? 'text-zinc-650' : 'text-neutral-400'
            }`} style={{ animationDelay: '1.2s' }}>
              {appMode === 'GOW' ? 'Gow Mode' : 'Normal Mode'}
            </p>
          </div>
        )}
         {error && error === 'MISSING_API_KEY' ? (
           <div className={`p-6 rounded-2xl border max-w-xl mx-auto my-6 text-left transition-all duration-300 shadow-md ${
             theme === 'light' 
               ? 'bg-rose-50/70 border-rose-200 text-rose-950' 
               : 'bg-rose-950/20 border-rose-900/40 text-rose-100'
           }`}>
             <h3 className="text-lg font-semibold mb-3 flex items-center gap-2 text-rose-600">
               <span>🚨 Gemini API Key Required</span>
             </h3>
             <p className="text-xs mb-4 leading-relaxed opacity-90">
               Since your site is uploaded as a static **Netlify Drop** manual deployment, traditional cloud environment variables is not active inside your browser.
             </p>
             
             <div className={`p-4 rounded-xl mb-4 border ${
               theme === 'light' ? 'bg-white border-zinc-200/50' : 'bg-neutral-900/50 border-neutral-800'
             }`}>
               <h4 className="text-xs font-bold uppercase tracking-wider mb-2 text-rose-500">Provide Key Directly:</h4>
               <p className="text-xs mb-3 text-neutral-400">
                 Enter your Gemini API key below to enable real-time generations directly in this browser. The key is securely conserved in your local browser state.
               </p>
               <div className="flex space-x-2">
                 <input
                   type="password"
                   placeholder="Enter Gemini API key (AIzaSy...)"
                   value={tempApiKey}
                   onChange={(e) => setTempApiKey(e.target.value)}
                   className={`flex-grow px-3 py-1.5 text-xs rounded-lg border focus:outline-none focus:ring-1 ${
                     theme === 'light' 
                       ? 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:ring-rose-500 focus:border-rose-450' 
                       : 'bg-neutral-950 border-neutral-850 text-neutral-100 focus:ring-rose-500 focus:border-rose-500'
                   }`}
                 />
                 <button
                   onClick={() => {
                     if (tempApiKey.trim() !== '') {
                       localStorage.setItem('GOW_GEMINI_API_KEY', tempApiKey.trim());
                       setError(null);
                       window.location.reload();
                     }
                   }}
                   className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-sans text-xs font-semibold shadow-md transition-all active:scale-95"
                 >
                   Save & Activate
                 </button>
               </div>
             </div>
             
             <p className="text-[11px] opacity-75">
               🔑 Don't have a key? You can get a free one in seconds from the <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="underline hover:text-rose-500">Google AI Studio Console</a>.
             </p>
           </div>
         ) : error ? (
           <p className="text-rose-500 my-4 text-center font-semibold animate-bounce font-heading">{error}</p>
         ) : null}
        {renderContent()}
      </main>

      {apiKeyModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className={`p-6 rounded-2xl border w-full max-w-sm shadow-xl transition-all duration-300 ${
            theme === 'light' ? 'bg-white border-zinc-200 text-zinc-900' : 'bg-neutral-900 border-neutral-800 text-neutral-100'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span>🔑 Configure Gemini API Key</span>
              </h3>
              <button 
                onClick={() => setApiKeyModalOpen(false)}
                className="text-xs font-mono border px-2 py-0.5 rounded hover:opacity-75 transition-opacity"
              >
                ESC
              </button>
            </div>
            
            <p className="text-xs mb-4 leading-relaxed opacity-80">
              Enter your Gemini API key to activate high-performance, real-time website modifications directly in your browser. This key is stored securely in your browser's private local state.
            </p>

            <div className="space-y-3">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                className={`w-full px-3 py-2 text-xs rounded-lg border focus:outline-none focus:ring-1 ${
                  theme === 'light' 
                    ? 'bg-zinc-50 border-zinc-200 text-zinc-900 focus:ring-rose-500 focus:border-rose-400' 
                    : 'bg-neutral-950 border-neutral-850 text-neutral-100 focus:ring-rose-500 focus:border-rose-500'
                }`}
              />

              <div className="flex space-x-2 pt-2">
                <button
                  onClick={() => {
                    if (tempApiKey.trim() === '') {
                      localStorage.removeItem('GOW_GEMINI_API_KEY');
                    } else {
                      localStorage.setItem('GOW_GEMINI_API_KEY', tempApiKey.trim());
                    }
                    setApiKeyModalOpen(false);
                    window.location.reload();
                  }}
                  className="flex-grow py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-sans text-xs font-semibold shadow-md active:scale-95 transition-all"
                >
                  Save key & reload
                </button>
                
                <button
                  onClick={() => {
                    setApiKeyModalOpen(false);
                  }}
                  className={`px-4 py-2 border rounded-lg text-xs font-medium transition-all ${
                    theme === 'light'
                      ? 'bg-zinc-100 border-zinc-200 text-zinc-700 hover:bg-zinc-200'
                      : 'bg-neutral-850 border-neutral-800 text-neutral-350 hover:bg-neutral-800'
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
