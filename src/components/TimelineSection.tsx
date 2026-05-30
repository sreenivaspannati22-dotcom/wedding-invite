import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { WEDDING_CONFIG } from '../config';

export default function TimelineSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineTrackRef = useRef<HTMLDivElement>(null);
  const lineFillRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    
    const ctx = gsap.context(() => {
      // Heading stagger
      gsap.fromTo('.timeline-heading',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.1, duration: 0.8, scrollTrigger: { trigger: sectionRef.current, start: 'top 80%' } }
      );

      // Line fill scrub
      if (lineFillRef.current && lineTrackRef.current) {
        gsap.fromTo(lineFillRef.current,
          { height: '0%' },
          { 
            height: '100%', 
            ease: 'none',
            scrollTrigger: {
              trigger: lineTrackRef.current,
              start: 'top 50%',
              end: 'bottom 50%',
              scrub: true,
              invalidateOnRefresh: true
            } 
          }
        );
      }

      // Event rows
      const rows = gsap.utils.toArray<HTMLElement>('.timeline-row');
      rows.forEach((row) => {
        const card = row.querySelector('.timeline-card');
        const photo = row.querySelector('.timeline-photo');
        const heart = row.querySelector('.timeline-heart');
        const isPhotoLeft = row.dataset.layout === 'photo-left';

        // Heart spring
        gsap.fromTo(heart,
          { scale: 0 },
          { scale: 1, ease: 'back.out(2)', duration: 0.6, scrollTrigger: { trigger: row, start: 'top 65%' } }
        );

        // Slide ins (desktop uses x, mobile uses y)
        const desktopX = 60;
        const cardX = isPhotoLeft ? desktopX : -desktopX;
        const photoX = isPhotoLeft ? -desktopX : desktopX;

        gsap.fromTo(card,
          { opacity: 0, x: isTouch ? 0 : cardX, y: isTouch ? 30 : 0 },
          { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 75%' } }
        );

        gsap.fromTo(photo,
          { opacity: 0, x: isTouch ? 0 : photoX, y: isTouch ? 30 : 0 },
          { opacity: 1, x: 0, y: 0, duration: 0.8, ease: 'power2.out', scrollTrigger: { trigger: row, start: 'top 75%' } }
        );

        // Parallax photo image
        if (!isTouch) {
          const img = photo?.querySelector('img');
          if (img) {
            gsap.fromTo(img,
              { yPercent: -8 },
              { yPercent: 8, ease: 'none', scrollTrigger: { trigger: row, start: 'top bottom', end: 'bottom top', scrub: true } }
            );
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative w-full py-24 md:py-32 px-6" style={{ background: 'linear-gradient(to bottom, #f4e8d3 0%, #fdf6e9 50%, var(--color-ivory) 100%)' }}>
      
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16 md:mb-24">
        <span className="timeline-heading font-jost text-xs tracking-[0.3em] uppercase text-muted-brown mb-4">The Celebration</span>
        <h2 className="timeline-heading font-cormorant text-4xl md:text-5xl text-deep-brown mb-3">Our Wedding Timeline</h2>
        <span className="timeline-heading font-great-vibes text-2xl md:text-3xl text-gold">Celebrating love, laughter & happily ever after</span>
      </div>

      {/* Timeline Container */}
      <div className="relative max-w-5xl mx-auto">
        
        {/* The Line Track (Background) */}
        <div ref={lineTrackRef} className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-4 bottom-4 w-[2px] bg-champagne/30" />
        
        {/* The Line Fill (Foreground) */}
        <div ref={lineFillRef} className="absolute left-6 md:left-1/2 md:-translate-x-1/2 top-4 w-[2px] bg-champagne origin-top" />

        <div className="flex flex-col gap-12 md:gap-24">
          {WEDDING_CONFIG.events.map((evt) => {
            const isPhotoLeft = evt.layout === 'photo-left';
            
            return (
              <div key={evt.id} data-layout={evt.layout} className="timeline-row relative flex flex-col md:flex-row items-center w-full min-h-[300px]">
                
                {/* Heart Marker */}
                <div className="timeline-heart absolute left-6 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-ivory flex items-center justify-center border border-champagne z-20 shadow-sm top-8 md:top-1/2 md:-translate-y-1/2">
                  <div className="text-gold text-[12px] flex items-center justify-center">♡</div>
                </div>

                {/* Left Side */}
                <div className={`w-full md:w-1/2 pl-16 md:pl-0 md:pr-12 lg:pr-16 flex ${!isPhotoLeft ? 'md:justify-end' : 'md:justify-start'}`}>
                  {isPhotoLeft ? <PhotoBlock evt={evt} /> : <CardBlock evt={evt} />}
                </div>

                {/* Right Side */}
                <div className={`w-full md:w-1/2 pl-16 md:pl-12 lg:pl-16 mt-6 md:mt-0 flex ${isPhotoLeft ? 'md:justify-start' : 'md:justify-end'}`}>
                  {isPhotoLeft ? <CardBlock evt={evt} /> : <PhotoBlock evt={evt} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PhotoBlock({ evt }: { evt: any }) {
  return (
    <div className="timeline-photo relative w-full max-w-[400px] aspect-[4/3] md:aspect-[5/4] rounded-2xl overflow-hidden border border-champagne shadow-md">
      <div className="absolute inset-[-20%] w-[140%] h-[140%]">
        <img src={evt.image} alt={evt.title} loading="lazy" className="w-full h-full object-cover" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
    </div>
  );
}

function CardBlock({ evt }: { evt: any }) {
  return (
    <div className="timeline-card relative w-full max-w-[400px] bg-ivory rounded-[24px] border border-champagne/60 p-6 md:p-8 shadow-sm hover:-translate-y-1 transition-transform duration-300">
      {/* Corner Ornaments */}
      <svg className="absolute top-3 right-3 w-8 h-8 text-champagne/40" viewBox="0 0 100 100" fill="none" aria-hidden="true">
        <path d="M100 0 C60 0 40 40 0 100" stroke="currentColor" strokeWidth="2" strokeDasharray="2 4" />
      </svg>
      <svg className="absolute bottom-3 left-3 w-8 h-8 text-champagne/40" viewBox="0 0 100 100" fill="none" aria-hidden="true" style={{ transform: 'rotate(180deg)' }}>
        <path d="M100 0 C60 0 40 40 0 100" stroke="currentColor" strokeWidth="2" strokeDasharray="2 4" />
      </svg>

      <div className="font-jost text-xs tracking-widest uppercase text-champagne mb-2">24 November 2026</div>
      <h3 className="font-cormorant text-2xl md:text-3xl text-deep-brown mb-3">{evt.title}</h3>
      <div className="w-12 h-[1px] bg-champagne/50 mb-4" />
      
      <p className="font-lora text-sm text-muted-brown leading-relaxed mb-6">
        {evt.description}
      </p>

      <div className="flex flex-col gap-2 font-jost text-xs md:text-sm text-deep-brown">
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {evt.time}
        </div>
        <div className="flex items-center gap-3">
          <svg className="w-4 h-4 text-champagne" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {evt.venue}
        </div>
      </div>
    </div>
  );
}
