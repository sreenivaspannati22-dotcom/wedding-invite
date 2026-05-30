import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { WEDDING_CONFIG } from '../config';

export default function GallerySection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    const ctx = gsap.context(() => {
      // Heading fade in
      gsap.fromTo('.gallery-heading',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      );

      if (!isTouch) {
        // Parallax columns
        gsap.to('.col-1', {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true }
        });
        
        gsap.to('.col-2', {
          yPercent: 15,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true }
        });
        
        gsap.to('.col-3', {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: { trigger: sectionRef.current, start: 'top bottom', end: 'bottom top', scrub: true }
        });
      }
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Split images into columns
  const images = WEDDING_CONFIG.galleryImages;
  
  // Mobile gets 2 cols, Desktop gets 3 cols
  const col1 = [images[0], images[3], images[6]].filter(Boolean);
  const col2 = [images[1], images[4], images[7]].filter(Boolean);
  const col3 = [images[2], images[5], images[8]].filter(Boolean);

  const Column = ({ imgs, className }: { imgs: string[], className: string }) => (
    <div className={`flex flex-col gap-4 md:gap-6 w-full ${className}`}>
      {imgs.map((src, i) => (
        <div key={i} className="relative w-full rounded-[24px] overflow-hidden cursor-pointer group border-[6px] border-white shadow-[0_10px_30px_rgba(184,137,53,0.1)]">
          <img 
            src={src} 
            alt="Gallery memory" 
            loading="lazy" 
            className="w-full h-auto object-cover filter sepia-[0.3] grayscale-[0.2] group-hover:sepia-0 group-hover:grayscale-0 group-hover:scale-[1.05] transition-all duration-700 ease-out"
          />
          {/* Sepia warm overlay that fades on hover */}
          <div className="absolute inset-0 bg-[#c6a15b] opacity-[0.15] mix-blend-color group-hover:opacity-0 transition-opacity duration-700 pointer-events-none" />
        </div>
      ))}
    </div>
  );

  return (
    <section ref={sectionRef} className="relative w-full py-24 md:py-32 px-4 md:px-8 bg-ivory overflow-hidden">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16 relative z-20">
        <span className="gallery-heading font-jost text-xs tracking-[0.3em] uppercase text-champagne mb-4">A Glimpse</span>
        <h2 className="gallery-heading font-cormorant text-4xl md:text-5xl text-deep-brown mb-3">Our Memories</h2>
      </div>

      <div className="max-w-7xl mx-auto flex gap-4 md:gap-6 items-start relative pb-20">
        <Column imgs={col1} className="col-1 pt-12 md:pt-24" />
        <Column imgs={col2} className="col-2 pb-12 md:pb-24" />
        <Column imgs={col3} className="col-3 pt-6 md:pt-12 hidden md:flex" />
      </div>

      {/* Fade out edges for the parallax */}
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-ivory to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-ivory to-transparent z-10 pointer-events-none" />
    </section>
  );
}
