import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NameCaptureModal from './components/NameCaptureModal';
import PetalCanvas from './components/PetalCanvas';
import HeroSection from './components/HeroSection';
import CountdownSection from './components/CountdownSection';
import TimelineSection from './components/TimelineSection';
import VenueMapSection from './components/VenueMapSection';
import GallerySection from './components/GallerySection';
import FooterSection from './components/FooterSection';
import { getStoredName, writeStoredName, usePersonalization } from './hooks/usePersonalization';
import { useLenis } from './hooks/useLenis';

function MainContent({ name }: { name: string }) {
  useLenis();

  return (
    <div className="bg-ivory flex flex-col items-center w-full relative">
      <PetalCanvas />
      <HeroSection name={name} />
      <CountdownSection name={name} />
      <TimelineSection />
      <VenueMapSection />
      <GallerySection />
      <FooterSection name={name} />
    </div>
  );
}

function App() {
  const [guestName, setGuestName] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setGuestName(getStoredName());
    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null; // Avoid hydration mismatch or flash

  return (
    <>
      <AnimatePresence mode="wait">
        {!guestName && (
          <motion.div key="modal" exit={{ opacity: 0 }} transition={{ duration: 0.8 }}>
            <NameCaptureModal
              onComplete={(name) => {
                writeStoredName(name);
                setGuestName(name);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {guestName && (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <MainContent name={guestName} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
