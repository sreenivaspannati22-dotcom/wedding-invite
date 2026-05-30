import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { WEDDING_CONFIG } from '../config';
import { AnimatePresence, motion } from 'framer-motion';

export default function VenueMapSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPhotoIdx((prev) => (prev + 1) % WEDDING_CONFIG.venueImages.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.venue-heading',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      );

      gsap.fromTo('.venue-left',
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );

      gsap.fromTo('.venue-right',
        { opacity: 0, x: 50 },
        { opacity: 1, x: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-24 md:py-32 px-6 overflow-hidden" style={{ background: 'linear-gradient(to bottom, var(--color-ivory) 0%, #fbf1de 50%, #fdf2e2 100%)' }}>
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16 md:mb-20 relative z-10">
        <span className="venue-heading font-jost text-xs tracking-[0.3em] uppercase text-muted-brown mb-4">The Venue</span>
        <h2 className="venue-heading font-cormorant text-4xl md:text-5xl text-deep-brown mb-3">Where It All Happens</h2>
        <span className="venue-heading font-great-vibes text-2xl md:text-3xl text-gold">{WEDDING_CONFIG.venueName}</span>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12 lg:gap-20 items-center relative z-10">
        
        {/* Left: Venue Photos */}
        <div className="venue-left w-full md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-[450px] aspect-[4/5] rounded-[24px] overflow-hidden border-[6px] border-ivory shadow-[0_20px_60px_rgba(184,137,53,0.15)] bg-deep-brown">
            <div className="absolute inset-0 border border-champagne rounded-[18px] z-20 pointer-events-none" />
            
            <AnimatePresence>
              <motion.img
                key={currentPhotoIdx}
                src={WEDDING_CONFIG.venueImages[currentPhotoIdx]}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 w-full h-full object-cover z-0"
                alt="Venue photo"
              />
            </AnimatePresence>
            
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/80 to-transparent z-10" />

            {/* Progress Dots */}
            <div className="absolute top-6 right-6 flex gap-2 z-20">
              {WEDDING_CONFIG.venueImages.map((_, i) => (
                <div key={i} className={`h-1.5 rounded-full transition-all duration-500 bg-white ${i === currentPhotoIdx ? 'w-6 opacity-100' : 'w-1.5 opacity-40'}`} />
              ))}
            </div>

            {/* Overlay Text */}
            <div className="absolute bottom-8 left-8 right-8 z-20 flex flex-col">
              <span className="font-jost text-[10px] tracking-widest uppercase text-champagne mb-2">The Celebration</span>
              <span className="font-cormorant text-2xl text-ivory mb-2">{WEDDING_CONFIG.venueName}</span>
              <span className="font-jost text-[10px] tracking-widest uppercase text-ivory/80">24 November 2026 • Udaipur, India</span>
            </div>
          </div>
        </div>

        {/* Right: Map & Details */}
        <div className="venue-right w-full md:w-1/2 flex flex-col">
          <div className="bg-ivory rounded-[24px] p-8 border border-champagne/40 shadow-sm mb-8 relative overflow-hidden">
            <span className="font-jost text-xs tracking-[0.2em] uppercase text-champagne mb-3 block">Find Us Here</span>
            <h3 className="font-cormorant text-3xl text-deep-brown mb-4">{WEDDING_CONFIG.venueName}</h3>
            <p className="font-lora text-muted-brown mb-8">{WEDDING_CONFIG.venueAddress}</p>
            
            {/* Map Area */}
            <div className="relative w-full aspect-video md:aspect-[4/3] rounded-xl overflow-hidden border border-champagne/40 bg-[#fdfaf5] group cursor-pointer" onClick={() => setMapLoaded(true)}>
              {!mapLoaded ? (
                <>
                  {/* Custom SVG Map Placeholder */}
                  <div className="absolute inset-0">
                    <svg className="w-full h-full opacity-30" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d="M-10,50 Q25,60 50,20 T110,30" stroke="#c6a15b" strokeWidth="2" fill="none" />
                      <path d="M20,-10 Q30,40 80,60 T110,90" stroke="#c6a15b" strokeWidth="3" fill="none" />
                      <path d="M-10,80 Q40,90 60,110" stroke="#c6a15b" strokeWidth="1.5" fill="none" />
                      <rect x="25" y="25" width="15" height="10" rx="2" fill="#c6a15b" opacity="0.3" />
                      <rect x="65" y="45" width="20" height="15" rx="3" fill="#c6a15b" opacity="0.3" />
                      <rect x="40" y="70" width="12" height="12" rx="2" fill="#c6a15b" opacity="0.3" />
                      <rect x="70" y="15" width="18" height="18" rx="2" fill="#c6a15b" opacity="0.3" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-ivory/20 backdrop-blur-[1px] transition-all group-hover:bg-ivory/10">
                    {/* Map Pin */}
                    <div className="relative flex items-center justify-center mb-3">
                      <div className="absolute w-12 h-12 bg-champagne/30 rounded-full animate-ping" />
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-champagne to-gold flex items-center justify-center z-10 shadow-md">
                        <div className="w-3 h-3 bg-ivory rounded-full" />
                      </div>
                      <div className="absolute -bottom-2 w-4 h-1 bg-black/20 blur-[2px] rounded-full" />
                    </div>
                    <div className="bg-gradient-to-r from-champagne to-gold text-ivory text-xs tracking-widest uppercase font-jost px-4 py-2 rounded-full shadow-md group-hover:shadow-lg transition-all group-hover:-translate-y-0.5">
                      Tap to load map
                    </div>
                  </div>
                </>
              ) : (
                <iframe
                  title="Venue Map"
                  src="https://www.google.com/maps?q=Iconic+Hotels+%26+Resorts,+Udaipur,+India&output=embed"
                  className="absolute inset-0 w-full h-full border-0"
                  allowFullScreen
                  loading="lazy"
                />
              )}
            </div>
          </div>

          <a 
            href="https://www.google.com/maps/search/?api=1&query=Iconic+Hotels+%26+Resorts%2C+Udaipur%2C+India" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full py-4 bg-ivory border border-champagne/40 rounded-full text-deep-brown font-jost tracking-[0.15em] text-sm uppercase hover:bg-cream transition-colors shadow-sm"
          >
            <svg className="w-4 h-4 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  );
}
