import React, { useEffect, useRef, useState } from 'react';

interface InteractiveFluidCanvasProps {
  theme: 'dark' | 'light';
}

interface Node {
  x: number;
  y: number;
  ox: number; // original resting x
  oy: number; // original resting y
  vx: number;
  vy: number;
}

export const InteractiveFluidCanvas: React.FC<InteractiveFluidCanvasProps> = ({ theme }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, px: -1000, py: -1000, vx: 0, vy: 0, active: false });
  const nodesRef = useRef<Node[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Handle ResizeObserver to track container boundaries gracefully without breaking layout
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let resizeTimeout: NodeJS.Timeout;

    const observer = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      
      // Debounced resize update for clean, smooth redraws
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        setDimensions({ width, height });
      }, 100);
    });

    observer.observe(container);
    return () => {
      observer.disconnect();
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Initialize node grid when dimensions change
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return;

    const nodes: Node[] = [];
    const spacing = 45; // grid spacing
    const cols = Math.ceil(dimensions.width / spacing) + 1;
    const rows = Math.ceil(dimensions.height / spacing) + 1;

    for (let c = 0; c < cols; c++) {
      for (let r = 0; r < rows; r++) {
        const x = c * spacing;
        const y = r * spacing;
        nodes.push({
          x,
          y,
          ox: x,
          oy: y,
          vx: 0,
          vy: 0,
        });
      }
    }

    nodesRef.current = nodes;
  }, [dimensions]);

  // Core physics rendering loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    // Track mouse move listeners at the window level for continuous, fluid tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const m = mouseRef.current;
      m.x = e.clientX - rect.left;
      m.y = e.clientY - rect.top;
      m.vx = m.x - m.px;
      m.vy = m.y - m.py;
      m.px = m.x;
      m.py = m.y;
      m.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);

    const physicsLoop = () => {
      if (!isRunning) return;

      // Draw background/clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const spacing = 45;

      // Damping friction and spring stiffness constants for organic fluid tension
      const springStiffness = 0.045;
      const friction = 0.88;
      const repellerRadius = 140;
      const repellerForce = 1.8;

      // Update Node Physics
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        // 1. Return-to-home spring force
        const dxRest = n.ox - n.x;
        const dyRest = n.oy - n.y;
        n.vx += dxRest * springStiffness;
        n.vy += dyRest * springStiffness;

        // 2. Mouse gravity/repeller physics
        if (mouse.active) {
          const dxMouse = n.x - mouse.x;
          const dyMouse = n.y - mouse.y;
          const distSquare = dxMouse * dxMouse + dyMouse * dyMouse;
          const dist = Math.sqrt(distSquare);

          if (dist < repellerRadius) {
            // Stronger push when closer with dynamic fallback to prevent dividing by zero
            const push = (1 - dist / repellerRadius) * repellerForce;
            const headingX = dxMouse / (dist || 1);
            const headingY = dyMouse / (dist || 1);

            n.vx += headingX * push;
            n.vy += headingY * push;

            // Introduce micro vorticity swirls based on lateral mouse drag speeds
            const mSpeedAndVorticity = Math.abs(mouse.vx) + Math.abs(mouse.vy);
            if (mSpeedAndVorticity > 2) {
              const tangentX = -headingY;
              const tangentY = headingX;
              n.vx += tangentX * mouse.vx * 0.04;
              n.vy += tangentY * mouse.vy * 0.04;
            }
          }
        }

        // Apply friction and integrate velocities
        n.vx *= friction;
        n.vy *= friction;
        n.x += n.vx;
        n.y += n.vy;
      }

      // Draw Fluid Mesh Matrix Lines & Intersections
      const cols = Math.ceil(dimensions.width / spacing) + 1;
      const rows = Math.ceil(dimensions.height / spacing) + 1;

      ctx.lineWidth = 0.75;
      const isDark = theme === 'dark';

      // Pick gorgeous, luxury tones
      ctx.strokeStyle = isDark 
        ? 'rgba(129, 140, 248, 0.05)' // subtle indigo
        : 'rgba(99, 102, 241, 0.03)'; // extremely light indigo file style

      // Draw Grid Matrix connections with custom alpha based on distance displacement
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const idx = c * rows + r;
          const n = nodes[idx];
          if (!n) continue;

          // Wire Horizontal Line
          if (c < cols - 1) {
            const nextH = nodes[(c + 1) * rows + r];
            if (nextH) {
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(nextH.x, nextH.y);
              ctx.stroke();
            }
          }

          // Wire Vertical Line
          if (r < rows - 1) {
            const nextV = nodes[c * rows + (r + 1)];
            if (nextV) {
              ctx.beginPath();
              ctx.moveTo(n.x, n.y);
              ctx.lineTo(nextV.x, nextV.y);
              ctx.stroke();
            }
          }

          // Draw Glowing Interactive Pivot Joints
          const distanceMovedSq = (n.x - n.ox) * (n.x - n.ox) + (n.y - n.oy) * (n.y - n.oy);
          if (distanceMovedSq > 2) {
            const motionFactor = Math.min(distanceMovedSq / 400, 1);
            ctx.fillStyle = isDark
              ? `rgba(244, 63, 94, ${0.08 * motionFactor})` // pink/rose flare
              : `rgba(225, 29, 72, ${0.04 * motionFactor})`;
            ctx.beginPath();
            ctx.arc(n.x, n.y, 2 + motionFactor * 2.5, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(physicsLoop);
    };

    physicsLoop();

    return () => {
      isRunning = false;
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [dimensions, theme]);

  return (
    <div ref={containerRef} className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full h-full block"
      />
    </div>
  );
};
