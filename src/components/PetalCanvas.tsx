import React, { useEffect, useRef } from 'react';

type Petal = {
  x: number;
  y: number;
  width: number;
  height: number;
  speedY: number;
  speedX: number;
  swayAmplitude: number;
  swayFrequency: number;
  swayPhase: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
};

const COLORS = [
  'rgba(255, 250, 243, OPACITY)', // ivory
  'rgba(244, 215, 215, OPACITY)', // soft blush
  'rgba(217, 166, 166, OPACITY)', // dusty rose
  'rgba(198, 161, 91, OPACITY)',  // champagne tint
  'rgba(247, 239, 228, OPACITY)', // cream
];

export default function PetalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let petals: Petal[] = [];
    let width = window.innerWidth;
    let height = window.innerHeight;

    const createPetal = (randomY = false): Petal => {
      const scale = Math.random() * 0.5 + 0.5;
      const opacity = Math.random() * 0.55 + 0.3; // 0.3 - 0.85
      const colorTemplate = COLORS[Math.floor(Math.random() * COLORS.length)];
      
      return {
        x: Math.random() * width,
        y: randomY ? Math.random() * height : -20,
        width: 10 * scale,
        height: 16 * scale,
        speedY: Math.random() * 0.5 + 0.3, // 0.3 - 0.8 px/frame
        speedX: (Math.random() - 0.5) * 0.2,
        swayAmplitude: Math.random() * 1.5 + 0.5,
        swayFrequency: Math.random() * 0.02 + 0.01,
        swayPhase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        opacity,
        color: colorTemplate.replace('OPACITY', opacity.toString()),
      };
    };

    const initPetals = () => {
      const isMobile = width < 768;
      const count = isMobile ? 25 : 55;
      petals = Array.from({ length: count }).map(() => createPetal(true));
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      initPetals();
    };

    const drawPetal = (p: Petal) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      
      ctx.beginPath();
      // Bezier drawn oval
      ctx.moveTo(0, -p.height / 2);
      ctx.bezierCurveTo(p.width / 2, -p.height / 2, p.width / 2, p.height / 2, 0, p.height / 2);
      ctx.bezierCurveTo(-p.width / 2, p.height / 2, -p.width / 2, -p.height / 2, 0, -p.height / 2);
      ctx.fill();
      
      // subtle inner highlight
      ctx.strokeStyle = `rgba(255,255,255,${p.opacity * 0.5})`;
      ctx.lineWidth = 0.5;
      ctx.stroke();
      
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      petals.forEach((p, i) => {
        drawPetal(p);
        
        if (!prefersReducedMotion) {
          p.y += p.speedY;
          p.x += p.speedX + Math.sin(p.swayPhase) * p.swayAmplitude;
          p.swayPhase += p.swayFrequency;
          p.rotation += p.rotationSpeed;

          if (p.y > height + 20) {
            petals[i] = createPetal();
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    resize();
    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-[5]"
      aria-hidden="true"
    />
  );
}
