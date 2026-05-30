import React, { useEffect, useRef } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import FlipDigit from './FlipDigit';
import { WEDDING_CONFIG } from '../config';
import { usePersonalization } from '../hooks/usePersonalization';
import gsap from 'gsap';

type CountdownSectionProps = {
  name: string;
};

function DigitBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="countdown-block flex flex-col items-center">
      <div className="flex bg-ivory rounded-xl border border-champagne/40 px-3 py-4 md:px-4 md:py-6 shadow-sm mb-3">
        {value.split('').map((char, idx) => (
          <FlipDigit key={idx} value={char} />
        ))}
      </div>
      <div className="h-[1px] w-6 bg-champagne mb-2" />
      <span className="font-jost text-xs tracking-[0.2em] uppercase text-muted-brown">{label}</span>
    </div>
  );
}

export default function CountdownSection({ name }: CountdownSectionProps) {
  const { countdownLine, displayName } = usePersonalization(name);
  const timeLeft = useCountdown(WEDDING_CONFIG.weddingDate);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.countdown-label',
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8,
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      );

      gsap.fromTo('.countdown-block',
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 80%',
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const lineText = timeLeft.isPassed ? `${displayName}, our forever has begun ♡` : countdownLine;

  return (
    <section ref={containerRef} className="relative w-full flex flex-col items-center justify-center py-24 md:py-32 overflow-hidden"
      style={{
        background: 'linear-gradient(to bottom, var(--color-ivory) 0%, #faf0dd 50%, #f4e8d3 100%)'
      }}
    >
      {/* SVG fractal-noise grain overlay 18% opacity */}
      <div className="absolute inset-0 z-0 opacity-[0.18] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="w-full h-[1px] bg-champagne/40 absolute top-0" />
      <div className="w-full h-[1px] bg-champagne/40 absolute bottom-0" />

      <div className="relative z-10 flex flex-col items-center text-center px-6">
        <h3 className="countdown-label font-jost text-xs tracking-[0.3em] uppercase text-champagne mb-4">
          Counting down to our forever
        </h3>
        
        <p className="countdown-label font-cormorant italic text-deep-brown text-2xl md:text-3xl max-w-[30rem] leading-relaxed mb-16">
          {lineText}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          <DigitBlock label="Days" value={timeLeft.days} />
          <DigitBlock label="Hours" value={timeLeft.hours} />
          <DigitBlock label="Minutes" value={timeLeft.minutes} />
          <DigitBlock label="Seconds" value={timeLeft.seconds} />
        </div>
      </div>
    </section>
  );
}
