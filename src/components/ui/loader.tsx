'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface LoaderProps {
  onLoadingComplete?: () => void;
}

const Star = ({ filled }: { filled: boolean }) => {
  return (
    <div className="relative w-8 h-8 md:w-12 md:h-12 mx-1">
      {/* Star SVG */}
      <svg
        viewBox="0 0 24 24"
        className="w-full h-full overflow-visible"
        style={{
          // Subtle bloom peak only when filled
          filter: filled ? 'drop-shadow(0 0 8px rgba(124,58,237,0.4))' : 'none',
          transition: 'filter 0.12s ease-out'
        }}
      >
        <path
          d="M12 1.5L14.5 9.5H22.5L16 14.5L18.5 22.5L12 17.5L5.5 22.5L8 14.5L1.5 9.5H9.5L12 1.5Z" /* Sharp 5-point star path */
          fill={filled ? "#7c3aed" : "transparent"}
          stroke="#7c3aed"
          strokeWidth="1.5"
          strokeLinejoin="miter"
          style={{ transition: 'fill 0.22s cubic-bezier(0, 0, 0.2, 1)' }} // Fast start, smooth settle
        />
      </svg>
    </div>
  );
};

const Loader: React.FC<LoaderProps> = ({ onLoadingComplete }) => {
  const [filledStars, setFilledStars] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Exact GTA V Timing Sequence
    // Start delay: 300ms
    // Fill duration: ~240ms (using CSS transition)
    // Pause: 90ms
    // Total per step: 330ms

    const startDelay = 300;
    const stepInterval = 330;

    let currentStep = 0;

    // Initial start delay
    const startTimer = setTimeout(() => {
      const interval = setInterval(() => {
        currentStep++;
        setFilledStars(currentStep);

        if (currentStep >= 5) {
          clearInterval(interval);
          // Final hold: 1.5s
          setTimeout(() => {
            setIsComplete(true);
            onLoadingComplete?.();
          }, 1500);
        }
      }, stepInterval);

      return () => clearInterval(interval);
    }, startDelay);

    return () => clearTimeout(startTimer);
  }, [onLoadingComplete]);

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden"
        >
          {/* Very Subtle Vignette & Grain */}
          <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none z-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat',
            }}
          />

          {/* Content Container - Compact & Centered */}
          <div className="relative z-10 flex flex-col items-center gap-6">

            {/* Logo - Fades in strictly after Star 2 starts filling */}
            {/* GTA logic: Intro -> Star 1 -> Star 2 -> (Logo Fade) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: filledStars >= 2 ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "linear" }}
              className="w-48 md:w-64 lg:w-72 h-auto mb-2"
            >
              <Image
                src="/logo.svg"
                alt="Logo"
                width={300}
                height={100}
                className="w-full h-auto object-contain"
                style={{ filter: 'drop-shadow(0 0 10px rgba(124, 58, 237, 0.7))' }}
                priority
              />
            </motion.div>

            {/* Stars Container - Tight Spacing */}
            <div className="flex items-center justify-center gap-0">
              {[1, 2, 3, 4, 5].map((index) => (
                <Star key={index} filled={filledStars >= index} />
              ))}
            </div>

          </div>

        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Loader;