import React from 'react';
import { motion } from 'motion/react';
import { AppMode } from '../types';

interface ModeSelectionProps {
  onModeSelect: (mode: AppMode) => void;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({ onModeSelect }) => {
  // Ultra-smooth dynamic 3D Mouse tilt tracker
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    // Calculate tilt values with inertia limits
    const angleX = (yc - y) / 12; 
    const angleY = (x - xc) / 12; 
    card.style.setProperty('--rotate-x', `${angleX}deg`);
    card.style.setProperty('--rotate-y', `${angleY}deg`);
    
    // Track light flare position
    const flareX = (x / rect.width) * 100;
    const flareY = (y / rect.height) * 100;
    card.style.setProperty('--flare-x', `${flareX}%`);
    card.style.setProperty('--flare-y', `${flareY}%`);
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    card.style.setProperty('--rotate-x', '0deg');
    card.style.setProperty('--rotate-y', '0deg');
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col justify-between p-6 md:p-12 relative overflow-hidden font-sans">
      {/* Decorative luxury mesh backdrop wireframe */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none z-0" />
      
      {/* Absolute clean backdrop radial light flare */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none z-0" />

      {/* Header section inside the full viewport */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg mx-auto pt-8 md:pt-16 text-center z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] font-mono tracking-widest text-neutral-400 uppercase mb-6 shadow-inner">
          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-ping"></span>
          Application Generator Core v1.5
        </div>
        <h1 className="text-4xl sm:text-5xl font-light tracking-tight text-white mb-4 uppercase bg-gradient-to-b from-white to-neutral-400 bg-clip-text text-transparent">
          Gow AI Ultra
        </h1>
        <p className="text-xs text-neutral-400 leading-relaxed font-normal max-w-sm mx-auto px-4">
          Unleash the next generation of beautiful, expressive, and interactive code pipelines.
        </p>
      </motion.div>
      
      {/* Core Selection Slots */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl w-full mx-auto my-12 z-10">
        
        {/* Normal Mode Selection Card */}
        <motion.div 
          onClick={() => onModeSelect(AppMode.NORMAL)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02 }}
          style={{
            transform: 'perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s',
          } as React.CSSProperties}
          className="relative bg-neutral-900/30 hover:bg-neutral-950 border border-neutral-900 hover:border-neutral-800 rounded-2xl p-8 flex flex-col justify-between group cursor-pointer text-left md:h-[290px] overflow-hidden shadow-2xl"
        >
          {/* Dynamic Laser-flare overlay trail */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(ellipse 110px 110px at var(--flare-x, 50%) var(--flare-y, 50%), rgba(255, 255, 255, 0.05), transparent 80%)`,
            }}
          />

          <div style={{ transform: 'translateZ(30px)' }}>
            <div className="text-[10px] font-mono text-neutral-500 mb-4 tracking-wider uppercase flex justify-between items-center">
              <span>Pipeline Alpha</span>
              <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-neutral-400">→</span>
            </div>
            <h2 className="text-xl font-medium text-white mb-2 tracking-tight">
              Normal Mode
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mt-3">
              Generate pixel-perfect professional web applications and clean landing pages powered by modern functional code blocks.
            </p>
          </div>
          <div className="mt-8" style={{ transform: 'translateZ(15px)' }}>
            <span className="inline-flex items-center text-xs font-semibold text-neutral-300 group-hover:text-white transition-colors border-b border-neutral-800 pb-0.5">
              Launch Core Engine
            </span>
          </div>
        </motion.div>

        {/* Gow Mode Selection Card */}
        <motion.div 
          onClick={() => onModeSelect(AppMode.GOW)}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          initial={{ opacity: 0, y: 40, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ scale: 1.02 }}
          style={{
            transform: 'perspective(1000px) rotateX(var(--rotate-x, 0deg)) rotateY(var(--rotate-y, 0deg))',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.1s cubic-bezier(0.25, 1, 0.5, 1), background-color 0.3s',
          } as React.CSSProperties}
          className="relative bg-neutral-900/30 hover:bg-neutral-950 border border-neutral-900/60 hover:border-rose-900/50 rounded-2xl p-8 flex flex-col justify-between group cursor-pointer text-left md:h-[290px] overflow-hidden shadow-2xl"
        >
          {/* Glowing rose laser light flare overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: `radial-gradient(ellipse 130px 130px at var(--flare-x, 50%) var(--flare-y, 50%), rgba(244, 63, 94, 0.08), transparent 80%)`,
            }}
          />

          <div style={{ transform: 'translateZ(30px)' }}>
            <div className="text-[10px] font-mono text-rose-500 mb-4 tracking-wider uppercase flex justify-between items-center">
              <span>Pipeline Beta • Recommended</span>
              <span className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-rose-400">→</span>
            </div>
            <h2 className="text-xl font-medium text-white mb-2 tracking-tight flex items-center justify-between">
              <span>Gow Mode</span>
            </h2>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-xs mt-3">
              Design experiential interfaces infused with interactive animations, Hindi narrative commentary, and cattle visual styling.
            </p>
          </div>
          <div className="mt-8" style={{ transform: 'translateZ(15px)' }}>
            <span className="inline-flex items-center text-xs font-semibold text-rose-400 group-hover:text-rose-300 transition-colors border-b border-rose-950 pb-0.5">
              Launch Gow Engine
            </span>
          </div>
        </motion.div>
      </div>

      {/* Footer copyright info */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1, delay: 0.5 }}
        className="w-full text-center pb-4 z-10 pointer-events-none"
      >
        <p className="text-[9px] font-mono text-neutral-400 tracking-widest uppercase">
          Clean Studio • Zero Gimmicks • Crafted to Inspire
        </p>
      </motion.div>
    </div>
  );
};
