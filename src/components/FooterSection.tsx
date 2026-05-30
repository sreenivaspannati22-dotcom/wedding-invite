import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { usePersonalization } from '../hooks/usePersonalization';
import { WEDDING_CONFIG } from '../config';
import { AnimatePresence, motion } from 'framer-motion';

type FooterSectionProps = {
  name: string;
};

export default function FooterSection({ name }: FooterSectionProps) {
  const { displayName } = usePersonalization(name);
  const sectionRef = useRef<HTMLElement>(null);
  
  const [attending, setAttending] = useState<boolean | null>(true);
  const [guestCount, setGuestCount] = useState('1');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.rsvp-card',
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: sectionRef.current, start: 'top 75%' } }
      );
      gsap.fromTo('.footer-content',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, stagger: 0.15, duration: 1, ease: 'power2.out', scrollTrigger: { trigger: '.footer-content-wrap', start: 'top 80%' } }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    const googleFormUrl = "https://docs.google.com/forms/d/e/1FAIpQLSexDONmjK-DR0JIcQGij5UG5lzP_XjYYK0UrErotowxeX3eMQ/formResponse";
    
    const formData = new URLSearchParams();
    formData.append("entry.905401854", displayName); // Name
    formData.append("entry.1783153218", attending ? "I will be joining you" : "I won't be able to attend"); // Attendance
    
    if (attending) {
      formData.append("entry.1759269072", guestCount); // Guest Count
    }
    
    if (message) {
      formData.append("entry.796421996", message); // Message
    }

    try {
      await fetch(googleFormUrl, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData.toString()
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit RSVP:", err);
      alert("There was an issue sending your RSVP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section ref={sectionRef} className="relative w-full bg-deep-brown text-ivory flex flex-col items-center pt-32 pb-16 px-4 md:px-8 mt-48 md:mt-64">
      {/* SVG Wave Divider bridging from Ivory to Deep Brown */}
      <div className="absolute top-0 left-0 right-0 w-full overflow-hidden leading-none transform -translate-y-[99%]">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-12 md:h-24 fill-deep-brown block">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C50.69,38.2,168.49,85.2,321.39,56.44Z" />
        </svg>
      </div>

      {/* RSVP Card overlapping the wave */}
      <div className="rsvp-card relative w-full max-w-2xl bg-ivory rounded-3xl p-8 md:p-12 shadow-2xl -mt-56 md:-mt-64 mb-24 border border-champagne/40 mx-auto text-deep-brown z-30">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="font-jost text-xs tracking-[0.3em] uppercase text-champagne mb-3">RSVP</span>
          <h2 className="font-cormorant text-3xl md:text-4xl">Be Our Guest</h2>
          <p className="font-lora text-muted-brown text-sm mt-3">Kindly let us know if you can make it by November 1st, 2026.</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <div className="flex flex-col gap-2">
              <label className="font-jost text-xs tracking-widest uppercase text-muted-brown">Guest Name</label>
              <input 
                type="text" 
                value={displayName} 
                disabled 
                className="w-full bg-cream border border-champagne/50 rounded-lg px-4 py-3 font-lora text-deep-brown opacity-80 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-jost text-xs tracking-widest uppercase text-muted-brown">Will you attend?</label>
              <div className="flex bg-cream p-1 rounded-xl border border-champagne/30">
                <button 
                  type="button"
                  onClick={() => setAttending(true)}
                  className={`flex-1 py-3 px-2 md:px-4 rounded-lg font-lora transition-all text-sm md:text-base ${attending === true ? 'bg-champagne text-ivory shadow-sm' : 'text-muted-brown hover:bg-champagne/10'}`}
                >
                  I will be joining you
                </button>
                <button 
                  type="button"
                  onClick={() => setAttending(false)}
                  className={`flex-1 py-3 px-2 md:px-4 rounded-lg font-lora transition-all text-sm md:text-base ${attending === false ? 'bg-muted-brown text-ivory shadow-sm' : 'text-muted-brown hover:bg-champagne/10'}`}
                >
                  I won't be able to attend
                </button>
              </div>
            </div>

            <AnimatePresence>
              {attending && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-col gap-6 overflow-hidden"
                >
                  <div className="flex flex-col gap-2 pt-2">
                    <label className="font-jost text-xs tracking-widest uppercase text-muted-brown">Number of Guests</label>
                    <select 
                      value={guestCount} 
                      onChange={(e) => setGuestCount(e.target.value)}
                      className="w-full bg-cream border border-champagne/50 rounded-lg px-4 py-3 font-lora text-deep-brown focus:outline-none focus:border-champagne"
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {attending !== null && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }} 
                  animate={{ height: 'auto', opacity: 1 }} 
                  className="flex flex-col gap-2 pt-2"
                >
                  <label className="font-jost text-xs tracking-widest uppercase text-muted-brown">Message for the bride and groom (Optional)</label>
                  <textarea 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full bg-cream border border-champagne/50 rounded-lg px-4 py-3 font-lora text-deep-brown focus:outline-none focus:border-champagne placeholder:text-muted-brown/50 resize-none"
                    placeholder={attending ? "Can't wait to see you!" : "So sorry we can't make it, wishing you the best!"}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`mt-4 w-full bg-deep-brown text-champagne font-jost tracking-[0.2em] uppercase py-4 rounded-xl transition-colors shadow-lg ${isSubmitting ? 'opacity-70 cursor-wait' : 'hover:bg-[#1a1410]'}`}
            >
              {isSubmitting ? 'Sending...' : 'Send RSVP'}
            </button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="flex flex-col items-center text-center py-8"
          >
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 border border-green-200">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            </div>
            <h3 className="font-cormorant text-2xl text-deep-brown mb-2">Thank you!</h3>
            <p className="font-lora text-muted-brown">
              {attending ? "We can't wait to celebrate with you." : "You will be missed!"}
            </p>
          </motion.div>
        )}
      </div>

      <div className="footer-content-wrap flex flex-col items-center max-w-4xl w-full text-center relative z-20">
        {/* Youtube Embed */}
        <div className="footer-content w-full max-w-lg aspect-video rounded-xl overflow-hidden shadow-2xl border border-champagne/20 mb-20 bg-black">
          <iframe 
            width="100%" 
            height="100%" 
            src={`https://www.youtube-nocookie.com/embed/${WEDDING_CONFIG.youtubeVideoId}?controls=1`} 
            title="Wedding Video" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen
            className="border-0"
          ></iframe>
        </div>

        {/* Sign Off */}
        <div className="footer-content mb-8">
          <h2 className="font-great-vibes text-4xl md:text-5xl text-champagne mb-4">With Love,</h2>
          <div className="font-cormorant text-5xl md:text-6xl text-ivory">
            {WEDDING_CONFIG.couple.person1} <span className="text-champagne font-great-vibes px-2">&</span> {WEDDING_CONFIG.couple.person2}
          </div>
        </div>

        <div className="footer-content w-24 h-[1px] bg-champagne/30 my-8" />

        <p className="footer-content font-jost text-[10px] tracking-widest uppercase text-ivory/40">
          Crafted with love for the beautiful couple
        </p>
      </div>
    </section>
  );
}
