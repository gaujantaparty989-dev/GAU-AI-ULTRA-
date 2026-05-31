import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GowHeadIcon } from './icons/Icons';

interface GowLoadingProps {
  message?: string;
  appMode?: 'NORMAL' | 'GOW';
}

export const GowLoading: React.FC<GowLoadingProps> = ({ message, appMode = 'NORMAL' }) => {
  const [secondsLeft, setSecondsLeft] = useState(120);
  const [statusIndex, setStatusIndex] = useState(0);

  const normalStates = [
    "Parsing design tokens and viewport metrics...",
    "Synthesizing Tailwind scaffolding...",
    "Applying premium responsive layout rules...",
    "Injecting buttery smooth motion curves...",
    "Compiling interactive component assets...",
    "Assembling structural bento layouts...",
    "Verifying aesthetic typography scales..."
  ];

  const gowStates = [
    "गउ माता नये विचार मथ रही हैं...",
    "घास से ऊर्जा लेकर कोड जनरेट किया जा रहा है...",
    "आपके शानदार कोड में देसी घी का तड़का लग रहा है...",
    "दूधिया रोशनी के साथ डिज़ाइन चमकाया जा रहा है...",
    "मक्खन की तरह स्मूथ एनिमेशन डाले जा रहे हैं...",
    "गोबर गैस से कंप्यूटर को फुल चार्ज किया जा रहा है...",
    "गजब का वेबसाइट संकलन तैयार हो रहा है..."
  ];

  const statesList = appMode === 'GOW' ? gowStates : normalStates;

  // Countdown timer effect (2 minutes = 120 seconds)
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsLeft]);

  // Status rotation effect
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statesList.length);
    }, 4500);
    return () => clearInterval(statusInterval);
  }, [statesList.length]);

  // Format time (MM:SS)
  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = ((120 - secondsLeft) / 120) * 100;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 50, damping: 15 }}
      className="flex flex-col items-center justify-center text-center p-8 max-w-xl mx-auto bg-slate-900 border border-slate-800/80 rounded-3xl shadow-2xl relative overflow-hidden"
    >
      {/* Dynamic ambient lights */}
      <div className="absolute top-[-30%] left-[-30%] w-80 h-80 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-30%] right-[-30%] w-80 h-80 bg-rose-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      {appMode === 'GOW' ? (
        <div className="relative w-36 h-36 flex items-center justify-center mb-6">
          <motion.div
            animate={{ 
              y: [0, -12, 0],
              rotate: [-2, 3, -2]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <GowHeadIcon className="w-24 h-24 text-rose-500 drop-shadow-[0_0_15px_rgba(244,63,94,0.3)]" />
          </motion.div>
        </div>
      ) : (
        <div className="relative w-24 h-24 flex items-center justify-center mb-8">
          {/* Inner pulsating core */}
          <motion.div 
            animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-4 rounded-full bg-indigo-500/10 blur-md"
          />
          {/* Orbital double borders */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-0 border-2 border-dashed border-indigo-500/30 rounded-full"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            className="absolute inset-1.5 border-2 border-t-indigo-500 border-r-transparent border-b-rose-500 border-l-transparent rounded-full"
          />
          <span className="text-[10px] font-mono font-black text-indigo-400 select-none tracking-widest">COSMO</span>
        </div>
      )}

      {/* Primary Message */}
      <h3 className="text-xl sm:text-2xl font-bold text-white font-sans mb-2 tracking-tight">
        {message || (appMode === 'GOW' ? "गउ माता जादू बिखेर रही हैं..." : "Crafting Experiential Build...")}
      </h3>

      {/* Dynamic Status ticker with smooth slide fades */}
      <div className="h-10 overflow-hidden mb-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p 
            key={statusIndex}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.8, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="text-xs font-semibold text-slate-400 font-mono tracking-wide px-4"
          >
            {statesList[statusIndex]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress & Countdown Block */}
      <div className="w-full bg-slate-950/70 p-5 rounded-2xl border border-slate-800/60 backdrop-blur-md space-y-4">
        <div className="flex justify-between items-center text-[10px] font-bold font-sans text-slate-500 uppercase tracking-widest">
          <span>{appMode === 'GOW' ? "संकलन प्रगति (PROGRESS)" : "QUANTUM PIPELINE ESTIMATOR"}</span>
          <motion.span 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-rose-400 font-mono text-xs bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg"
          >
            {formatTime(secondsLeft)}
          </motion.span>
        </div>

        {/* ProgressBar */}
        <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden relative">
          <motion.div 
            className={`h-full bg-gradient-to-r transition-all duration-1000 ${
              appMode === 'GOW' 
                ? 'from-rose-500 via-pink-500 to-orange-400' 
                : 'from-indigo-500 via-purple-500 to-rose-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <p className="text-[10px] text-slate-500 leading-normal font-sans">
          {appMode === 'GOW'
            ? "महान रचनाएँ समय लेती हैं। गउ माता इसे आपके लिए बेहद मज़ेदार बना रही हैं!"
            : "High-performance experiential websites take around 2 minutes to compile correctly to optimize physics coordinates."}
        </p>
      </div>
    </motion.div>
  );
};
