import React from 'react';
import { motion } from 'motion/react';
import { AppMode } from '../types';
import { PenIcon, BulbIcon, CompassIcon, CodeIcon } from './icons/Icons';

interface SuggestionChipsProps {
  onChipClick: (prompt: string) => void;
  appMode: AppMode;
  theme: 'dark' | 'light';
}

const normalSuggestions = [
  { text: "Generate a futuristic space agency landing page with 3D starfield, GSAP timeline, and character reveals", icon: <CompassIcon className="w-6 h-6 text-indigo-400" /> },
  { text: "Design a luxury electric watch landing page with a central rotating 3D clock and kinetic scroll effects", icon: <BulbIcon className="w-6 h-6 text-indigo-400" /> },
  { text: "Create an interactive portfolio for a kinetic typographer featuring custom circular mouse cursor trail", icon: <PenIcon className="w-6 h-6 text-indigo-400" /> },
  { text: "Generate a cybernetic neon dark portfolio with a floating 3D bento grid and magnet hover buttons", icon: <CodeIcon className="w-6 h-6 text-indigo-400" /> },
];

const gowSuggestions = [
  { text: "एक वेबसाइट जो दिखाती है कि बिल्लियाँ गुप्त रूप से दुनिया पर कैसे राज करती हैं, जिसमें उड़ते हुए चूहे और 3D एनीमेशन हो", icon: <PenIcon className="w-6 h-6 text-orange-400" /> },
  { text: "एक ऐसी आलीशान दुकान जहाँ केवल उल्टे-सीधे गैजेट्स और उड़ने वाले समोसे 3D ग्लास में घूमते हुए बिकते हैं", icon: <BulbIcon className="w-6 h-6 text-orange-400" /> },
  { text: "एक अंतरिक्ष यात्री गाय की डायरी, जिसमें चंद्रमा पर हरी घास ढूंढने की 3D स्क्रीन्स और मद्धम संगीत एनीमेशन हो", icon: <CompassIcon className="w-6 h-6 text-orange-400" /> },
  { text: "एक अंतरिक्ष एआई ढाबा जहाँ रोबोट वेटर घी लगी तंदूरी रोटी और गरम-गरम पनीर टिक्का 3D प्लेट में परोसते हैं", icon: <CodeIcon className="w-6 h-6 text-orange-400" /> },
];

export const SuggestionChips: React.FC<SuggestionChipsProps> = ({ onChipClick, appMode, theme }) => {
  const suggestions = appMode === 'GOW' ? gowSuggestions : normalSuggestions;
  const isGow = appMode === 'GOW';

  // Container variants for staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 15 },
    show: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex md:grid md:grid-cols-4 overflow-x-auto md:overflow-x-visible pb-3 md:pb-0 gap-4 w-full scrollbar-none snap-x snap-mandatory"
    >
      {suggestions.map(({ text, icon }, index) => (
        <motion.button
          key={index}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.03, 
            y: -5,
            transition: { type: 'spring', stiffness: 200, damping: 10 }
          }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onChipClick(text)}
          className={`p-4 rounded-xl text-left border flex flex-col justify-between h-28 min-w-[260px] md:min-w-0 flex-shrink-0 snap-start cursor-pointer group ${
            theme === 'light'
              ? 'bg-white border-zinc-200 hover:border-zinc-350 text-zinc-700 hover:text-zinc-950 shadow-[0_1px_3px_rgba(0,0,0,0.02)]'
              : isGow 
                ? 'bg-neutral-900/20 border-neutral-900 hover:border-orange-950/40 text-neutral-200 hover:text-white' 
                : 'bg-neutral-900/20 border-neutral-900 hover:border-neutral-850 text-neutral-200 hover:text-white'
          }`}
        >
          <span className={`text-[11px] font-normal leading-relaxed transition-colors line-clamp-3 font-sans ${
            theme === 'light' ? 'text-zinc-650 group-hover:text-zinc-950' : 'text-neutral-300 group-hover:text-neutral-100'
          }`}>
            {text}
          </span>
          <div className="self-end opacity-40 group-hover:opacity-90 transition-opacity">
            {React.cloneElement(icon, { className: `w-4 h-4 ${theme === 'light' ? 'text-zinc-400' : 'text-neutral-400'}` })}
          </div>
        </motion.button>
      ))}
    </motion.div>
  );
};
