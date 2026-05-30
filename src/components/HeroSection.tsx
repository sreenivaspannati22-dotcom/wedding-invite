import React, { useEffect, useRef } from 'react';
import { WEDDING_CONFIG } from '../config';
import gsap from 'gsap';
import { usePersonalization } from '../hooks/usePersonalization';

type HeroSectionProps = {
  name: string;
};

export default function HeroSection({ name }: HeroSectionProps) {
  const { heroLine } = usePersonalization(name);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Character stagger for names
      gsap.fromTo('.name-char',
        { opacity: 0, rotateX: -45, y: 20 },
        { opacity: 1, rotateX: 0, y: 0, duration: 1, stagger: 0.05, ease: "back.out(1.5)", delay: 0.2 }
      );
      
      // Word stagger for headline
      gsap.fromTo('.hero-word',
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power2.out", delay: 1.5 }
      );

      // Date fade
      gsap.fromTo('.hero-date',
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 2.5 }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const person1Chars = WEDDING_CONFIG.couple.person1.split('');
  const person2Chars = WEDDING_CONFIG.couple.person2.split('');
  const heroWords = heroLine.split(' ');

  return (
    <section ref={containerRef} className="relative w-full h-[100dvh] flex items-center justify-center overflow-hidden">
      {/* Background Images Crossfade */}
      <div className="absolute inset-0 z-0 bg-deep-brown">
        {WEDDING_CONFIG.heroImages.map((src, i) => (
          <div
            key={src}
            className="absolute inset-0 bg-cover"
            style={{
              backgroundImage: `url(${src})`,
              backgroundPosition: 'center 25%',
              filter: 'blur(10px) brightness(0.65) saturate(1.05)',
              animation: `hero-crossfade ${WEDDING_CONFIG.heroImages.length * 8}s infinite`,
              animationDelay: `${i * 8}s`,
              opacity: 0,
            }}
          />
        ))}
      </div>

      {/* Warm gradient mesh overlay + Vignette + Fade band to Ivory at bottom */}
      <div 
        className="absolute inset-0 z-10" 
        style={{ 
          background: 'linear-gradient(to bottom, rgba(35, 20, 15, 0.55) 0%, rgba(35, 20, 15, 0.4) 60%, var(--color-ivory) 100%)' 
        }} 
      />

      {/* Content */}
      <div className="relative z-20 flex flex-col items-center text-center px-6 mt-[-10vh] w-full">
        
        {/* Eyebrow */}
        <div className="flex items-center justify-center w-full gap-4 mb-6 opacity-90">
          <div className="w-8 h-[1px] bg-champagne" />
          <span className="font-jost text-xs tracking-[0.3em] uppercase text-ivory">Join us for the wedding of</span>
          <div className="w-8 h-[1px] bg-champagne" />
        </div>

        {/* Couple Names - 3 lines */}
        <div className="flex flex-col items-center gap-2 mb-6 w-full">
          <h1 className="font-great-vibes text-gold text-[clamp(3rem,8vw,6rem)] leading-none" aria-label={WEDDING_CONFIG.couple.person1}>
            {person1Chars.map((char, i) => (
              <span key={i} className="name-char inline-block">{char === ' ' ? '\u00A0' : char}</span>
            ))}
          </h1>
          <span className="font-great-vibes text-champagne text-[clamp(2rem,4vw,3.25rem)]">&</span>
          <h1 className="font-great-vibes text-gold text-[clamp(3rem,8vw,6rem)] leading-none" aria-label={WEDDING_CONFIG.couple.person2}>
            {person2Chars.map((char, i) => (
              <span key={i} className="name-char inline-block">{char === ' ' ? '\u00A0' : char}</span>
            ))}
          </h1>
        </div>

        {/* Subname */}
        <div className="font-great-vibes text-ivory/85 text-2xl md:text-3xl mb-10">
          Together Forever
        </div>

        {/* Personalized Headline */}
        <p className="font-lora italic text-ivory text-lg md:text-xl max-w-[36rem] leading-relaxed mb-12" aria-label={heroLine}>
          {heroWords.map((word, i) => (
            <span key={i} className="hero-word inline-block mr-2">{word}</span>
          ))}
        </p>

        {/* Date block */}
        <div className="hero-date flex items-center justify-center gap-4 w-full">
          <div className="w-[1px] h-6 bg-champagne hidden md:block" />
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 font-jost text-xs md:text-sm tracking-[0.2em] uppercase text-champagne">
            <span>24 November 2026</span>
            <span className="hidden md:inline">•</span>
            <span>Udaipur, India</span>
          </div>
          <div className="w-[1px] h-6 bg-champagne hidden md:block" />
        </div>

      </div>
    </section>
  );
}
