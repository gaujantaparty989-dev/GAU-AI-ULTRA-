import React, { useEffect, useRef, useState } from 'react';

interface FluidCursorProps {
  theme: 'dark' | 'light';
  isGowMode: boolean;
}

export const FluidCursor: React.FC<FluidCursorProps> = ({ theme, isGowMode }) => {
  const innerDotRef = useRef<HTMLDivElement>(null);
  const outerRingRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: -100, y: -100 });
  const innerRef = useRef({ x: -100, y: -100 });
  const outerRef = useRef({ x: -100, y: -100 });
  
  const [hoverState, setHoverState] = useState<'normal' | 'clickable' | 'input' | 'gow'>('normal');
  const [isMobile, setIsMobile] = useState(true);

  // Detect coarse pointers (touch/mobile devices) to bypass rendering standard-cursor wrappers
  useEffect(() => {
    const checkMobile = () => {
      const isCoarse = window.matchMedia('(pointer: coarse)').matches;
      const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      setIsMobile(isCoarse || hasTouch);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Sync cursor coordinates, trigger scale-ups on links/buttons
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;

      // Dynamic Interactive Target Sniffing
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const clickable = target.closest('button, a, [role="button"], [onClick], .cursor-pointer, input[type="submit"]');
      const inputField = target.closest('input[type="text"], input[type="password"], textarea, [contenteditable="true"]');
      
      if (clickable) {
        if (isGowMode) {
          setHoverState('gow');
        } else {
          setHoverState('clickable');
        }
      } else if (inputField) {
        setHoverState('input');
      } else {
        setHoverState('normal');
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isMobile, isGowMode]);

  // Main high-frequency animation loop
  useEffect(() => {
    if (isMobile) return;

    let isRunning = true;

    const tick = () => {
      if (!isRunning) return;

      const target = pointerRef.current;
      const inner = innerRef.current;
      const outer = outerRef.current;

      // 1. Smoothly interpolate inner dot (leads mouse tightly)
      inner.x += (target.x - inner.x) * 0.45;
      inner.y += (target.y - inner.y) * 0.45;

      // 2. Smoothly interpolate outer ring (lagging inertia)
      const prevOuterX = outer.x;
      const prevOuterY = outer.y;
      outer.x += (target.x - outer.x) * 0.16;
      outer.y += (target.y - outer.y) * 0.16;

      // Render translations via hardware-accelerated transform matrices
      if (innerDotRef.current) {
        innerDotRef.current.style.transform = `translate3d(${inner.x}px, ${inner.y}px, 0)`;
      }

      if (outerRingRef.current) {
        // Compute heading angle and speed-based vector length to deform (stretch) the ring
        const dx = outer.x - prevOuterX;
        const dy = outer.y - prevOuterY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Dynamic stretching math to maintain physical area conservation
        const stretchFactor = Math.min(distance * 0.08, 0.7);
        const scaleX = 1 + stretchFactor;
        const scaleY = 1 / (1 + stretchFactor);
        const rotationAngle = Math.atan2(dy, dx) * (180 / Math.PI);

        // Map scale multiplier based on active hover states
        let baseScale = 1;
        if (hoverState === 'clickable') baseScale = 2.2;
        if (hoverState === 'gow') baseScale = 2.8;
        if (hoverState === 'input') baseScale = 0.5;

        outerRingRef.current.style.transform = `translate3d(${outer.x}px, ${outer.y}px, 0) rotate(${rotationAngle}deg) scale3d(${scaleX * baseScale}, ${scaleY * baseScale}, 1)`;
      }

      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    return () => {
      isRunning = false;
    };
  }, [isMobile, hoverState]);

  if (isMobile) return null;

  const isDark = theme === 'dark';

  return (
    <>
      {/* Absolute Inner Floating Core Point */}
      <div
        ref={innerDotRef}
        className={`fixed top-0 left-0 w-2.5 h-2.5 -ml-1.25 -mt-1.25 rounded-full pointer-events-none z-[9999] transition-opacity duration-350 ${
          hoverState === 'input' ? 'opacity-0' : 'opacity-100'
        } ${
          isGowMode && hoverState !== 'normal' 
            ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.6)]' 
            : isDark ? 'bg-white' : 'bg-zinc-950'
        }`}
      />

      {/* Dynamic Outer Jelly Elastic Floating Loop Ring */}
      <div
        ref={outerRingRef}
        className={`fixed top-0 left-0 w-8 h-8 -ml-4 -mt-4 rounded-full border pointer-events-none z-[9998] transition-colors duration-300 flex items-center justify-center overflow-hidden uppercase font-mono tracking-widest text-[7px] font-bold ${
          hoverState === 'clickable'
            ? isDark
              ? 'bg-white/5 border-white text-white'
              : 'bg-zinc-950/5 border-zinc-950 text-zinc-950'
            : hoverState === 'gow'
              ? 'bg-rose-500/10 border-rose-500 text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.2)]'
              : hoverState === 'input'
                ? 'border-dashed border-rose-450 bg-rose-500/5'
                : isDark
                  ? 'border-white/18 text-transparent'
                  : 'border-zinc-950/15 text-transparent'
        }`}
      >
        {hoverState === 'gow' && <span className="animate-pulse">GOW</span>}
        {hoverState === 'clickable' && !isGowMode && <span>TAP</span>}
      </div>
    </>
  );
};
