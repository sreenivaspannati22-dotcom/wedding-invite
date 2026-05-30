import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const IMAGES = [
  '/images/couple1.jpg',
  '/images/couple2.jpg',
  '/images/couple3.jpg',
  '/images/couple4.jpg',
  '/images/couple5.jpg',
];

type NameCaptureModalProps = {
  onComplete: (name: string) => void;
};

export default function NameCaptureModal({ onComplete }: NameCaptureModalProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nameInput, setNameInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Crossfade images every 6.5s
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  // Autofocus input
  useEffect(() => {
    const timeout = setTimeout(() => {
      inputRef.current?.focus();
    }, 900);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const trimmed = nameInput.trim();
    if (!trimmed) {
      setError('Please enter your name to continue');
      inputRef.current?.focus();
      return;
    }
    if (trimmed.length > 60) {
      setError('Please use a shorter name');
      return;
    }

    setError('');
    setIsSubmitting(true);
    
    // Simulate short delay for press animation
    setTimeout(() => {
      onComplete(trimmed);
    }, 350);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNameInput(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden font-lora">
      {/* Background Container with zoom animation */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1 }}
        animate={{ scale: 1.05 }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
      >
        <AnimatePresence>
          <motion.img
            key={currentImageIndex}
            src={IMAGES[currentImageIndex]}
            alt="Couple background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.2 }}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: 'blur(14px) brightness(0.65) saturate(1.05)' }}
          />
        </AnimatePresence>
      </motion.div>

      {/* Warm rose-gold radial overlay & bokeh */}
      <div 
        className="absolute inset-0 z-10"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(120, 70, 40, 0.25) 0%, rgba(35, 20, 15, 0.65) 70%, rgba(20, 10, 8, 0.85) 100%)'
        }}
      />
      <div 
        className="absolute inset-0 z-10 opacity-60"
        style={{
          background: 'radial-gradient(circle at 20% 30%, rgba(198, 161, 91, 0.15) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(244, 215, 215, 0.1) 0%, transparent 40%)'
        }}
      />

      {/* Center Card */}
      <motion.div
        initial={{ scale: 0.9, y: 16, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="relative z-20 w-[90%] max-w-[500px] bg-ivory/95 backdrop-blur-md rounded-[24px] border border-champagne/55 px-8 py-12 md:px-12 md:py-14 flex flex-col items-center text-center shadow-[0_30px_80px_rgba(30,18,12,0.45),inset_0_0_0_1px_rgba(255,250,243,0.6)]"
      >
        {/* Corner Ornaments (SVG placeholders) */}
        <svg className="absolute top-4 right-4 w-12 h-12 text-champagne/60" viewBox="0 0 100 100" fill="none" aria-hidden="true">
          <path d="M100 0 C60 0 40 40 0 100" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="80" cy="20" r="4" fill="currentColor" />
          <circle cx="60" cy="40" r="2" fill="currentColor" />
        </svg>
        <svg className="absolute bottom-4 left-4 w-12 h-12 text-champagne/60" viewBox="0 0 100 100" fill="none" aria-hidden="true" style={{ transform: 'rotate(180deg)' }}>
          <path d="M100 0 C60 0 40 40 0 100" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="80" cy="20" r="4" fill="currentColor" />
          <circle cx="60" cy="40" r="2" fill="currentColor" />
        </svg>

        <motion.div
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="text-gold text-2xl mb-4"
        >
          ♡
        </motion.div>
        
        <motion.h2 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="font-cormorant text-4xl md:text-5xl text-deep-brown mb-3"
        >
          Welcome!
        </motion.h2>

        <motion.p 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="font-montserrat text-xs tracking-widest uppercase text-muted-brown mb-8 px-4 leading-relaxed"
        >
          Please let us know your name before you continue
        </motion.p>

        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
          <motion.div 
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.85 }}
            className="w-full relative mb-6"
          >
            <div className={`flex items-center w-full bg-cream rounded-full border px-4 py-3 transition-colors duration-300 ${error ? 'border-rose ring-2 ring-rose/30 shadow-[0_0_15px_rgba(217,166,166,0.3)]' : 'border-champagne focus-within:border-gold focus-within:ring-2 focus-within:ring-gold/30 focus-within:shadow-[0_0_15px_rgba(184,137,53,0.3)]'}`}>
              <svg className="w-5 h-5 text-champagne shrink-0 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={nameInput}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="w-full bg-transparent outline-none text-deep-brown font-cormorant text-xl placeholder:font-lora placeholder:text-muted-brown/60 placeholder:text-base"
                maxLength={60}
                aria-label="Your name"
                aria-invalid={!!error}
              />
            </div>
            {error && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                className="text-rose text-sm mt-2 font-montserrat"
                role="alert"
              >
                {error}
              </motion.div>
            )}
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.0 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
            className="w-full md:w-[72%] bg-gradient-to-r from-champagne to-gold text-ivory rounded-full py-3 font-montserrat tracking-widest uppercase text-sm shadow-md hover:shadow-lg transition-all relative group disabled:opacity-80"
          >
            Enter ♡
            <div className="absolute inset-0 rounded-full bg-ivory opacity-0 group-hover:opacity-10 transition-opacity" />
          </motion.button>
        </form>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 1 }}
          className="mt-10 font-great-vibes text-gold text-3xl"
        >
          SuperBoy & SuperGirl
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3, duration: 1 }}
          className="mt-3 font-jost text-xs tracking-widest text-muted-brown uppercase"
        >
          24 November 2026 • Udaipur
        </motion.div>
      </motion.div>
    </div>
  );
}
