import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface IntroSplashProps {
  onComplete: () => void;
}

export default function IntroSplash({ onComplete }: IntroSplashProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Show splash for 3 seconds then fade out
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800); // give time for exit animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="absolute inset-0 z-[200] bg-[#050505] flex items-center justify-center overflow-hidden"
        >
          {/* Subtle background glow */}
          <div className="absolute inset-0 bg-radial from-brand-green/10 to-transparent opacity-50" />
          
          {/* Logo container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1.1, opacity: 1 }}
            transition={{ 
              opacity: { duration: 1.5, ease: "easeOut" },
              scale: { duration: 10, ease: "linear" }
            }}
            className="relative flex items-center justify-center w-full px-8"
          >
            <img 
              src="/snooker ace - Escrita vetor.svg" 
              alt="Snooker Ace Logo" 
              className="w-[85%] max-w-[360px] drop-shadow-[0_0_40px_rgba(0,210,106,0.3)]"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
